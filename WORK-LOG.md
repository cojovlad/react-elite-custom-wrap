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
- Business email `elite.custom_cluj@yahoo.com` (`src/config.js`): each request is also sent there through FormSubmit, it is shown in the contact section and in the structured data.
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
- Share image `public/og-image.jpg` (1200×630, real render from the configurator) for WhatsApp/Facebook/Google previews; large Twitter card.
- App icons (`apple-touch-icon.png`, `icon-512.png`) and `site.webmanifest`.
- Speed (Core Web Vitals): Three.js and the 3D scene load as a separate chunk; the main script went from 920 KB to 230 KB, so text and controls appear first.
- When the domain is known, build with `SITE_URL`, for example create `.env.local` with `SITE_URL=https://www.your-domain.ro` and run `npm run build`. This adds canonical, `og:url`, hreflang links, absolute image URLs, `sitemap.xml` and the `Sitemap:` line in `robots.txt`.
- After publishing: add the site to Google Search Console and submit `sitemap.xml`; link the website from the Google Business Profile.
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

## Signature palettes that suggest finishes

- Section "Signature palettes" now rotates by itself every 8 s through 8 finish directions: Signature, Gloss, Matte, Satin, Metallic, Pearl & flip, Metal & carbon, Coloured PPF. Each shows 3 palettes made only from the studio's real films (`src/palettes.js`), with matching card art and colour dots.
- Rotation pauses on hover/focus or when the section is off screen, stops after a chip is clicked and is off with reduced motion. Clicking a card loads the palette in the configurator.
- "Front PPF" added as its own card (03) in the services section (5 cards now), to the request form services, the WhatsApp/email message and the structured data.
- Missing "Pearl" finish translation added. Tests: 25 unit, 7 e2e scenarios.

## Price list and estimates

- Prices come from the client's grid `Elite_Custom_Wrap_Grila_Preturi_Finala_v2.csv`. After editing the CSV, run `node scripts/generate-pricing.mjs` to regenerate `src/price-list.js`.
- Prices are final (the client is not a VAT payer), so the site says "final prices" and never mentions VAT.
- New "Prices" section (in the menu) with 4 vehicle sizes: Compact, Saloon / Estate, SUV, Large SUV / Luxury. It covers every car, including those not in the configurator.
  - Each size has a side silhouette and example models.
  - The silhouettes (`src/price-silhouettes.js`) are traced from the site's own CC BY 4.0 3D models (Renault Clio, BMW i4, Porsche Macan, BMW X5 M) at one real-world scale, so the sizes compare truthfully.
  - It shows rows for colour change, clear PPF, coloured PPF and front PPF, with the price of every film line and a "from" price.
  - It follows the configurator car's size until the visitor picks a size, and highlights the line of the chosen film.
- Special films are priced on the Special / ColorFlow / Color Flip lines. These are colour flip, satin flip, diamond, liquid metal / chrome, brushed, carbon and every textured film.
- The configurator shows a "Full wrap estimate": the exact price for a studio film, or a range for a free colour.
- The request form now has:
  - a vehicle-size choice, preselected from the configurator car;
  - a live estimate built from the chosen services. When more than one service is chosen, it lists every service with its price, "included in the full / coloured PPF" (front PPF is not added on top of full PPF, and coloured PPF covers both), or "on request". The total covers only the priced services. Chrome delete and Bespoke details stay outside the total with an explanation: they depend on the trim and the details, so they are quoted once the studio sees the car.
- When the colour change wrap is chosen, the estimate shows what it is priced from: a swatch with the body film and finish from the design, and a short note explaining that changing the film in the configurator changes the price (or, for a free colour, that standard or special film prices are shown until it is matched to a real film).
- With "No, my car is different", the summary at the top of the form shows the car the visitor types (updated on Enter or when leaving the field) instead of the configurator car.
- Size, estimate and the per-service breakdown are included in the WhatsApp message, the email and the downloaded brief, with "final offer after inspection".
- SEO: a price range for each offer in the structured data, plus a new FAQ item, "How much does a car wrap cost?". These numbers are written by hand in `index.html`; a unit test fails if they no longer match the CSV.
- Tests: 35 unit, 10 e2e scenarios.

## Local SEO for Cluj

- Title and description in every language now target the city: "Colantare auto și folie PPF în Cluj-Napoca | Elite Custom Wrap" (Hungarian uses Kolozsvár). Social preview texts and keywords mention Cluj too.
- Visible mentions that fit the design: the hero line "COLANTARE AUTO PREMIUM & PPF · CLUJ-NAPOCA", "Găsește atelierul din Cluj-Napoca pe Google Maps", a footer line "Atelier de colantare auto și folie PPF în Cluj-Napoca, România" and a new FAQ item "Unde este atelierul?" (also published as FAQ rich results).
- Structured data: city-level address (Cluj-Napoca, Cluj, RO), service area Cluj-Napoca and Romania, `sameAs` link to the Google business profile, and `geo.region` / `geo.placename` meta tags.

## Our work and Google reviews

