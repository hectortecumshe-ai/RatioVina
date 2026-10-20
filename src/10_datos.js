"use strict";
/* =====================================================================
   1. DATOS BASE · CONFIGURACIÓN, IDIOMA, ESTADO Y CATÁLOGO
   Ratio Viña — Ratio Complexus («lo que está tejido junto»)
   ===================================================================== */
const CONFIG = {
  app:'Ratio Viña', version:'0.2.0', anio:2026, doi:'10.5281/zenodo.23439305',
  repo:'https://github.com/hectortecumshe-ai/RatioVina',
  autores:'Héctor Tecumshé Mojica-Zárate · Oscar Díaz-José · Edgar Arturo Sánchez-Moreno · Sergio Alejo-Bello · Luis Ángel Barrera-Guzmán',
  citaAutores:{es:'Mojica-Zárate, H. T., Díaz-José, O., Sánchez-Moreno, E. A., Alejo-Bello, S., y Barrera-Guzmán, L. Á.',en:'Mojica-Zárate, H. T., Díaz-José, O., Sánchez-Moreno, E. A., Alejo-Bello, S., & Barrera-Guzmán, L. Á.'},
  titulo:{es:'El conocimiento local de la vid en México como sistema complejo adaptativo, con índices de regeneración y riesgo',en:'Local grapevine knowledge in Mexico as a complex adaptive system, with regeneration and risk indices'}
};
CONFIG.url = 'https://hectortecumshe-ai.github.io/RatioVina/';
CONFIG.qr = '<svg role="img" aria-label="QR" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 41" shape-rendering="crispEdges"><rect width="41" height="41" fill="#fff"/><path d="M4 4h7v1h-7zM14 4h1v1h-1zM17 4h1v1h-1zM20 4h8v1h-8zM30 4h7v1h-7zM4 5h1v1h-1zM10 5h1v1h-1zM15 5h5v1h-5zM21 5h1v1h-1zM25 5h1v1h-1zM30 5h1v1h-1zM36 5h1v1h-1zM4 6h1v1h-1zM6 6h3v1h-3zM10 6h1v1h-1zM12 6h2v1h-2zM15 6h3v1h-3zM19 6h4v1h-4zM25 6h3v1h-3zM30 6h1v1h-1zM32 6h3v1h-3zM36 6h1v1h-1zM4 7h1v1h-1zM6 7h3v1h-3zM10 7h1v1h-1zM12 7h1v1h-1zM15 7h1v1h-1zM18 7h3v1h-3zM23 7h2v1h-2zM27 7h2v1h-2zM30 7h1v1h-1zM32 7h3v1h-3zM36 7h1v1h-1zM4 8h1v1h-1zM6 8h3v1h-3zM10 8h1v1h-1zM12 8h4v1h-4zM17 8h1v1h-1zM19 8h1v1h-1zM22 8h1v1h-1zM25 8h1v1h-1zM27 8h1v1h-1zM30 8h1v1h-1zM32 8h3v1h-3zM36 8h1v1h-1zM4 9h1v1h-1zM10 9h1v1h-1zM12 9h2v1h-2zM15 9h1v1h-1zM19 9h2v1h-2zM24 9h1v1h-1zM28 9h1v1h-1zM30 9h1v1h-1zM36 9h1v1h-1zM4 10h7v1h-7zM12 10h1v1h-1zM14 10h1v1h-1zM16 10h1v1h-1zM18 10h1v1h-1zM20 10h1v1h-1zM22 10h1v1h-1zM24 10h1v1h-1zM26 10h1v1h-1zM28 10h1v1h-1zM30 10h7v1h-7zM12 11h2v1h-2zM15 11h2v1h-2zM19 11h1v1h-1zM25 11h1v1h-1zM27 11h1v1h-1zM4 12h1v1h-1zM6 12h5v1h-5zM13 12h1v1h-1zM17 12h6v1h-6zM26 12h3v1h-3zM30 12h5v1h-5zM4 13h3v1h-3zM11 13h1v1h-1zM13 13h1v1h-1zM16 13h1v1h-1zM18 13h1v1h-1zM20 13h1v1h-1zM22 13h3v1h-3zM26 13h2v1h-2zM30 13h2v1h-2zM33 13h2v1h-2zM36 13h1v1h-1zM4 14h1v1h-1zM6 14h1v1h-1zM8 14h3v1h-3zM12 14h1v1h-1zM14 14h1v1h-1zM19 14h2v1h-2zM22 14h1v1h-1zM24 14h1v1h-1zM26 14h1v1h-1zM28 14h2v1h-2zM32 14h1v1h-1zM34 14h2v1h-2zM4 15h2v1h-2zM11 15h2v1h-2zM14 15h2v1h-2zM18 15h2v1h-2zM23 15h1v1h-1zM25 15h2v1h-2zM32 15h3v1h-3zM36 15h1v1h-1zM4 16h4v1h-4zM9 16h2v1h-2zM16 16h1v1h-1zM22 16h1v1h-1zM25 16h1v1h-1zM28 16h2v1h-2zM32 16h2v1h-2zM35 16h2v1h-2zM5 17h4v1h-4zM13 17h3v1h-3zM17 17h5v1h-5zM24 17h2v1h-2zM27 17h1v1h-1zM30 17h1v1h-1zM35 17h2v1h-2zM4 18h5v1h-5zM10 18h1v1h-1zM12 18h1v1h-1zM14 18h2v1h-2zM17 18h1v1h-1zM23 18h1v1h-1zM25 18h2v1h-2zM29 18h2v1h-2zM33 18h3v1h-3zM5 19h5v1h-5zM13 19h4v1h-4zM20 19h1v1h-1zM23 19h3v1h-3zM28 19h4v1h-4zM33 19h2v1h-2zM4 20h1v1h-1zM6 20h1v1h-1zM8 20h1v1h-1zM10 20h1v1h-1zM12 20h1v1h-1zM14 20h1v1h-1zM16 20h3v1h-3zM21 20h1v1h-1zM23 20h2v1h-2zM26 20h2v1h-2zM29 20h1v1h-1zM31 20h2v1h-2zM36 20h1v1h-1zM4 21h1v1h-1zM6 21h1v1h-1zM11 21h3v1h-3zM16 21h1v1h-1zM18 21h1v1h-1zM20 21h5v1h-5zM27 21h1v1h-1zM30 21h2v1h-2zM33 21h2v1h-2zM36 21h1v1h-1zM4 22h1v1h-1zM6 22h2v1h-2zM10 22h3v1h-3zM15 22h7v1h-7zM24 22h1v1h-1zM26 22h1v1h-1zM30 22h3v1h-3zM34 22h1v1h-1zM6 23h1v1h-1zM8 23h2v1h-2zM11 23h1v1h-1zM14 23h1v1h-1zM17 23h1v1h-1zM20 23h3v1h-3zM24 23h1v1h-1zM27 23h3v1h-3zM31 23h4v1h-4zM36 23h1v1h-1zM4 24h1v1h-1zM6 24h3v1h-3zM10 24h1v1h-1zM12 24h1v1h-1zM15 24h1v1h-1zM18 24h3v1h-3zM23 24h4v1h-4zM28 24h2v1h-2zM31 24h3v1h-3zM4 25h2v1h-2zM11 25h1v1h-1zM13 25h1v1h-1zM17 25h1v1h-1zM19 25h1v1h-1zM22 25h1v1h-1zM25 25h1v1h-1zM27 25h1v1h-1zM30 25h1v1h-1zM33 25h1v1h-1zM36 25h1v1h-1zM4 26h1v1h-1zM6 26h3v1h-3zM10 26h2v1h-2zM13 26h1v1h-1zM15 26h1v1h-1zM17 26h1v1h-1zM19 26h2v1h-2zM22 26h1v1h-1zM24 26h3v1h-3zM28 26h1v1h-1zM30 26h4v1h-4zM35 26h1v1h-1zM4 27h1v1h-1zM6 27h3v1h-3zM12 27h1v1h-1zM15 27h2v1h-2zM19 27h1v1h-1zM25 27h3v1h-3zM31 27h1v1h-1zM34 27h1v1h-1zM36 27h1v1h-1zM4 28h1v1h-1zM6 28h2v1h-2zM9 28h2v1h-2zM13 28h2v1h-2zM16 28h2v1h-2zM19 28h1v1h-1zM21 28h1v1h-1zM26 28h1v1h-1zM28 28h5v1h-5zM35 28h2v1h-2zM12 29h4v1h-4zM18 29h1v1h-1zM20 29h1v1h-1zM22 29h4v1h-4zM28 29h1v1h-1zM32 29h1v1h-1zM34 29h1v1h-1zM36 29h1v1h-1zM4 30h7v1h-7zM13 30h1v1h-1zM15 30h1v1h-1zM19 30h1v1h-1zM22 30h1v1h-1zM24 30h2v1h-2zM27 30h2v1h-2zM30 30h1v1h-1zM32 30h1v1h-1zM34 30h2v1h-2zM4 31h1v1h-1zM10 31h1v1h-1zM12 31h1v1h-1zM16 31h1v1h-1zM18 31h1v1h-1zM20 31h1v1h-1zM24 31h5v1h-5zM32 31h4v1h-4zM4 32h1v1h-1zM6 32h3v1h-3zM10 32h1v1h-1zM12 32h3v1h-3zM18 32h1v1h-1zM22 32h1v1h-1zM25 32h1v1h-1zM28 32h6v1h-6zM35 32h1v1h-1zM4 33h1v1h-1zM6 33h3v1h-3zM10 33h1v1h-1zM12 33h1v1h-1zM14 33h2v1h-2zM17 33h1v1h-1zM19 33h3v1h-3zM24 33h6v1h-6zM32 33h2v1h-2zM36 33h1v1h-1zM4 34h1v1h-1zM6 34h3v1h-3zM10 34h1v1h-1zM12 34h2v1h-2zM18 34h1v1h-1zM22 34h2v1h-2zM27 34h2v1h-2zM30 34h2v1h-2zM33 34h1v1h-1zM4 35h1v1h-1zM10 35h1v1h-1zM13 35h3v1h-3zM20 35h1v1h-1zM23 35h8v1h-8zM32 35h3v1h-3zM4 36h7v1h-7zM12 36h1v1h-1zM14 36h1v1h-1zM16 36h1v1h-1zM21 36h4v1h-4zM26 36h6v1h-6zM33 36h3v1h-3z" fill="#1d2420"/></svg>';   // QR de la app (qr.py de la suite; sin servicios externos)

