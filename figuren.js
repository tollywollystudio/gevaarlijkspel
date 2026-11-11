/* gevaarlijk spel. — de buurtfiguren: twee inkten, handlijn, oranje vulling net ernaast */
var GSF = (function(){
  var rustig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function defs(){
    if(document.getElementById('gsf-defs'))return;
    var d=document.createElement('div');
    d.innerHTML='<svg id="gsf-defs" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'+
      '<pattern id="raster" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><circle cx="3.5" cy="3.5" r="1.9" fill="#2f4fa8"/></pattern>'+
      '<pattern id="raster2" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)"><circle cx="4.5" cy="4.5" r="2.6" fill="#ff5c39"/></pattern>'+
      '<filter id="wiebel" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.5"/></filter>'+
      '</defs></svg>';
    document.body.insertBefore(d.firstChild, document.body.firstChild);
  }
  var HAND={down:[15,-27],up:[25,-60],fwd:[25,-42],laag:[20,-32]};
  function ledematen(o){
    var r=HAND[o.r||'down'], l=HAND[o.l||'down'], s='';
    if(o.zit) s+='<path d="M5 -22H18V-4"/>';
    else s+='<line class="been a" x1="-4" y1="-24" x2="-4" y2="0"/><line class="been b" x1="4" y1="-24" x2="4" y2="0"/>';
    var sy=o.zit?-40:-46, dy=o.zit?6:0;
    s+='<line class="arm-l" x1="-9" y1="'+sy+'" x2="'+(-l[0])+'" y2="'+(l[1]+dy)+'"/>';
    s+='<line class="arm-r" x1="9" y1="'+sy+'" x2="'+r[0]+'" y2="'+(r[1]+dy)+'"/>';
    return s;
  }
  function pers(o){
    var L=ledematen(o), by=o.zit?-44:-51, bh=o.zit?24:29, hy=o.zit?-55:-62;
    var romp='<rect x="-9" y="'+by+'" width="18" height="'+bh+'" rx="6"/><circle cx="0" cy="'+hy+'" r="9"/>';
    return '<g class="pers '+(o.cls||'')+(o.w?' w':'')+'"><g class="vul"><g class="dik">'+L+'</g>'+romp+'</g>'+
      '<g class="lijn">'+romp+'<g class="dun">'+L+'</g></g><g class="prop">'+(o.extra||'')+'</g></g>';
  }
  function fig(o){var s=o.s||1;return '<g transform="translate('+o.x+','+o.y+') scale('+(o.flip?-s:s)+','+s+')">'+pers(o)+'</g>';}
  var KOPTEL='<path d="M-10 -64A10 10 0 0 1 10 -64"/><rect class="pv" x="-13.5" y="-67" width="5" height="9" rx="2"/><rect class="pv" x="8.5" y="-67" width="5" height="9" rx="2"/>';
  var KEYCORD='<path d="M-5 -51L0 -41L5 -51"/><rect class="wit" x="-3.5" y="-41" width="7" height="9"/>';
  var HOND='<path d="M15 -27L29 -17"/><rect class="wit" x="28" y="-17" width="21" height="9" rx="4"/><circle class="wit" cx="51" cy="-20" r="4.5"/><path d="M32 -8v8M45 -8v8"/><path class="staart" d="M28 -14l-5 -6"/>';
  var STOK='<path d="M20 -32L22 0"/>';
  var ROL='<circle cx="-1" cy="-13" r="13"/><circle cx="21" cy="-3" r="3"/><path d="M-9 -40l-6 -4"/>';
  var PAN='<path d="M25 -42h8"/><rect class="wit" x="33" y="-46" width="16" height="8" rx="1"/><path class="damp" d="M37 -51q-3 -4 0 -8M45 -51q-3 -4 0 -8"/>';
  function svg(vb,label,inhoud,los){return '<svg class="fg" viewBox="'+vb+'" role="img" aria-label="'+label+'">'+(los?inhoud:'<g class="w">'+inhoud+'</g>')+'</svg>';}
  function grond(x0,x1,y){return '<path class="bl grondlijn" d="M'+x0+' '+y+'q'+((x1-x0)/2)+' -4 '+(x1-x0)+' 0"/>';}
  function slinger(x0,xm,ym,x1,y0,y1,n,anim){
    var s='<path class="bl slingerlijn" pathLength="1" style="stroke-width:1.6" d="M'+x0+' '+y0+'Q'+xm+' '+ym+' '+x1+' '+y1+'"/>';
    for(var i=1;i<n;i++){var t=i/n,x=x0*(1-t)*(1-t)+2*(1-t)*t*xm+t*t*x1,y=y0*(1-t)*(1-t)+2*(1-t)*t*ym+t*t*y1;
      s+='<path class="vlag '+(i%2?'oranje':'vast')+'"'+(anim?' style="--vd:'+(3.6+i*0.28).toFixed(2)+'s"':'')+' d="M'+(x-9).toFixed(1)+' '+y.toFixed(1)+'h18l-9 20z"/>';}
    return s;
  }

  // ---------- de vijf scenario's ----------
  var SCENE={
   stroom:['Blackout: een figuur schijnt met een zaklamp door het donker naar een buur',
    '<rect class="raster" x="0" y="0" width="240" height="200"/>'+
    '<g transform="translate(92,91)"><g class="lamp"><path class="bgvlak" d="M0 0L170 -62V62z"/></g></g>'+
    fig({x:44,y:172,s:1.35,r:'fwd',extra:'<rect class="pv" x="24" y="-45" width="9" height="6" rx="1"/>'})+
    fig({x:190,y:172,s:1.35,r:'up',cls:'zwaait'})+grond(6,234,174)],
   water:['Overstroming: een figuur staat op zandzakken terwijl het water stijgt',
    '<g class="prop"><rect class="wit" x="62" y="150" width="44" height="20" rx="9"/><rect class="wit" x="108" y="150" width="44" height="20" rx="9"/><rect class="wit" x="85" y="130" width="44" height="20" rx="9"/></g>'+
    fig({x:107,y:130,s:1.25,r:'up',cls:'zwaait',extra:KEYCORD})+
    '<g class="golven"><path class="raster" d="M-40 150q10 -9 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0V260H-40z"/><path class="bl" d="M-40 150q10 -9 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0"/></g>'],
   hitte:['Hittestress: onder een felle zon geeft een figuur een glas water aan een oudere buur',
    '<g class="zon"><circle class="raster-o" cx="176" cy="52" r="40"/></g>'+
    fig({x:78,y:172,s:1.35,r:'laag',cls:'geeft'})+
    '<g class="prop"><rect class="wit" x="118" y="118" width="9" height="13" rx="1"/></g>'+
    fig({x:166,y:172,s:1.35,r:'laag',extra:STOK})+grond(6,234,174)],
   weer:['Extreem weer: een figuur leunt met een paraplu tegen wind en regen in',
    '<g class="regen"><path class="bl" style="stroke-width:1.6" d="M30 -20l-12 24M70 -10l-12 24M110 -24l-12 24M150 -8l-12 24M190 -20l-12 24M230 -6l-12 24M50 40l-12 24M90 30l-12 24M130 44l-12 24M170 34l-12 24M210 44l-12 24M250 30l-12 24M30 90l-12 24M70 100l-12 24M190 96l-12 24M230 90l-12 24M250 130l-12 24M40 140l-12 24M210 146l-12 24"/></g>'+
    '<g class="wind">'+fig({x:120,y:172,s:1.4,r:'up',extra:'<path d="M25 -60V-84"/><path class="wit" d="M-3 -84A28 22 0 0 1 53 -84z"/>'})+'</g>'+grond(6,234,174)],
   digitaal:['Digitale dreiging: het signaal valt weg, een figuur houdt een papieren briefje omhoog',
    '<g class="prop wifi" transform="translate(120,58)"><path d="M-30 -10A42 42 0 0 1 30 -10"/><path d="M-20 0A28 28 0 0 1 20 0"/><path d="M-10 10A14 14 0 0 1 10 10"/></g>'+
    '<g class="prop kruis" transform="translate(120,56)"><path d="M-14 -14L14 14M14 -14L-14 14" style="stroke-width:5"/></g>'+
    fig({x:92,y:172,s:1.35,r:'up',extra:'<rect class="wit" x="17" y="-82" width="17" height="21"/><path d="M20 -77h11M20 -72h11M20 -67h7" style="stroke-width:1.4"/>'})+
    fig({x:168,y:172,s:1.35,r:'fwd',extra:'<rect class="pv" x="23" y="-50" width="7" height="12" rx="1.5"/>'})+grond(6,234,174)]
  };
  SCENE.meting=['Een buur plakt een oranje stip op een bord met drie rijen; er staan veel meer oranje stippen dan blauwe',
    '<g class="prop"><rect class="wit" x="100" y="26" width="128" height="120" rx="4"/><path d="M112 146V174M216 146V174"/><path style="stroke-width:1.6" d="M108 50q5 -3 10 0t10 0M108 86q5 -3 10 0t10 0M108 122q5 -3 10 0t10 0"/>'+
    '<circle cx="142" cy="50" r="5"/><circle cx="156" cy="50" r="5"/><circle cx="142" cy="86" r="5"/><circle cx="142" cy="122" r="5"/><circle cx="156" cy="122" r="5"/></g>'+
    [[170,50],[184,50],[198,50],[212,50],[156,86],[170,86],[184,86],[198,86],[170,122],[184,122],[198,122],[212,122]].map(function(p){return '<circle class="oranje" cx="'+p[0]+'" cy="'+p[1]+'" r="5"/>';}).join('')+
    fig({x:54,y:172,s:1.35,r:'fwd',extra:KEYCORD})+'<circle class="oranje" cx="92" cy="114" r="5"/>'+grond(6,234,174)];
  function scene(key){var s=SCENE[key];return svg('0 0 240 200',s[0],s[1]);}

  // ---------- samen oefenen ----------
  function dans(el){
    defs();
    var d='', dx=[70,180,270,380,490,590,690], dsz=[1.7,1.7,1.1,1.7,1.15,1.7,1.6];
    dx.forEach(function(x,i){d+=fig({x:x,y:186,s:dsz[i],cls:'dans',extra:KOPTEL+KEYCORD});});
    el.innerHTML=svg('0 0 760 216','Zeven buren met koptelefoon en keycord maken tegelijk dezelfde armbeweging onder een slinger vlaggetjes',slinger(0,380,40,760,22,18,25,false)+grond(14,746,188)+d);
  }

  // ---------- de folder komt tot leven ----------
  function folder(el){
    defs();
    var VAN=232, SNEL=150, Y=348;
    var LX=896, DX=950;  // wie de ladder draagt en vasthoudt, en wie de slinger ophangt
    var buren=[{x:LX,s:1.75,r:'fwd',extra:KEYCORD},{x:DX,s:1.75,r:'up',cls:'drager',extra:KEYCORD},{x:760,s:1.75,r:'fwd',extra:PAN},{x:690,s:1.75,idle:'i-dans',extra:KOPTEL+KEYCORD},{x:610,s:1.75,zit:true,idle:'i-rol',extra:ROL},{x:470,s:1.75,extra:HOND},{x:400,s:1.75,r:'laag',extra:STOK},{x:334,s:1.15,idle:'i-spring',extra:KEYCORD}];
    var figs=buren.map(function(o,i){
      var t=Math.max(1.1,(o.x-VAN)/SNEL), n=Math.max(1,Math.round(t/.72)), d=.8+i*1.7, dy=[0,0,7,-3,8,5,-2,6][i]; o.w=true;
      return '<g class="wandel'+(i===0?' eerste':'')+' '+(o.idle||'')+'" style="--aank:'+(d+1.9+t).toFixed(2)+'s;--x:'+o.x+'px;--van:'+VAN+'px;--d:'+d+'s;--t:'+t.toFixed(2)+'s;--n:'+n+';--g:'+(16.8+[.5,0,.6,.25,1,.4,.8,1.3][i])+'s;--gt:'+[2.6,2.8,2.3,3.2,2.6,3.4,2.5,3][i]+'s'+(i===1?';--neer:'+(d+1.9+t+3.8).toFixed(2)+'s':'')+'"><g class="'+(i===1?'klim':'')+'"><g class="hop"><g transform="translate(0,'+(Y+dy)+') scale('+o.s+')">'+pers(o)+'</g></g></g></g>';
    }).reverse().join('');  // wie later komt, staat achter wie al loopt
    // de slinger komt uit de rand van het boekje, precies waar het eerste figuur hem vastpakt.
    // tijdens het lopen komen de vlaggetjes een voor een naar buiten; bij het ophangen gaat de hele slinger omhoog.
    var HX=44, HY=243, A0=[270,HY], A1=[270,106], P=[994,120], LEN=Math.hypot(P[0]-A1[0],P[1]-A1[1]), T0=(DX-VAN)/SNEL, OP=1.6, DUUR=1.9+T0+OP, ZAK=12, D1=.8+1.7;
    var ms='<path class="bl" style="stroke-width:1.6" d="M0 0Q'+(LEN/2).toFixed(1)+' '+ZAK+' '+LEN.toFixed(1)+' 0"/>';
    for(var k=1;k<23;k++){var q=k/23,fx=2*(1-q)*q*(LEN/2)+q*q*LEN,fy=2*(1-q)*q*ZAK;ms+='<path class="mvlag '+(k%2?'oranje':'vast')+'" d="M'+(fx-9).toFixed(1)+' '+fy.toFixed(1)+'h18l-9 20z"/>';}
    var meeslinger='<clipPath id="kaftsleuf"><rect x="0" y="-40" width="'+(LEN+60).toFixed(0)+'" height="200"/></clipPath>'+
      '<g class="meeslinger"><g clip-path="url(#kaftsleuf)"><g class="trek">'+ms+'</g></g></g>';
    var pts=[[0,[VAN+HX,HY],A0],[1.9,[VAN+HX,HY],A0]];
    for(var s=1;s<=10;s++)pts.push([1.9+T0*s/10,[VAN+(DX-VAN)*s/10+HX,HY],A0]);
    for(var u=1;u<=5;u++){var w=u/5;pts.push([1.9+T0+OP*w,[DX+HX+(P[0]-DX-HX)*w,HY+(P[1]-HY)*w],[A0[0],A0[1]+(A1[1]-A0[1])*w]]);}
    var kf1='',kf2='',kf3='';
    pts.forEach(function(p){
      var a=p[2],dx=p[1][0]-a[0],dy=p[1][1]-a[1],len=Math.hypot(dx,dy),an=Math.atan2(dy,dx)*180/Math.PI,pc=(p[0]/DUUR*100).toFixed(2)+'%';
      kf1+=pc+'{transform:translate('+a[0]+'px,'+a[1].toFixed(1)+'px) rotate('+an.toFixed(2)+'deg)}';
      kf2+=pc+'{transform:rotate('+(-an).toFixed(2)+'deg)}';
      kf3+=pc+'{transform:translateX('+(-(LEN-len)).toFixed(1)+'px)}';
    });
    var eind=Math.atan2(P[1]-A1[1],P[0]-A1[0])*180/Math.PI;
    // de ladder: gedragen door het eerste figuur, daarna tegen de paal gezet
    var T0L=(LX-VAN)/SNEL, DL=1.9+T0L+.9, HOEK=82.2, lk='';
    // eerst staat hij als tekening rechtop op de middelste pagina; het eerste figuur pakt hem op zodra het tot leven komt
    [[0,VAN,2,1],[1,VAN,2,1],[1.75,VAN,1,1],[1.9,VAN,1,1],[1.9+T0L,LX,1,1],[DL,0,0,1]].forEach(function(p){
      lk+=(p[0]/DL*100).toFixed(2)+'%{opacity:'+p[3]+';transform:'+(p[2]===2?'translate(-812px,-3px) rotate(0deg)':p[2]?'translate('+(p[1]-110-962)+'px,-79px) rotate('+HOEK+'deg)':'translate(0,0) rotate(0deg)')+'}';
    });
    // klimmen: sport voor sport omhoog, even blijven staan, en weer omlaag
    var KD=3.6, kk='', stap=function(t,k){kk+=(t/KD*100).toFixed(2)+'%{transform:translate('+(18*k/5).toFixed(1)+'px,'+(-123*k/5).toFixed(1)+'px)}';};
    for(var z=0;z<=5;z++){stap(OP*z/5,z);if(z<5)stap(OP*(z+.55)/5,z);}
    stap(2.3,5);for(var y=4;y>=0;y--){stap(2.3+1.2*(5-y-.45)/5,y+1);stap(2.3+1.2*(5-y)/5,y);}
    if(!document.getElementById('gsf-kf')){
      var st=document.createElement('style');st.id='gsf-kf';
      st.textContent='.fg .meeslinger{transform:translate('+A1[0]+'px,'+A1[1]+'px) rotate('+eind.toFixed(2)+'deg)}'+
        '.fg .mvlag{transform-box:fill-box;transform-origin:50% 0;transform:rotate('+(-eind).toFixed(2)+'deg)}'+
        '.fg .ladder{transform-origin:962px 352px}@keyframes f-ladder{'+lk+'}@keyframes f-klim{'+kk+'}'+
        '@media (prefers-reduced-motion:no-preference){.speel .fg .ladder{animation:f-ladder '+DL.toFixed(2)+'s linear .8s backwards}'+
        '.speel .fg .klim .been.a{animation:f-stap-a .72s linear calc(var(--d) + 1.9s) var(--n),f-stap-a .64s linear calc(var(--d) + 1.9s + var(--t)) 2.5,f-stap-a .48s linear calc(var(--d) + 4.2s + var(--t)) 2.5}'+
        '.speel .fg .klim .been.b{animation:f-stap-b .72s linear calc(var(--d) + 1.9s) var(--n),f-stap-b .64s linear calc(var(--d) + 1.9s + var(--t)) 2.5,f-stap-b .48s linear calc(var(--d) + 4.2s + var(--t)) 2.5}}'+
        '@keyframes f-slinger{'+kf1+'}@keyframes f-mvlag{'+kf2+'}@keyframes f-trek{'+kf3+'}'+
        '@media (prefers-reduced-motion:no-preference){.speel .fg .meeslinger{animation:f-slinger '+DUUR.toFixed(2)+'s linear '+D1+'s backwards}.speel .fg .mvlag{animation:f-mvlag '+DUUR.toFixed(2)+'s linear '+D1+'s backwards}.speel .fg .trek{animation:f-trek '+DUUR.toFixed(2)+'s linear '+D1+'s backwards}}';
      document.head.appendChild(st);
    }
    var boek=
     '<g class="w"><path class="raster" d="M30 118L110 106V350L30 358z"/><path class="bl" d="M30 118L110 106V350L30 358z"/><path class="vast" d="M38 136L102 127V170L38 177z"/></g>'+
     '<text x="43" y="152" transform="rotate(-7 43 152)">WAT U</text><text x="43" y="165" transform="rotate(-7 43 165)">KUNT DOEN</text>'+
     '<g class="p2"><g class="w"><path class="bl wit" d="M110 106L190 118V358L110 350z"/>'+
     '<g class="bl" style="stroke-width:2"><circle cx="126" cy="140" r="6"/><path d="M138 138q7 -4 14 0t14 0t12 0M138 150q7 -4 14 0t14 0"/>'+
     '<circle cx="126" cy="196" r="6"/><path d="M138 194q7 -4 14 0t14 0t12 0M138 206q7 -4 14 0t14 0t8 0"/>'+
     '<circle cx="126" cy="252" r="6"/><path d="M138 250q7 -4 14 0t14 0t12 0M138 262q7 -4 14 0"/></g></g></g>'+
     '<g class="p3"><g class="w"><path class="bl wit" d="M190 118L270 106V350L190 358z"/><path class="bl" style="stroke-width:2" d="M202 140q7 -4 14 0t14 0t14 0t12 0M202 154q7 -4 14 0t14 0t10 0"/>'+
     '<rect class="bl" style="stroke-width:1.6;stroke-dasharray:4 5" x="204" y="196" width="56" height="146" rx="8"/></g></g>';
    el.innerHTML=svg('0 0 1010 400','Animatie: een folder vouwt open, een figuur draagt een ladder naar buiten en zet hem tegen een paal, een tweede klimt erop en hangt een slinger vlaggetjes op, zes buren volgen en de straat groet',
      '<g class="zon-op"><circle class="raster-o" cx="640" cy="170" r="92" opacity=".6"/></g>'+
      '<g class="w"><path class="bl" style="stroke-width:3" d="M4 358q130 -3 258 -6q160 -5 330 0t334 -2t80 0"/></g>'+
      '<g class="w"><path class="bl" style="stroke-width:3" d="M994 352V116"/><circle class="vast" cx="994" cy="112" r="5"/></g>'+
      boek+'<g class="ladder"><g class="w"><path class="bl" d="M950 352L976 176M974 352L996 176'+[324,296,268,240,212].map(function(yy){var q=(352-yy)/176;return 'M'+(950+26*q).toFixed(1)+' '+yy+'H'+(974+22*q).toFixed(1);}).join('')+'"/></g></g>'+meeslinger+figs,true);
    var klok=null, gestart=false;
    var knop=document.createElement('button');knop.type='button';knop.className='nogeens';knop.id='folder-nogeens';knop.textContent='nog een keer';knop.hidden=true;
    el.appendChild(knop);knop.addEventListener('click',function(){start();});
    function start(){
      el.classList.remove('speel');void el.offsetWidth;el.classList.add('speel');el.classList.remove('uit');
      clearTimeout(klok);knop.hidden=true;
      klok=setTimeout(function(){knop.hidden=false;},21500);
    }
    el.classList.remove('speel');
    if('IntersectionObserver' in window && !rustig){
      new IntersectionObserver(function(es,io){if(es[0].isIntersecting&&!gestart){gestart=true;start();io.disconnect();}},{threshold:.35}).observe(el);
    } else el.classList.add('speel');
    return start;
  }

  // ---------- oefeningen: spelen één keer als ze in beeld komen ----------
  var LAMPJE='<path class="straal" d="M33 -42L74 -60V-24z"/><rect class="pv" x="24" y="-45" width="9" height="6" rx="1"/>';
  function trap(){var d='M6 174H20';for(var k=1;k<=6;k++)d+='V'+(174-16*k)+'H'+(20+30*k+(k===6?36:0));return d;}
  var GOLF='M0 150q10 -8 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0';
  function golf(x0,x1,y){var d='M'+x0+' '+y+'q10 -8 20 0';for(var x=x0+20;x<x1;x+=20)d+='t20 0';return d;}
  function waterband(x0,x1,y,cls){var g=golf(x0,x1,y);return '<g class="'+(cls||'')+'"><path class="raster" d="'+g+'V204H'+x0+'z"/><path class="bl" d="'+g+'"/></g>';}
  function trapDelen(){return '<circle class="raster-o" cx="218" cy="38" r="28" opacity=".5"/><g class="prop"><path d="M218 4V30"/><circle class="wit" cx="218" cy="37" r="7"/></g>'+
    '<path class="bl" d="'+trap()+'"/>'+
    '<g class="klimmen">'+fig({x:125,y:126,s:.9})+fig({x:155,y:110,s:.62,extra:KEYCORD})+fig({x:186,y:94,s:.9,r:'up'})+'</g>';}
  function vlagDelen(){return '<g class="prop"><path class="wit" d="M20 174V70L80 28L140 70V174"/><rect class="wit" x="62" y="84" width="36" height="34"/><path d="M80 84V118M62 101H98"/></g>'+
    '<g transform="translate(98,98)"><g class="vlagstok"><g class="prop"><path d="M0 0L52 -26"/><path class="wit" d="M30 -15L52 -26L60 -10L38 1z"/></g></g></g>'+
    '<g class="bootje">'+fig({x:172,y:152,s:.9})+fig({x:200,y:152,s:.9,r:'up'})+'<path class="bgvlak" d="M148 138H224L213 160H159z"/><path class="bl" d="M148 138H224L213 160H159z"/></g>';}
  function gever(x,i){return '<g style="--fi:'+i+'">'+fig({x:x,y:172,s:1.15,r:'fwd',l:'fwd',cls:'doorgeef'})+'</g>';}
  var OEF={
   zandzakken:['zandzakken doorgeven','Drie buren geven zandzakken van hand tot hand door, van een stapel links naar een muurtje voor een deur',
    '<g class="prop"><path class="wit" d="M190 174V84H238V174"/><path d="M182 84H246"/><circle class="pv" cx="199" cy="134" r="2.5"/>'+
    '<rect class="wit" x="-58" y="161" width="28" height="13" rx="6"/><rect class="wit" x="-30" y="161" width="28" height="13" rx="6"/><rect class="wit" x="-44" y="148" width="28" height="13" rx="6"/></g>'+
    gever(44,0)+gever(102,1)+gever(160,2)+
    '<g class="prop"><rect class="wit" x="186" y="161" width="28" height="13" rx="6"/><rect class="wit" x="214" y="161" width="28" height="13" rx="6"/>'+
    '<rect class="wit z1" x="200" y="148" width="28" height="13" rx="6"/><rect class="wit z2" x="186" y="135" width="28" height="13" rx="6"/><rect class="wit z3" x="214" y="135" width="28" height="13" rx="6"/>'+
    '<g class="zakloop"><rect class="wit" x="-14" y="-7" width="28" height="13" rx="6"/></g></g>'+grond(-62,252,174),'-66 0 322 200'],
   meterkast:['zaklamp naar de meterkast','Een ouder en een kind lopen met een zaklamp naar de meterkast; de deur gaat open en er hangt een ingevuld plan',
    '<g class="prop"><rect class="wit" x="160" y="64" width="56" height="110"/><rect class="wit" x="170" y="80" width="36" height="46"/><path style="stroke-width:1.5" d="M176 92h24M176 102h24M176 112h14"/>'+
    '<path class="vink" d="M178 142l8 9l16 -20" style="stroke:var(--zalm);stroke-width:5"/></g>'+
    '<g class="prop"><rect class="wit deur" x="160" y="64" width="56" height="110"/></g>'+
    '<g class="samenloop">'+fig({x:70,y:172,s:1.25,r:'fwd',cls:'loopt',extra:LAMPJE})+fig({x:118,y:172,s:.8,cls:'loopt',extra:KEYCORD})+'</g>'+grond(6,234,174)],
   trap:['samen de trap op','Drie buren klimmen trede voor trede een trap op naar een zolder waar een lamp brandt, terwijl onder hen het water stijgt',
    trapDelen()+waterband(-20,260,136,'stijgwater')],
   soep:['soep op de brander','Drie buren staan rond een brander met een pan soep; er komt damp uit de pan',
    '<g class="prop stoomwolk"><path d="M110 132q-5 -7 0 -14M122 132q-5 -7 0 -14M134 132q-5 -7 0 -14"/></g>'+
    fig({x:24,y:172,s:.8,extra:KEYCORD})+fig({x:62,y:172,s:1.25,r:'fwd',extra:'<path d="M25 -42L35 -24"/>'})+fig({x:192,y:172,s:1.25,r:'laag',flip:true})+
    '<path class="oranje vlam" d="M111 160q9 -13 18 0z"/><g class="prop"><rect class="wit" x="106" y="160" width="28" height="14" rx="2"/><rect class="wit" x="98" y="138" width="44" height="16" rx="2"/><path d="M142 144h14"/></g>'+grond(6,234,174)],
   vlag:['witte vlag uit het raam','Uit het raam van een huis in het water komt een witte vlag; een bootje met twee buren vaart ernaartoe',
    vlagDelen()+waterband(-20,260,150)]
  };
  // brede versies voor tussen de secties: het water loopt over de hele breedte van de pagina
  var BREED={
   trapbreed:[OEF.trap[1],'<g transform="translate(1080,0)">'+trapDelen()+'</g>'+waterband(0,2400,136,'stijgwater')+'<path class="bl" d="'+golf(0,2400,199)+'"/>'],
   vlagbreed:[OEF.vlag[1],'<g transform="translate(1080,0)">'+vlagDelen()+'</g>'+waterband(0,2400,150)+'<path class="bl" d="'+golf(0,2400,199)+'"/>']
  };
  function oefening(key){if(BREED[key])return '<svg class="fg" viewBox="0 0 2400 200" preserveAspectRatio="xMidYMax slice" role="img" aria-label="'+BREED[key][0]+'"><g class="w">'+BREED[key][1]+'</g></svg>';var o=OEF[key];return svg(o[3]||'0 0 240 200',o[1],o[2]);}
  function oefeningNaam(key){return OEF[key][0];}
  // één losse buur, om op een lijn te zetten
  var LOS=[{r:'up',cls:'zwaait'},{extra:HOND},{r:'fwd',extra:PAN},{extra:KOPTEL+KEYCORD},{r:'laag',extra:STOK},{zit:true,extra:ROL},{s:.7,extra:KEYCORD}];
  function los(i){var o=Object.assign({},LOS[i%LOS.length]);o.x=0;o.y=0;o.w=true;return '<svg class="fg" viewBox="-30 -86 96 90" aria-hidden="true">'+fig(o)+'</svg>';}
  return {scene:scene, dans:dans, folder:folder, defs:defs, los:los, oefening:oefening, oefeningNaam:oefeningNaam, oefeningen:Object.keys(OEF)};
})();
