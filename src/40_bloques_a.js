"use strict";
/* =====================================================================
   6. BLOQUES · base, Inicio, 1 Cultivo, 2 Región, 3 Requerimientos
   ===================================================================== */
/* Referencia del software en formato APA (7.ª ed.): Autores (año). Título (Versión) [Software]. Editorial. DOI */
const citaAPA = ()=> `${esc(tx(CONFIG.citaAutores))} (${CONFIG.anio}). <i>${CONFIG.app}: ${esc(tx(CONFIG.titulo))}</i> (${T('Versión','Version')} ${CONFIG.version}) [Software]. Zenodo. ${CONFIG.doi?`https://doi.org/${CONFIG.doi}`:esc(CONFIG.repo||'')}`;
document.addEventListener('click',ev=>{ if(ev.target.closest('[data-ver-cita]')){ const c=document.querySelector('.cita-card'); if(c) c.scrollIntoView({behavior:'smooth',block:'center'}); return; } if(!ev.target.closest('[data-copiar-cita]')) return; const t=document.getElementById('citaTxt'); try{ navigator.clipboard.writeText(t.innerText); toast(T('Referencia copiada','Reference copied')); }catch(e){} });
const BLOQUES = [
  {id:'inicio',      n:'⌂', ill:null,       corto:E('Inicio','Home'),                 titulo:E('Inicio','Home'), render:()=>renderInicio},
  {id:'cultivo',     n:'1', ill:'cult',     corto:E('Vid','Vine'),                    titulo:E('Tu viñedo: destino, variedad, portainjerto y conducción','Your vineyard: use, variety, rootstock and training'), render:()=>renderCultivo},
  {id:'region',      n:'2', ill:'i-mapa',   corto:E('Región','Region'),               titulo:E('Región, municipio y localidad','Region, municipality and locality'), render:()=>renderRegion},
  {id:'clima',       n:'3', ill:'i-tierra', corto:E('Clima vitícola','Viticultural climate'), titulo:E('Clima vitícola: Winkler, Huglin y noches frescas','Viticultural climate: Winkler, Huglin and cool nights'), render:()=>renderClima},
  {id:'requerimientos',n:'4',ill:'i-req',   corto:E('Requerimientos','Requirements'), titulo:E('Requerimientos técnicos tradicionales e innovados','Traditional and innovated technical requirements'), render:()=>renderReq},
  {id:'manejo',      n:'5', ill:'i-manejo', corto:E('Manejo','Management'),           titulo:E('Manejo: el ciclo anual del viñedo','Management: the vineyard’s annual cycle'), render:()=>renderManejo},
  {id:'regeneracion', n:'6', ill:'i-regen', corto:E('Regeneración','Regeneration'), titulo:E('Regeneración del viñedo','Vineyard regeneration'), render:()=>renderRegeneracion},
  {id:'riesgos',     n:'7', ill:'i-riesgo', corto:E('Riesgos','Risks'), titulo:E('Riesgos del viñedo','Vineyard risks'), render:()=>renderRiesgos},
  {id:'elementos',   n:'8', ill:'i-red',    corto:E('Elementos','Elements'),          titulo:E('Elementos que interactúan en el viñedo','Elements interacting in the vineyard'), render:()=>renderElementos},
  {id:'precios',     n:'9', ill:'i-valor',  corto:E('Precio y valor','Price and value'),titulo:E('Precio y valor de los elementos','Price and value of the elements'), render:()=>renderPrecios},
  {id:'formulacion', n:'10', ill:'i-telar',  corto:E('Formulación','Formulation'),     titulo:E('Formulación del sistema complejo adaptativo','Complex adaptive system formulation'), render:()=>renderFormulacion},
  {id:'tablero',     n:'11', ill:'i-panel2', corto:E('Tablero','Dashboard'),           titulo:E('Tablero de resultados','Results dashboard'), render:()=>renderTablero},
  {id:'sostenible',  n:'12', ill:'i-tierra', corto:E('Sostenibilidad','Sustainability'),titulo:E('Sostenibilidad, ODS y huella','Sustainability, SDGs and footprint'), render:()=>renderSostenible},
  {id:'prospectiva', n:'13', ill:'i-panel2', corto:E('Prospectiva','Outlook'),       titulo:E('Prospectiva a 2, 5 y 10 años','Outlook at 2, 5 and 10 years'), render:()=>renderProspectiva},
  {id:'informe',     n:'14',ill:'i-report', corto:E('Informe','Report'),             titulo:E('Informe general y exportación','General report and export'), render:()=>renderInforme},
  {id:'atlas',       n:'15',ill:'i-mapa',   corto:E('Atlas nacional','National atlas'), titulo:E('Atlas nacional del conocimiento local de la vid','National atlas of local grapevine knowledge'), render:()=>renderAtlas},
  {id:'validacion',  n:'✓', ill:'i-check',  corto:E('Validación','Validation'),       titulo:E('Validación','Validation'), render:()=>renderValidacion},
  {id:'teoria',      n:'§', ill:'i-book',   corto:E('Teoría','Theory'),               titulo:E('Marco teórico','Theoretical framework'), render:()=>renderTeoria}
];
const NUMERADOS = BLOQUES.filter(b=>/^\d+$/.test(b.n)).length;
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const esc = t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fmt(v,d=2){ if(v==null||v===''||isNaN(v)) return '—'; return Number(Math.abs(v)<1e-12?0:v).toLocaleString(LOC(),{minimumFractionDigits:d,maximumFractionDigits:d}); }
const B = id=>BLOQUES.find(b=>b.id===id);
const ill = (id, cls='', style='') => `<svg class="ico ${cls}" style="${style}" aria-hidden="true"><use href="#${id}" width="100%" height="100%"/></svg>`;
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('on'),2400); }
const marcaDato = ()=>`<span class="dato">● ${T('Dato publicado','Published data')}</span>`;
const marcaInterp = (t)=>`<span class="interp" title="${esc(t||'')}">◆ ${T('Lectura de Ratio Viña','Ratio Viña reading')}</span>`;
const fuenteArt = ()=>`<div class="fuente">${T('Fuente','Source')}: Díaz-José et al. (2026), <a href="https://doi.org/${ART.doi}" target="_blank" rel="noopener">doi:${ART.doi}</a></div>`;
const fuenteTesis = ()=>`<div class="fuente">${T('Fuente','Source')}: Mojica Zárate (2017), ${T('tesis doctoral, UCLV','doctoral thesis, UCLV')}.</div>`;
const fuenteInegi = ()=>`<div class="fuente">${T('Fuente','Source')}: INEGI, ${T('Catálogo Único de Claves Geoestadísticas; Censo de Población y Vivienda 2020','Geostatistical catalogue; 2020 Population and Housing Census')}.</div>`;
function cabecera(id, lead){ const b=B(id);
  const et = /^\d+$/.test(b.n) ? T(`Bloque ${b.n} de ${NUMERADOS}`,`Block ${b.n} of ${NUMERADOS}`) : (id==='validacion'?T('Evaluación de la plataforma','Platform evaluation'):T('Fundamentos','Foundations'));
  const ic = b.ill==='cult' ? cultivoSel().ico : b.ill;
  return `<div class="bhead"><div><div class="eyebrow">${et}</div><h1>${esc(tx(b.titulo))}</h1>${lead?`<p class="lead">${lead}</p>`:''}${franjaAvance(id)}</div>${ic?`<div class="bill" style="--anim:running">${ill(ic)}</div>`:''}</div>`; }
