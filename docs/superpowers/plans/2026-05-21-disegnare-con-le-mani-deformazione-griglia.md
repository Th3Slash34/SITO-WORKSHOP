# Deformazione a Griglia — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a grid-deformation "Anima" mode to the existing hand-tracking drawing app, allowing the user to pinch-and-drag grid nodes to warp any drawing.

**Architecture:** Single-file HTML app. A 6x6 grid overlay (7x7=49 nodes) is placed over the frozen drawing canvas when entering Anima mode. Each cell is triangulated (2 triangles) and rendered with affine transforms per frame. Radial decay propagates node drags to neighbors.

**Tech Stack:** Vanilla JS, Canvas 2D, TensorFlow.js + MediaPipe (existing)

**File to modify:**
- `DISEGNARE CON LE MANI/codebase/index.html`

---

### Task 1: Add HTML + CSS for Anima button and grid nodes

- [ ] **Step 1: Add Anima button to toolbar**

Find the toolbar `<div id="toolbar">` and add the new button after the `btn-export` button, before the `size-slider`:

```html
<button id="btn-anima" title="Anima">🎭</button>
<button id="btn-reset-grid" title="Reset griglia" style="display:none">🔄</button>
```

- [ ] **Step 2: Add CSS for grid nodes and Anima states**

Add after the existing `#toolbar` CSS block (before `</style>`):

```css
#grid-canvas { z-index: 3; cursor: grab; }
#grid-canvas.grabbing { cursor: grabbing; }
.grid-node {
  position: absolute;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: 2px solid rgba(0,0,0,0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 4;
}
#btn-reset-grid {
  font-size: 16px;
}
```

Also add `#grid-canvas` in the `.layer` class area after the existing `#overlay { z-index: 2; }` line — make sure `z-index` is 3.

- [ ] **Step 3: Add grid-canvas element to the DOM**

After the `<canvas id="overlay" class="layer"></canvas>` line, add:

```html
<canvas id="grid-canvas" class="layer"></canvas>
```

- [ ] **Step 4: Verify the DOM structure**

Open `index.html` in a browser and confirm the "🎭" and "🔄" buttons appear in the toolbar and the grid canvas is in the container.

---

### Task 2: Grid data structure and initialization

- [ ] **Step 1: Add grid constants and state variables**

After `const ERASER_RADIUS = 20;`, add:

```javascript
const GRID_ROWS = 7;  // nodes per row (6 cells)
const GRID_COLS = 7;  // nodes per col (6 cells)
const NODE_GRAB_RADIUS = 50; // px max distance to grab a node
const DECAY_RADIUS = 3; // nodes distance for radial decay

let animaMode = false;
let animaOffscreen = null;
let gridNodes = []; // 2D array of { ox, oy, x, y } (original and current position)
let grabbedNode = null; // { row, col } of grabbed node, or null
let prevMode = 'draw'; // mode to restore when exiting anima
```

- [ ] **Step 2: Add grid initialization function**

After the existing functions (before `async function main()`), add:

```javascript
function initGrid(w, h) {
  gridNodes = [];
  const marginX = w * 0.05;
  const marginY = h * 0.05;
  const cellW = (w - 2 * marginX) / (GRID_COLS - 1);
  const cellH = (h - 2 * marginY) / (GRID_ROWS - 1);
  for (let r = 0; r < GRID_ROWS; r++) {
    gridNodes[r] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      const ox = marginX + c * cellW;
      const oy = marginY + r * cellH;
      gridNodes[r][c] = { ox, oy, x: ox, y: oy };
    }
  }
}
```

- [ ] **Step 3: Add radial decay propagation function**

After `initGrid`, add:

```javascript
function applyNodeDrag(row, col, dx, dy) {
  if (!gridNodes[row]) return;
  gridNodes[row][col].x += dx;
  gridNodes[row][col].y += dy;
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (r === row && c === col) continue;
      const dist = Math.hypot(r - row, c - col);
      if (dist > DECAY_RADIUS) continue;
      const weight = 1 / (dist * dist + 0.1);
      gridNodes[r][c].x += dx * weight;
      gridNodes[r][c].y += dy * weight;
    }
  }
}
```

