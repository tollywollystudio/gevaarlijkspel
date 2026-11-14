// Zet de programma's als gewone HTML in index.html en programmas.html,
// zodat zoekmachines en AI-bots ze lezen zonder JavaScript uit te voeren.
// Draai dit na elke wijziging in de programmadata in gs.js:
//   node tools/prerender.js
// Vereist Playwright met Chromium.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png' };

const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});

function vul(bestand, naam, html) {
  const f = path.join(root, bestand);
  const s = fs.readFileSync(f, 'utf8');
  const re = new RegExp('(<!--prerender:' + naam + '-->)[\\s\\S]*?(<!--/prerender-->)');
  if (!re.test(s)) throw new Error('marker ' + naam + ' niet gevonden in ' + bestand);
  fs.writeFileSync(f, s.replace(re, (_, a, b) => a + html + b));
  console.log(bestand + ': ' + naam + ' bijgewerkt');
}

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://localhost:' + server.address().port + '/';
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // alleen lokale bestanden, geen statistieken of andere externe verzoeken
  await page.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
  await page.goto(base + 'programmas.html');
  const { detail, kaarten, P } = await page.evaluate(() => ({
    detail: GS.detailLijst(), kaarten: GS.kaartLijst(),
    P: GS.P.map(p => ({ id: p.id, naam: p.naam, kort: p.kort, wat: p.wat, op: p.op, duur: p.duur, waar: p.waar,
      scen: p.scen.map(s => GS.SCEN[s]), voor: p.voor.map(v => GS.GROEP[v].naam) }))
  }));
  await browser.close();
  server.close();
  const B = 'https://www.gevaarlijkspel.nl/';
  const lijst = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'Programma’s van Gevaarlijk spel',
    itemListElement: P.map((p, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: {
        '@type': 'Service', '@id': B + 'programmas.html#' + p.id, url: B + 'programmas.html#' + p.id,
        name: p.naam, serviceType: 'crisisoefening', description: p.kort + ' ' + p.wat,
        audience: { '@type': 'Audience', audienceType: p.voor.join(', ') },
        keywords: p.scen.concat([p.waar, p.duur]).join(', '),
        provider: { '@id': B + '#org', '@type': 'Organization', name: 'Gevaarlijk spel', url: B }
      }
    }))
  };
  const ld = '<script type="application/ld+json">' + JSON.stringify(lijst).replace(/</g, '\\u003c') + '</script>';
  vul('programmas.html', 'jsonld', ld);
  vul('programmas.html', 'detail', detail);
  vul('index.html', 'kaarten', kaarten);
})().catch(e => { console.error(e); process.exit(1); });
