# Oggetto SVG Reattivo al Microfono — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone HTML page with an SVG radio that switches between ATTIVO and NON ATTIVO states based on microphone volume.

**Architecture:** Single `index.html` with inline SVG groups extracted from the two SVG files. CSS handles layout, crossfade transitions, and pulse animation. JavaScript uses Web Audio API (`getUserMedia` + `AnalyserNode`) to sample volume in a `requestAnimationFrame` loop and toggle state with hysteresis.

**Tech Stack:** Vanilla HTML, CSS, JS. No frameworks or build tools.

---

## File Structure

- **Create:** `codebase/index.html` — main page. Contains:
  - Inlined SVG with all groups from `ATTIVO.svg` and `NON ATTIVO.svg`
  - `<style>` block for layout, crossfade, pulse, and slider styles
  - `<script>` block for Web Audio logic, state management, and animation loop

---

### Task 1: Scaffold HTML with inline SVG

**Files:**
- Create: `codebase/index.html`

- [ ] **Step 1: Create `codebase/index.html` with basic structure + inline SVG**

The SVG combines all groups from both source files. Groups common to both states are always visible. `SCHERMO_VOLUME` and `ONDE_AUDIO` get class `state-active`. `SCHERMO_AUDIO` gets class `state-inactive`. The `CASSA` group keeps its original content.

