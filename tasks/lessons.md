# Lessons

## Never use em dashes or en dashes (hard rule)
**Correction (2026-06-07):** The user asked twice to remove em dashes and to never use them
again under any circumstances.

- Use a hyphen `-` (or rephrase, or a comma) instead of `—` (em dash) or `–` (en dash),
  including in hour ranges like `13:00 - 24:00` and `Monday - Sunday`.
- This applies to EVERYTHING I produce: page copy, `data-en` strings, titles, meta tags,
  alt text, commit messages, and chat replies.
- Before delivering any text/content, scan for `[‒–—―]` and replace with `-`.
  Quick check: `grep -rn '[‒–—―]' .`
