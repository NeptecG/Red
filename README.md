# Τράγος Κόκκινος / Trágos Kokkinos

Website for **Trágos Kokkinos**, a Greek restaurant in Preveza, Epirus - traditional cuisine
with a gourmet twist. Bilingual (Greek default, English toggle), built as a plain static site
with no build step, so it deploys anywhere.

## Pages
- `index.html` - Home
- `menu.html` - Menu
- `history.html` - History
- `gallery.html` - Gallery (with lightbox)
- `directions.html` - Directions + map
- `reservations.html` - Reservation form + call to book

## Tech
- HTML + CSS + vanilla JavaScript. No framework, no build.
- Fonts: Cormorant Garamond + Spectral (Google Fonts; full Greek + Latin support).
- Language toggle (EL/EN) in the header; the choice is remembered in the browser.

## Run locally
Just open `index.html` in a browser. Or serve the folder:
```
npx serve .
```

## Deploy to Vercel (via GitHub)
1. Push this folder to a GitHub repository.
2. In Vercel: **New Project → Import** the repo.
3. Framework preset: **Other**. Build command: *none*. Output directory: `./` (root).
4. Deploy. That's it - every push to the main branch redeploys.

(Also works as-is on Netlify or GitHub Pages - it's just static files.)

## ✅ Before going live - things to replace
This site ships with **realistic placeholder content**. Update these:

1. **Reservation email** - open `reservations.html`, find the form's `action`:
   `https://formspree.io/f/YOUR_FORM_ID`. Create a free form at <https://formspree.io>,
   then paste your real endpoint. Until then, the form politely falls back to an email link.
   (Also update the address `hello@tragoskokkinos.gr` in `assets/js/main.js` and the footers.)
2. **Phone** - replace `+30 26820 00000` (search across the `.html` files).
3. **Address** - replace `Παραλία Πρέβεζας, Σαΐτη 8, 481 00` and the Google Map query
   in `directions.html` (`?q=Preveza%2C%20Greece` → your exact address).
4. **Hours** - currently `13:00 - 24:00`, Monday-Sunday.
5. **Menu** - real dishes, descriptions and prices live in `menu.html`
   (and the three signatures in `index.html`).
6. **Photos** - swap the files in `assets/img/` (keep the same filenames to avoid editing HTML).
   Current photos are licensed stock placeholders.
7. **Social links** - Instagram/Facebook URLs in the footers.
8. **Founding year / story** - `index.html` ("Από το 2012") and `history.html`.

## Editing language text
Each translatable element keeps its Greek text in the HTML and the English in a `data-en`
attribute, e.g. `<a data-en="Menu">Μενού</a>`. Edit both to change wording.
