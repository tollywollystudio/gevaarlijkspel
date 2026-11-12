/* gevaarlijk spel. — gedeelde data en gedrag */
var GS = (function(){
  var SCENTEKST = {stroom:'Het licht, de pinautomaat en de koelkast vallen uit.', water:'Het water komt: evacueren of blijven.', hitte:'Dagen boven de dertig, zonder ventilator.', weer:'Storm, hoosbuien, de straat blank en bomen om.', digitaal:'Geen internet, geen telefoon, geen app van de gemeente.'};
  function scenrij(el,metTekst,link){if(typeof GSF==='undefined')return;GSF.defs();el.innerHTML=Object.keys(SCEN).map(function(k){var b=GSF.scene(k)+'<figcaption class="mono">'+SCEN[k]+(metTekst?'<p>'+SCENTEKST[k]+'</p>':'')+'</figcaption>';return '<figure class="toneel">'+(link?'<a href="programmas.html#s-'+k+'" aria-label="programma’s bij '+SCEN[k]+'">'+b+'</a>':b)+'</figure>';}).join('');}
  function brekers(){if(typeof GSF==='undefined')return;GSF.defs();document.querySelectorAll('.breker figure[data-oef]').forEach(function(f){f.innerHTML=GSF.oefening(f.getAttribute('data-oef'));});}
  function oefenrij(el){if(typeof GSF==='undefined')return;GSF.defs();el.innerHTML=GSF.oefeningen.map(function(k){return '<figure class="toneel eenmaal">'+GSF.oefening(k)+'<figcaption class="mono">'+GSF.oefeningNaam(k)+'</figcaption></figure>';}).join('');}
  var SCEN = {stroom:'blackout', water:'overstroming', hitte:'hittestress', weer:'extreem weer', digitaal:'digitale dreiging'};
  var GROEP = {
    gemeente:{naam:'gemeente', kleur:'groen', lang:'Gemeente'},
    regio:{naam:'veiligheidsregio', kleur:'blauw', lang:'Veiligheidsregio'},
    school:{naam:'school', kleur:'paars', lang:'School'},
    buurt:{naam:'buurt of organisatie', kleur:'zalm', lang:'Buurt of organisatie'}
  };
  var P = [
    {id:'silent-noodshow', foto:['img/v5-3.jpg','Deelnemers met koptelefoon zwaaien naar boven'], nr:'01', naam:'Silent Noodshow', waar:'straat of plein', duur:'15 min per ronde', scen:['water','stroom'], voor:['gemeente','regio','buurt'],
     kort:'Koptelefoon op, keycord om, en een stem die je in een kwartier door een overstroming praat.',
     wat:'Een stem in de koptelefoon praat de groep door een overstroming. Er zijn vier groepen, elk met een eigen keycordkleur; zo herkennen ze elkaar als buren. Iedereen krijgt een kaartje met een straat en de waterdiepte daar. Het verhaal vertakt voor wie wel of geen noodpakket en evacuatieplan heeft. Zo leer je snel wie er om je heen al voorbereid is en hoe je dat kunt doen.',
     jij:'Een straat of plein en een stroompunt.',
     op:'Rondes van een kwartier, de hele middag door. Helpt het bewustzijn over waterveiligheid en evacuatieplannen vergroten. Ook als dagopening binnen te boeken.'},
    {id:'kookkaravaan', oef:'soep', nr:'02', naam:'Noodpakket Kookkaravaan', waar:'buurthuis of plein', duur:'2,5 uur', scen:['stroom'], voor:['gemeente','buurt'],
     kort:'Nieuwsgierig wat je kunt maken met de ingrediënten van je noodpakket? Doe mee aan deze interactieve workshop met je buren, leer wat er in je noodpakket moet zitten en maak de lekkerste gerechten.',
     wat:'Buren koken samen een maaltijd met alleen wat er in een noodpakket zit, zonder stroom. Aan het eind eet je samen en praat je over wat er thuis in de kast staat. Te combineren met de kookshow Alive & Cooking.',
     jij:'Een buurthuis, plein of andere plek waar een groep kan koken en eten.',
     op:'Een informatieve en laagdrempelige workshop die uitnodigt tot gesprekken over noodpakketten. Ook voor mensen die nooit naar een informatieavond komen. Community building met een pan.'},
    {id:'alive-and-cooking', nr:'03', naam:'Alive & Cooking', waar:'straat of markt', duur:'25 min per optreden', scen:['stroom'], voor:['gemeente','buurt'],
     kort:'De kookshow over leven en overleven: straattheater met een gastchef en een noodpakket.',
     wat:'Een presentator en een gastchef koken voor publiek met wat er in een noodpakket zit. Een optreden duurt ongeveer 25 minuten en wordt meerdere keren op een dag gespeeld. Te combineren met de Noodpakket Kookkaravaan.',
     jij:'Een plek op straat, op de markt of op een evenement.',
     op:'Voorbijgangers die blijven staan en horen wat er in een noodpakket hoort. Gespeeld op Festival Voor de Vloed en de open dag van het waterschap.'},
    {id:'wijkspel-72-uur', oef:'meterkast', nr:'03', naam:'Wijkspel 72 uur', waar:'buiten, in de wijk', duur:'3 uur', scen:['stroom','water','hitte','weer'], voor:['gemeente','regio','buurt'],
     kort:'Een klein evenement met de buurt. Je loopt in groepjes door de wijk, zoals bij een vossenjacht, en probeert zelf uit hoe je drie dagen doorkomt.',
     wat:'De wijk is het speelveld. Groepjes buren lopen een route langs posten. Bij elke post probeer je iets uit: water halen, koken zonder stroom, een buur vinden die hulp nodig heeft. Onderweg ontdek je wat er in je eigen wijk is en wie wat kan.',
     jij:'Een wijk of buurt en een plek om te starten en te eindigen.',
     op:'Buren die samen door hun wijk hebben gelopen en weten wat ze aan elkaar hebben.'},
    {id:'redders', oef:'vlag', nr:'04', naam:'Redders van [jouw gemeente]', waar:'vloedcamp', duur:'1 uur per klas', scen:['water'], voor:['school','gemeente'],
     kort:'Een trainingskamp waar kinderen redder worden: zandzakken stapelen, een hindernisbaan en klimmen naar de zolder.',
     wat:'Volgens aanhoudende geruchten wordt de stad al eeuwen beschermd door de Redders. Op het Vloedcamp trainen klassen om erbij te horen. Ze stapelen zandzakken, nemen een hindernisbaan, klimmen naar een nagebouwde zolder en leren over noodpakketten.',
     jij:'Een plek in de stad, zoals een plein of tuin, en klassen uit groep 3 tot en met 5. We bouwen het Vloedcamp op voor minimaal een dag met meerdere klassen.',
     op:'In Dordrecht kwamen in 2026 zo’n 500 kinderen naar het Vloedcamp, onder wie 321 leerlingen van 13 klassen. Op deze manier bereikt informatie over waterveiligheid jong en oud.'},
    {id:'oefening-met-publiek', oef:'zandzakken', folder:'Ga bij langdurige uitval naar het noodsteunpunt in uw buurt.', nr:'05', naam:'Pop-up Noodsteunpunt', waar:'in de wijk', duur:'dagdeel', scen:['stroom','water','hitte','weer','digitaal'], voor:['gemeente','regio','buurt'],
     kort:'Er komen noodsteunpunten in de wijk. Wij zorgen dat bewoners en wijkorganisaties ze kennen voordat ze nodig zijn.',
     wat:'We zetten een noodsteunpunt op in de wijk en bewoners lopen binnen om te zien wat het is en wat ze er kunnen halen. Wie wil, speelt mee, met acteurs die het lastig maken. Of we oefenen met de organisaties in de wijk: buurthuis, moskee of kerk, sportclub, ouderenwerk. Bij elke situatie kiezen ze: zelf oplossen, naar het noodsteunpunt, of niets doen. Zo zie je wie wat kan en waar het netwerk nog gaten heeft.',
     jij:'Een plek in de wijk, de mensen die het steunpunt bemannen en de organisaties uit de wijk.',
     op:'Bewoners die weten waar het steunpunt is en waarvoor ze er terechtkunnen. Wijkorganisaties die elkaar kennen voordat het nodig is.'},
    {id:'offline', nr:'06', naam:'Offline', waar:'binnen', duur:'2 uur', scen:['digitaal'], voor:['gemeente','buurt','school'], nieuw:true,
     kort:'Een bijeenkomst waarin je een dag zonder internet naspeelt. Wat doet het nog, en wat niet?',
     wat:'Een interactieve presentatie in een zaal. Samen loop je een dag door waarop het internet uitvalt. Wie kun je nog bereiken? Doet je verwarming het nog? Kun je boodschappen doen en betalen? Bij elke vraag kiest de zaal, en zie je wat er gebeurt.',
     jij:'Een zaal in een buurthuis, school of gemeentehuis.',
     op:'Een bewuste buurt waar buren elkaar kennen.'},
    {id:'stormstad', nr:'07', naam:'Stormstad', waar:'klas', duur:'2 uur', scen:['weer','water'], voor:['school','gemeente'],
     kort:'Ontwerp en bouw een stad die tegen het water kan.',
     wat:'De klas wordt een architectenbureau. In groepjes ontwerpen leerlingen op een eigen kavel een gebouw dat regelmatig onder water mag staan: drijvende winkels met loopbruggen, huizen met een reddingsboot op het dak. Aan het eind leggen ze alle kavels als een puzzel tegen elkaar.',
     jij:'Een lokaal met tafels en een klas uit groep 6 tot en met de brugklas.',
     op:'Eén grote maquette van de stad van de toekomst, en leerlingen die weten wat wonen onder zeeniveau vraagt.'}
  ];
  P.forEach(function(p,i){p.nr=('0'+(i+1)).slice(-2);});
  function scenHtml(s){return '<span class="scen '+s+'"><i aria-hidden="true"></i>'+SCEN[s]+'</span>';}
  function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML;}
  function kaart(p, link){
    var tag = link ? 'a' : 'div';
    var h = '<'+tag+' class="pk"'+(link?' href="programmas.html#'+p.id+'"':'')+' data-scen="'+p.scen.join(' ')+'" data-voor="'+p.voor.join(' ')+'">'+
      '<span class="nr">'+p.nr+' · '+esc(p.waar)+' · '+esc(p.duur)+(p.nieuw?' · in ontwikkeling':'')+'</span>'+
      '<span class="t">'+esc(p.naam)+'</span><span>'+esc(p.kort)+'</span>'+
      '<span class="scens">'+p.scen.map(scenHtml).join('')+'</span></'+tag+'>';
    return h;
  }
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}}
  function kopieer(btn){
    btn.addEventListener('click',function(){
      var t=btn.getAttribute('data-kopie');
      var klaar=function(){var o=btn.textContent;btn.textContent='gekopieerd';setTimeout(function(){btn.textContent=o;},1600);};
      try{navigator.clipboard.writeText(t).then(klaar,function(){kies(btn);});}catch(e){kies(btn);}
    });
  }
  function kies(btn){var el=document.getElementById(btn.getAttribute('aria-controls'));if(!el)return;var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);}
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('[data-kopie]').forEach(kopieer);
    var hoek=[-1.4,1.1,-.7,1.6,-1.1,.8];
    document.querySelectorAll('main img, .wrap img').forEach(function(im,i){if(im.closest('.duo'))return;var s=document.createElement('span');s.className='duo';s.style.setProperty('--r',hoek[i%hoek.length]+'deg');im.parentNode.insertBefore(s,im);s.appendChild(im);});
    var een=document.querySelectorAll('.eenmaal');
    if('IntersectionObserver' in window){var kijk=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('speel');kijk.unobserve(e.target);}});},{threshold:.5});een.forEach(function(e){kijk.observe(e);});}
    if(typeof GSF!=='undefined'&&!document.querySelector('.breker')){GSF.defs();var plek=['right:9%','right:27%','right:4%','right:18%','right:34%'];
      document.querySelectorAll('.sec, .hero2').forEach(function(sec,i){if(sec.id==='licht')return;var b=document.createElement('span');b.className='buur';b.setAttribute('style',plek[i%plek.length]);b.innerHTML=GSF.los(i);sec.insertBefore(b,sec.firstChild);});}
  });
  return {brekers:brekers, oefenrij:oefenrij, scenrij:scenrij, P:P, SCEN:SCEN, GROEP:GROEP, kaart:kaart, scenHtml:scenHtml, esc:esc, store:store};
})();
