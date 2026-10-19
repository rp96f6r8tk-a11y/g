# Giorno Klaro7 — inserzioni Meta

Due creatività per la promo "Giorno Klaro7", realizzate con Remotion e con lo stile della piattaforma (indaco, glow ciano, CTA arancio, card chiare con bordo arancio).

| File | Formato | Uso |
|---|---|---|
| `export/giorno-klaro7-reel.mp4` | 1080×1920, 10 s, 30 fps, H.264 | Reels / Storie Facebook e Instagram |
| `export/giorno-klaro7-post.png` | 1080×1350 (4:5) | Feed Instagram / Facebook |

Testi a schermo in **Cormorant Garamond** (font locali in `public/fonts`, cifre allineate). Il video non usa voce: tutti i messaggi sono già a schermo, perché su Meta la maggior parte dei video viene vista senza audio. Nel video testi e CTA stanno nella safe zone dei Reels (né nel 14% in alto né nel 35% in basso).

## Offerta comunicata
- **Cashback Giorno Klaro7**: ogni 7 del mese, 7 minuti in regalo a chi ha ricaricato oltre 100€ nel mese precedente.
- **Promo nuovi iscritti**: 7 minuti gratis alla prima consulenza.

## Struttura del video (10 s)
| Tempo | Scena | Leva psicologica |
|---|---|---|
| 0–2,4 s | "Ogni mese c'è un giorno… che aspetta solo te." + il 7 che si accende | Curiosità / loop aperto (Zeigarnik), personalizzazione |
| 2,4–4,6 s | "Il 7 di ogni mese è il Giorno Klaro7 — Il nostro modo di dirti grazie." | Rituale ricorrente (attesa del giorno fisso), reciprocità |
| 4,6–7,6 s | Le due offerte si girano come carte dei tarocchi | Effetto "gratis" (zero-price), riconoscimento per chi è fedele |
| 7,6–10 s | Tagline del brand, logo, CTA "Scopri i consulenti →", note legali | Una sola CTA (legge di Hick), fiducia (professionisti verificati) |

Il numero 7 si ripete volutamente (giorno 7, 7 minuti, Klaro7): un unico simbolo facile da ricordare, che si lega al nome del brand.

## Copy consigliato per Ads Manager
**Testo principale**
> Il 7 non è un giorno qualsiasi. ✨
> Ogni 7 del mese, se nel mese precedente hai ricaricato oltre 100€, ti regaliamo 7 minuti di consulenza. È il nostro modo di dirti grazie.
> Sei nuovo su Klaro7? Per te 7 minuti gratis alla prima consulenza con i nostri professionisti verificati.

**Titolo**: Il 7 di ogni mese è il Giorno Klaro7
**Descrizione**: 7 minuti in regalo per te
**Pulsante**: Scopri di più

## Rigenerare / modificare
```bash
npm install
npm run studio        # anteprima interattiva
npm run render        # esporta video e post in out/
```
Se Remotion non riesce a scaricare Chrome, aggiungi `--browser-executable=<percorso di chrome headless>`.
Testi e note legali: `src/brand.ts` (`copy`) e i componenti in `src/Video.tsx` / `src/Post.tsx`.
Il logo in `src/components/Logo.tsx` è una ricostruzione del wordmark: si può sostituire con il file ufficiale (SVG/PNG in `public/`).