function siguiente(id){ const i=BLOQUES.findIndex(b=>b.id===id), p=BLOQUES[i-1], n=BLOQUES[i+1];
  return `<div class="next no-print">${p?`<button class="btn ghost" data-ir="${p.id}">← ${esc(tx(p.corto))}</button>`:'<span></span>'}
    ${n?`<button class="btn big-next" data-ir="${n.id}"><small>${T('Siguiente','Next')}</small><span>${/^\d+$/.test(n.n)?n.n+' · ':''}${esc(tx(n.titulo))} →</span></button>`:''}</div>`; }
function consejo(prod, cien){ return `<div class="consejo prod">${ill('i-prod')}<p><span class="k">${T('Consejo','Tip')}</span>${prod}</p></div>${cien?`<div class="consejo sci">${ill('i-cien')}<p><span class="k">${T('Para el científico','For the scientist')}</span>${cien}</p></div>`:''}`; }
function descargar(nombre, texto, tipo){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([texto],{type:tipo})); a.download=nombre; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},500); }
const csv = filas => '﻿'+filas.map(f=>f.map(c=>{ const s=String(c??''); return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s; }).join(',')).join('\n');
const slug = ()=> (S.proyecto.nombre||(locSel()||[])[1]||'ratio_vina').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w\-]+/g,'_');
const locSel = ()=> (TERR.localidades[S.edo+S.mun]||[]).find(l=>l[0]===S.loc) || (TERR.localidades[S.edo+S.mun]||[])[0];
const munSel = ()=> (TERR.municipios[S.edo]||[]).find(m=>m[0]===S.mun);
const esCalpan = ()=> false;   // Ratio Viña no tiene caso publicado precargado

/* ================= INICIO ================= */
function telarVivo(){ const cols=['#9a6a3a','#d9a441','#5f8f3e','#2f7d8a','#7a4f9a']; let s=`<svg class="telar-vivo" viewBox="0 0 520 420" aria-hidden="true">`;
  cols.forEach((c,i)=>{ const x=70+i*95; s+=`<path class="hilo" d="M${x} 30 V390" stroke="${c}" stroke-width="9" stroke-linecap="round" style="--l:360;stroke-dasharray:360;animation-delay:${i*.15}s"/>`; });
  [110,200,290].forEach((y,j)=>{ let d=`M30 ${y}`; for(let i=0;i<5;i++){ const x=70+i*95; d+=` Q ${x-47} ${y+((i+j)%2?22:-22)} ${x} ${y}`; } d+=` Q 515 ${y+20} 500 ${y}`;
    s+=`<path class="hilo" d="${d}" stroke="var(--text)" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7" style="--l:620;stroke-dasharray:620;animation-delay:${.8+j*.4}s"/>`; });
  s+=`<g class="lanzadera"><rect x="30" y="${330}" width="70" height="22" rx="11" fill="var(--accent)"/><circle cx="65" cy="341" r="5" fill="#fff"/></g></svg>`; return s; }
