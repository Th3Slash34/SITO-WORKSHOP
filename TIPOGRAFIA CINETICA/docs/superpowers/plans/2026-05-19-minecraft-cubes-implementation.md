# MINECRAFT Cubes Animation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single HTML file that animates the text "MINECRAFT" using Minecraft-style 3D cubes flying into place.

**Architecture:** Single `index.html` file with Three.js (CDN). Letter shapes defined as boolean bitmaps. Cubes are `BoxGeometry` with canvas-generated block textures. Animation uses `requestAnimationFrame` with a queue system.

**Tech Stack:** Three.js (CDN), Canvas 2D (programmatic textures), vanilla JS

---

### Task 1: HTML Scaffold + Three.js Scene Setup

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write the HTML scaffold with Three.js CDN**

```html
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MINECRAFT — Cubetti 3D</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { overflow: hidden; background: #1a1a2e; }
  canvas { display: block; }
</style>
</head>
<body>
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"
  }
}
</script>
<script type="module">
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
fillLight.position.set(-10, 5, -10);
scene.add(fillLight);

// Ground plane (for shadow)
const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.ShadowMaterial({ opacity: 0.3, color: 0x000000 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.6;
ground.receiveShadow = true;
scene.add(ground);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
</script>
</body>
</html>
```

- [ ] **Step 2: Open in browser to verify**

Open `index.html` in browser.
Expected: Blue sky background, ground shadow plane visible, no errors in console.

- [ ] **Step 3: Commit**

```bash
git init
git add index.html
git commit -m "feat: add three.js scene scaffold"
```

---

### Task 2: Letter Bitmaps (8×10 grid for M I N E C R A F T)

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add letter bitmap definitions**

Add this object after the lights setup, before the ground plane code:

```javascript
const LETTERS = 'MINECRAFT';
const GRID_W = 8;
const GRID_H = 10;
const SPACING = 2;

const BITMAPS = {
  M: [
    0,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,1,
    1,1,0,0,0,0,1,1,
    1,0,1,0,0,1,0,1,
    1,0,0,1,1,0,0,1,
    1,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,1,
    0,0,0,0,0,0,0,0,
  ],
  I: [
    0,0,0,0,0,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,0,0,0,0,0,
  ],
  N: [
    0,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,1,
    1,1,0,0,0,0,0,1,
    1,0,1,0,0,0,0,1,
    1,0,0,1,0,0,0,1,
    1,0,0,0,1,0,0,1,
    1,0,0,0,0,1,0,1,
    1,0,0,0,0,0,1,1,
    1,0,0,0,0,0,0,1,
    0,0,0,0,0,0,0,0,
  ],
  E: [
    0,0,0,0,0,0,0,0,
    1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0,
    1,1,1,1,1,0,0,0,
    1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0,
    1,1,1,1,1,1,1,1,
    0,0,0,0,0,0,0,0,
  ],
  C: [
    0,0,0,0,0,0,0,0,
    0,1,1,1,1,1,1,0,
    1,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,1,
    0,1,1,1,1,1,1,0,
    0,0,0,0,0,0,0,0,
  ],
  R: [
    0,0,0,0,0,0,0,0,
    1,1,1,1,1,1,0,0,
    1,0,0,0,0,0,1,0,
    1,0,0,0,0,0,1,0,
    1,1,1,1,1,1,0,0,
    1,0,0,1,1,0,0,0,
    1,0,0,0,1,0,0,0,
    1,0,0,0,0,1,0,0,
    1,0,0,0,0,0,1,0,
    0,0,0,0,0,0,0,0,
  ],
  A: [
    0,0,0,0,0,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,1,0,0,1,0,0,
    0,1,0,0,0,0,1,0,
    1,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,1,
    0,0,0,0,0,0,0,0,
  ],
  F: [
    0,0,0,0,0,0,0,0,
    1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0,
    1,1,1,1,1,0,0,0,
    1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
  ],
  T: [
    0,0,0,0,0,0,0,0,
    1,1,1,1,1,1,1,1,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,0,0,0,0,0,
  ],
};

function getLetterOffset(letterIndex) {
  let offset = 0;
  for (let i = 0; i < letterIndex; i++) {
    offset += GRID_W + SPACING;
  }
  return offset;
}
```

