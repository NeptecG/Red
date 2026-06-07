# Trágos Kokkinos — Website Design Spec

**Date:** 2026-06-07
**Project:** Marketing website for *Τράγος Κόκκινος / Trágos Kokkinos*, a Greek restaurant in Preveza, Epirus.
**Concept:** Traditional Greek cuisine with a gourmet twist. Tone: warm, timeless, refined-but-welcoming. Theme nods to the logo's Dionysian satyr ("red goat").

---

## 1. Goals
- A beautiful, fast, easy-to-maintain site that feels "awesome yet simple".
- Bilingual: **Greek (default)** with an instant **EL · EN** toggle.
- Let guests see the menu, feel the place, find it, and book a table.

## 2. Decisions (locked)
| Area | Decision |
|------|----------|
| Structure | **Multi-page** static site |
| Pages | Home + **Menu · History · Gallery · Directions · Reservations** (nav order as listed; logo → Home) |
| Language | Greek default + EL·EN toggle, choice remembered (localStorage) |
| Stack | Plain **HTML + CSS + vanilla JS**, no build step (hosts free on Netlify/Vercel/GitHub Pages) |
| Style | "Aegean Parchment" — warm, airy, elegant |
| Content | Realistic **placeholder** menu/copy/hours + curated stock photos, all editable later |
| Reservations | Reservation **form** (emails owner via Formspree, placeholder endpoint) **+** tap-to-call **+** map |

## 3. Visual system
**Colors (CSS tokens):**
- `--ox` Oxblood Red `#7E241B` — headings, buttons, accents, links
- `--ox-deep` Deep Red `#5E1A14` — hovers, dark bands
- `--beige` `#EFE9DC` — main background
- `--paper` `#FBF8F1` — cards, surfaces
- `--brown` `#221E18` — **footer only**
- `--ink` `#2A201C` — body text (warm espresso)
- `--line` `#E0D7C5` — hairline borders

Removed: gold, ochre, olive. No brown/tan tiles or letters outside the footer.

**Typography (Google Fonts, full Greek + Latin support):**
- Headings/display: **Cormorant Garamond** (600/700)
- Body/UI: **Spectral** (300/400/500/600)
- `font-display: swap`, preconnect to fonts.gstatic.com.

**Components & polish:**
- Inline SVG icons (Lucide-style), no emoji as icons.
- Sticky translucent header that turns solid on scroll; active-page underline.
- Buttons: oxblood pill (solid) + oxblood outline (ghost); clear hover/focus states.
- Gentle scroll-reveal (fade/slide ≤300ms), disabled under `prefers-reduced-motion`.
- Mobile-first; hamburger menu on small screens; sticky "Κράτηση/Reserve" button on phones.
- Contrast meets WCAG AA; visible focus rings; alt text on images.

## 4. Pages & content

**Home** — full-screen hero (logo, name, tagline *"Παραδοσιακή γεύση, γκουρμέ ψυχή"* / "Traditional flavour, gourmet soul", Preveza, Reserve + View Menu buttons over an ambiance photo); short welcome; 3 signature dishes; hours/location strip; CTA to Reservations.

**Menu (Μενού)** — category sections/tabs: Ορεκτικά (Starters), Κυρίως (Mains), Θαλασσινά (Seafood), Γλυκά (Desserts), Κρασιά & Ποτά (Wine & Drinks). Dish rows: name + short description + price with dotted leaders. Placeholder items (editable), e.g.:
- *Κόκκινος Τράγος* (signature) — slow-braised goat, red wine, hilopites — 19€
- *Γαρίδες Αμβρακικού* — Amvrakikos prawns, ouzo, feta — 16€
- *Ντάκος Κρήτης*, *Χταπόδι στη σχάρα*, *Μπακλαβάς γκουρμέ*, etc.

**History (Ιστορία)** — narrative page: Epirus roots, philosophy (tradition + gourmet refinement), the satyr/Dionysus story behind the name, a couple of photos.

**Gallery** — responsive masonry/grid of atmosphere + food photos with lightbox; lazy-loaded.

**Directions (Πρόσβαση)** — embedded Google Map of Preveza, address, parking note, opening hours, tap-to-call phone, "open in Google/Apple Maps" link.

**Reservations (Κρατήσεις)** — reservation request form (name, phone, email, date, time, party size, notes) → emails owner (Formspree placeholder endpoint, with inline validation + success/error states), big "Call to reserve" button, hours reminder.

## 5. Bilingual mechanism
- Every translatable element carries `data-el` / `data-en`; a tiny JS swaps `textContent`/attributes on toggle and sets `<html lang>`.
- Default Greek; persisted in `localStorage`; toggle in header.

## 6. File structure
```
Kokkinos/
  index.html  menu.html  history.html  gallery.html  directions.html  reservations.html
  assets/
    logo.png                     (master satyr logo)
    css/styles.css               (tokens + components, shared)
    js/main.js                   (nav, language toggle, scroll-reveal, form, gallery)
    img/                         (downloaded stock photos: hero, dishes, ambiance)
  docs/spec.md
```

## 7. Accessibility & performance
- Semantic landmarks, sequential headings, labelled form fields, `aria-live` for form feedback.
- WebP images with width/height set (no layout shift), `loading="lazy"` below the fold.
- One shared CSS/JS file; minimal JS; no framework.

## 8. Out of scope (YAGNI for now)
- Online ordering / payments, CMS/admin, blog, real database, accounts.
- Real menu prices/photos and final address/phone (owner supplies later; placeholders meanwhile).

## 9. Owner to provide later
Real photos, final menu + prices, exact address, phone, opening hours, social links, and a Formspree endpoint (or preferred email service) to receive reservation emails.