function renderInicio(el){
  const nl=Object.values(TERR.localidades).reduce((s,l)=>s+l.length,0), nm=Object.values(TERR.municipios).reduce((s,l)=>s+l.length,0);
  const nVar=VID_VARIEDADES.reduce((s,g)=>s+g[1].length,0);
  const pasos=[['cultivo',T('Tu viñedo','Your vineyard'),T(`Destino (mesa, vino, pasa, jugo), variedad (${nVar} en la lista y la tuya), portainjerto, conducción, edad y densidad.`,`Destination (table, wine, raisin, juice), variety (${nVar} listed plus yours), rootstock, training, age and density.`)],
    ['region',T('Región','Region'),T(`Del país a la localidad: ${fmt(nm,0)} municipios y ${fmt(nl,0)} localidades del INEGI, con altitud y ubicación en el mapa.`,`From country to locality: ${fmt(nm,0)} municipalities and ${fmt(nl,0)} INEGI localities with altitude and map position.`)],
    ['clima',T('Clima vitícola','Viticultural climate'),T('Con las temperaturas de tu estación: grados día de Winkler, índice de Huglin y frescor nocturno.','From your station’s temperatures: Winkler degree days, Huglin index and cool night index.')],
    ['requerimientos',T('Requerimientos','Requirements'),T('Lo que necesita el viñedo en cada etapa y lo que la localidad ha innovado.','What the vineyard needs at each stage and what the locality has innovated.')],
    ['manejo',T('Manejo','Management'),T(`Un cuestionario base de ${PASOS.length} pasos y ${N_ACT_STACK()} actividades por etapas BBCH: responde cuáles practicas y agrega las tuyas.`,`A baseline questionnaire of ${PASOS.length} steps and ${N_ACT_STACK()} activities by BBCH stages: answer which you practise and add your own.`)],
    ['regeneracion',T('Regeneración','Regeneration'),T('Ocho perillas de 0 a 4 miden si el viñedo se regenera: labranza, cubierta, diversidad, raíces vivas, animales, insumos, materia orgánica y saber local.','Eight 0–4 knobs measure whether the vineyard regenerates: tillage, cover, diversity, living roots, animals, inputs, organic matter and local knowledge.')],
    ['riesgos',T('Riesgos','Risks'),T('Heladas, granizo, calor, plagas, mercado y más en una matriz de probabilidad por impacto.','Frost, hail, heat, pests, market and more in a likelihood-by-impact matrix.')],
    ['elementos',T('Elementos','Elements'),T('Viticultores, jornaleros, enólogos, compradores, insumos, equipo, recursos, conocimientos y productos.','Growers, crews, winemakers, buyers, inputs, equipment, resources, knowledge and products.')],
    ['precios',T('Precio y valor','Price and value'),T('El precio lo pone el mercado; el valor, el sistema: económico, de uso, cultural y ecológico.','Price is set by the market; value by the system: economic, use, cultural and ecological.')],
    ['formulacion',T('Formulación','Formulation'),T('Teje el modelo: agentes, interacciones, retroalimentaciones y propiedades emergentes.','Weave the model: agents, interactions, feedbacks and emergent properties.')],
    ['tablero',T('Tablero','Dashboard'),T('Red ponderada, nodos clave, comunidades, correlaciones, cladograma y calendario del viñedo.','Weighted network, key nodes, communities, correlations, cladogram and vineyard calendar.')],
    ['sostenible',T('Sostenibilidad','Sustainability'),T('Lo que cada labor suma o resta al suelo, el agua, la atmósfera, la vegetación y la fauna; los 17 ODS y la huella de carbono.','What each task adds or subtracts for soil, water, air, vegetation and fauna; the 17 SDGs and the carbon footprint.')],
    ['prospectiva',T('Prospectiva','Outlook'),T('Tres futuros a 2, 5 y 10 años con precios, calentamiento, mano de obra y adopción de tus innovaciones.','Three futures at 2, 5 and 10 years with prices, warming, labour and adoption of your innovations.')],
    ['informe',T('Informe','Report'),T('Resumen redactado, tablas, CSV, PDF y el archivo de tu viñedo para el atlas.','Written summary, tables, CSV, PDF and your vineyard’s file for the atlas.')],
    ['atlas',T('Atlas nacional','National atlas'),T('Junta los archivos de muchos viñedos: mapa, regiones de Winkler, prácticas por región y por destino, variedades y la red nacional.','Combine files from many vineyards: map, Winkler regions, practices by region and destination, varieties and the national network.')]];
  el.innerHTML = `<section class="hero">
    <div><div class="eyebrow">Ratio Complexus · ${T('lo que está tejido junto','what is woven together')}</div>
      <h1>${T('Ratio <em>Viña</em>: el saber local de la vid como <span class="acc">sistema vivo</span>','Ratio <em>Viña</em>: local grapevine knowledge as a <span class="acc">living system</span>')}</h1>
      <p class="big">${T('De la uva de mesa del desierto de Sonora a los vinos de Baja California, Coahuila, Querétaro y el Bajío, cada viñedo de México se cultiva con un saber propio: podas, riegos, variedades, personas e instituciones que interactúan y se adaptan a su clima. Ratio Viña documenta ese saber como un <b>sistema complejo adaptativo</b>, viñedo por viñedo, con un mismo cuestionario, mide su <b>regeneración</b> y su <b>riesgo</b>, y junta los resultados en un <b>atlas nacional</b>.','From the table grapes of the Sonoran desert to the wines of Baja California, Coahuila, Querétaro and the Bajío, every Mexican vineyard is grown with its own knowledge: pruning, irrigation, varieties, people and institutions that interact and adapt to their climate. Ratio Viña documents that knowledge as a <b>complex adaptive system</b>, vineyard by vineyard, with the same questionnaire, measures its <b>regeneration</b> and <b>risk</b>, and combines the results into a <b>national atlas</b>.')}</p>
      <div class="ctas"><button class="btn lg" data-ir="cultivo">${T('Documentar mi viñedo →','Document my vineyard →')}</button>
        <button class="btn ghost lg" data-entrar-ej>${T('Ver el caso publicado (Mata de Zarza)','See the published case (Mata de Zarza)')}</button><button class="btn ghost lg" data-ir="atlas">${T('Atlas nacional','National atlas')}</button><button class="btn link" data-ir="teoria">${T('Leer la teoría','Read the theory')}</button><button class="btn link" data-ver-cita>${T('¿Cómo citarla?','How to cite it?')}</button><a class="btn link" href="instructivo-productor.html" target="_blank" rel="noopener">${T('Instructivo del Productor','Producer Guide')} ↗</a><a class="btn link" href="instructivo-cientifico.html" target="_blank" rel="noopener">${T('Instructivo del Científico','Scientist Guide')} ↗</a></div>
      <div class="chips"><span class="chip">${T('Todo el cálculo ocurre en tu navegador','All calculations run in your browser')}</span><span class="chip">${T('Sin cookies ni recursos de terceros','No cookies or third-party resources')}</span><span class="chip">${T('Español e inglés','Spanish and English')}</span><span class="chip">${T('Libre (MIT)','Free (MIT)')}</span></div></div>
    <div class="art" aria-hidden="true" style="--anim:running"><div class="stage"></div>${telarVivo()}
      <svg class="big float" style="left:2%;top:2%;width:22%;height:30%"><use href="#c-uva"/></svg>
      <svg class="big float d3" style="right:2%;bottom:6%;width:22%;height:30%"><use href="#c-uva"/></svg>
      <div class="chip-n" style="left:30%;top:0">${T('Índice de clima','Climate index')}<b>${T('Winkler · Huglin · noches','Winkler · Huglin · nights')}</b></div>
      <div class="chip-n" style="right:18%;bottom:0">${T('Ciclo anual','Annual cycle')}<b>${T('Etapas BBCH','BBCH stages')}</b></div></div></section>
  ${tarjetaAnterior()}
  <div class="card como-llenar"><h3>${T('Así distingues lo tuyo de lo demás','How to tell your data from the rest')}</h3><div class="grid g3">
    <div><span class="muestra vacia">${T('Escribe aquí…','Type here…')}</span><p class="nota">${T('Campo vacío: texto gris de ayuda. La aplicación empieza en blanco; nada viene llenado.','Empty field: grey help text. The app starts blank; nothing comes filled in.')}</p></div>
    <div><span class="muestra sugerida">${T('Sugerido, sin confirmar','Suggested, not confirmed')}</span><p class="nota">${T('Perilla punteada: es una sugerencia. Cuenta solo cuando la mueves o pulsas «Aceptar».','Dashed knob: it is a suggestion. It counts only when you move it or press “Accept”.')}</p></div>
    <div><span class="muestra ejemplo">${T('Guía de llenado','Filling guide')}</span><p class="nota">${T('Ventana sepia: cómo llenar cada bloque. Es solo de consulta y no cambia tus campos.','Sepia window: how to fill in each block. For reference only; it does not change your fields.')}</p></div></div>
    <p class="nota">${T('Arriba, la barra «Llenado por ti» y las marcas del menú (○ pendiente, ◐ en proceso, ● completo) cuentan solo lo que tú llenaste.','Above, the “Filled in by you” bar and the menu marks (○ pending, ◐ in progress, ● complete) count only what you filled in.')}</p></div>
  <div class="card cita-card"><h2>${T('¿Cómo citarla?','How to cite it?')}</h2>
   <p class="nota">${T(`Si usas ${CONFIG.app} en un artículo, una tesis, un informe o una clase, cítala así (APA, 7.ª ed.):`,`If you use ${CONFIG.app} in a paper, thesis, report or class, cite it as follows (APA 7th ed.):`)}</p>
   <p id="citaTxt" class="cita-apa">${citaAPA()}</p>
   <div class="row" style="gap:10px;flex-wrap:wrap;align-items:center"><button class="btn ghost sm" data-copiar-cita>⧉ ${T('Copiar referencia','Copy reference')}</button>${CONFIG.doi?`<a class="btn link sm" href="https://doi.org/${CONFIG.doi}" target="_blank" rel="noopener">DOI ${CONFIG.doi} ↗</a>`:''}</div></div><div class="qr-app"><span class="qr-img">${CONFIG.qr}</span><span><b>${CONFIG.url.replace(/^https:\/\//,'').replace(/\/$/,'').replace('.io/','.io/<wbr>')}</b><br>${T('Escanea el código para abrirla en tu celular o compartirla.','Scan the code to open it on your phone or share it.')}</span></div></div>
  <div class="stats">
    <div class="stat"><div class="v">${nVar}</div><div class="l">${T('variedades en la lista (y la tuya)','varieties listed (plus yours)')}</div></div>
    <div class="stat"><div class="v">${fmt(nl,0)}</div><div class="l">${T('localidades de México','Mexican localities')}</div></div>
    <div class="stat"><div class="v">${PASOS.length} · ${N_ACT_STACK()}</div><div class="l">${T('pasos y actividades del cuestionario base','baseline questionnaire steps and activities')}</div></div>
    <div class="stat"><div class="v">${ELEM.length}</div><div class="l">${T('elementos del sistema en 10 categorías','system elements in 10 categories')}</div></div>
    <div class="stat"><div class="v">3</div><div class="l">${T('índices de clima vitícola','viticultural climate indices')}</div></div><div class="stat"><div class="v">17</div><div class="l">${T('ODS evaluados','SDGs assessed')}</div></div></div>
  <h2 class="section-t">${T('Una herramienta, dos miradas','One tool, two views')}</h2>
  <div class="vistas"><div class="vista ${MODO==='prod'?'on':''}"><h3>${ill('i-prod')}${T('Vista productor','Producer view')}</h3><ul><li>${T('Tu cultivo, tu localidad y tus pasos, en lenguaje sencillo','Your crop, locality and steps in plain language')}</li><li>${T('Qué actividades suman y cuáles restan','Which activities add and which subtract')}</li><li>${T('Cuánto vale cada recurso para tu sistema','What each resource is worth to your system')}</li></ul>${MODO==='prod'?'':`<button class="btn sm" data-vista="prod">${T('Usar vista productor','Use producer view')}</button>`}</div>
    <div class="vista ${MODO==='cien'?'on':''}"><h3>${ill('i-cien')}${T('Vista científica','Scientist view')}</h3><ul><li>${T('Estadística de redes: centralidades, modularidad, mundo pequeño','Network statistics: centralities, modularity, small world')}</li><li>${T('Correlaciones φ, matrices y fórmulas','φ correlations, matrices and formulas')}</li><li>${T('Validación externa del motor y referencias','External engine validation and references')}</li></ul>${MODO==='cien'?'':`<button class="btn sm" data-vista="cien">${T('Usar vista científica','Use scientist view')}</button>`}</div></div>
  <h2 class="section-t">${T('Catorce bloques y un atlas nacional','Fourteen blocks and a national atlas')}</h2>
  <div class="inc">${pasos.map((p,i)=>`<button data-ir="${p[0]}"><span class="num">${i+1}</span><h3>${p[1]}</h3><p>${p[2]}</p></button>`).join('')}</div>
  <div class="card"><h2>${T('Rigor: dato publicado o lectura','Rigour: published data or reading')}</h2>
   <p>${marcaDato()} ${T('Cifras y fórmulas tomadas de una fuente citada (INEGI, IPCC, Amerine y Winkler, Huglin, Tonietto y Carbonneau, Sarandón).','Figures and formulas from a cited source (INEGI, IPCC, Amerine and Winkler, Huglin, Tonietto and Carbonneau, Sarandón).')}</p>
   <p>${marcaInterp()} ${T('Relaciones y perfiles que propone Ratio Viña para leer los datos; todos son editables.','Links and profiles proposed by Ratio Viña to read the data; all are editable.')}</p>
   <p class="nota">${T('Lo que no está documentado aparece como «sin dato». Ratio Viña no inventa valores. Todavía no existe un Stack publicado de la vid: el cuestionario base es una lectura de Ratio Viña que cada viñedo responde y amplía.','What is undocumented appears as “no data”. Ratio Viña does not invent values. There is no published grapevine Stack yet: the baseline questionnaire is a Ratio Viña reading that each vineyard answers and extends.')}</p></div>
  ${siguiente('inicio')}`; }

