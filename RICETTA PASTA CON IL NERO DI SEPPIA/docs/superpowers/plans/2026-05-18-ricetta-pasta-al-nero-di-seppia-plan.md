# Pasta al Nero di Seppia — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page HTML website for the "Pasta al Nero di Seppia" recipe with interactive ingredient scaling and substitution suggestions.

**Architecture:** Single `index.html` file in `codebase/` containing inline CSS and vanilla JS. Recipe data defined as a JS object. All UI updates happen in real time via event listeners.

**Tech Stack:** Vanilla HTML5, CSS3, ES6 JavaScript. Zero dependencies.

---

### Task 1: HTML Structure — Skeleton and Static Content

**Files:**
- Create: `codebase/index.html`

- [ ] **Step 1: Create the HTML file with document structure**

Create `codebase/index.html` with:
```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pasta al Nero di Seppia</title>
  <style>
    /* CSS will be added in Task 2 */
  </style>
</head>
<body>
  <!-- Content will be added in Step 2 -->
  <script>
    /* JS will be added in Task 3+ */
  </script>
</body>
</html>
```

- [ ] **Step 2: Add the static HTML sections inside `<body>`**

```html
<header class="recipe-header">
  <h1>Pasta al Nero di Seppia</h1>
  <p class="author">Chef Gordon Primesay</p>
</header>

<section class="servings-control">
  <label for="servings-slider">Numero di commensali:</label>
  <div class="servings-row">
    <input type="range" id="servings-slider" min="1" max="20" value="2" step="1">
    <span id="servings-display">2</span>
  </div>
</section>

<section class="ingredients" id="ingredients-section">
  <h2>Ingredienti</h2>
  <div class="ingredients-grid" id="ingredients-grid">
    <!-- Populated by JS -->
  </div>
</section>

<section class="instructions">
  <h2>Procedimento</h2>
  <ol id="instructions-list">
    <!-- Populated by JS -->
  </ol>
</section>
```

- [ ] **Step 3: Verify file opens in browser**

Run: `Start-Process "codebase\index.html"`
Expected: Browser opens showing plain unstructured content.

---

### Task 2: CSS Styling

**Files:**
- Modify: `codebase/index.html`

- [ ] **Step 1: Add CSS variables and reset inside `<style>`**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #f5f0eb;
  --text: #1a1a1a;
  --accent: #d97706;
  --success: #16a34a;
  --warning: #ea580c;
  --error: #dc2626;
  --card-bg: #ffffff;
  --border: #e5e0db;
}

