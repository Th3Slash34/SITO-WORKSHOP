# STYLEGUIDE — ROBERTO FRANCIPELLI

Design system del sito portfolio. Tema rosso, font Jersey, ispirazione Supercell/CRT videoludico.

---

## COLORI

| Ruolo | Colore | Esagono |
|---|---|---|
| Accento principale | Rosso | `#cc2222` |
| Rosso scuro (scanline titoli) | Rosso scuro | `#7a1414` |
| Sfondo pagina | Nero profondo | `#0a0202` |
| Testo primario | Bianco | `#ffffff` |
| Testo secondario | Bianco 60% | `rgba(255,255,255,0.6)` |
| Descrizioni | Bianco 35% | `rgba(255,255,255,0.35)` |
| Sfondo nav | Nero 88% | `rgba(5,2,2,0.88)` |

### Card esercizi

| Card | Gradiente |
|---|---|
| DISEGNARE CON LE MANI | `#C25A3C → #a0452a` |
| TIPOGRAFIA CINETICA | `#6B2D46 → #4a1e30` |
| TEXTURE O PATTERN | `#6B7B8D → #4a5a6b` |
| RESPONSIVO AL MICROFONO | `#8C7A6B → #6b5a4a` |
| RICETTA PASTA | `#3d2a2a → #2a1a1a` (titolo in `#e8d5b7`) |

---

## TIPOGRAFIA

Font: **Jersey** (Google Fonts)

| Peso | Uso | Dimensione |
|---|---|---|
| **Jersey 25** | Titoli hero, sezioni, card | `clamp(3.5rem, 10vw, 7rem)` |
| **Jersey 20** | Sottotitoli, CTA, link contatti | `clamp(1.2rem, 2.5vw, 1.8rem)` |
| **Jersey 15** | Corpo testo, nav, descrizioni card | `clamp(1rem, 1.5vw, 1.2rem)` |
| **Jersey 10** | Etichette, credits, info minime | `0.7rem` |

I titoli hanno scanline direttamente nel testo via `background-clip: text` con `repeating-linear-gradient` che alterna colore pieno e scuro ogni 2px.

---

## COMPONENTI

### Nav
- Posizione: fixed in alto
- Sfondo: `rgba(5,2,2,0.88)` con `backdrop-filter: blur(8px)`
- Logo: Jersey 25, `#cc2222`
- Link: Jersey 15, colore base `rgba(255,255,255,0.6)`, hover `#cc2222`
- Padding: `1rem 2.5rem`

### Card esercizi
- Border-radius: `16px`
- Min-height: `280px` (desktop), `160px` (mobile)
- Padding: `4rem 2rem` (desktop), `1.8rem 1rem` (mobile)
- Hover: `translateY(-6px)` + `box-shadow: 0 20px 40px rgba(0,0,0,0.4)`
- Titolo card: Jersey 25, `clamp(2rem, 4vw, 3.5rem)`, scanline effect

### Button / Link contatti
- Jersey 20, `#cc2222`
- Bordo: `2px solid rgba(204,34,34,0.3)`
- Padding: `0.8rem 2rem`, border-radius: `8px`
- Hover: sfondo `rgba(204,34,34,0.1)`, bordo `#cc2222`

### Footer
- Centrato, bordo superiore sottile
- Brand: Jersey 25, `rgba(255,255,255,0.3)`
- Link: Jersey 15, `rgba(255,255,255,0.25)`, hover `#cc2222`
- Credits: Jersey 10, `rgba(255,255,255,0.15)`

---

## EFFETTI

### Scanlines CRT
Overlay fisso su tutta la pagina (`z-index: 9998`):
```
repeating-linear-gradient(
  0deg, transparent 0 2px,
  rgba(0,0,0,0.35) 2px 4px
)
```

### Pixel particles
60 particelle quadrate (4-10px) che fluttuano dal basso verso l'alto:
- `z-index: 0` (sotto il contenuto)
- Durata: random 25-55s
- Colori: rosso semitrasparente
- `animation: float linear infinite`

### Cursor glow + sparks
- Glow: radiale 180px, `#cc2222`, `z-index: 9999`
- Segue il mouse con `transform: translate(-50%,-50%)`
- 30% di probabilità di generare una spark per movimento
- Spark: 3-8px, si allontana radialmente e svanisce in ~1s

---

## SPAZIATURE

| Elemento | Valore |
|---|---|
| Container | `max-width: 960px` |
| Gap griglia esercizi | `2rem` |
| Border-radius card | `16px` |
| Padding nav | `1rem 2.5rem` |
| Padding sezioni | `5rem 3rem` |

### Breakpoint
- `900px`: griglia mantiene 2 colonne
- `600px`: griglia passa a 1 colonna, padding ridotti