/* ================= BLOQUE 1 · VID ================= */
function chipsVid(grupos, sel, attr, col){ return `<div class="razas">${grupos.map(g=>`<div><b>${esc(tx(g[0]))}</b> <span class="muted">(${g[1].length})</span><div class="elchips">${g[1].map(r=>`<button type="button" class="elchip ${sel===r?'on':''}" style="--ec:${col}" data-${attr}="${esc(r)}">${esc(r)}</button>`).join('')}</div></div>`).join('')}</div>`; }
function renderCultivo(el){ const c=cultivoSel(), dest=VID_DESTINOS.find(d=>d.id===S.vidDestino);
  el.innerHTML = `${cabecera('cultivo',T('Ratio Viña documenta el conocimiento local de un solo cultivo, la vid, en todo México. Indica para qué cultivas la uva, qué variedad y qué portainjerto usas, cómo conduces la planta y cómo está organizado tu viñedo.','Ratio Viña documents local knowledge of a single crop, the grapevine, across Mexico. State what you grow grapes for, which variety and rootstock you use, how you train the vine and how your vineyard is organised.'))}
  ${consejo(T('Si no conoces el nombre exacto de la variedad o del portainjerto, escríbelo como lo llaman en tu localidad. Las listas son orientativas: siempre puedes escribir el tuyo.','If you do not know the exact name of the variety or rootstock, write it as it is called locally. The lists are only a guide: you can always type your own.'),
    T('Las listas de variedades, portainjertos y sistemas de conducción son una lectura de Ratio Viña de lo que se cultiva en México; para variedades registradas el referente oficial es el Catálogo Nacional de Variedades Vegetales del SNICS.','Variety, rootstock and training lists are a Ratio Viña reading of what is grown in Mexico; for registered varieties the official reference is the SNICS National Catalogue of Plant Varieties.'))}
  <div class="card aparece" style="border-top:4px solid ${dest?dest.col:'#6b3fa0'}"><div class="row between"><h3 style="margin:0">${ill('c-uva','','width:34px;height:40px;vertical-align:middle;margin-right:6px')}${T('¿Para qué cultivas la uva?','What do you grow grapes for?')}</h3></div>
    <div class="tipo-tabs" style="margin:10px 0 0;flex-wrap:wrap">${VID_DESTINOS.map(d=>`<button data-vdest="${d.id}" class="${S.vidDestino===d.id?'on':''}">${esc(tx(d.n))}</button>`).join('')}</div>
    ${S.vidDestino?'':`<p class="nota"><span class="sin-llenar">${T('Sin elegir','Not chosen')}</span> ${T('El destino orienta las preguntas del Bloque 5: algunas labores son propias de la uva de mesa (anillado, giberelinas) y otras de la uva para vino (riego deficitario).','The destination guides Block 5 questions: some tasks belong to table grapes (girdling, gibberellins) and others to wine grapes (deficit irrigation).')}</p>`}</div>
  <div class="grid g2"><div class="card"><h3>${T('Variedad','Variety')}</h3>
     <label class="f"><span>${T('Variedad principal','Main variety')}</span><input id="vVar" list="vVars" value="${esc(S.vidVar)}" placeholder="${T('elige abajo o escribe la tuya','pick below or type your own')}"><datalist id="vVars">${VID_VARIEDADES.flatMap(g=>g[1]).map(r=>`<option value="${esc(r)}">`).join('')}</datalist></label>
     ${chipsVid(VID_VARIEDADES, S.vidVar, 'vvar', '#6b3fa0')}<div class="fuente">${marcaInterp()} ${T('Lista orientativa; verifica el nombre con tu vivero o asociación.','Indicative list; check the name with your nursery or association.')}</div></div>
   <div class="card"><h3>${T('Portainjerto y conducción','Rootstock and training')}</h3>
     <label class="f"><span>${T('Portainjerto','Rootstock')}</span><input id="vPie" list="vPies" value="${esc(S.vidPie)}" placeholder="${T('elige abajo o escribe el tuyo','pick below or type your own')}"><datalist id="vPies">${VID_PIES.flatMap(g=>g[1]).map(r=>`<option value="${esc(r)}">`).join('')}</datalist></label>
     ${chipsVid(VID_PIES, S.vidPie, 'vpie', '#7d5a2c')}
     <label class="f" style="margin-top:10px"><span>${T('Sistema de conducción','Training system')}</span><select id="vCond" class="${S.vidCond?'':'vacio'}"><option value="" ${S.vidCond?'':'selected'} disabled>${T('— Elige el sistema de conducción —','— Choose the training system —')}</option>${VID_CONDUCCION.map(x=>`<option value="${x.id}" ${S.vidCond===x.id?'selected':''}>${esc(tx(x.n))}</option>`).join('')}</select></label>
     <div class="grid g2"><label class="f"><span>${T('Edad del viñedo (años)','Vineyard age (years)')}</span>${S.vidPlant?`<input type="text" disabled value="${fmt(edadVinedo(),1)} ${T('años (por la fecha de plantación)','years (from planting date)')}">`:`<input type="number" id="vEdad" min="0" step="1" value="${esc(S.vidEdad)}" placeholder="${T('p. ej., 12, o pon la fecha de plantación abajo','e.g., 12, or set the planting date below')}">`}</label>
      <label class="f"><span>${T('Plantas por hectárea','Vines per hectare')}</span><input type="number" id="vDens" min="0" step="10" value="${esc(S.vidDens)}" placeholder="${T('p. ej., 2,200','e.g., 2,200')}"></label></div></div></div>
  <div class="card aparece"><h3>${T('Historial del viñedo','Vineyard history')}</h3>
    <p class="nota">${T('La historia de cada viñedo ayuda a entender su presente: cuándo y con qué se plantó, y cuándo y cómo se ha podado. Anota cada poda con su fecha; en climas sin invierno marcado puede haber dos podas y dos cosechas al año.','Each vineyard’s history explains its present: when and with what it was planted, and when and how it has been pruned. Record each pruning with its date; in climates without a marked winter there may be two prunings and two crops a year.')}</p>
    <div class="grid g3"><div class="f plantacion" style="grid-column:1/-1"><span>${T('Fecha de plantación','Planting date')}: <b id="vPlantTxt">${S.vidPlant?fechaLarga(S.vidPlant):T('sin capturar','not entered')}</b></span>
      <div class="row" style="gap:10px;align-items:center"><input type="range" min="0" max="364" id="vPlantD" value="${S.vidPlant?diaDelAno(S.vidPlant):45}" class="${S.vidPlant?'':'fantasma'}" style="flex:1" aria-label="${T('Día del año de la plantación','Day of the year of planting')}">
      <input type="number" id="vPlantA" min="1900" max="2100" step="1" style="width:90px" value="${S.vidPlant?S.vidPlant.slice(0,4):''}" placeholder="${T('año','year')}" aria-label="${T('Año de plantación','Planting year')}"></div>
      <small class="muted">${T('Mueve la perilla por los 365 días del año y escribe el año.','Move the knob through the 365 days of the year and type the year.')}</small></div>
     <label class="f"><span>${T('Material de plantación','Planting material')}</span><select id="vMat" class="${S.vidMat?'':'vacio'}"><option value="" ${S.vidMat?'':'selected'} disabled>${T('— Elige el material —','— Choose the material —')}</option>${VID_MATERIAL.map(x=>`<option value="${x.id}" ${S.vidMat===x.id?'selected':''}>${esc(tx(x.n))}</option>`).join('')}</select></label>
     <div class="kpi" style="margin:0"><div class="l">${T('Edad','Age')}</div><div class="v">${edadVinedo()==null?'—':fmt(edadVinedo(),1)}</div><div class="s">${T('años','years')}</div></div></div>
    <h4 style="margin:12px 0 6px">${T('Registro de podas','Pruning record')} <span class="muted" style="font-weight:400">(${(S.podas||[]).length})</span></h4>
    ${(S.podas||[]).length?`<div class="tbl-c"><table class="tbl"><thead><tr><th>${T('Fecha','Date')}</th><th>${T('Tipo','Type')}</th><th>${T('Nota','Note')}</th><th></th></tr></thead><tbody>${[...S.podas].map((x,i)=>({...x,i})).sort((a,b)=>b.f.localeCompare(a.f)).map(x=>`<tr><td>${esc(x.f)}</td><td>${esc(tx((TIPOS_PODA.find(t=>t.id===x.t)||{n:E(x.t,x.t)}).n))}</td><td>${esc(x.nota||'')}</td><td><button class="btn sm ghost" data-qpoda="${x.i}" aria-label="${T('Quitar','Remove')}">×</button></td></tr>`).join('')}</tbody></table></div>`:`<p class="sindato">${T('Aún no hay podas registradas.','No prunings recorded yet.')}</p>`}
    <div class="nueva"><div class="grid g3"><label class="f"><span>${T('Fecha de la poda','Pruning date')}</span><input type="date" id="pzF"></label>
     <label class="f"><span>${T('Tipo de poda','Pruning type')}</span><select id="pzT">${TIPOS_PODA.map(t=>`<option value="${t.id}">${esc(tx(t.n))}</option>`).join('')}</select></label>
     <label class="f"><span>${T('Nota (opcional)','Note (optional)')}</span><input id="pzN" maxlength="120" placeholder="${T('p. ej., a dos yemas, con cuadrilla de 4','e.g., to two buds, crew of 4')}"></label></div>
     <button class="btn sm" id="pzAdd">+ ${T('Agregar poda','Add pruning')}</button></div></div>
  <div class="grid g2"><div class="card"><h3>${T('Sistema de producción','Production system')}${ayuda('sistema')}</h3>
    <div class="opts">${sistemasTodos().map(s=>`<label class="opt ${S.sistema===s.id?'sel':''} ${s.usuario?'sis-usuario':''}"><input type="radio" name="sis" value="${esc(s.id)}" ${S.sistema===s.id?'checked':''}><b>${esc(tx(s.n))}</b><small>${s.usuario?(s.d?esc(s.d):T('agregado por ti','added by you')):T('elígelo si así trabajas tu viñedo','choose it if this is how you work your vineyard')}</small>${s.usuario?`<button type="button" class="sis-quitar" data-sisq="${esc(s.id)}" title="${T('Quitar este sistema','Remove this system')}" aria-label="${T('Quitar','Remove')}">✕</button>`:''}</label>`).join('')}</div>
    <details class="sis-nuevo"><summary>＋ ${T('¿No está tu sistema? Agrégalo','Your system is missing? Add it')}</summary>
     <label class="f"><span>${T('Nombre del sistema de producción','Production system name')}</span><input id="sisN" maxlength="90" placeholder="${T('p. ej., Viñedo biodinámico, Viñedo en ladera con terrazas','e.g., Biodynamic vineyard, Terraced hillside vineyard')}"></label>
     <label class="f"><span>${T('Descripción breve (opcional)','Short description (optional)')}</span><input id="sisD" maxlength="160" placeholder="${T('cómo se organiza, qué se combina','how it is organised, what is combined')}"></label>
     <button type="button" class="btn sm" id="sisAdd">${T('Agregar y elegir','Add and select')}</button></details></div>
   <div class="card"><h3>${T('Unidad de producción','Production unit')}</h3>
    <label class="f"><span>${T('Tipo de unidad','Unit type')}</span><select id="tUP" class="${S.tipoUP===''||S.tipoUP==null?'vacio':''}"><option value="" ${S.tipoUP===''||S.tipoUP==null?'selected':''} disabled>${T('— Elige el tipo de unidad —','— Choose the unit type —')}</option>${TIPOS_UP.map((t,i)=>`<option value="${i}" ${S.tipoUP!==''&&S.tipoUP!=null&&+S.tipoUP===i?'selected':''}>${esc(tx(t))}</option>`).join('')}<option value="-1" ${S.tipoUP!==''&&+S.tipoUP===-1?'selected':''}>${T('Otro (escríbelo)…','Other (type it)…')}</option></select></label>
    ${+S.tipoUP===-1?`<label class="f"><span>${T('¿Qué tipo de unidad es?','What kind of unit is it?')}</span><input id="upOtro" maxlength="90" value="${esc(S.upOtro||'')}" placeholder="${T('p. ej., cooperativa, viñedo escolar','e.g., cooperative, school vineyard')}"></label>`:''}
    <label class="f"><span>${T('Superficie (ha)','Area (ha)')}${ayuda('superficie')}</span><input type="number" id="sup" min="0" step="0.1" value="${S.superficie===''||S.superficie==null?'':S.superficie}" placeholder="${T('p. ej., 2.5','e.g., 2.5')}"></label>
    <label class="f"><span>${T('Nombre del viñedo o del proyecto','Vineyard or project name')}</span><input id="pNom" value="${esc(S.proyecto.nombre)}" placeholder="${T('p. ej., Viñedo La Loma','e.g., La Loma vineyard')}"></label>
    <label class="f"><span>${T('Viticultor o viticultora','Grower')}</span><input id="pProd" value="${esc(S.proyecto.productor)}"></label>
    <div class="kpis" style="margin-top:10px"><div class="kpi"><div class="l">${T('Cultivo','Crop')}</div><div class="v" style="font-size:20px">${esc(tx(c.n))}</div><div class="s"><i>${esc(tx(c.sci))}</i></div></div>
    <div class="kpi"><div class="l">${T('Cuestionario base','Baseline questionnaire')}</div><div class="v">${PASOS.length} · ${N_ACT_STACK()}</div><div class="s">${T('pasos y actividades del Bloque 5','Block 5 steps and activities')}</div></div></div></div></div>
  ${siguiente('cultivo')}`;
  $$('[data-vdest]',el).forEach(b=>b.onclick=()=>{ S.vidDestino = S.vidDestino===b.dataset.vdest ? '' : b.dataset.vdest; guardar(); render(); });
  $$('[data-vvar]',el).forEach(b=>b.onclick=()=>{ S.vidVar = S.vidVar===b.dataset.vvar ? '' : b.dataset.vvar; guardar(); render(); });
  $$('[data-vpie]',el).forEach(b=>b.onclick=()=>{ S.vidPie = S.vidPie===b.dataset.vpie ? '' : b.dataset.vpie; guardar(); render(); });
  $('#vVar',el).onchange=e=>{ S.vidVar=e.target.value.trim(); guardar(); render(); };
  $('#vPie',el).onchange=e=>{ S.vidPie=e.target.value.trim(); guardar(); render(); };
  $('#vCond',el).onchange=e=>{ S.vidCond=e.target.value; guardar(); render(); };
  if($('#vEdad',el)) $('#vEdad',el).onchange=e=>{ S.vidEdad=e.target.value; guardar(); render(); };
  const pD=$('#vPlantD',el), pA=$('#vPlantA',el), fijaPlant=()=>{ const a=+pA.value||new Date().getFullYear(); S.vidPlant=isoDiaAno(a,+pD.value); guardar(); render(); };
  pD.oninput=()=>{ $('#vPlantTxt',el).textContent=fechaLarga(isoDiaAno(+pA.value||new Date().getFullYear(),+pD.value)); }; pD.onchange=fijaPlant;
  pA.onchange=()=>{ if(pA.value) fijaPlant(); };
  $('#vMat',el).onchange=e=>{ S.vidMat=e.target.value; guardar(); render(); };
  $('#pzAdd',el).onclick=()=>{ const f=$('#pzF',el).value; if(!f) return toast(T('Pon la fecha de la poda','Set the pruning date')); S.podas=S.podas||[]; S.podas.push({f, t:$('#pzT',el).value, nota:$('#pzN',el).value.trim()}); guardar(); render(); toast(T('Poda registrada','Pruning recorded')); };
  $$('[data-qpoda]',el).forEach(b=>b.onclick=()=>{ S.podas.splice(+b.dataset.qpoda,1); guardar(); render(); });
  $('#vDens',el).onchange=e=>{ S.vidDens=e.target.value; guardar(); };
  $$('input[name=sis]',el).forEach(r=>r.onchange=()=>{ S.sistema=r.value; guardar(); render(); });
  const sisAdd=$('#sisAdd',el); if(sisAdd) sisAdd.onclick=()=>{ const n=$('#sisN',el).value.trim(), d=$('#sisD',el).value.trim(); if(!n){ toast(T('Escribe el nombre del sistema','Type the system name')); $('#sisN',el).focus(); return; }
    S.sisExtra=S.sisExtra||[]; if(sistemasTodos().some(s=>tx(s.n).toLowerCase()===n.toLowerCase())){ toast(T('Ese sistema ya está en la lista','That system is already listed')); return; }
    const id='u'+Date.now().toString(36); S.sisExtra.push({id, n, d}); S.sistema=id; guardar(); render(); toast(T('Sistema agregado: ','System added: ')+n); };
  $$('[data-sisq]',el).forEach(b=>b.onclick=e=>{ e.preventDefault(); e.stopPropagation(); const s=(S.sisExtra||[]).find(x=>x.id===b.dataset.sisq); if(!s||!confirm(T(`¿Quitar «${s.n}» de la lista?`,`Remove “${s.n}” from the list?`))) return;
    S.sisExtra=S.sisExtra.filter(x=>x.id!==s.id); if(S.sistema===s.id) S.sistema=''; guardar(); render(); });
  $('#tUP',el).onchange=e=>{ S.tipoUP=e.target.value===''?'':+e.target.value; guardar(); render(); };
  if($('#upOtro',el)) $('#upOtro',el).onchange=e=>{ S.upOtro=e.target.value.trim(); guardar(); };
  $('#sup',el).onchange=e=>{ S.superficie=e.target.value===''?'':(+e.target.value||0); guardar(); render(); };
  $('#pNom',el).onchange=e=>{ S.proyecto.nombre=e.target.value; guardar(); actualizarPill(); };
  $('#pProd',el).onchange=e=>{ S.proyecto.productor=e.target.value; guardar(); }; }

