# Oggetto SVG Reattivo al Microfono — Specifica di Design

## Panoramica
Pagina HTML autonoma che mostra un'illustrazione SVG di una radio. Il microfono rileva il volume ambientale e commuta tra due stati visivi (ATTIVO / NON ATTIVO) con transizioni animate CSS.

## Asset
- `ATTIVO.svg` — radio con barre volume di diverse altezze, onde sonore a sinistra
- `NON ATTIVO.svg` — radio con barre volume piatte, senza onde sonore

I gruppi SVG vengono estratti e inlinati nell'HTML. I gruppi presenti:
- **Comuni** (sempre visibili): `RADIO`, `CASSA`, `MANICO`
- **Attivo** (`opacity: 1` quando attivo): `SCHERMO_VOLUME`, `ONDE_AUDIO`
- **Non attivo** (`opacity: 1` quando inattivo): `SCHERMO_AUDIO`

## Architettura

### HTML
- File unico `index.html` con CSS in `<style>` e JS in `<script>`
- SVG inline nel DOM per consentire animazioni JS su singoli elementi
- Slider sensitivity sotto l'SVG

### CSS
- Crossfade tra gruppi attivo/inattivo: `opacity` + `transition: opacity 0.3s`
- Pulse delle casse: `transform: scale()` con `transition: transform 0.3s ease-in-out`
  - Ciclo 1.0 ↔ 1.03 mentre lo stato è attivo
- Onde sonore: `transform: translateY()` sincronizzato col volume live
- Layout: SVG centrato su fondo chiaro, adattato alla viewport
- Slider centrato sotto l'SVG

### JavaScript — Web Audio API
1. `navigator.mediaDevices.getUserMedia({ audio: true })` — permesso microfono
2. `AudioContext` + `AnalyserNode` — campionamento frequenza
3. `requestAnimationFrame` loop (~60fps):
   - Legge `getByteFrequencyData` dall'analyser
   - Calcola media come valore di volume (0–255 → normalizzato 0–1)
   - Confronta con soglia (controllata da slider)
   - Isteresi: per passare a ATTIVO serve volume > soglia × 1.05; per tornare a NON ATTIVO serve volume < soglia × 0.95
4. Switch di classe CSS sul container: `class="active"` o `class="inactive"`
5. Onde audio: mappa valore volume direttamente su `translateY` (escursione ~10px)

### Slider Sensibilità
- `<input type="range" min="0" max="1" step="0.01" value="0.3">`
- Etichetta "Sensibilità" sopra lo slider
- Valore mostrato dinamicamente in percentuale

## Comportamento

| Evento                   | Transizione                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Silenzio/volume < soglia | `SCHERMO_AUDIO` visibile, `SCHERMO_VOLUME` + `ONDE_AUDIO` nascosti, casse a scala 1                                             |
| Volume > soglia          | Crossfade: `SCHERMO_VOLUME` + `ONDE_AUDIO` appaiono, `SCHERMO_AUDIO` scompare. Casse pulse 1.0↔1.03. Onde oscillano col volume. |

## File prodotto
- `codebase/index.html` — pagina completa
- `docs/superpowers/specs/2026-05-20-oggetto-sonoro-svg-design.md` — questo documento