let LANG = 'es', MODO = 'prod';
try{ LANG = localStorage.getItem('vina_lang') || ((navigator.language||'es').slice(0,2)==='en'?'en':'es'); MODO = localStorage.getItem('vina_modo') || 'prod'; }catch(e){}
const T = (es,en)=> LANG==='en' ? en : es;
const tx = o => o==null ? '' : (typeof o==='string' ? o : (LANG==='en' ? (o.en??o.es) : (o.es??o.en)));
const E = (es,en)=>({es,en});
const LOC = ()=> LANG==='en' ? 'en-US' : 'es-MX';

/* ---------- Catálogo de cultivos y especies (Bloque 1) ----------
   doc: 'stack' = con Stack de conocimiento local documentado; 'base' = catálogo para documentar.  */
const CATALOGO = [
  {id:'uva', tipo:'cultivo', ico:'c-uva', n:E('Vid (uva)','Grapevine (grape)'), sci:'Vitis vinifera L. y otras Vitis', doc:'stack', col:'#6b3fa0'}
];
/* Razas de maíz de México (CONABIO, 2020; clasificación de Sánchez et al., 2000): 64 razas en 7 grupos.
   RAZAS_EXT: descritas inicialmente fuera de México (Caribe y Guatemala) pero colectadas en el país. */