- [ ] **Step 2: Verify in browser**

Open `index.html`, check console for no errors.
Expected: Blue background, no errors, nothing else changed visibly.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add letter bitmaps for MINECRAFT"
```

---

### Task 3: Programmatic Minecraft Textures (Canvas 2D)

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add texture generator function**

Add this after the BITMAPS definition:

```javascript
function createBlockTexture(name) {
  const size = 16;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const colors = {
    grass:    { base: '#7c9c5c', top: '#7c9c5c', side: '#7c9c5c', line: '#5c7c3c' },
    stone:    { base: '#8c8c8c', top: '#8c8c8c', side: '#8c8c8c', line: '#6c6c6c' },
    dirt:     { base: '#8c6c3c', top: '#8c6c3c', side: '#8c6c3c', line: '#6c4c2c' },
    planks:   { base: '#b8943c', top: '#b8943c', side: '#b8943c', line: '#9c7424' },
    cobble:   { base: '#7c7c7c', top: '#7c7c7c', side: '#7c7c7c', line: '#5c5c5c' },
    brick:    { base: '#9c5c3c', top: '#9c5c3c', side: '#9c5c3c', line: '#7c3c2c' },
    gold:     { base: '#dcdc3c', top: '#dcdc3c', side: '#dcdc3c', line: '#bcbc2c' },
    diamond:  { base: '#3cdcbc', top: '#3cdcbc', side: '#3cdcbc', line: '#2cbc9c' },
    netherrack:{base: '#6c2c2c', top: '#6c2c2c', side: '#6c2c2c', line: '#4c1c1c' },
  };

  const c = colors[name];
  if (!c) return null;

  // Fill base color
  ctx.fillStyle = c.base;
  ctx.fillRect(0, 0, size, size);

  // Add pixel noise/pattern for block texture feel
  const dark = ctx.createImageData(size, size);
  const data = dark.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 0;
    data[i+1] = 0;
    data[i+2] = 0;
    data[i+3] = 50 + Math.random() * 80;
  }
  ctx.putImageData(dark, 0, 0);

  // Grid lines
  ctx.strokeStyle = c.line;
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

const TEXTURE_NAMES = ['grass', 'stone', 'dirt', 'planks', 'cobble', 'brick', 'gold', 'diamond', 'netherrack'];
const TEXTURES = TEXTURE_NAMES.map(createBlockTexture);
```

- [ ] **Step 2: Verify in browser**

Open `index.html`, check console.
Expected: No errors, textures created silently.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add programmatic minecraft block textures"
```

---

### Task 4: Cube Generation and Positioning

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Generate all cube objects at target + offscreen positions**

Add this after the texture code, before `animate()`:

```javascript
const CUBE_SIZE = 0.8;
const GAP = 0.05;
const cubeSize = CUBE_SIZE - GAP;

let allCubes = [];

LETTERS.split('').forEach((char, letterIdx) => {
  const bitmap = BITMAPS[char];
  if (!bitmap) return;
  const offsetX = getLetterOffset(letterIdx);

  for (let row = 0; row < GRID_H; row++) {
    for (let col = 0; col < GRID_W; col++) {
      const idx = row * GRID_W + col;
      if (!bitmap[idx]) continue;

      const targetX = (offsetX + col - (GRID_W * LETTERS.length + SPACING * (LETTERS.length - 1)) / 2) * CUBE_SIZE;
      const targetY = (GRID_H - 1 - row - GRID_H / 2) * CUBE_SIZE;
      const targetZ = 0;

      const texIdx = allCubes.length % TEXTURES.length;
      const mat = new THREE.MeshStandardMaterial({
        map: TEXTURES[texIdx],
        roughness: 0.7,
        metalness: 0.1,
      });

      const cube = new THREE.Mesh(new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize), mat);
      cube.castShadow = true;
      cube.receiveShadow = true;

      const angle = Math.random() * Math.PI * 2;
      const dist = 25 + Math.random() * 15;
      cube.position.set(
        targetX + Math.cos(angle) * dist,
        targetY + Math.sin(angle) * dist,
        targetZ + (Math.random() - 0.5) * dist
      );

      cube.userData = {
        targetPos: new THREE.Vector3(targetX, targetY, targetZ),
        startPos: cube.position.clone(),
        progress: 0,
        arrived: false,
        startRot: new THREE.Euler(Math.random() * 2, Math.random() * 2, Math.random() * 2),
      };

      scene.add(cube);
      allCubes.push(cube);
    }
  }
});

// Randomize order
allCubes.sort(() => Math.random() - 0.5);

// Animation queue
let currentCubeIdx = 0;
let lastCubeTime = 0;
const TICK_INTERVAL = 100; // ms
```

