# gevaarlijk spel. — website

Statische site voor Gevaarlijk spel, een programma van Stichting Lexlab en Tolly Wolly Studio.

- `index.html`, `programmas.html`, `cases.html`, `voor-wie.html`: de pagina's
- `gs.css`: stijl · `gs.js`: programmadata en gedeeld gedrag · `figuren.js`: de getekende figuren en animaties
- `terugbel.php`: verstuurt het terugbelformulier per mail (vereist PHP met `mail()` op de hosting)
- `img/`: foto's en de deelafbeelding
- `privacy.html`: privacyverklaring (statistieken, terugbelformulier, opgeslagen keuze)
- `stats.js`: bezoekersstatistieken via Matomo (site 3 op festivalvoordevloed.nl/stats), zonder cookies, alleen op gevaarlijkspel.nl
- `fonts.css` en `fonts/`: Instrument Sans en DM Mono, zelf gehost zodat er niets naar Google gaat

Geen bouwstap. Lokaal bekijken: `npx serve .` (het formulier werkt alleen op een server met PHP).

## Vindbaarheid (Google en AI)

- De programma's staan als gewone HTML in `index.html` en `programmas.html`, zodat ook AI-bots die geen JavaScript draaien ze lezen. Bron blijft `gs.js`. Na elke wijziging aan de programma's: `node tools/prerender.js` (vereist Playwright met Chromium). Dat werkt ook de gestructureerde data (JSON-LD) op `programmas.html` bij.
- `robots.txt`, `sitemap.xml` en `llms.txt` (korte samenvatting voor AI-assistenten). Pas `llms.txt` en de lastmod-datums in `sitemap.xml` aan bij grote wijzigingen.
- Veelgestelde vragen staan op `voor-wie.html`, zichtbaar en als FAQPage-data. Houd beide gelijk.