const RAZAS_MAIZ = [
  {g:E('Cónico','Conical'), r:['Arrocillo','Cacahuacintle','Cónico','Cónico Norteño','Chalqueño','Dulce','Elotes cónicos','Mixteco','Mushito','Mushito de Michoacán','Negrito','Palomero de Chihuahua','Palomero de Jalisco','Palomero toluqueño','Uruapeño']},
  {g:E('Sierra de Chihuahua','Sierra de Chihuahua'), r:['Apachito','Azul','Complejo Serrano de Jalisco','Cristalino de Chihuahua','Gordo','Mountain Yellow (Amarillo de Montaña)']},
  {g:E('Ocho Hileras','Eight-rowed'), r:['Ancho','Blando','Bofo','Bolita','Elotes occidentales','Harinoso de ocho','Jala','Onaveño','Tablilla de ocho','Tabloncillo','Tabloncillo Perla','Zamorano Amarillo']},
  {g:E('Chapalote','Chapalote'), r:['Chapalote','Dulcillo del Noroeste','Elotero de Sinaloa','Reventador']},
  {g:E('Tropicales precoces','Early tropical'), r:['Conejo','Nal-Tel','Ratón','Zapalote Chico']},
  {g:E('Dentados tropicales','Tropical dents'), r:['Celaya','Chiquito','Choapaneco','Cubano Amarillo','Nal-Tel de Altura','Pepitilla','Tepecintle','Tuxpeño','Tuxpeño Norteño','Vandeño','Zapalote Grande']},
  {g:E('Maduración tardía','Late maturing'), r:['Dzit Bacal','Comiteco','Coscomatepec','Mixeño','Motozinteco','Negro de Chimaltenango','Olotillo','Olotón','Quicheño','Serrano','Serrano Mixe','Tehua']}
];
const RAZAS_EXT = ['Cubano Amarillo','Nal-Tel de Altura','Serrano','Negro de Chimaltenango','Quicheño'];
const SISTEMAS = [
  {id:'riego_tec', n:E('Viñedo con riego tecnificado (goteo o microaspersión)','Vineyard with pressurised irrigation (drip or micro-sprinkler)'), doc:false},
  {id:'riego_grav', n:E('Viñedo con riego por gravedad','Vineyard with gravity irrigation'), doc:false},
  {id:'temporal', n:E('Viñedo de temporal (sin riego)','Rainfed vineyard (no irrigation)'), doc:false},
  {id:'organico', n:E('Viñedo orgánico o en transición','Organic or transitioning vineyard'), doc:false},
  {id:'diversif', n:E('Viñedo diversificado (cubiertas, frutales u otros cultivos)','Diversified vineyard (covers, fruit trees or other crops)'), doc:false},
  {id:'traspatio', n:E('Parra de traspatio o huerto familiar','Backyard vine or home garden'), doc:false}
];
const TIPOS_UP = [E('Viñedo familiar','Family vineyard'),E('Viñedo comercial','Commercial vineyard'),E('Viñedo de una bodega vinícola','Winery-owned vineyard'),E('Rancho o empresa de uva de mesa','Table-grape ranch or company'),E('Parcela ejidal o comunal','Ejido or communal plot'),E('Parcela demostrativa o experimental','Demonstration or experimental plot')];