/* ================= BLOQUE 2 · REGIÓN ================= */
function renderRegion(el){ if(!S.edo) return renderRegionVacia(el); const e=edoDe(S.edo), muns=TERR.municipios[S.edo]||[], m=munSel(), locs=TERR.localidades[S.edo+S.mun]||[], l=locSel();
  const pobE=muns.reduce((s,x)=>s+(x[2]||0),0);
  el.innerHTML = `${cabecera('region',T('Cada productor cultiva a su manera y cada lugar tiene su propio clima, altitud y gente. Elige tu estado en el mapa y baja hasta el municipio y la localidad: Ratio Viña ubica tu punto y trae los datos oficiales del INEGI.','Every farmer works their own way and every place has its own climate, altitude and people. Pick your state on the map and go down to municipality and locality: Ratio Viña places your point and loads official INEGI data.'))}
  <div class="card"><div class="mapa-wrap"><div>${mapaTelar(S.edo, l?[l[4],l[5]]:null)}
      <div class="chips" style="margin-top:8px">${Object.entries(REG_BX).map(([k,r])=>`<span class="chip rchip ${k===e[3]?'on':''}" style="--rc:${r.col}"><i></i>${esc(tx(r.n))}</span>`).join('')}</div>
      <p class="tiny muted">${T('Contornos: Natural Earth (dominio público). Regiones: Banco de México. El punto de la localidad usa sus coordenadas del INEGI (posición aproximada sobre contornos simplificados).','Outlines: Natural Earth (public domain). Regions: Banco de México. The locality dot uses its INEGI coordinates (approximate position on simplified outlines).')}</p></div>
    <div class="rinfo"><div class="eyebrow">${esc(tx(REG_BX[e[3]].n))}</div><h2 style="margin:4px 0 8px">${esc(e[1])}</h2>
      <label class="f"><span>${T('Estado','State')}</span><select id="zEst">${TERR.estados.map(x=>`<option value="${x[0]}" ${x[0]===S.edo?'selected':''}>${esc(x[1])}</option>`).join('')}</select></label>
      <label class="f"><span>${T('Municipio','Municipality')}</span><select id="zMun" class="${S.mun?'':'vacio'}"><option value="" ${S.mun?'':'selected'} disabled>${T('— Elige el municipio —','— Choose the municipality —')}</option>${muns.map(x=>`<option value="${x[0]}" ${x[0]===S.mun?'selected':''}>${esc(x[1])}</option>`).join('')}</select></label>
      <label class="f"><span>${T('Localidad','Locality')}${ayuda('localidad')}</span><select id="zLoc" class="${S.loc?'':'vacio'}" ${S.mun?'':'disabled'}><option value="" ${S.loc?'':'selected'} disabled>${S.mun?T('— Elige la localidad —','— Choose the locality —'):T('— primero el municipio —','— municipality first —')}</option>${locs.map(x=>`<option value="${x[0]}" ${x[0]===S.loc?'selected':''}>${esc(x[1])}${x[2]!=null?' · '+fmt(x[2],0)+' hab.':''}</option>`).join('')}</select></label>
      ${LUGARES.length?`<div class="lugares"><span class="nota">${T('Lugares de trabajo','Work places')}:</span>`:''}${LUGARES.map((p,i)=>`<button class="chip ${S.edo===p.edo&&S.mun===p.mun&&S.loc===p.loc?'on':''}" data-lugar="${i}">📍 ${esc(tx(p.n))}</button>`).join('')}${LUGARES.length?'</div>':''}
      <div class="ruta"><span>${T('México','Mexico')}</span><i>›</i><span>${esc(tx(REG_BX[e[3]].n))}</span><i>›</i><span>${esc(e[1])}</span><i>›</i><span>${esc(m?m[1]:'')}</span><i>›</i><span>${esc(l?l[1]:'')}</span></div></div></div></div>
  <div class="kpis">
   <div class="kpi"><div class="l">${T('Localidad: población 2020','Locality: population 2020')}</div><div class="v">${l&&l[2]!=null?fmt(l[2],0):'—'}</div><div class="s">${l?(l[6]?T('urbana','urban'):T('rural','rural')):''}</div></div>
   <div class="kpi"><div class="l">${T('Altitud','Altitude')}</div><div class="v">${l&&l[3]!=null?fmt(l[3],0)+' m':'—'}</div><div class="s">${l&&l[4]!=null?fmt(l[5],3)+'° N, '+fmt(-l[4],3)+'° O':''}</div></div>
   <div class="kpi"><div class="l">${T('Municipio: población 2020','Municipality: population 2020')}</div><div class="v">${m&&m[2]?fmt(m[2],0):'—'}</div><div class="s">${m&&m[3]?fmt(m[3],0)+' '+T('viviendas habitadas','inhabited dwellings'):''}</div></div>
   <div class="kpi"><div class="l">${T('Estado','State')}</div><div class="v">${fmt(e[4],0)}</div><div class="s">${muns.length} ${T('municipios','municipalities')} · ${fmt(pobE,0)} ${T('hab.','people')}</div></div></div>
  ${fuenteInegi()}
  ${siguiente('region')}`;
  enlazarRegion(el);
  $('#zMun',el).onchange=ev=>{ S.mun=ev.target.value; S.loc=''; guardar(); render(); };
  $('#zLoc',el).onchange=ev=>{ S.loc=ev.target.value; guardar(); render(); };
}
/* Estado y lugares de trabajo: comunes a la vista vacía y a la llena */
function enlazarRegion(el){ const ponEdo=(c)=>{ S.edo=c; S.mun=''; S.loc=''; guardar(); render(); };
  $$('[data-edo]',el).forEach(p=>p.onclick=()=>ponEdo(p.dataset.edo));
  $('#zEst',el).onchange=ev=>ponEdo(ev.target.value);
  $$('[data-lugar]',el).forEach(b=>b.onclick=()=>{ const p=LUGARES[+b.dataset.lugar]; S.edo=p.edo; S.mun=p.mun; S.loc=p.loc; guardar(); render(); toast(tx(p.n)); }); }
