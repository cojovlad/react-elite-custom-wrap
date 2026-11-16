# Elite Custom Wrap â€” Work log

## Foundation

- Fixed `npm install` behind the company proxy (`.npmrc` noproxy).
- Built the site from scratch: vanilla JS + Three.js + Vite, mobile-first, responsive for phone, tablet and desktop.
- Premium piano-black / bone-white design, later softened to a warmer black (`#1b1b1d`) that pairs better with bone white.
- Rebranded everything to **Elite Custom Wrap**.

## 3D wrap configurator (main attraction)

- Real, licensed 3D car models instead of drawn cars, loaded locally (Draco + Meshopt compression).
- Colour changes per part: body, hood, roof, mirrors, wheels, accents.
- Finishes: gloss, satin, matte.
- Camera presets (3/4, side, front, rear), drag to rotate, tap a panel to select it, screenshot download.
- Parts a model can't support are disabled automatically in the UI.
- Saved designs and shareable design links.
- Fixed broken geometry on several models (Tesla, wheels on Ferrari/Tesla/Camaro, Aventador paint, rotations).
- Fixed black patches on the doors of small/tall cars (mirror region can now be turned off per car).

## Car catalog

- Grew from 21 to more than 100 models, ordered luxury first, then everyday cars.
- Includes Rolls-Royce, Ferrari, Lamborghini, McLaren, Koenigsegg, Porsche, Mercedes-Benz, BMW, Audi, Tesla, Toyota, VW, Dacia, Renault, Peugeot, Ford, Opel, Hyundai, Kia, Fiat and more.
- Brand tabs scroll sideways with snapping on mobile.
- Every model has a `license` field; `public/models/attributions.json` records author, source and licence.
- Game-ripped / non-redistributable models were rejected.

## The garage (3D scene)

- Recreated the real Elite garage from the client photo: dark room, glowing white hexagonal LED ceiling, LED baseboard, ventilated checker floor tiles and the ELITE roll-up banner.
- Removed the small window from the back wall on request.

## Languages

- Six languages: English, Romanian, German, Spanish, Italian, Hungarian.
- Auto-detects the browser language, falls back to English, remembers the choice.
- Seamless globe language switch in the header (no ugly dropdown arrow).
- Layout stays perfectly still when switching language (text boxes reserve space for the longest translation), checked on phone, tablet and desktop sizes.

## Contact and requests

- WhatsApp business number +40 773 239 125.
- Desktop: static WhatsApp link in the page. Phone: floating WhatsApp button that can be closed and comes back on refresh.
- Request form sends a prefilled WhatsApp message with the name, contact, vehicle, services, finish, every part colour, notes and the design link.
- "Did you find your car on the site?" question: if not, the customer types their real car and the message uses it (site model is only mentioned as the preview).
- Email sending via FormSubmit is ready but switched off until the business email is added in `src/config.js`.
- Downloadable request brief.

## Content

- Services section: wrap, PPF (also coloured PPF), chrome delete, detailing.
- Footer credit "Made by New Folder Solutions" with a click overlay inviting people who want a website to get in touch (link to newfoldersolutions.com).
- `PRESENTATION.md` with the feature list, strengths and growth ideas.

## SEO

- Page title and description, translated per language, with `<html lang>` updated on language change.
- Keywords (English + Romanian), robots meta and `public/robots.txt`.
- Open Graph and Twitter card tags for nice link previews.
- Structured data (schema.org `AutoBodyShop`) with phone and services.

## Client film catalogue and realistic materials

- `Elite_Custom_Wrap_Master_Color_Database.csv` (560 films: Avery Dennison, 3M, ORAFOL/ORACAL, Skyfol, Carlass) is turned into `src/films.js` by `node scripts\generate-films.mjs`. Rerun this after editing the CSV.
- 16 realistic materials (`src/materials.js`) rendered by a custom shader: gloss, metallic flakes, pearl, satin, matte, colour flip, diamond sparkle, liquid metal, brushed metal, carbon weave, textured.
- Section 02, "Play with any colour": 19 free colours plus a colour picker, with any finish.
- Section 03, "Our studio films" (collapsible): filter by manufacturer, search by name or code, filter by finish. Choosing a film only offers the finishes the studio stocks for that exact colour.
- Only ORACAL 970RA has official RGB values; the other colours are estimated from their names and are labelled as approximate.