- [ ] **Step 2: Verify in browser**

Open `index.html`, check console. All cubes should be created at offscreen positions, invisible.
Expected: No errors. Scene should appear as before (no cubes visible yet since they're offscreen).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: generate cubes at offscreen positions"
```

---

### Task 5: Animation Loop — Cubes Fly In One by One

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Implement fly-in animation in the animate loop**

Replace the empty `animate()` function with:

```javascript
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function animate(time) {
  requestAnimationFrame(animate);

  // Launch next cube
  if (currentCubeIdx < allCubes.length && time - lastCubeTime > TICK_INTERVAL) {
    lastCubeTime = time;
    currentCubeIdx++;
  }

  // Animate each cube
  for (let i = 0; i < allCubes.length; i++) {
    const cube = allCubes[i];
    const data = cube.userData;

    if (!data.arrived && i < currentCubeIdx) {
      data.progress += 0.02;
      if (data.progress >= 1) {
        data.progress = 1;
        data.arrived = true;
        cube.position.copy(data.targetPos);
      } else {
        const t = easeOutBack(data.progress);
        cube.position.lerpVectors(data.startPos, data.targetPos, t);
        cube.rotation.x = data.startRot.x * (1 - data.progress);
        cube.rotation.y = data.startRot.y * (1 - data.progress);
        cube.rotation.z = data.startRot.z * (1 - data.progress);
      }
    }
  }

  renderer.render(scene, camera);
}
animate();
```

- [ ] **Step 2: Open in browser to verify animation**

Open `index.html`.
Expected: Cubes fly in from offscreen one at a time in random order, rotating slightly, forming "MINECRAFT". Each cube has a different Minecraft block texture. Textures cycle every 9 cubes.

- [ ] **Step 3: Tweak timing if needed**

Adjust `TICK_INTERVAL` (faster = lower number) or `0.02` (speed per frame) if animation is too fast/slow.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add fly-in animation with easing"
```

---

### Task 6: Final Verification — All Cubes Static at End

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Verify in browser**

Open `index.html`.
Expected: All cubes fly in one by one, forming "MINECRAFT". After the last cube lands, everything stays static.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: complete animation, cubes static at end"
```

---

### Task 7: Polish — Sizing, Centering, Responsiveness

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Adjust camera position and cube sizing for optimal view**

After testing visually, adjust these parameters at the top of the JS:

```javascript
const CUBE_SIZE = 0.7;    // slightly smaller if too crowded
const TICK_INTERVAL = 80;  // slightly faster if too slow
```

And adjust camera for best framing:

```javascript
camera.position.set(0, 10, 22);
```

- [ ] **Step 2: Add simple loading/title text**

Before the Three.js canvas, add a title overlay:

```html
<div id="title">MINECRAFT</div>
<style>
  #title {
    position: fixed;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Courier New', monospace;
    font-size: 14px;
    color: rgba(255,255,255,0.3);
    letter-spacing: 4px;
    text-transform: uppercase;
    z-index: 10;
    pointer-events: none;
  }
</style>
```

- [ ] **Step 3: Final browser verification**

Open `index.html` in full screen.
Expected: "MINECRAFT" composed of ~400-500 cubes with Minecraft textures centered in view, cubes fly in randomly one at a time, all end static.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: polish sizing, centering, and add title overlay"
```