/* Subcategoría de bovinos: propósito → sistema de producción (régimen) → razas.
   Tipología usual de la ganadería bovina en México (carne: vaca–becerro, desarrollo en pastoreo y engorda en corral;
   leche: familiar o de traspatio, semiespecializado y especializado o intensivo; doble propósito en el trópico).
   Las razas son una lista orientativa de las que se crían en el país: «Lectura de Ratio Viña»; verifícalas con la asociación de criadores. */
const REGIMEN = {ext:E('Extensivo','Extensive'), semi:E('Semiintensivo','Semi-intensive'), int:E('Intensivo','Intensive'), tras:E('Traspatio (pequeña escala)','Backyard (small scale)')};
const REG_SIS = {ext:'pastoreo', semi:'pastoreo', int:'confinado', tras:'traspatio'};
const BOV_CEBU = ['Brahman','Indobrasil','Gyr','Nelore','Guzerat','Sardo Negro'];
const BOV_EUR_C = ['Angus','Hereford','Charolais','Simmental','Limousin','Beefmaster','Brangus','Santa Gertrudis','Simbrah','Charbray'];
const BOV = [
  {id:'carne', n:E('Ganado productor de carne','Beef cattle'), col:'#8a4b2e', sis:[
    {id:'vacabecerro', reg:'ext', n:E('Sistema vaca–becerro','Cow–calf system'), d:E('Hato de vientres en pastoreo o agostadero que pare y cría becerros hasta el destete, para venta o para engorda.','Breeding herd on pasture or rangeland raising calves to weaning, for sale or finishing.'),
      r:[[E('Cebuinas','Zebu'),BOV_CEBU],[E('Europeas y sintéticas','European and composite'),BOV_EUR_C],[E('Cruzas y criollas','Crosses and criollo'),['Cruza cebú × europeo','Criollo']]]},
    {id:'repasto', reg:'ext', n:E('Desarrollo y engorda en pastoreo (repasto)','Stocker and grass finishing'), d:E('Becerros destetados que ganan peso en praderas o agostadero antes de venderse o de entrar al corral.','Weaned calves gaining weight on pasture before sale or feedlot entry.'),
      r:[[E('Cebuinas','Zebu'),BOV_CEBU],[E('Europeas y sintéticas','European and composite'),BOV_EUR_C],[E('Cruzas','Crosses'),['Cruza cebú × europeo']]]},
    {id:'corral', reg:'int', n:E('Engorda en corral (finalización intensiva)','Feedlot finishing'), d:E('Toretes y novillos en corral con dieta de alta energía hasta el peso de mercado (el caso que formula RatioBos).','Bulls and steers in pens on high-energy diets to market weight (the case RatioBos formulates).'),
      r:[[E('Europeas y sintéticas','European and composite'),['Charolais','Angus','Hereford','Simmental','Limousin','Beefmaster','Brangus','Charbray','Simbrah']],[E('Cebuinas','Zebu'),['Brahman','Indobrasil','Nelore']],[E('Cruzas y otras','Crosses and others'),['Cruza cebú × europeo','Holstein (machos)']]]}]},
  {id:'leche', n:E('Ganado productor de leche','Dairy cattle'), col:'#2f6b8a', sis:[
    {id:'lechetras', reg:'tras', n:E('Lechería familiar o de traspatio','Family or backyard dairy'), d:E('Pocas vacas en el solar o junto a la casa, ordeña manual o con equipo sencillo; leche para la familia, el queso o la venta local.','A few cows by the house, hand or simple machine milking; milk for the family, cheese or local sale.'),
      r:[[E('Lecheras','Dairy'),['Holstein','Jersey','Pardo Suizo']],[E('Cruzas y criollas','Crosses and criollo'),['Cruza Holstein × cebú','Cruza Pardo Suizo × cebú','Criollo Lechero Tropical','Criollo']]]},
    {id:'lechesemi', reg:'semi', n:E('Lechería semiespecializada','Semi-specialised dairy'), d:E('Hatos medianos con pastoreo y suplemento en pesebre, ordeña mecánica y venta a acopiadores.','Medium herds grazing with manger supplement, machine milking and sale to collectors.'),
      r:[[E('Lecheras','Dairy'),['Holstein','Jersey','Pardo Suizo']],[E('Cruzas','Crosses'),['Cruza Holstein × Jersey','Cruza Holstein × cebú']]]},
    {id:'lecheint', reg:'int', n:E('Lechería especializada o intensiva (estabulada)','Specialised intensive dairy (housed)'), d:E('Vacas estabuladas con ración total mezclada, ordeña mecanizada dos o tres veces al día y alta producción por vaca.','Housed cows on total mixed ration, machine milked two or three times a day, high yield per cow.'),
      r:[[E('Lecheras','Dairy'),['Holstein','Jersey','Pardo Suizo']],[E('Cruzas','Crosses'),['Cruza Holstein × Jersey']]]}]},
  {id:'doble', n:E('Doble propósito (carne y leche)','Dual purpose (beef and milk)'), col:'#6b8f3e', sis:[
    {id:'dobletrop', reg:'ext', n:E('Doble propósito tropical','Tropical dual purpose'), d:E('Vacas cruzadas en pastoreo que se ordeñan con el becerro al pie; se vende leche y becerro destetado.','Crossbred grazing cows milked with the calf at foot; milk and weaned calves are sold.'),
      r:[[E('Cruzas','Crosses'),['Cruza cebú × Pardo Suizo','Cruza cebú × Holstein','Cruza cebú × Simmental','Gyrolando']],[E('Razas','Breeds'),['Pardo Suizo','Simmental','Gyr','Sardo Negro','Criollo Lechero Tropical']]]}]}
];
const bovSisSel = ()=>{ const p=BOV.find(b=>b.id===S.bovProp)||BOV[0]; return p.sis.find(s=>s.id===S.bovSis)||p.sis[0]; };
const bovTexto = ()=>{ const p=BOV.find(b=>b.id===S.bovProp)||BOV[0], s=bovSisSel(); return tx(p.n)+' · '+tx(s.n)+' ('+tx(REGIMEN[s.reg]).toLowerCase()+')'+(S.bovRaza?' · '+S.bovRaza:''); };