- New section "03 / Our work" (after services, also in the menu): 8 real studio photos with car and finish captions in every language and descriptive alt text for SEO (e.g. "BMW M4 negru lucios sub luminile hexagonale ale studioului Elite Custom Wrap din Cluj-Napoca").
  - Number plates are pixelated and blurred. The original photos are kept in `photos/originals/` (not uploaded to Git).
  - Each photo is served as WebP in 3 sizes (`public/work/`), so the gallery grid downloads about 40–90 KB per photo; the viewer loads the larger size.
  - Clicking a photo opens a full-screen viewer: arrows, keyboard, swipe on phones, photo counter.
- New section "In their words" before the contact section: a floating carousel of Google reviews (avatar, name, date, stars, text; each card opens the review on Google). It glides slowly by itself, pauses on hover, touch or focus and when off screen, can be dragged or stepped with the arrows, and stays still with reduced motion. Buttons "Read our reviews on Google" and "Leave a Google review" are always shown.
- No fixed "rated 5.0 from N reviews" line, since it could not stay live; the section links to Google instead.
- Reviews come from `src/reviews.json`. It starts with the 7 real Google reviews that have text (copied by hand, with each reviewer's Google photo in `public/reviews/`). Dates are shown like on Google ("acum 2 săptămâni"). Cards without their own Google link open the studio's Google reviews. With no reviews, only the two Google buttons are shown.
  - To fill it automatically: create a Google Cloud key with "Places API (New)" enabled (it fits in the free tier), then either run `GOOGLE_PLACES_API_KEY=... npm run reviews` locally or add it as the GitHub repository secret `GOOGLE_PLACES_API_KEY`. `.github/workflows/reviews.yml` then refreshes the reviews every Monday (or on demand) and commits the file, and every `npm run build` refreshes it too when the key is set.
  - Google returns at most 5 reviews per request; the script keeps earlier ones, so the list grows over time. Reviews can also be added by hand to `src/reviews.json` (`author`, `rating`, `text`, `time` as the approximate day, optional `photo` such as `/reviews/name.png`). When Google returns a review by the same name, it replaces the hand-added copy (exact date and link), so nothing is shown twice.
- All Instagram references removed.
- Tests: 41 unit, 12 e2e scenarios.

## Less clutter

- Removed the "A considered process" section (its three steps repeated what the studio, price list and contact already say).
- Phones: the services are a swipe carousel of cards instead of five stacked blocks; the brand names sit on one sliding row; each price row shows only the film picked in the studio, with "All films and prices" to unfold the full list.
- WhatsApp appears once per screen: the floating button steps aside at the contact section (which has its own WhatsApp button). The footer shows the phone number and the email side by side, and the duplicate "Leave a Google review" link left the contact section (it stays next to the reviews).
- Phone page about 20% shorter (≈12,100 px → ≈9,700 px).
- Phones: a vertical swipe over the 3D car now scrolls the page and a sideways drag turns the car. Before, the car caught every swipe, so it was hard to scroll past it.
- Computers: the mouse wheel over the 3D car scrolls the page; Ctrl + wheel (or a trackpad pinch) zooms the car.
- Phones: service cards and the gap under section titles are more compact.
- Footer email sits next to the phone number.

## Ready for launch

- Privacy policy page (`/privacy.html`, Romanian and English; opens in English for visitors not using Romanian): what the form collects, why (GDPR art. 6(1)(b) and (c)), who receives it (FormSubmit, the mailbox provider, WhatsApp if chosen, the host), retention, what stays in the browser (language, last design, 3D model cache, Google review photos) and the visitor's rights (ANSPDCP). Linked from the footer and under the request form. Listed in the sitemap.
- Footer: link to ANPC – SAL (alternative resolution of consumer disputes) and a line for the legal company details (Law 365/2002) that appears once `COMPANY` in `src/config.js` is filled in. The same details then appear in the privacy policy.
- `.env.example` documents `SITE_URL`; `.env` is no longer committed.
- Tests: 43 unit, 14 e2e scenarios.

## Still to do

- Fill in `COMPANY` in `src/config.js` (legal name, Trade Register no., CUI, registered office) exactly as on the ONRC certificate.
- Once the site is live, send one test request from it: FormSubmit then emails `elite.custom_cluj@yahoo.com` an activation link; click "Activate Form", otherwise emails are not delivered (WhatsApp works regardless).
- Add the real domain: copy `.env.example` to `.env` (or set it on the host) with `SITE_URL`, rebuild, then submit `/sitemap.xml` in Google Search Console and link the site from the Google Business Profile.
- Add the street address, opening hours and coordinates to the structured data.
- 8 models are kept by choice although their licence does not allow commercial use (CC BY-NC: Mercedes A 45 AMG, BMW M4 G82, Peugeot 3008; CC BY-NC-SA: Ford Fiesta XR2i, Fiat 500 2016; Sketchfab Standard: VW Golf GTI Mk8, ID.3, ID.4). Before launch, ask the authors for permission or buy a commercial licence, or replace them.
- More Romanian-popular models (Skoda, more Dacia, VW SUVs, Opel Astra, Toyota RAV4).
- Review the changes, then commit and push (nothing committed yet).