function renderRegionVacia(el){
  el.innerHTML = `${cabecera('region',T('Cada lugar tiene su propio clima, altitud y gente. Toca tu estado en el mapa o elígelo de la lista; luego baja hasta el municipio y la localidad.','Every place has its own climate, altitude and people. Tap your state on the map or pick it from the list; then go down to municipality and locality.'))}
  <div class="card"><div class="mapa-wrap"><div>${mapaTelar('', null)}
      <div class="chips" style="margin-top:8px">${Object.entries(REG_BX).map(([k,r])=>`<span class="chip rchip" style="--rc:${r.col}"><i></i>${esc(tx(r.n))}</span>`).join('')}</div></div>
    <div class="rinfo"><div class="eyebrow"><span class="sin-llenar">${T('Sin elegir','Not chosen')}</span></div><h2 style="margin:4px 0 8px">${T('¿Dónde está tu unidad?','Where is your farm?')}</h2>
      <label class="f"><span>${T('Estado','State')}</span><select id="zEst" class="vacio"><option value="" selected disabled>${T('— Elige el estado —','— Choose the state —')}</option>${TERR.estados.map(x=>`<option value="${x[0]}">${esc(x[1])}</option>`).join('')}</select></label>
      <label class="f"><span>${T('Municipio','Municipality')}</span><select disabled class="vacio"><option>${T('— primero el estado —','— state first —')}</option></select></label>
      <label class="f"><span>${T('Localidad','Locality')}</span><select disabled class="vacio"><option>${T('— primero el municipio —','— municipality first —')}</option></select></label>
      ${LUGARES.length?`<div class="lugares"><span class="nota">${T('Lugares de trabajo','Work places')}:</span>`:''}${LUGARES.map((p,i)=>`<button class="chip" data-lugar="${i}">📍 ${esc(tx(p.n))}</button>`).join('')}${LUGARES.length?'</div>':''}</div></div></div>
  ${fuenteInegi()}${siguiente('region')}`;
  enlazarRegion(el); }