```html
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Radio Reattiva</title>
<style>
/* styles in Task 2 */
</style>
</head>
<body>
<div id="container">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.89 595.28" id="radio-svg">
    <defs>
      <style>
        .st0 { fill: none; stroke: #9e1a16; stroke-miterlimit: 10; stroke-width: 5px; }
      </style>
    </defs>
    <!-- RADIO (always visible) -->
    <g id="RADIO">
      <rect class="st0" x="102.82" y="205.93" width="606.64" height="271.91" rx="118.72" ry="118.72"/>
    </g>
    <!-- CASSA (always visible, animated via class) -->
    <g id="CASSA">
      <g>
        <circle class="st0" cx="211.84" cy="336.91" r="82.72"/>
        <line class="st0" x1="162.82" y1="270.27" x2="162.82" y2="403.54"/>
        <line class="st0" x1="250.06" y1="263.53" x2="250.06" y2="410.29"/>
        <line class="st0" x1="208.84" y1="254.18" x2="208.84" y2="419.63"/>
        <line class="st0" x1="145.2" y1="385.5" x2="278.47" y2="385.5"/>
        <line class="st0" x1="138.46" y1="298.27" x2="285.22" y2="298.27"/>
        <line class="st0" x1="129.12" y1="339.48" x2="294.56" y2="339.48"/>
      </g>
      <g>
        <circle class="st0" cx="601.54" cy="336.91" r="82.72"/>
        <line class="st0" x1="552.52" y1="270.27" x2="552.52" y2="403.54"/>
        <line class="st0" x1="639.76" y1="263.53" x2="639.76" y2="410.29"/>
        <line class="st0" x1="598.54" y1="254.18" x2="598.54" y2="419.63"/>
        <line class="st0" x1="534.9" y1="385.5" x2="668.17" y2="385.5"/>
        <line class="st0" x1="528.16" y1="298.27" x2="674.92" y2="298.27"/>
        <line class="st0" x1="518.81" y1="339.48" x2="684.26" y2="339.48"/>
      </g>
    </g>
    <!-- MANICO (always visible) -->
    <g id="MANICO">
      <path class="st0" d="M372.86,128.57h73.53c21.37,0,38.72,17.35,38.72,38.72v38.64h-150.97v-38.64c0-21.37,17.35-38.72,38.72-38.72Z"/>
    </g>
    <!-- SCHERMO_VOLUME (active state) -->
    <g id="SCHERMO_VOLUME" class="state-active">
      <rect class="st0" x="319.84" y="297.64" width="172.09" height="105.9"/>
      <line class="st0" x1="333.61" y1="391.09" x2="333.61" y2="329.93"/>
      <line class="st0" x1="341.57" y1="391.09" x2="341.57" y2="371.09"/>
      <line class="st0" x1="349.53" y1="391.09" x2="349.53" y2="359.44"/>
      <line class="st0" x1="357.49" y1="391.09" x2="357.49" y2="386.43"/>
      <line class="st0" x1="365.45" y1="391.09" x2="365.45" y2="350.59"/>
      <line class="st0" x1="373.41" y1="391.09" x2="373.41" y2="365.07"/>
      <line class="st0" x1="381.37" y1="391.09" x2="381.37" y2="379.25"/>
      <line class="st0" x1="389.33" y1="391.09" x2="389.33" y2="336.91"/>
      <line class="st0" x1="397.29" y1="391.09" x2="397.29" y2="375.27"/>
      <line class="st0" x1="405.26" y1="391.09" x2="405.26" y2="365.07"/>
      <line class="st0" x1="413.22" y1="391.09" x2="413.22" y2="379.25"/>
      <line class="st0" x1="421.18" y1="391.09" x2="421.18" y2="336.91"/>
      <line class="st0" x1="429.14" y1="391.09" x2="429.14" y2="375.27"/>
      <line class="st0" x1="437.1" y1="391.09" x2="437.1" y2="365.07"/>
      <line class="st0" x1="445.06" y1="391.09" x2="445.06" y2="365.07"/>
      <line class="st0" x1="453.02" y1="391.09" x2="453.02" y2="379.25"/>
      <line class="st0" x1="460.98" y1="391.09" x2="460.98" y2="336.91"/>
      <line class="st0" x1="468.94" y1="391.09" x2="468.94" y2="375.27"/>
      <line class="st0" x1="476.9" y1="391.09" x2="476.9" y2="375.27"/>
    </g>
    <!-- SCHERMO_AUDIO (inactive state) -->
    <g id="SCHERMO_AUDIO" class="state-inactive">
      <rect class="st0" x="319.84" y="297.64" width="172.09" height="105.9"/>
      <line class="st0" x1="333.61" y1="391.09" x2="333.61" y2="386.43"/>
      <line class="st0" x1="340.79" y1="391.09" x2="340.79" y2="386.43"/>
      <line class="st0" x1="347.98" y1="391.09" x2="347.98" y2="386.43"/>
      <line class="st0" x1="355.16" y1="391.09" x2="355.16" y2="386.43"/>
      <line class="st0" x1="362.34" y1="391.09" x2="362.34" y2="386.43"/>
      <line class="st0" x1="369.53" y1="391.09" x2="369.53" y2="386.43"/>
      <line class="st0" x1="376.71" y1="391.09" x2="376.71" y2="386.43"/>
      <line class="st0" x1="383.89" y1="391.09" x2="383.89" y2="386.43"/>
      <line class="st0" x1="391.08" y1="391.09" x2="391.08" y2="386.43"/>
      <line class="st0" x1="398.26" y1="391.09" x2="398.26" y2="386.43"/>
      <line class="st0" x1="405.45" y1="391.09" x2="405.45" y2="386.43"/>
      <line class="st0" x1="412.63" y1="391.09" x2="412.63" y2="386.43"/>
      <line class="st0" x1="419.81" y1="391.09" x2="419.81" y2="386.43"/>
      <line class="st0" x1="427" y1="391.09" x2="427" y2="386.43"/>
      <line class="st0" x1="434.18" y1="391.09" x2="434.18" y2="386.43"/>
      <line class="st0" x1="441.37" y1="391.09" x2="441.37" y2="386.43"/>
      <line class="st0" x1="448.55" y1="391.09" x2="448.55" y2="386.43"/>
      <line class="st0" x1="455.73" y1="391.09" x2="455.73" y2="386.43"/>
      <line class="st0" x1="462.92" y1="391.09" x2="462.92" y2="386.43"/>
      <line class="st0" x1="470.1" y1="391.09" x2="470.1" y2="386.43"/>
      <line class="st0" x1="477.29" y1="391.09" x2="477.29" y2="386.43"/>
    </g>
    <!-- ONDE_AUDIO (active state) -->
    <g id="ONDE_AUDIO" class="state-active">
      <path class="st0" d="M79.91,254.18s-1.98-70.47,89.97-70.47"/>
      <path class="st0" d="M51.89,263.53s-2.89-102.91,131.38-102.91"/>
      <path class="st0" d="M25.51,263.53s-3.4-121.12,154.62-121.12"/>
    </g>
  </svg>
</div>
<div id="controls">
  <label for="sensitivity">Sensibilità: <span id="sensitivity-value">30%</span></label>
  <input type="range" id="sensitivity" min="0" max="1" step="0.01" value="0.3">
</div>
<script>
/* JS in Task 3 */
</script>
</body>
</html>
```

- [ ] **Step 2: Verify the file exists**