/* ---------- Estado / state ---------- */
let S;
function estadoInicial(){ return {
  formato:3,                       // 3 = con la etapa de Establecimiento (pasos 1–6); 2 = versión 0.1.0 (pasos 1–31); sin «formato» = otra app
  bloque:'inicio', visitados:{},
  proyecto:{nombre:'', productor:'', fecha:new Date().toISOString().slice(0,10), notas:''},
  cultivo:'uva', sistema:'', tipoUP:'', superficie:'',   // la app es solo de vid; lo demás empieza vacío
  vidDestino:'', vidVar:'', vidPie:'', vidCond:'', vidEdad:'', vidDens:'',   // Bloque 1 · Vid
  vidPlant:'', vidMat:'', podas:[],   // historial del viñedo: fecha y material de plantación; podas [{f:'AAAA-MM-DD', t, nota}]
  clima:{tmed:Array(12).fill(''), tmax:Array(12).fill(''), tmin:Array(12).fill(''), fuente:''},   // Bloque 4 · Clima vitícola
  edo:'', mun:'', loc:'',
  granja:[],                       // especies de la granja de traspatio
     // subcategoría del maíz
  bovProp:'carne', bovSis:'vacabecerro', bovRaza:'',   // subcategoría de bovinos
  catExtra:[],                     // cultivos y especies agregados por el usuario {id, tipo, n, sci, col}
  variedad:{},                     // cultivo -> variedad, tipo o raza elegida o escrita
  sisExtra:[],                     // sistemas de producción agregados por el usuario {id, n, d}
  upOtro:'',                       // tipo de unidad escrito por el usuario (tipoUP = -1)
  regen:{}, regenBase:null, regenMO:{},   // perillas de regeneración (0–4), línea base y materia orgánica
  riesgo:{},                       // riesgo -> {p, i, c, off}
  prosp:null,                      // supuestos editados de la prospectiva (null = valores iniciales)
  reqInn:[],                       // [{t, b, d, fuente}]
  manejo:{},                       // n paso -> {resp:{codigo:'si'|'no'}, inn:[{t, el:[ids], imp:[5], nota}], imp:{codigo:[5]}}; sin respuesta no cuenta
  elemExtra:[],                    // elementos agregados por el usuario {id,cat,n}
  precio:{},                       // id -> {p:precio unitario, u:unidad, q:cantidad por ha}
  valor:{},                        // id -> {eco,uso,cul,eia} 0..5
  pesosValor:{eco:1,uso:1,cul:1,eia:1},
  carbono:{diesel:'', nKg:'', urea:'', rend:''},
  siembraDia:null,                // fecha de siembra (día del año); null = sin capturar
  fechas:{},                       // n paso -> {ini, fin, ev}
  revisado:{},                     // bloques sin campos propios que el usuario marcó como revisados
  formulado:false
}; }
/* EJ = modo ejemplo (caso publicado de Mata de Zarza): nunca se guarda y no toca el proyecto del usuario */
let EJ = false, S_USUARIO = null;
function guardar(){ if(EJ) return; try{ localStorage.setItem('vina_v1', JSON.stringify(S)); }catch(e){} }
function cargar(){ try{ const g=JSON.parse(localStorage.getItem('vina_v1')||'null'); if(g && g.manejo) return migrarPasos(Object.assign(estadoInicial(), g, {formato:g.formato})); }catch(e){} return estadoInicial(); }
/* Proyectos de Ratio Viña 0.1.0 (formato 2): sus pasos 1–31 pasan a ser 7–37, porque la etapa de Establecimiento ocupa los pasos 1–6 */
function migrarPasos(s){ if(s.formato!==2) return s; const mueve=o=>Object.fromEntries(Object.entries(o||{}).map(([n,v])=>[isFinite(+n)?String(+n+6):n, v]));
  s.manejo=mueve(s.manejo); s.fechas=mueve(s.fechas); s.formato=3; return s; }
