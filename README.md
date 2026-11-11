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