- [ ] **Step 4: Verify code loads**

Open in browser, open DevTools console, no errors logged.

---

### Task 3: Triangle rendering helper

- [ ] **Step 1: Add texturedTriangle function**

After `hexToRgba`, add:

```javascript
function texturedTriangle(ctx, img, x0,y0, x1,y1, x2,y2, sx0,sy0, sx1,sy1, sx2,sy2) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.clip();

  const dx = sx1 - sx0, dy = sy1 - sy0;
  const dx2 = sx2 - sx0, dy2 = sy2 - sy0;
  const D = dx * dy2 - dy * dx2;
  if (Math.abs(D) < 1e-6) { ctx.restore(); return; }

  const a = ((x1 - x0) * dy2 - (x2 - x0) * dy) / D;
  const b = ((y1 - y0) * dy2 - (y2 - y0) * dy) / D;
  const c = ((x2 - x0) * dx - (x1 - x0) * dx2) / D;
  const d = ((y2 - y0) * dx - (y1 - y0) * dx2) / D;
  const e = x0 - a * sx0 - c * sy0;
  const f = y0 - b * sx0 - d * sy0;

  ctx.setTransform(a, b, c, d, e, f);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}
```

- [ ] **Step 2: Add renderDeformedGrid function**

After `texturedTriangle`, add:

```javascript
function renderDeformedGrid(ctx, img) {
  if (!gridNodes.length) return;
  for (let r = 0; r < GRID_ROWS - 1; r++) {
    for (let c = 0; c < GRID_COLS - 1; c++) {
      const n00 = gridNodes[r][c];
      const n01 = gridNodes[r][c+1];
      const n10 = gridNodes[r+1][c];
      const n11 = gridNodes[r+1][c+1];

      // Two triangles per cell
      // Triangle 1: top-left, top-right, bottom-left
      texturedTriangle(ctx, img,
        n00.x, n00.y, n01.x, n01.y, n10.x, n10.y,
        n00.ox, n00.oy, n01.ox, n01.oy, n10.ox, n10.oy
      );
      // Triangle 2: top-right, bottom-left, bottom-right
      texturedTriangle(ctx, img,
        n01.x, n01.y, n10.x, n10.y, n11.x, n11.y,
        n01.ox, n01.oy, n10.ox, n10.oy, n11.ox, n11.oy
      );
    }
  }
}
```

- [ ] **Step 3: No test needed** — verified in Task 4 when rendering loop runs.

---

### Task 4: Reduce grid nodes for performance

- [ ] **Step 1: Change grid constants to 5×5**

```javascript
const GRID_ROWS = 5;  // 5×5 nodes = 4×4 cells = 32 triangles/frame
const GRID_COLS = 5;
```

Better performance: fewer triangles, lighter rendering per frame.

---

### Task 5: Enter and exit Anima mode

- [ ] **Step 1: Add enterAnima / exitAnima functions**

After `renderDeformedGrid`, add:

```javascript
function enterAnima() {
  const w = drawCanvas.width;
  const h = drawCanvas.height;
  if (!w || !h) return;

  prevMode = mode;
  prevPinch = null; // don't carry over pinch from drawing mode
  shapePoints = []; // clear any in-progress shape
  animaOffscreen = document.createElement('canvas');
  animaOffscreen.width = w;
  animaOffscreen.height = h;
  const offCtx = animaOffscreen.getContext('2d');
  offCtx.drawImage(drawCanvas, 0, 0);

  const gc = document.getElementById('grid-canvas');
  gc.width = w;
  gc.height = h;
  initGrid(w, h);
  animaMode = true;
  grabbedNode = null;
  document.getElementById('btn-reset-grid').style.display = '';
  document.getElementById('btn-anima').classList.add('active');
  statusEl.textContent = 'Anima: attiva — pizzica un nodo';
}

function exitAnima() {
  if (!animaMode) return;
  animaMode = false;

  // Render deformed grid onto drawCanvas
  const gc = document.getElementById('grid-canvas');
  const gctx = gc.getContext('2d');
  gctx.clearRect(0, 0, gc.width, gc.height);

  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  if (animaOffscreen) {
    renderDeformedGrid(drawCtx, animaOffscreen);
  }

  animaOffscreen = null;
  gridNodes = [];
  document.getElementById('btn-reset-grid').style.display = 'none';
  document.getElementById('btn-anima').classList.remove('active');
  setMode(prevMode);
}
```