## SEO optimisation (round 2)

- Keyword-rich but premium title and description in all 6 languages (e.g. RO: "Colantare auto premium, folie PPF și chrome delete"); hero eyebrow now reads "PREMIUM CAR WRAPPING & PPF".
- Language URLs: `?lang=ro`, `?lang=de`, ... open the site directly in that language, so each language can be indexed separately (hreflang + self canonical).
- Structured data: `AutoBodyShop` (services catalogue, phone, map, languages), `WebSite`, and an automatic `FAQPage` built from the visible FAQ at build time (`vite.config.js`).
- Share image `public/og-image.jpg` (1200×630, real render from the configurator) for WhatsApp/Facebook/Instagram/Google previews; large Twitter card.
- App icons (`apple-touch-icon.png`, `icon-512.png`) and `site.webmanifest`.
- Speed (Core Web Vitals): Three.js and the 3D scene load as a separate chunk; the main script went from 920 KB to 230 KB, so text and controls appear first.
- When the domain is known, build with `SITE_URL`, for example create `.env.local` with `SITE_URL=https://www.your-domain.ro` and run `npm run build`. This adds canonical, `og:url`, hreflang links, absolute image URLs, `sitemap.xml` and the `Sitemap:` line in `robots.txt`.
- After publishing: add the site to Google Search Console and submit `sitemap.xml`; link the website from the Google Business Profile and Instagram bio.
## Security and speed (no visible changes)

- 3D models compressed losslessly (meshopt without quantisation, PNG textures to lossless WebP): 754 MB → 605 MB in total, for example Rolls-Royce Ghost 35.5 → 16.3 MB and the default BMW M4 22.7 → 14.3 MB. Renders were compared pixel by pixel against the originals (no difference). Originals are backed up outside the project.
- CSS now goes through Vite (minified, cache-busted file name); the main font is preloaded.
- Content Security Policy on the built site (only own scripts, WebAssembly for the 3D decoders, FormSubmit as the only external connection).
- `public/_headers` (Netlify / Cloudflare Pages): HSTS, nosniff, no framing, referrer and permissions policy, long caching for assets, fonts and models.
- Search fields have a length limit; all external links use `noopener noreferrer`; `npm audit`: 0 vulnerabilities.
- Loading skeleton: an inline-styled placeholder (header, brand tabs, studio and colour panel) appears instantly and fades out once the page is translated and the font is ready, so English text no longer flashes before the chosen language. It falls back to fading out on its own after 12 s and is hidden when JavaScript is disabled.

## Code quality refactor (no visible changes)

- `src/main.js` split from ~1,450 lines into modules: `design.js` (design model, share links), `film-catalog.js` (colour order, filters), `request.js` (form validation, WhatsApp message, email), `navigation.js`, `whatsapp-float.js`, `toast.js`, `dom.js`. `main.js` now only wires them together.
- Translations moved to `src/locales/<lang>.json`, each a separate cached file. All languages are still fetched in parallel at start-up (preloaded in the HTML) because the layout reserves room for the longest text of every language, so switching language never moves the page.
- Service worker (`dist/sw.js`, production/HTTPS only): already seen 3D models (last 12), decoders, fonts and scripts load from the device cache on the next visit. Each file is keyed by a content hash, so an updated model is always fetched fresh. HTML is never cached.
- Tests: 21 Vitest unit tests (`tests/unit`) and 6 Playwright end-to-end scenarios on desktop and mobile (`tests/e2e`).
- ESLint + Prettier. `npm run check` runs lint, format check, unit tests, build and e2e tests; `.github/workflows/check.yml` runs the same on GitHub for every push / pull request.
- Fixed: FAQ structured data questions had a stray " +" at the end.
- Verified identical behaviour with a before/after snapshot of the built site (all 6 languages, desktop and mobile, configurator, film catalogue, form and WhatsApp message, share link): 0 differences.

## Still to do

- Add the business email in `src/config.js` and confirm the FormSubmit activation email.
- Add the real domain (canonical URL, sitemap, Open Graph image) and the business address/Instagram to the structured data.
- Buy/confirm licences for the NC/SA models listed in `attributions.json`.
- More Romanian-popular models (Skoda, more Dacia, VW SUVs, Opel Astra, Toyota RAV4).
- Review the changes, then commit and push (nothing committed yet).
