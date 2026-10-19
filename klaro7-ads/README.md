# Giorno Klaro7 — inserzioni Meta

Due creatività per la promo "Giorno Klaro7", realizzate con Remotion e con lo stile della piattaforma (indaco, glow ciano, CTA arancio, card chiare con bordo arancio).

| File | Formato | Uso |
|---|---|---|
| `export/giorno-klaro7-reel.mp4` | 1080×1920, 10 s, 30 fps, H.264 | Reels / Storie Facebook e Instagram |
| `export/giorno-klaro7-post.png` | 1080×1350 (4:5) | Feed Instagram / Facebook |
| `export/giorno-klaro7-reel-v2.mp4` | 1080×1920, 10 s, 30 fps, H.264 | Versione 2 — Reels / Storie |
| `export/giorno-klaro7-post-v2.png` | 1080×1350 (4:5) | Versione 2 — Feed |
| `export/giorno-klaro7-reel-v3.mp4` | 1080×1920, 10 s, 30 fps, H.264 | **Versione 3 (consigliata)** — Reels / Storie |
| `export/giorno-klaro7-post-v3.png` | 1080×1350 (4:5) | **Versione 3 (consigliata)** — Feed |

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

## Versione 2 — blocchi di colore, massima leggibilità
Stessi colori e font del brand, ma senza l'impostazione dell'hero della piattaforma: fondi pieni (indaco, menta, arancio), una sola idea per schermata, testi molto grandi e scuri su chiaro o bianchi su scuro. Codice in `src/v2/`.

| Tempo | Scena | Fondo |
|---|---|---|
| 0–2 s | Un calendario a palette scatta 3→4→5→6→**7**: "Segna questa data." | Indaco |
| 2–3,8 s | "Ogni 7 del mese è il Giorno Klaro7" | Menta |
| 3,8–6 s | "Hai ricaricato oltre 100€ il mese scorso? **7 minuti in regalo**, il 7 di ogni mese" | Arancio |
| 6–7,9 s | "Prima volta su Klaro7? **7 minuti GRATIS** alla tua prima consulenza" | Menta |
| 7,9–10 s | Logo, "Il tuo 7 ti aspetta.", CTA "Scopri i consulenti →", note legali | Indaco |

Il calendario fa da gancio: il movimento che si ferma sul 7 attira l'occhio nel primo secondo e fissa la data in mente. Ogni offerta ha un colore suo, così chi guarda capisce subito che sono due vantaggi distinti.

## Versione 3 — il logo come linguaggio visivo (consigliata)
Le forme del logo Klaro7 (mezzo disco ciano, mandorla arancio con pupilla ciano) diventano gli elementi grafici di tutta l'inserzione. Codice in `src/v3/`.

- **Fondo**: indaco profondo con una luce ciano e una arancio che respirano, particelle luminose e una grana leggera, per dare profondità senza togliere leggibilità.
- **Transizione di marca**: il mezzo disco ciano, con il bordo arancio, attraversa lo schermo tra una scena e l'altra (circa mezzo secondo).
- **Offerte**: card in vetro satinato con barra colorata (arancio per il cashback, ciano per i nuovi iscritti) e "7" in arancio sfumato.

| Tempo | Scena |
|---|---|
| 0–2,2 s | Il simbolo del logo si compone attorno a un grande 7: "Segna la data · Ogni mese c'è un giorno tutto per te." |
| 2,2–4,2 s | Logo Klaro7 + "Il 7 di ogni mese è il Giorno Klaro7 — Il nostro modo di dirti grazie." |
| 4,2–6,3 s | Card cashback: "Hai ricaricato oltre 100€ il mese scorso? 7 minuti in regalo." |
| 6,3–8,3 s | Card nuovi iscritti: "Prima volta su Klaro7? 7 minuti gratis." |
| 8,3–10 s | Logo, "Il tuo 7 ti aspetta.", CTA "Scopri i consulenti →", note legali |

### Logo
`src/components/Logo.tsx` è una ricostruzione vettoriale del logo, ricavata dal marchio visibile sulla piattaforma (lo usano tutte le versioni). Per usare il file ufficiale, mettilo in `public/` (es. `public/logo.svg`) e sostituisci l'SVG del componente con `<Img src={staticFile('logo.svg')} />`.

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
npm run render        # esporta tutte le versioni in out/ (singole: render:video-v2, render:post-v2, …)
```
Se Remotion non riesce a scaricare Chrome, aggiungi `--browser-executable=<percorso di chrome headless>`.
Testi e note legali: `src/brand.ts` (`copy`) e i componenti in `src/Video.tsx` / `src/Post.tsx`.