/* Proyectos de Ratio Telar (maíz) abiertos como archivo: «off» se convierte en respuestas «sí» y «no».
   Solo se recupera si el usuario lo pide; «off» se convierte en respuestas «sí» y «no». */
function proyectoAnterior(){ return null; }   // Ratio Viña no tiene versión anterior
function migrarV2(g){ const s=Object.assign(estadoInicial(), g);
  if((catalogoTodos().find(c=>c.id===s.cultivo)||{}).doc==='stack') PASOS.forEach(p=>{ const m=s.manejo[p.n]=s.manejo[p.n]||{inn:[], imp:{}}; const off=m.off||{}; m.resp={}; p.a.forEach(a=>{ m.resp[a[0]]=off[a[0]]?'no':'si'; }); m.off={}; });
  return s; }
const sistemasTodos = ()=> SISTEMAS.concat((S.sisExtra||[]).map(x=>({id:x.id, n:x.n, d:x.d, doc:false, usuario:true})));
const SIS_VACIO = {id:'', n:E('Sin elegir','Not chosen'), doc:false, vacio:true};
const CULT_VACIO = {id:'', tipo:'cultivo', ico:'i-telar', n:E('Cultivo sin elegir','Crop not chosen'), sci:'', doc:'base', col:'#9a9a9a', vacio:true};
const sistemaSel = ()=> sistemasTodos().find(s=>s.id===S.sistema) || SIS_VACIO;
const tipoUPTexto = ()=> S.tipoUP===''||S.tipoUP==null ? '—' : +S.tipoUP===-1 ? (S.upOtro||T('Otro','Other')) : (TIPOS_UP[S.tipoUP] ? tx(TIPOS_UP[S.tipoUP]) : '—');
const cultivoSel = ()=> catalogoTodos().find(c=>c.id===S.cultivo) || CULT_VACIO;
const conStack = ()=> cultivoSel().doc==='stack';
const LUGARES = [];   // sin accesos directos: cada localidad se elige en el mapa o en la lista