- [ ] **Step 2: Add resetGrid function**

After `exitAnima`, add:

```javascript
function resetGrid() {
  if (!animaMode || !gridNodes.length) return;
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const n = gridNodes[r][c];
      n.x = n.ox;
      n.y = n.oy;
    }
  }
  grabbedNode = null;
}
```

- [ ] **Step 3: Wire up Anima and Reset buttons**

Inside `main()`, after the existing button event listeners (around the `btn-clear` section), add:

```javascript
document.getElementById('btn-anima').addEventListener('click', () => {
  if (animaMode) {
    exitAnima();
  } else {
    enterAnima();
  }
});

document.getElementById('btn-reset-grid').addEventListener('click', resetGrid);
```

- [ ] **Step 4: Verify toggle works**

Open in browser, draw something, click "🎭" — no errors in console. Click again — exits cleanly, drawing visible.

---

### Task 6: Pinch-to-node interaction in Anima mode

- [ ] **Step 1: Modify the detect loop's pinch handling for Anima mode**

Inside `main()`, in the `detect()` function, find the pinch handling code (around `if (dist < PINCH_THRESHOLD)`). Modify the interaction to branch on `animaMode`:

Replace the existing pinch handling:

```javascript
if (dist < PINCH_THRESHOLD) {
  pinching = true;
  const mx = (thumb.x + index.x) / 2;
  const my = (thumb.y + index.y) / 2;

  if (animaMode) {
    if (!grabbedNode) {
      // Find nearest node within grab radius
      let minDist = Infinity;
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const n = gridNodes[r][c];
          const d = Math.hypot(mx - n.x, my - n.y);
          if (d < minDist && d < NODE_GRAB_RADIUS) {
            minDist = d;
            grabbedNode = { row: r, col: c, prevX: n.x, prevY: n.y };
          }
        }
      }
    }
    if (grabbedNode) {
      const n = gridNodes[grabbedNode.row][grabbedNode.col];
      const dx = mx - n.x;
      const dy = my - n.y;
      applyNodeDrag(grabbedNode.row, grabbedNode.col, dx, dy);
      grabbedNode.prevX = n.x;
      grabbedNode.prevY = n.y;
    }
  }
```

Then after the existing pinch handling for draw/erase/fill, add the else-branch for non-anima mode. The cleanest way is to wrap the existing draw/erase/fill code inside `} else { ... }` for the `animaMode` check.

Here's the exact replacement — replace the entire `if (dist < PINCH_THRESHOLD)` block from its opening to just before ` }` (end of the `if (dist < ...)` block):

Wait, let me be more precise. Find this exact code:

```javascript
            if (dist < PINCH_THRESHOLD) {
              pinching = true;
              const mx = (thumb.x + index.x) / 2;
              const my = (thumb.y + index.y) / 2;

              if (mode === 'shape' && !wasPinching) {
                shapePoints = [{ x: mx, y: my }];
              }
              if (mode === 'shape') {
                if (shapePoints.length) shapePoints[1] = { x: mx, y: my };
              }

              if (mode === 'draw') {
                // ... draw code ...
              } else if (mode === 'erase') {
                // ... erase code ...
              } else if (mode === 'fill') {
                // ... fill code ...
              }
            }
```

Replace the whole block with:

```javascript
            if (dist < PINCH_THRESHOLD) {
              pinching = true;
              const mx = (thumb.x + index.x) / 2;
              const my = (thumb.y + index.y) / 2;

              if (animaMode) {
                if (!grabbedNode) {
                  let minDist = Infinity;
                  for (let r = 0; r < GRID_ROWS; r++) {
                    for (let c = 0; c < GRID_COLS; c++) {
                      const n = gridNodes[r][c];
                      const d = Math.hypot(mx - n.x, my - n.y);
                      if (d < minDist && d < NODE_GRAB_RADIUS) {
                        minDist = d;
                        grabbedNode = { row: r, col: c };
                      }
                    }
                  }
                }
                if (grabbedNode) {
                  const n = gridNodes[grabbedNode.row][grabbedNode.col];
                  const dx = mx - n.x;
                  const dy = my - n.y;
                  applyNodeDrag(grabbedNode.row, grabbedNode.col, dx, dy);
                }
              } else {
                if (mode === 'shape' && !wasPinching) {
                  shapePoints = [{ x: mx, y: my }];
                }
                if (mode === 'shape') {
                  if (shapePoints.length) shapePoints[1] = { x: mx, y: my };
                }

                if (mode === 'draw') {
                  if (prevPinch) {
                    // ... existing draw code unchanged ...
                    drawCtx.beginPath();
                    drawCtx.moveTo(prevPinch.x, prevPinch.y);
                    drawCtx.lineTo(mx, my);
                    drawCtx.strokeStyle = strokeColor;
                    drawCtx.lineWidth = strokeWidth;
                    drawCtx.lineCap = 'round';
                    drawCtx.lineJoin = 'round';
                    drawCtx.stroke();
                  }
                  prevPinch = { x: mx, y: my };

                  ctx.beginPath();
                  ctx.arc(mx, my, 14, 0, 2 * Math.PI);
                  ctx.strokeStyle = strokeColor;
                  ctx.lineWidth = 2;
                  ctx.setLineDash([4, 4]);
                  ctx.stroke();
                  ctx.setLineDash([]);
                } else if (mode === 'erase') {
                  drawCtx.clearRect(mx - ERASER_RADIUS, my - ERASER_RADIUS, ERASER_RADIUS * 2, ERASER_RADIUS * 2);
                  ctx.beginPath();
                  ctx.arc(mx, my, ERASER_RADIUS, 0, 2 * Math.PI);
                  ctx.strokeStyle = '#ff4444';
                  ctx.lineWidth = 2;
                  ctx.stroke();
                } else if (mode === 'fill') {
                  floodFill(drawCanvas, Math.round(mx), Math.round(my), strokeColor);
                  ctx.beginPath();
                  ctx.arc(mx, my, 20, 0, 2 * Math.PI);
                  ctx.strokeStyle = strokeColor;
                  ctx.lineWidth = 2;
                  ctx.setLineDash([4, 4]);
                  ctx.stroke();
                  ctx.setLineDash([]);
                }
              }
            }
```

Wait, this is getting complex. Let me simplify. The exact replacement should preserve the existing draw/erase/fill code exactly as-is, just wrap it in `} else { ... }` after the `animaMode` branch.

Let me restructure. Find this section in the detect loop:

```javascript
            if (dist < PINCH_THRESHOLD) {
              pinching = true;
              const mx = (thumb.x + index.x) / 2;
              const my = (thumb.y + index.y) / 2;

              if (mode === 'shape' && !wasPinching) {
                shapePoints = [{ x: mx, y: my }];
              }
              if (mode === 'shape') {
                if (shapePoints.length) shapePoints[1] = { x: mx, y: my };
              }

              if (mode === 'draw') {
                if (prevPinch) {
                  drawCtx.beginPath();
                  drawCtx.moveTo(prevPinch.x, prevPinch.y);
                  drawCtx.lineTo(mx, my);
                  drawCtx.strokeStyle = strokeColor;
                  drawCtx.lineWidth = strokeWidth;
                  drawCtx.lineCap = 'round';
                  drawCtx.lineJoin = 'round';
                  drawCtx.stroke();
                }
                prevPinch = { x: mx, y: my };

                ctx.beginPath();
                ctx.arc(mx, my, 14, 0, 2 * Math.PI);
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
              } else if (mode === 'erase') {
                drawCtx.clearRect(mx - ERASER_RADIUS, my - ERASER_RADIUS, ERASER_RADIUS * 2, ERASER_RADIUS * 2);
                ctx.beginPath();
                ctx.arc(mx, my, ERASER_RADIUS, 0, 2 * Math.PI);
                ctx.strokeStyle = '#ff4444';
                ctx.lineWidth = 2;
                ctx.stroke();
              } else if (mode === 'fill') {
                floodFill(drawCanvas, Math.round(mx), Math.round(my), strokeColor);
                ctx.beginPath();
                ctx.arc(mx, my, 20, 0, 2 * Math.PI);
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
              }
            }
```

Replace with:

```javascript
            if (dist < PINCH_THRESHOLD) {
              pinching = true;
              const mx = (thumb.x + index.x) / 2;
              const my = (thumb.y + index.y) / 2;

              if (animaMode) {
                if (!grabbedNode) {
                  let minDist = Infinity;
                  for (let r = 0; r < GRID_ROWS; r++) {
                    for (let c = 0; c < GRID_COLS; c++) {
                      const n = gridNodes[r][c];
                      const d = Math.hypot(mx - n.x, my - n.y);
                      if (d < minDist && d < NODE_GRAB_RADIUS) {
                        minDist = d;
                        grabbedNode = { row: r, col: c };
                      }
                    }
                  }
                }
                if (grabbedNode) {
                  const n = gridNodes[grabbedNode.row][grabbedNode.col];
                  const dx = mx - n.x;
                  const dy = my - n.y;
                  applyNodeDrag(grabbedNode.row, grabbedNode.col, dx, dy);
                }
              } else {
                if (mode === 'shape' && !wasPinching) {
                  shapePoints = [{ x: mx, y: my }];
                }
                if (mode === 'shape') {
                  if (shapePoints.length) shapePoints[1] = { x: mx, y: my };
                }

                if (mode === 'draw') {
                  if (prevPinch) {
                    drawCtx.beginPath();
                    drawCtx.moveTo(prevPinch.x, prevPinch.y);
                    drawCtx.lineTo(mx, my);
                    drawCtx.strokeStyle = strokeColor;
                    drawCtx.lineWidth = strokeWidth;
                    drawCtx.lineCap = 'round';
                    drawCtx.lineJoin = 'round';
                    drawCtx.stroke();
                  }
                  prevPinch = { x: mx, y: my };

                  ctx.beginPath();
                  ctx.arc(mx, my, 14, 0, 2 * Math.PI);
                  ctx.strokeStyle = strokeColor;
                  ctx.lineWidth = 2;
                  ctx.setLineDash([4, 4]);
                  ctx.stroke();
                  ctx.setLineDash([]);
                } else if (mode === 'erase') {
                  drawCtx.clearRect(mx - ERASER_RADIUS, my - ERASER_RADIUS, ERASER_RADIUS * 2, ERASER_RADIUS * 2);
                  ctx.beginPath();
                  ctx.arc(mx, my, ERASER_RADIUS, 0, 2 * Math.PI);
                  ctx.strokeStyle = '#ff4444';
                  ctx.lineWidth = 2;
                  ctx.stroke();
                } else if (mode === 'fill') {
                  floodFill(drawCanvas, Math.round(mx), Math.round(my), strokeColor);
                  ctx.beginPath();
                  ctx.arc(mx, my, 20, 0, 2 * Math.PI);
                  ctx.strokeStyle = strokeColor;
                  ctx.lineWidth = 2;
                  ctx.setLineDash([4, 4]);
                  ctx.stroke();
                  ctx.setLineDash([]);
                }
              }
            }
```