/* ================= BLOQUE 3 · REQUERIMIENTOS ================= */
const REQ_TRAD = [   // lectura de Ratio Viña a partir de Winkler et al. (1974), Keller (2020) y Mojica-Zárate et al. (2026); pasos del cuestionario base
  {b:'establecimiento', t:E('Material vegetal sano y bien enraizado, plantado en suelo húmedo y protegido durante el primer año','Healthy, well-rooted planting material, planted in moist soil and protected during the first year'), pasos:[1,2,3,4,5]},
  {b:'reposo', t:E('Poda adecuada a la variedad y estructura de conducción en buen estado','Pruning suited to the variety and a sound training structure'), pasos:[7,9,10]},
  {b:'reposo', t:E('Reposo invernal suficiente o un manejo que rompa la dormancia donde faltan horas frío','Enough winter rest, or management to break dormancy where chilling is short'), pasos:[11]},
  {b:'brotacion', t:E('Suelo con buen drenaje y agua de riego suficiente y oportuna, con su análisis','Well-drained soil and enough, timely irrigation water, with its analysis'), pasos:[8,13,24,33]},
  {b:'brotacion', t:E('Sanidad: prevención de cenicilla, mildiu y pudriciones con monitoreo','Plant health: preventing powdery mildew, downy mildew and rots by scouting'), pasos:[17,18,25,34]},
  {b:'fruto', t:E('Equilibrio entre follaje y racimos: desbrote, raleo y manejo del dosel','Balance between foliage and clusters: shoot thinning, thinning and canopy management'), pasos:[14,15,21,23]},
  {b:'cosecha', t:E('Cosecha en la madurez que pide el destino y salida al mercado sin pérdidas','Harvest at the ripeness the destination requires and getting to market without losses'), pasos:[27,28,29,30,31]}
];
function renderReq(el){ S.reqEst=S.reqEst||{};
  el.innerHTML = `${cabecera('requerimientos',T('Lo que el viñedo necesita para prosperar en cada etapa del año. Los seis requerimientos base son una lectura de Ratio Viña de la viticultura general; abajo puedes registrar los que tu localidad ha innovado.','What the vineyard needs to thrive at each stage of the year. The six baseline requirements are a Ratio Viña reading of general viticulture; below you can record those your locality has innovated.'))}
  ${conStack()?`<div class="card"><div class="row between"><h3 style="margin:0">${T('Requerimientos técnicos tradicionales','Traditional technical requirements')}${ayuda('req')}</h3>${marcaInterp()}</div>
   <p class="nota">${T('Evalúa si tu viñedo cumple cada requerimiento. Los números son los pasos del cuestionario base que lo atienden.','Rate whether your vineyard meets each requirement. Numbers are the baseline questionnaire steps addressing it.')}</p>
   <div class="reqs">${REQ_TRAD.map((r,i)=>{ const b=B5.find(x=>x.id===r.b), v=S.reqEst[i]||'';
     return `<div class="req aparece" style="--rc:${b.col};animation-delay:${i*60}ms"><div class="rb">${i+1}</div><div><h4>${esc(tx(b))}${b.interp?' '+marcaInterp():''}</h4><div>${esc(tx(r.t))}</div><div class="nota">${esc(T(b.d[0],b.d[1]))}</div><div class="pasosr">${r.pasos.map(n=>`<span title="${esc(tx(E(PASOS[n-1].es,PASOS[n-1].en)))}">${n}</span>`).join('')}</div></div>
       <div class="semaf" role="group">${[['ok',T('Sí','Yes')],['warn',T('Parcial','Partly')],['bad',T('No','No')]].map(([k,t])=>`<button class="${k} ${v===k?'on':''}" data-req="${i}" data-v="${k}">${t}</button>`).join('')}</div></div>`; }).join('')}</div>${fuenteArt()}</div>`
   :`<div class="alert info"><p>${T('Este cultivo o especie aún no tiene un Stack documentado. Registra sus requerimientos abajo; el ejemplo del maíz criollo muestra cómo se organizan en cinco reglas.','This crop or species has no documented Stack yet. Record its requirements below; the landrace-maize example shows how they are organised in five rules.')}</p></div>`}
  <div class="card"><h3>${T('Requerimientos innovados en la localidad','Requirements innovated in the locality')}${ayuda('reqInn')}</h3>
   ${S.reqInn.length?`<div class="tbl-c"><table class="tbl"><thead><tr><th>${T('Requerimiento','Requirement')}</th><th>${T('Regla','Rule')}</th><th>${T('Fuente','Source')}</th><th></th></tr></thead><tbody>${S.reqInn.map((r,i)=>`<tr><td>${esc(r.t)}${r.d?`<div class="nota">${esc(r.d)}</div>`:''}</td><td>${esc(tx(B5.find(b=>b.id===r.b)||{es:'—'}))}</td><td>${esc(r.fuente||'—')}</td><td><button class="btn sm ghost" data-qreq="${i}">×</button></td></tr>`).join('')}</tbody></table></div>`:`<p class="sindato">${T('Aún no hay requerimientos innovados registrados.','No innovated requirements recorded yet.')}</p>`}
   <div class="nueva"><div class="grid g2"><label class="f"><span>${T('Requerimiento innovado','Innovated requirement')}</span><input id="rT" placeholder="${T('p. ej., Cobertura con abono verde antes de la siembra','e.g., Green-manure cover before sowing')}"></label>
     <label class="f"><span>${T('Regla a la que pertenece','Rule it belongs to')}</span><select id="rB">${B5.map(b=>`<option value="${b.id}">${esc(tx(b))}</option>`).join('')}</select></label>
     <label class="f"><span>${T('Descripción o justificación','Description or rationale')}</span><input id="rD"></label>
     <label class="f"><span>${T('Fuente (productor, asesor, investigación, programa)','Source (farmer, adviser, research, programme)')}</span><input id="rF"></label></div>
     <button class="btn sm" id="rAdd">+ ${T('Agregar requerimiento','Add requirement')}</button></div></div>
  ${siguiente('requerimientos')}`;
  $$('[data-req]',el).forEach(b=>b.onclick=()=>{ S.reqEst[b.dataset.req]= S.reqEst[b.dataset.req]===b.dataset.v?'':b.dataset.v; guardar(); render(); });
  $('#rAdd',el).onclick=()=>{ const t=$('#rT',el).value.trim(); if(!t) return toast(T('Escribe el requerimiento','Write the requirement')); S.reqInn.push({t, b:$('#rB',el).value, d:$('#rD',el).value.trim(), fuente:$('#rF',el).value.trim()}); guardar(); render(); };
  $$('[data-qreq]',el).forEach(b=>b.onclick=()=>{ S.reqInn.splice(+b.dataset.qreq,1); guardar(); render(); }); }
