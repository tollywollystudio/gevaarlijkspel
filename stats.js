// Bezoekersstatistieken via de Matomo van Tolly Wolly Studio, zonder cookies. Alleen op de live site.
if (/(^|\.)gevaarlijkspel\.nl$/.test(location.hostname)) {
  var _paq = window._paq = window._paq || [];
  _paq.push(['disableCookies']);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function () {
    var u = 'https://festivalvoordevloed.nl/stats/';
    _paq.push(['setTrackerUrl', u + 'matomo.php']);
    _paq.push(['setSiteId', '3']);
    var g = document.createElement('script');
    g.async = true;
    g.src = u + 'matomo.js';
    document.head.appendChild(g);
  })();
}
