# Sito Portfolio — Design Doc

## Overview
Homepage portfolio personale a tema scuro con accenti rossi, font Jersey, ispirata a Supercell.com. Contiene esercizi di design digitale del workshop Design 2.

## Architecture
- **Tecnologia**: Singolo file HTML (`codebase/index.html`) con CSS + JS inline
- **Font**: Google Fonts — Jersey 25 (titoli), Jersey 20 (sottotitoli), Jersey 15 (descrizioni), Jersey 10 (credits/footer)
- **Zero dipendenze**: nessuna libreria esterna oltre Google Fonts

## Layout
```
┌────────────────────────────────────────────┐
│ NAV: [ROBERTO FRANCIPELLI] About Esercizi Contatti │
├────────────────────────────────────────────┤
│                                              │
│           ROBERTO FRANCIPELLI                │
│        Design 2 — Workshop                   │
│    Portfolio di esercizi di design digitale  │
│                                              │
├────────────────────────────────────────────┤
│              ABOUT                           │
│    Testo descrittivo del portfolio           │
├────────────────────────────────────────────┤
│              ESERCIZI                        │
│  ┌──────────┐  ┌──────────┐                │
│  │DISEGNARE │  │TIPO-     │                │
│  │CON LE    │  │GRAFIA    │                │
│  │MANI      │  │CINETICA  │                │
│  └──────────┘  └──────────┘                │
│  ┌──────────┐  ┌──────────┐                │
│  │TEXTURE   │  │RESPON-   │                │
│  │PATTERN   │  │SIVO      │                │
│  └──────────┘  └──────────┘                │
│  ┌──────────┐                              │
│  │RICETTA   │                              │
│  │PASTA     │                              │
│  └──────────┘                              │
├────────────────────────────────────────────┤
│              CONTATTI                       │
│    Email: roberto.francipelli@...           │
├────────────────────────────────────────────┤
│  ROBERTO FRANCIPELLI                        │
│  About · Esercizi · Contatti                │
│  Jersey 10 — Credits                        │
└────────────────────────────────────────────┘
```

## Sezioni
1. **Navbar** — fissa, logo rosso a sx, link a dx
2. **Hero** — full-screen, titolo grande rosso #cc2222, sottotitolo, descrizione
3. **About** — sezione descrittiva del portfolio
4. **Esercizi** — griglia 2 colonne con 5 card
5. **Contatti** — sezione con link email
6. **Footer** — brand, link nav, credits

## Animazioni sfondo
- **Pixel particles**: 30 quadratini rossi che fluttano verso l'alto (dimensioni/speed casuali)
- **Scanlines CRT**: overlay con righe orizzontali e micro-flicker
- Sfondo fisso scuro (#0a0202)

## Colori
- Sfondo: #0a0202
- Accento rosso: #cc2222
- Testo: #fff con opacità variabili
- Card gradienti: palette differenziata per ogni esercizio

## Font usage
| Variante | Uso |
|----------|-----|
| Jersey 25 | Nav logo, hero title, section titles |
| Jersey 20 | Sottotitolo hero |
| Jersey 15 | Nav links, descrizioni, card text, about, contatti |
| Jersey 10 | Footer credits |

## Path mapping
- `codebase/index.html` → homepage
- Esercizi con back button "TORNA ALLA HOME" che punta a `codebase/index.html`