- [ ] **Step 2: Handle node release when pinch stops or hands lost**

Find where `if (!pinching) prevPinch = null;` is (near the bottom of the detect loop), and add after it:

```javascript
if (!pinching && animaMode) grabbedNode = null;
```

Also, in the "no hands" section where `if (hands.length === 0)`, add `grabbedNode = null;` after `prevPinch = null;`:

```javascript
          if (hands.length === 0) {
            statusEl.textContent = 'Nessuna mano rilevata';
            prevPinch = null;
            grabbedNode = null;
          }
```

- [ ] **Step 3: Render deformed grid in the detect loop**

In the `detect()` function, after the code that draws hands (around `ctx.clearRect` and `drawHand` calls), add the anima rendering. Find the section:

```javascript
          ctx.clearRect(0, 0, overlay.width, overlay.height);
```

And after the hand-drawing loop (before `if (mode === 'shape')`), add:

```javascript
          if (animaMode) {
            const gc = document.getElementById('grid-canvas');
            const gctx = gc.getContext('2d');
            gctx.clearRect(0, 0, gc.width, gc.height);
            if (animaOffscreen) {
              renderDeformedGrid(gctx, animaOffscreen);
            }
            // Draw grid nodes on overlay
            for (let r = 0; r < GRID_ROWS; r++) {
              for (let c = 0; c < GRID_COLS; c++) {
                const n = gridNodes[r][c];
                ctx.beginPath();
                ctx.arc(n.x, n.y, 6, 0, 2 * Math.PI);
                const isGrabbed = grabbedNode && grabbedNode.row === r && grabbedNode.col === c;
                ctx.fillStyle = isGrabbed ? '#ffd93d' : 'rgba(255,255,255,0.85)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.5)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
              }
            }
          }
```

Also need to handle `!pinching` for the `animaMode` case. After `if (!pinching) prevPinch = null;`, update to also handle `grabbedNode`.

- [ ] **Step 4: Verify pinch interaction works**

Open in browser, draw something, click "🎭", make a pinch gesture near a grid node → node turns yellow and follows. Release pinch → node stays.

- [ ] **Step 5: Verify non-anima mode still works**

Exit Anima mode. Verify draw, erase, fill, shape modes still function correctly.

---

### Task 7: Ensure anima mode disables other interactions

- [ ] **Step 1: Skip shape rendering in anima mode**

Find this code in the detect loop:

```javascript
          if (mode === 'shape') {
            if (shapePoints.length === 2) {
              drawShapeOnCanvas(ctx, shapePoints, shapeType);
            }
            if (wasPinching && !pinching && shapePoints.length) {
              drawShapeOnCanvas(drawCtx, shapePoints, shapeType);
              shapePoints = [];
            }
          }
```

Wrap it in:

```javascript
          if (!animaMode && mode === 'shape') {
            // existing shape code
          }
```

- [ ] **Step 2: Verify animation mode is clean**

Open browser, enter Anima mode, try drawing — nothing happens until you exit.

---

### Task 8: Self-review and polish

- [ ] **Step 1: Sanity check all edge cases**

Verify:
- Enter anima with empty canvas → grid appears, no errors
- Reset grid → nodes snap back to original positions
- Exit anima → deformed drawing is permanent on draw canvas
- Enter anima again → previous deformation is baked into the new frozen texture
- Clear all in normal mode → canvas clears
- Window resize → canvas doesn't break (resize detection may need `ResizeObserver` or window event)

- [ ] **Step 2: Verify everything works end-to-end**

Full flow: draw a shape → Anima → pinch and drag nodes → exit → drawing is deformed. Repeat.

- [ ] **Step 3: Hide video background while animating?** Optional: in `enterAnima`, call `container.classList.add('hide-video')` to hide the webcam feed while animating for a cleaner view. In `exitAnima`, remove it. This requires the existing `btn-bg` toggle logic to not interfere — set a flag `animaHidVideo = true` and restore on exit only if `animaHidVideo` and `btn-bg` was not already hiding.
