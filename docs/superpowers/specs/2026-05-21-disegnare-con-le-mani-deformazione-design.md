# DISEGNARE CON LE MANI — Deformazione a griglia

**Data:** 2026-05-21  
**Stato:** Bozza

## Obiettivo

Permettere all'utente di animare/deformare qualsiasi disegno creato con l'hand tracking, usando le mani come "pinze" su una griglia di controllo.

## Flusso

1. L'utente disegna liberamente sul canvas in modalità normale (già esistente)
2. Preme il pulsante **"🎭 Anima"** nella toolbar
3. Il sistema congela il contenuto del drawing canvas come texture offscreen
4. Viene sovrapposta una **griglia di controllo 6×6** sopra il canvas
5. I nodi della griglia appaiono come punti trascinabili (cerchi bianchi con bordo nero)
6. L'utente fa pinch su un nodo → il nodo viene "afferrato"
7. Muovendo la mano, il nodo segue la posizione del pinch
8. Il resto della griglia si deforma con un **decadimento radiale** (più lontano dal nodo mosso, meno deformazione)
9. I tratti originali vengono renderizzati trasformati attraverso la griglia deformata
10. L'utente può afferrare più nodi (anche con mani diverse) e muoverli simultaneamente
11. Premendo "🎭 Anima" di nuovo si esce dalla modalità
12. La deformazione viene **applicata permanentemente** al canvas dei tratti
13. L'utente può tornare a disegnare sopra il risultato deformato

## Architettura tecnica

### Grid Deformation Engine

- Griglia: array 2D di `(row×col)` punti di controllo
- Ogni cella della griglia definisce un quadrilatero sulla texture sorgente
- Il rendering usa `ctx.setTransform()` o triangolazione per mappare ogni cella dalla texture originale allo schermo deformato
- **Decadimento radiale:** spostare un nodo influenza i nodi vicini con peso = `1 / (distance² + ε)`, raggio configurabile (default: 3 nodi)
- **Triangolazione:** ogni cella della griglia viene divisa in 2 triangoli; `ctx.setTransform()` con i 3 vertici di ogni triangolo permette il mapping texture→schermo (canvas 2D nativo non supporta quadrilateri arbitrari)

### Stati del canvas

| Stato | Descrizione |
|---|---|
| **Disegno** | Modalità normale: drawing sul canvas (già implementata) |
| **Anima** | Congela il draw canvas, attiva griglia, hand tracking controlla i nodi. Altre modalità (matita, gomma, riempimento, forme) sono disabilitate |
| **Uscita** | Applica deformazione permanentemente (renderizza la griglia deformata su drawCanvas tramite triangolazione), pulisce overlay, riattiva le modalità di disegno |

### Hand tracking

- Riusa la logica `pinch` esistente (soglia 35px tra pollice e indice)
- In modalità Anima: invece di disegnare, cerca il nodo della griglia più vicino al pinch e lo aggancia
- Distanza massima per agganciare un nodo: 50px (configurabile)
- Se nessun nodo è entro tale distanza, il pinch non aggancia nulla
- Rilasciando il pinch, il nodo resta dove posizionato (non torna indietro)

### UI nella toolbar

- Bottone **"🎭 Anima"** — toggle on/off; quando attivo, la modalità di disegno corrente viene salvata e ripristinata all'uscita
- Bottone **"🔄 Reset griglia"** — riporta tutti i nodi alla posizione originale (visibile solo in modalità Anima)
- Indicatore di stato: mostra "Anima: attiva" / "Anima: disattiva", sovrascrive l'indicatore della modalità di disegno corrente

## Dettagli implementativi

- La griglia si basa sulle dimensioni del video (e quindi del canvas), ridimensionata proporzionalmente
- `drawCanvas` viene copiato in un `offscreenCanvas` all'attivazione di Anima
- Il rendering della deformazione avviene su `overlay` durante la modalità Anima, disegnando cella per cella
- Quando si esce dalla modalità, il contenuto deformato viene renderizzato su `drawCanvas` tramite triangolazione cella per cella, sovrascrivendo i tratti originali con quelli deformati
- La griglia si nasconde quando non si è in modalità Anima

## Vincoli

- Funziona con qualsiasi disegno, non solo stickman
- La deformazione è permanente fino al prossimo "Reset griglia" o "Cancella tutto"
- Performance: target 30+ fps in modalità Anima su hardware medio
- **Nessuna libreria esterna aggiuntiva** — tutto implementato in plain JS su canvas 2D

## Non in scope (per ora)

- Animazione temporale (keyframe, play/pause)
- Scheletro automatico (bones, IK)
- Export animato (GIF/video)
- Multi-utente