```bash
Test-Path -LiteralPath "codebase/index.html"
```
Expected: `True`

---

### Task 2: Add CSS styles (layout, crossfade, pulse)

**Files:**
- Modify: `codebase/index.html` (add CSS in `<style>` block)

- [ ] **Step 1: Replace the empty `<style>` block with full CSS**

Locate `<style></style>` and replace with:

```html
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #f5f5f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
}
#container {
  width: 90vmin;
  max-width: 900px;
}
#radio-svg {
  width: 100%;
  height: auto;
}
.state-active { opacity: 1; transition: opacity 0.3s ease-in-out; }
.state-inactive { opacity: 1; transition: opacity 0.3s ease-in-out; }
#container.inactive .state-active { opacity: 0; }
#container.active .state-inactive { opacity: 0; }
#CASSA { transition: transform 0.3s ease-in-out; transform-origin: 406.69px 336.91px; }
#container.active #CASSA { animation: pulse 0.6s ease-in-out infinite; }
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
#ONDE_AUDIO { transition: transform 0.1s linear; }
#controls {
  margin-top: 24px;
  width: 90vmin;
  max-width: 900px;
  text-align: center;
}
#controls label { display: block; margin-bottom: 8px; font-size: 1rem; color: #333; }
#sensitivity { width: 100%; }
</style>
```

- [ ] **Step 2: Open the HTML in a browser to verify the SVG renders correctly**

Open `codebase/index.html` in a browser. Expected: SVG radio visible, centered, on light background.

---

### Task 3: Add JavaScript — Web Audio logic

**Files:**
- Modify: `codebase/index.html` (add JS in `<script>` block)

- [ ] **Step 1: Replace the empty `<script>` block with full JS**

Locate `<script></script>` and replace with:

```html
<script>
const container = document.getElementById('container');
const svg = document.getElementById('radio-svg');
const cassa = document.getElementById('CASSA');
const ondeAudio = document.getElementById('ONDE_AUDIO');
const sensitivityInput = document.getElementById('sensitivity');
const sensitivityValue = document.getElementById('sensitivity-value');

let audioContext = null;
let analyser = null;
let dataArray = null;
let source = null;
let stream = null;
let isActive = false;
let animFrameId = null;

const HYSTERESIS_FACTOR = 1.05;

sensitivityInput.addEventListener('input', () => {
  const pct = Math.round(parseFloat(sensitivityInput.value) * 100);
  sensitivityValue.textContent = pct + '%';
});

async function initAudio() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    loop();
  } catch (err) {
    console.error('Microfono non accessibile:', err);
  }
}

function getVolume() {
  analyser.getByteFrequencyData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  return sum / dataArray.length / 255;
}

function loop() {
  const volume = getVolume();
  const threshold = parseFloat(sensitivityInput.value);
  const upper = threshold * HYSTERESIS_FACTOR;
  const lower = threshold / HYSTERESIS_FACTOR;

  if (!isActive && volume > upper) {
    isActive = true;
    container.className = 'active';
  } else if (isActive && volume < lower) {
    isActive = false;
    container.className = 'inactive';
  }

  if (isActive && ondeAudio) {
    const wavePaths = ondeAudio.querySelectorAll('path');
    const offset = (volume - threshold) * 40;
    const offsets = [offset, offset * 0.7, offset * 0.4];
    wavePaths.forEach((path, i) => {
      path.setAttribute('transform', `translate(0, ${-offsets[i]})`);
    });
  }

  animFrameId = requestAnimationFrame(loop);
}

initAudio();
</script>
```

- [ ] **Step 2: Verify no syntax errors**

Open the HTML in a browser and check the console (`F12`). Expected: No JS errors. The page should request microphone permission.

---

### Task 4: Self-review and final verification

**Files:**
- Modify: `codebase/index.html`

- [ ] **Step 1: Review for any issues**

Check these requirements against the implementation:
- SVG renders with both speaker screens, handle, radio body, sound waves
- Crossfade between active/inactive screen groups works
- Casse pulse animation plays when active
- Sound waves translateY reacts to volume
- Sensitivity slider controls threshold
- Hysteresis prevents flickering

- [ ] **Step 2: Open in browser and test with microphone**

Open `codebase/index.html` in Chrome or Firefox. Allow microphone access. Make noise — the radio should switch to active state with pulse and wave animation. Go quiet — it should fade back to inactive. Adjust sensitivity slider and verify the response changes.
