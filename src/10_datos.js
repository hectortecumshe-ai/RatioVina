"use strict";
/* =====================================================================
   1. DATOS BASE · CONFIGURACIÓN, IDIOMA, ESTADO Y CATÁLOGO
   Ratio Viña — Ratio Complexus («lo que está tejido junto»)
   ===================================================================== */
const CONFIG = {
  app:'Ratio Viña', version:'0.1.0', anio:2026, doi:'',
  repo:'https://github.com/hectortecumshe-ai/RatioVina',
  autores:'Héctor Tecumshé Mojica-Zárate · Oscar Díaz-José',
  citaAutores:{es:'Mojica-Zárate, H. T., y Díaz-José, O.',en:'Mojica-Zárate, H. T., & Díaz-José, O.'},
  titulo:{es:'El conocimiento local de la vid en México como sistema complejo adaptativo, con índices de regeneración y riesgo',en:'Local grapevine knowledge in Mexico as a complex adaptive system, with regeneration and risk indices'}
};
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
  formato:2,                       // 2 = respuestas sí/no (sin precarga); los archivos sin «formato» son de la versión anterior
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
/* EJ = modo ejemplo (caso publicado de Calpan): nunca se guarda y no toca el proyecto del usuario */
let EJ = false, S_USUARIO = null;
function guardar(){ if(EJ) return; try{ localStorage.setItem('vina_v1', JSON.stringify(S)); }catch(e){} }
function cargar(){ try{ const g=JSON.parse(localStorage.getItem('vina_v1')||'null'); if(g && g.manejo) return Object.assign(estadoInicial(), g); }catch(e){} return estadoInicial(); }
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
