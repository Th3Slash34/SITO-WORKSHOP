# MINECRAFT — Animazione Cubetti 3D

## Obiettivo
Animazione HTML della scritta "MINECRAFT" composta da cubetti 3D in stile Minecraft. I cubetti volano da fuori schermo e si compongono uno alla volta in ordine sparso fino a formare il testo completo.

## Tecnologia
- **Three.js** (ultima versione stabile, caricato via CDN)
- Singolo file `index.html` con CSS inline e JS
- Camera in prospettiva, angolata ~30° sopra il piano

## Griglia e Lettere
- Ogni lettera: griglia **8×10** (8 colonne × 10 righe)
- 9 lettere: M I N E C R A F T
- Spaziatura: 2 colonne tra ogni lettera
- Bitmap: ogni lettera definita come matrice booleana 8×10

## Cubetti
- ~400–500 cubi totali (a seconda del riempimento delle lettere)
- Ogni cubo è un `BoxGeometry(1, 1, 1)` con texture su tutte le facce
- Posizione finale calcolata in base a (lettera, col, riga) sulla griglia globale

## Texture
9 texture di blocchi Minecraft (16×16 PNG), ciclo ogni 9 cubetti:
1. Grass Block (top)
2. Stone
3. Dirt
4. Oak Planks
5. Cobblestone
6. Brick
7. Gold Block
8. Diamond Block
9. Netherrack

Ciclo: cubetto 1→9 = texture 1→9, cubetto 10→18 = texture 1→9, ecc.

## Animazione
- All'avvio: generazione di tutti i cubetti con posizione iniziale random fuori schermo
- **Ordine sparso:** array dei cubetti randomizzato, non lettera-per-lettera
- **Tick:** ogni ~100ms entra un cubetto
- **Traiettoria:** volo con easing (cubic-bezier o Three.js tween) da posizione casuale a posizione finale
- **Rotazione:** leggera rotazione durante il volo, si ferma a destinazione
- **Atterraggio:** piccolo rimbalzo visivo (overshoot) poi fermo
- **Stato finale:** cubi statici, nessun movimento continuo

## Scene Setup
- Background: gradiente cielo azzurro-chiaro (stile Minecraft)
- Luce ambient + directional per ombre e volume
- Camera: Three.js `PerspectiveCamera`, angolata per vista isometrica leggera
- Ogni cubo con ombra proiettata (o shadow plane sotto)

## Flusso di Caricamento
1. Pagina HTML → Three.js scene si inizializza
2. Texture caricate (array di loader)
3. Bitmap lettere generate, posizioni calcolate
4. Cubi creati e posizionati fuori schermo
5. Animazione parte: un cubetto entra ogni ~100ms
6. Quando tutti i cubi sono a destinazione → fine animazione

## Criteri di Successo
- La scritta MINECRAFT è chiaramente leggibile a fine animazione
- Ogni cubetto ha una texture Minecraft riconoscibile
- L'animazione è fluida (60fps)
- L'ordine sparso crea un effetto visivo interessante
