# Trágos Kokkinos - Build Plan

Spec: `docs/spec.md`. Static multi-page site, bilingual (EL default + EN toggle), Aegean Parchment style.

## Tasks
- [x] Brainstorm + approve design direction, palette, structure
- [x] Write spec
- [x] Gather + curate photos into `assets/img`
- [x] Copy master logo to `assets/logo.png`
- [x] Shared `assets/css/styles.css` (tokens, base, components, responsive)
- [x] Shared `assets/js/main.js` (sticky nav, mobile menu, EL/EN toggle, scroll-reveal, gallery lightbox, reservation form)
- [x] `index.html` (Home: hero, welcome, signatures, atmosphere, hours band)
- [x] `menu.html` (categories: Starters/Mains/Seafood/Desserts/Wine)
- [x] `history.html` (story of name + philosophy + values)
- [x] `gallery.html` (masonry grid + lightbox)
- [x] `directions.html` (Google map, address, hours, tap-to-call)
- [x] `reservations.html` (form + call button)
- [x] favicon + meta/OG tags + accessibility pass
- [x] `.gitignore`, `README.md`, `robots.txt`, Vercel-ready, git init + initial commit
- [x] Verify all pages render (Playwright screenshots, console clean, language toggle works)

## Review

**Outcome:** All six pages built and verified in a real browser.

**Verified working:**
- All pages render with 0 console errors / 0 warnings.
- EL/EN language toggle swaps every text, `<title>`, meta and placeholders; choice persists; brand name stays Greek.
- Reservation form: bilingual inline validation (5 required fields flagged on empty submit, focus moves to first invalid), and an honest mailto fallback until a Formspree endpoint is added.
- Gallery masonry + lightbox (open, prev/next, close, keyboard).
- Live Google Map of Preveza on Directions.
- Scroll-reveal animations fire on scroll AND are gated behind `has-js` so no-JS visitors / crawlers still see all content.
- Mobile (390px) layout + hamburger menu.

**Key decisions:**
- Plain HTML/CSS/vanilla JS, no build step → trivial Vercel/Netlify/GH Pages deploy.
- Palette strictly oxblood red + beige (+ brown footer); no gold/olive, per request.
- Fonts: Cormorant Garamond + Spectral (full Greek + Latin).

**Owner must replace before launch** (see `README.md`): Formspree endpoint + email, phone,
address + map query, hours, real menu/prices, real photos (same filenames), social links, founding year.

**Notes / follow-ups (optional):** convert photos to WebP for extra performance; add a real
favicon set + `sitemap.xml` once the domain is known.