body {
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}
```

- [ ] **Step 2: Add header and servings control styles**

```css
.recipe-header {
  text-align: center;
  margin-bottom: 2rem;
}
.recipe-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
}
.recipe-header .author {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}
.servings-control {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}
.servings-control label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.75rem;
}
.servings-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.servings-row input[type="range"] {
  flex: 1;
  accent-color: var(--accent);
}
#servings-display {
  font-size: 1.5rem;
  font-weight: 700;
  min-width: 2.5rem;
  text-align: center;
  color: var(--accent);
}
```

- [ ] **Step 3: Add ingredients grid styles**

```css
.ingredients {
  margin-bottom: 2rem;
}
.ingredients h2, .instructions h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--accent);
}
.ingredient-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.ingredient-card .name {
  flex: 1;
  font-weight: 500;
}
.ingredient-card .scaled-qty {
  color: #666;
  font-size: 0.9rem;
  min-width: 5rem;
  text-align: right;
}
.ingredient-card .availability-input {
  width: 70px;
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
}
.ingredient-card .unit-label {
  font-size: 0.85rem;
  color: #888;
  min-width: 2rem;
}
.status-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: default;
  flex-shrink: 0;
}
.status-ok { background: #dcfce7; color: var(--success); }
.status-warning { background: #ffedd5; color: var(--warning); cursor: pointer; }
.status-error { background: #fee2e2; color: var(--error); }
.substitution-tip {
  display: none;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: #92400e;
}
.substitution-tip.visible {
  display: block;
}
.qb-label {
  color: #888;
  font-style: italic;
  font-size: 0.9rem;
}
```

- [ ] **Step 4: Add instructions and utility styles**

```css
.instructions ol {
  padding-left: 1.5rem;
}
.instructions li {
  margin-bottom: 0.75rem;
  line-height: 1.7;
}
.instructions li .dynamic-qty {
  font-weight: 600;
  color: var(--accent);
}
.reset-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1.2rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}
.reset-btn:hover {
  opacity: 0.9;
}
@media (max-width: 600px) {
  .ingredient-card {
    flex-wrap: wrap;
  }
  .ingredient-card .name {
    flex: 1 1 100%;
    order: -1;
  }
}
```

- [ ] **Step 5: Verify styling renders correctly**

Open `codebase/index.html` in browser and confirm styled layout matches the design spec.

---

### Task 3: JS — Recipe Data and Ingredient Rendering

**Files:**
- Modify: `codebase/index.html`

- [ ] **Step 1: Add the recipe data object inside `<script>`**

```js
const BASE_SERVINGS = 2;

const recipe = {
  title: "Pasta al Nero di Seppia",
  author: "Chef Gordon Primesay",
  ingredients: [
    { id: "seppie", name: "Seppie", qty: 600, unit: "g", scalable: true, optional: false, substitution: "Aggiungi gamberetti o vongole per bilanciare." },
    { id: "pomodoro", name: "Concentrato di pomodoro", qty: 30, unit: "g", scalable: true, optional: false, substitution: "Usa un pomodoro fresco maturo pelato." },
    { id: "vino", name: "Vino bianco secco", qty: 60, unit: "ml", scalable: true, optional: false, substitution: "Sfuma con brodo vegetale e qualche goccia di limone." },
    { id: "scalogno", name: "Scalogno", qty: 1, unit: "", scalable: true, optional: false, substitution: "Usa mezza cipolla dorata." },
    { id: "aglio", name: "Aglio", qty: 1, unit: "spicchio", scalable: true, optional: false, substitution: "Usa 1/2 cucchiaino di aglio in polvere." },
    { id: "pasta", name: "Pasta (spaghetti/linguine)", qty: 350, unit: "g", scalable: true, optional: false, substitution: "Allunga con zucchine tagliate a dadini." },
    { id: "olio", name: "Olio extravergine di oliva", qty: null, unit: "q.b.", scalable: false, optional: false, substitution: null },
    { id: "peperoncino", name: "Peperoncino", qty: 1, unit: "pezzetto", scalable: true, optional: true, substitution: "Usa un pizzico di peperoncino in polvere." },
    { id: "sale", name: "Sale", qty: null, unit: "q.b.", scalable: false, optional: false, substitution: null },
  ],
  instructions: [
    "Tritare finemente la cipolla e metterla in un tegame con il peperoncino intero, uno spicchio d'aglio e l'olio extravergine d'oliva.",
    "Fare appassire la cipolla lentamente aggiungendo 10ml di acqua calda per evitare che bruci, cuocendo finché non diventa trasparente.",
    "Nel frattempo, tagliare le seppie a strisce sottili e dividere i tentacoli in piccoli pezzi.",
    "Aggiungere le seppie alla cipolla e rosolare a fuoco medio.",
    "Quando le seppie cambiano colore, aggiungere qualche goccia di vino bianco e lasciare evaporare la parte alcolica.",
    "Aggiungere il concentrato di pomodoro.",
    "Prendere la vescica contenente il nero della seppia tra due dita e spremere delicatamente per far gocciolare il nero nel tegame, facendo attenzione a non schizzare.",
    "Mescolare e aggiungere mezzo bicchiere di acqua calda.",
    "Cuocere le seppie con il loro nero a fuoco basso e coperto per 20 minuti.",
    "Assaggiare prima di aggiungere il sale — il nero della seppia è naturalmente salato.",
    "Lessare la pasta in abbondante acqua salata e scolarla al dente.",
    "Mantecare la pasta in padella insieme al sugo delle seppie, emulsionando con un filo d'olio extravergine d'oliva e poca acqua di cottura se necessario."
  ]
};
```

- [ ] **Step 2: Add the scaling helper function**

```js
function getScaledQty(ingredient, servings) {
  if (!ingredient.scalable || ingredient.qty === null) return null;
  return (ingredient.qty / BASE_SERVINGS) * servings;
}

function getStatus(ingredient, servings, available) {
  if (!ingredient.scalable || ingredient.qty === null) return null;
  const needed = getScaledQty(ingredient, servings);
  if (available === null || available === undefined || available === '') return null;
  const ratio = available / needed;
  if (ratio >= 0.8) return 'ok';
  if (ratio >= 0.5) return 'warning';
  return 'error';
}
```

- [ ] **Step 3: Add render function for ingredients**

```js
function renderIngredients(servings, availabilities, includePeperoncino) {
  const grid = document.getElementById('ingredients-grid');
  grid.innerHTML = '';

  recipe.ingredients.forEach(ing => {
    if (ing.optional && !includePeperoncino) return;

    const card = document.createElement('div');
    card.className = 'ingredient-card';
    card.dataset.id = ing.id;

    const scaledQty = getScaledQty(ing, servings);
    const available = availabilities[ing.id] !== undefined ? availabilities[ing.id] : (scaledQty || '');
    const status = getStatus(ing, servings, available);

    const scaledDisplay = scaledQty !== null ? `${scaledQty}${ing.unit ? ' ' + ing.unit : ' (' + ing.unit + ')'}` : '';
    const availDisplay = ing.scalable
      ? `<input type="number" class="availability-input" id="avail-${ing.id}" value="${available}" min="0" step="any" data-id="${ing.id}">`
      : '<span class="qb-label">q.b.</span>';

    let statusHtml = '';
    if (status === 'ok') {
      statusHtml = '<span class="status-indicator status-ok">&#10003;</span>';
    } else if (status === 'warning') {
      statusHtml = `<span class="status-indicator status-warning" data-id="${ing.id}" role="button">&#9888;</span>`;
    } else if (status === 'error') {
      statusHtml = '<span class="status-indicator status-error">&#10007;</span>';
    } else {
      statusHtml = '<span class="status-indicator" style="visibility:hidden;">-</span>';
    }

    card.innerHTML = `
      <span class="name">${ing.name}</span>
      <span class="scaled-qty">${scaledDisplay}</span>
      ${availDisplay}
      ${ing.scalable ? `<span class="unit-label">${ing.unit}</span>` : ''}
      ${statusHtml}
    `;
    grid.appendChild(card);

    if (status === 'warning') {
      const indicator = card.querySelector('.status-warning');
      const tip = document.createElement('div');
      tip.className = 'substitution-tip';
      tip.id = `tip-${ing.id}`;
      tip.textContent = ing.substitution;
      card.appendChild(tip);
      indicator.addEventListener('click', () => {
        tip.classList.toggle('visible');
      });
    }

    if (ing.scalable) {
      const input = card.querySelector('.availability-input');
      if (input) {
        input.addEventListener('input', (e) => {
          const newVal = e.target.value === '' ? '' : parseFloat(e.target.value);
          availabilities[ing.id] = newVal;
          renderIngredients(servings, availabilities, includePeperoncino);
        });
      }
    }
  });
}
```

- [ ] **Step 4: Add render function for instructions**

```js
function renderInstructions(servings) {
  const list = document.getElementById('instructions-list');
  list.innerHTML = '';

  recipe.instructions.forEach(text => {
    const li = document.createElement('li');
    let html = text;
    recipe.ingredients.forEach(ing => {
      if (ing.scalable && ing.qty !== null) {
        const scaled = getScaledQty(ing, servings);
        const qtyStr = ing.unit ? `${scaled} ${ing.unit}` : `${scaled}`;
        const regex = new RegExp(`(\\b${ing.qty}\\s*${ing.unit.replace('.', '\\.')}\\b)`, 'gi');
        html = html.replace(regex, `<span class="dynamic-qty">${qtyStr}</span>`);
      }
    });
    li.innerHTML = html;
    list.appendChild(li);
  });
}
```

- [ ] **Step 5: Add initialization and state management**

```js
let currentServings = 2;
let availabilities = {};
let includePeperoncino = true;

function initAvailabilities() {
  recipe.ingredients.forEach(ing => {
    if (ing.scalable && ing.qty !== null) {
      availabilities[ing.id] = getScaledQty(ing, BASE_SERVINGS);
    }
  });
}

function renderAll() {
  renderIngredients(currentServings, availabilities, includePeperoncino);
  renderInstructions(currentServings);
  document.getElementById('servings-display').textContent = currentServings;
}

initAvailabilities();
```

- [ ] **Step 6: Add event listeners**

```js
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('servings-slider');
  const display = document.getElementById('servings-display');

  slider.addEventListener('input', (e) => {
    currentServings = parseInt(e.target.value, 10);
    renderAll();
  });

  const resetBtn = document.createElement('button');
  resetBtn.className = 'reset-btn';
  resetBtn.textContent = 'Reimposta disponibilità';
  resetBtn.addEventListener('click', () => {
    initAvailabilities();
    renderAll();
  });
  document.getElementById('ingredients-section').appendChild(resetBtn);

  const checkbox = document.createElement('label');
  checkbox.style.cssText = 'display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; font-size:0.9rem; cursor:pointer;';
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.checked = true;
  cb.addEventListener('change', (e) => {
    includePeperoncino = e.target.checked;
    renderAll();
  });
  checkbox.appendChild(cb);
  checkbox.appendChild(document.createTextNode('Includi peperoncino'));
  document.getElementById('ingredients-section').insertBefore(checkbox, document.getElementById('ingredients-grid'));

  renderAll();
});
```

---

### Task 4: Self-Review and Polish

**Files:**
- Modify: `codebase/index.html`

- [ ] **Step 1: Review against spec checklist**

Check each spec requirement has a corresponding implementation:
- [x] Selettore commensali 1–20 (Task 1, Task 3 step 6)
- [x] Scaling ingredienti via `getScaledQty` (Task 3 step 2)
- [x] Input disponibilità per ogni ingrediente (Task 3 step 3)
- [x] Indicatore ✅/⚠️/❌ (Task 3 step 3)
- [x] Suggerimenti sostituzione su click (Task 3 step 3)
- [x] Ingredienti q.b. senza scaling né input (Task 3 step 3 — `qb-label`)
- [x] Checkbox peperoncino opzionale (Task 3 step 6)
- [x] Pulsante reset (Task 3 step 6)
- [x] Procedimento con quantità scalate (Task 3 step 4)
- [x] Design responsive, palette colori (Task 2)

- [ ] **Step 2: Test all interactions manually**

Open `codebase/index.html` in browser and verify:
- Slider changes update quantities in real time
- Availability inputs change status indicators
- Clicking ⚠️ shows/hides substitution tip
- Unchecking "peperoncino" removes it from the list
- Reset button restores default availability values

- [ ] **Step 3: Fix any issues found during testing**

Address any broken interactions, incorrect quantities, or styling issues.

---

### Task 5: Final Verification

**Files:**
- Modify: `codebase/index.html`

- [ ] **Step 1: Validate HTML**

Open `codebase/index.html` in browser, open DevTools console — confirm no JS errors.

- [ ] **Step 2: Responsive test**

Resize browser to mobile width (<600px) — verify ingredient cards stack properly.

- [ ] **Step 3: Edge case test**

Slide servings to 1, then 20. Verify all quantities scale correctly and no NaN or negative values appear.
