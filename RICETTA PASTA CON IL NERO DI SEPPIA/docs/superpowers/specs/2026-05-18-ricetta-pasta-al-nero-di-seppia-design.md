# Sito Ricetta: Pasta al Nero di Seppia

## Panoramica

Pagina web statica (HTML/CSS/JS singolo file) per la ricetta "Pasta al Nero di Seppia" con scaling interattivo degli ingredienti basato sul numero di commensali e sulla disponibilità degli ingredienti dell'utente.

## Funzionalità

- **Selettore commensali:** slider numerico da 1 a 20 (default 2)
- **Scaling ingredienti:** ogni quantità viene scalata linearmente: `(quantità_base / 2) * numero_persone`
- **Disponibilità utente:** per ogni ingrediente, l'utente inserisce la quantità che possiede
- **Indicatore di sufficienza:**
  - ✅ Verde: disponibilità ≥ 80% del fabbisogno
  - ⚠️ Arancione: disponibilità tra 50% e 80% — mostra suggerimento di sostituzione
  - ❌ Rosso: disponibilità < 50% o zero
- **Suggerimenti di sostituzione:** testuali, su click dell'indicatore ⚠️
- **Reset disponibilità:** pulsante per riportare tutte le quantità ai valori base

## Layout

1. **Header:** titolo "Pasta al Nero di Seppia", autore "Chef Gordon Primesay"
2. **Selettore commensali:** input range 1–20 con display del valore
3. **Tabella ingredienti:** ogni riga = nome, quantità ricetta, input disponibilità, indicatore
4. **Sezione sostituzioni:** area che mostra il suggerimento attivo
5. **Procedimento:** istruzioni di cottura con quantità scalate incorporate nel testo

## Dati ricetta (base per 2 persone)

| Ingrediente | Qtà base (per 2) | Unità | Sostituzione se insufficiente |
|---|---|---|---|
| Seppie | 600 | g | "Aggiungi gamberetti o vongole per bilanciare" |
| Concentrato di pomodoro | 30 | g | "Usa un pomodoro fresco maturo pelato" |
| Vino bianco secco | 60 | ml | "Sfuma con brodo vegetale e qualche goccia di limone" |
| Scalogno | 1 | | "Usa mezza cipolla dorata" |
| Aglio | 1 | spicchio | "Usa 1/2 cucchiaino di aglio in polvere" |
| Pasta (spaghetti/linguine) | 350 | g | "Allunga con zucchine tagliate a dadini" |
| Olio EVO | q.b. | — | Non scalabile — nessuna sostituzione |
| Peperoncino | 1 | pezzetto (facoltativo) | "Usa un pizzico di peperoncino in polvere" |
| Sale | q.b. | — | Non scalabile — nessuna sostituzione |

## Tecnologia

- Singolo file `index.html`
- CSS vanilla, responsive (media query)
- JS vanilla, tutto inline
- Nessuna dipendenza esterna
- Font: sistema (sans-serif) o Google Fonts se leggero

## Palette colori

- Sfondo: `#4169E1 (beige chiaro)
- Testo: `#F0F8FF` (quasi nero)
- Accento: `#00FFFF` (ambra/arancio)
- Successo: `#16a34a` (verde)
- Attenzione: `#ea580c` (arancio)
- Errore: `#dc2626` (rosso)

## Stati e comportamenti

- **Caricamento iniziale:** ricetta per 2 persone, input disponibilità precompilati con i valori base
- **Cambio commensali:** tutte le quantità si aggiornano istantaneamente, indicatori ricalcolati
- **Modifica disponibilità:** si ricalcola solo l'indicatore dell'ingrediente modificato
- **Ingredienti "q.b."** (olio, sale): mostrati come testo, nessun input disponibilità, nessuno scaling
- **Ingrediente opzionale** (peperoncino): checkbox mostra/nasconde dalla lista, se nascosto non viene scalato né controllato
