"use strict";
/* =====================================================================
   Bloque 6 · REGENERACIÓN DEL SISTEMA PRODUCTIVO
   Bloque 7 · RIESGOS DEL SISTEMA
   ---------------------------------------------------------------------
   Regeneración: ocho indicadores en escala 0–4, agrupados en los principios
   de salud del suelo del USDA-NRCS (mínima perturbación, suelo cubierto,
   diversidad, raíces vivas) más los que la literatura de agricultura
   regenerativa añade (integración animal, menos insumos de síntesis,
   materia orgánica; Newton et al., 2020; Schreefel et al., 2020) y el saber
   local del Stack. Cada indicador tiene un valor sugerido a partir de las
   actividades que se practican (Bloque 5) que el usuario puede ajustar con
   su perilla. Índice de regeneración IR = Σ s / (4·n), 0–1.
   La lectura de los valores sugeridos y los cortes de clase son «Lectura de
   Ratio Viña».
   Riesgo: matriz de probabilidad × impacto 1–5 (IEC 31010:2019; ISO 31000:2018)
   y el marco del IPCC (2014): el riesgo depende de la amenaza, la exposición y
   la vulnerabilidad. La capacidad adaptativa CA (0–1) reduce el riesgo:
   r = P · I · (1 − 0.4·CA) · (1 − 0.15·control). En la prospectiva, la
   probabilidad de las amenazas climáticas sube ΔP = 5·(p(t) − p₀). Los factores 0.4 y 0.15 son
   supuestos de Ratio Viña, marcados y explicados en la app.
   ===================================================================== */
const NIVEL04 = [E('Nulo','None'),E('Bajo','Low'),E('Medio','Medium'),E('Alto','High'),E('Muy alto','Very high')];
const NIVEL15 = [null,E('Muy bajo','Very low'),E('Bajo','Low'),E('Medio','Medium'),E('Alto','High'),E('Muy alto','Very high')];
const _tiene = (a, ids)=> a.el.some(id=>ids.includes(id));
const SIN_SUG = (m)=>({s:null, m:m||T('sin datos todavía: responde el Bloque 5 o mueve la perilla','no data yet: answer Block 5 or move the knob')});
const DIV_SIS = {riego_tec:1, riego_grav:1, temporal:1, organico:2, diversif:4, traspatio:5};   // especies por sistema de viñedo (lectura de Ratio Viña)
const REGEN_IND = [
  {id:'labranza', pr:E('Mínima perturbación','Minimal disturbance'), n:E('Labranza mínima','Minimal tillage'), col:'#9a6a3a',
   q:E('¿Cuántos pasos de maquinaria o arado mueven el suelo en cada ciclo? Menos pasos, menos erosión y más vida en el suelo.','How many machinery or plough passes move the soil each cycle? Fewer passes, less erosion and more soil life.'),
   auto:(acts)=>{ if(!acts.length) return SIN_SUG(); const n=acts.filter(a=>_tiene(a,['ARADO','SUBS','RASTRA'])&&!/decisi|determinaci|evaluaci|decision/i.test(a.n.es||'')).length; return {s:n===0?4:n===1?3:n===2?2:n<=4?1:0, m:T(`${n} actividades de labranza practicadas`,`${n} tillage activities practised`)}; }},
  {id:'cobertura', pr:E('Suelo cubierto','Soil cover'), n:E('Suelo cubierto todo el año','Soil covered all year'), col:'#7a9a3a',
   q:E('¿Cuántos meses del año el suelo está cubierto por el cultivo, rastrojo, acolchado o abono verde?','How many months a year is the soil covered by crop, stubble, mulch or green manure?'),
   auto:(acts)=>{ if(!acts.length) return SIN_SUG(); const r=acts.some(a=>_tiene(a,['RAST','CUB'])&&a.v&&a.v[0]>0); return {s:r?2:1, m:r?T('hay cubierta vegetal o sarmientos sobre el suelo; ajusta según los meses de cobertura','there is cover crop or prunings on the soil; adjust to months of cover'):T('sin dato de cobertura: ajústalo','no cover data: adjust it')}; }},
  {id:'diversidad', pr:E('Diversidad','Diversity'), n:E('Diversidad de especies','Species diversity'), col:'#2f8f6a',
   q:E('¿Cuántas especies se cultivan o crían juntas en la unidad (incluidos árboles y animales)?','How many species are grown or raised together in the unit (including trees and animals)?'),
   auto:()=>{ if(!S.sistema && S.cultivo!=='granja') return SIN_SUG(T('elige el sistema de producción (Bloque 1) o mueve la perilla','choose the production system (Block 1) or move the knob')); const k=S.cultivo==='granja'?Math.max(1,S.granja.length):(DIV_SIS[S.sistema]||1); return {s:k<=1?0:k===2?1:k===3?2:k<=5?3:4, m:T(`${k} especies según el sistema elegido`,`${k} species according to the chosen system`)}; }},
  {id:'raices', pr:E('Raíces vivas','Living roots'), n:E('Raíces vivas el mayor tiempo','Living roots as long as possible'), col:'#5f8f3e',
   q:E('¿Cuántos meses al año hay plantas vivas en la parcela (cultivo, cobertera, árboles, pastos)?','How many months a year are there living plants on the plot (crop, cover crop, trees, pasture)?'),
   auto:()=>{ if(!S.sistema) return SIN_SUG(T('elige el sistema de producción (Bloque 1) o mueve la perilla','choose the production system (Block 1) or move the knob')); const perenne=true; /* la vid es perenne */ return {s:perenne?3:2, m:perenne?T('la vid es perenne: ajusta según los meses con hojas y cubierta','the vine is perennial: adjust to the months with leaves and cover'):T('cultivo de un ciclo: ajusta según los meses con plantas vivas','single-cycle crop: adjust to months with living plants')}; }},
  {id:'animales', pr:E('Integración animal','Livestock integration'), n:E('Animales integrados al sistema','Animals integrated into the system'), col:'#b0703e',
   q:E('¿Hay animales que pastorean el rastrojo, aportan estiércol o conviven en la unidad?','Are there animals grazing stubble, providing manure or living in the unit?'),
   auto:(acts)=>{ if(!acts.length && !S.cultivo && !S.sistema) return SIN_SUG(); const esp=cultivoSel().tipo==='especie'||['pastoreo','traspatio'].includes(S.sistema); const forr=acts.some(a=>_tiene(a,['FORR'])); return {s:esp?3:forr?2:0, m:esp?T('unidad con animales','unit with animals'):forr?T('se produce forraje para animales','fodder is produced for animals'):T('sin animales registrados','no animals recorded')}; }},
  {id:'insumos', pr:E('Menos síntesis','Fewer synthetics'), n:E('Menos agroquímicos de síntesis','Fewer synthetic agrochemicals'), col:'#2f7d8a',
   q:E('¿Qué parte de las actividades con insumos usa agroquímicos de síntesis frente a bioinsumos?','What share of input activities uses synthetic agrochemicals versus bio-inputs?'),
   auto:(acts)=>{ if(!acts.length) return SIN_SUG(); const s=acts.filter(a=>_tiene(a,['INSEC','HERB','FERTG','FOLIAR','FUNG','CIAN','GIB'])).length, b=acts.filter(a=>_tiene(a,['BIOI','COMPO'])).length; if(!s&&!b) return {s:4, m:T('sin insumos registrados','no inputs recorded')}; const r=s/(s+b); return {s:Math.round(4*(1-r)), m:T(`${s} actividades con agroquímicos y ${b} con bioinsumos`,`${s} activities with agrochemicals and ${b} with bio-inputs`)}; }},
  {id:'mo', pr:E('M. orgánica','Org. matter'), n:E('Materia orgánica y residuos','Organic matter and residues'), col:'#7a4f9a',
   q:E('¿Se incorporan rastrojo, estiércol o composta, y se mide la materia orgánica del suelo?','Are stubble, manure or compost incorporated, and is soil organic matter measured?'),
   auto:(acts)=>{ if(!acts.length) return SIN_SUG(); const r=acts.filter(a=>_tiene(a,['RAST','CUB','COMPO'])&&a.v&&a.v[0]>0).length, lab=acts.some(a=>_tiene(a,['LAB'])); const s=Math.min(4,(r===0?1:r===1?2:3)+(lab?1:0)); return {s, m:T(`${r} actividades que devuelven residuos al suelo${lab?'; con análisis de suelo':''}`,`${r} activities returning residues to soil${lab?'; with soil testing':''}`)}; }},
  {id:'saber', pr:E('Saber local','Local knowledge'), n:E('Saber local y semilla propia','Local knowledge and own seed'), col:'#d9a441',
   q:E('¿Qué tanto se apoya el manejo en el saber tácito y cultural, la selección de semilla propia y la familia?','How much does management rely on tacit and cultural knowledge, own seed selection and the family?'),
   auto:(acts)=>{ if(!acts.length) return SIN_SUG(); const f=acts.filter(a=>_tiene(a,['KTAC','KCUL','LUNA','FAM','SEMS'])).length/acts.length; return {s:Math.min(4,Math.round(8*f)), m:T(`${Math.round(100*f)} % de las actividades usan saber local o semilla propia`,`${Math.round(100*f)} % of activities use local knowledge or own seed`)}; }}
];
const SIN_DATO_CL = {n:E('Sin dato','No data'), c:'info'};
const CLASE_IR = v=> v==null?SIN_DATO_CL : v<0.25?{n:E('Degradante','Degrading'),c:'bad'} : v<0.5?{n:E('Convencional','Conventional'),c:'warn'} : v<0.75?{n:E('En transición regenerativa','In regenerative transition'),c:'info'} : {n:E('Regenerativo','Regenerative'),c:'ok'};
/* Cada perilla: confirmada por el usuario (la movió o aceptó la sugerencia) o, si no, sugerida (punteada) o sin dato.
   IR se calcula con los valores disponibles; es «provisional» mientras alguna perilla no esté confirmada. */
function regeneracion(){ const acts=sostenibilidad().acts, R=S.regen||{};
  const ind=REGEN_IND.map(d=>{ const a=d.auto(acts), u=R[d.id], conf=(u!=null&&u!==''); const s=conf?+u:a.s; return {...d, sug:a.s, motivo:a.m, s, conf, ajustado:conf&&+u!==a.s}; });
  const conV=ind.filter(x=>x.s!=null), nConf=ind.filter(x=>x.conf).length;
  const IR=conV.length?conV.reduce((t,x)=>t+x.s,0)/(4*conV.length):null;
  const regenAct=acts.map(a=>({a, r:(a.v[0]+a.v[1]+a.v[3]+a.v[4])})).sort((x,y)=>y.r-x.r);
  const base=S.regenBase||null, IRb=base?base.IR:null;
  return {ind, IR, nConf, provisional:nConf<ind.length, faltan:ind.length-nConf, clase:CLASE_IR(IR), sube:regenAct.filter(x=>x.r>0).slice(0,6), baja:regenAct.filter(x=>x.r<0).reverse().slice(0,6), base, dIR:IRb!=null&&IR!=null?IR-IRb:null, mo:S.regenMO||{}}; }

/* ---------------- RIESGOS ---------------- */
const CAT_R = {clima:{n:E('Climáticos','Climatic'),col:'#2d78b0'}, bio:{n:E('Biológicos','Biological'),col:'#5f8f3e'}, mercado:{n:E('Mercado','Market'),col:'#c98b21'}, social:{n:E('Sociales','Social'),col:'#b05434'}, inst:{n:E('Institucionales','Institutional'),col:'#5a6b8a'}, recursos:{n:E('Recursos naturales','Natural resources'),col:'#7a4f9a'}};
const RIESGOS = [
  {id:'sequia', cat:'clima', n:E('Sequía o lluvias tardías','Drought or late rains'), el:['HUM','CLIMA','ENSO']},
  {id:'helada', cat:'clima', n:E('Helada','Frost'), el:['CLIMA']},
  {id:'granizo', cat:'clima', n:E('Granizo','Hail'), el:['CLIMA']},
  {id:'lluvia', cat:'clima', n:E('Lluvias intensas o inundación','Heavy rain or flooding'), el:['CICL','CLIMA']},
  {id:'calor', cat:'clima', n:E('Ola de calor','Heatwave'), el:['CLIMA']},
  {id:'ciclon', cat:'clima', n:E('Ciclones y huracanes','Cyclones and hurricanes'), el:['CICL','MJO']},
  {id:'plagas', cat:'bio', n:E('Plagas','Pests'), el:['PLAGA']},
  {id:'enferm', cat:'bio', n:E('Enfermedades','Diseases'), el:['PLAGA']},
  {id:'malezas', cat:'bio', n:E('Malezas resistentes o invasoras','Resistant or invasive weeds'), el:['ARV','HERB']},
  {id:'precio', cat:'mercado', n:E('Caída del precio de venta','Fall in sale price'), el:['PRECIO','COMP','GRANO']},
  {id:'insumos', cat:'mercado', n:E('Alza de insumos y servicios','Rise in input and service costs'), el:['COSTOS','FERTG','PI']},
  {id:'venta', cat:'mercado', n:E('Intermediarismo o falta de comprador','Middlemen or no buyer'), el:['COMP','TRANS']},
  {id:'manoobra', cat:'social', n:E('Falta de mano de obra y de relevo generacional','Labour shortage and no generational succession'), el:['PM','FAM']},
  {id:'saber', cat:'social', n:E('Pérdida del saber local','Loss of local knowledge'), el:['KTAC','KCUL','FAM']},
  {id:'insegur', cat:'social', n:E('Inseguridad o robo','Insecurity or theft'), el:[]},
  {id:'apoyos', cat:'inst', n:E('Retiro de programas y apoyos','Withdrawal of programmes and support'), el:['AT','SDR']},
  {id:'tierra', cat:'inst', n:E('Conflictos de tenencia de la tierra','Land tenure conflicts'), el:[]},
  {id:'erosion', cat:'recursos', n:E('Erosión y pérdida de fertilidad','Erosion and fertility loss'), el:['SUELO']},
  {id:'agua', cat:'recursos', n:E('Escasez de agua','Water scarcity'), el:['HUM']}
];
const NIVEL_R = r=> r<=4?{n:E('Bajo','Low'),c:'#3f9b5f'} : r<=9?{n:E('Medio','Medium'),c:'#d9b13a'} : r<=15?{n:E('Alto','High'),c:'#e0803a'} : {n:E('Muy alto','Very high'),c:'#c43a2f'};
function sugerenciaRiesgo(id, acts, P){ const e=P.esc.ten; let p=3, i=3, m=T('moderado: ajústalo a tu localidad','moderate: adjust it to your locality');
  const sh=acts.length?acts.filter(a=>_tiene(a,['INSEC','HERB','FERTG','FOLIAR','PI'])).length/acts.length:0, kt=acts.length?acts.filter(a=>_tiene(a,['KTAC','KCUL','FAM'])).length/acts.length:0;
  if(id==='insumos'){ p=e.gC>=2?4:3; i=1+Math.round(4*Math.min(1,sh*2)); m=T(`probabilidad del escenario tendencial (costos +${e.gC} %/año); impacto según el ${Math.round(100*sh)} % de actividades con insumos comprados`,`trend-scenario probability (costs +${e.gC} %/yr); impact from the ${Math.round(100*sh)} % of activities with purchased inputs`); }
  if(id==='manoobra'){ p=e.gL<=-1.5?4:e.gL<0?3:2; m=T(`según la pérdida de mano de obra del escenario tendencial (${e.gL} %/año)`,`from the trend scenario labour loss (${e.gL} %/yr)`); }
  if(id==='precio'){ p=e.gP<0?4:3; m=T('según el precio del escenario tendencial','from the trend scenario price'); }
  if(id==='saber'){ i=1+Math.round(4*Math.min(1,kt*2)); m=T(`impacto según el ${Math.round(100*kt)} % de actividades que dependen del saber local`,`impact from the ${Math.round(100*kt)} % of activities relying on local knowledge`); }
  if(['sequia','calor'].includes(id)){ p=e.dT>=0.2?4:3; m=T(`calentamiento del escenario tendencial (${e.dT} °C por década; IPCC, 2018)`,`trend-scenario warming (${e.dT} °C per decade; IPCC, 2018)`); }
  return {p, i, m}; }
function capacidadAdaptativa(rg){ const sos=sostenibilidad(), sar=sarandon(sos); const parts=rg.IR!=null?[{n:E('Regeneración','Regeneration'), v:rg.IR}]:[];
  if(sar){ const B=sar.IKs.find(x=>x.k==='B'), K=sar.ISCs.find(x=>x.k==='B'), I=sar.ISCs.find(x=>x.k==='C');
    if(B&&B.v!=null) parts.push({n:E('Diversificación de productos','Product diversification'), v:B.v/4});
    if(K&&K.v!=null) parts.push({n:E('Acceso a conocimiento técnico','Access to technical knowledge'), v:K.v/4});
    if(I&&I.v!=null) parts.push({n:E('Integración institucional','Institutional integration'), v:I.v/4}); }
  return {CA:parts.length?parts.reduce((t,x)=>t+x.v,0)/parts.length:0, parts, sinDato:!parts.length}; }
function riesgos(opt={}){ const acts=sostenibilidad().acts, P=prosp(), U=S.riesgo||{}, rg=opt.rg||regeneracion(), cap=opt.CA!=null?{CA:opt.CA,parts:[]}:capacidadAdaptativa(rg), dP=opt.dClima||0;
  const L=RIESGOS.map(d=>{ const sg=sugerenciaRiesgo(d.id, acts, P), u=U[d.id]||{};
    const off=u.off===true, p0=u.p!=null?+u.p:sg.p, i=u.i!=null?+u.i:sg.i, ctl=u.c!=null?+u.c:0;
    const p=d.cat==='clima'?Math.min(5,p0+dP):p0, bruto=p*i, r=bruto*(1-0.4*cap.CA)*(1-0.15*ctl);
    const conf=off || u.ok===true || (u.p!=null && u.i!=null);   // confirmado: lo desmarcó, aceptó la sugerencia o movió sus perillas
    return {...d, sug:sg, p, i, ctl, off, bruto, r, nivel:NIVEL_R(r), conf, ajustado:(u.p!=null||u.i!=null)}; });
  const act=L.filter(x=>!x.off), idx=act.length?act.reduce((t,x)=>t+x.r,0)/(25*act.length):0, nConf=L.filter(x=>x.conf).length;
  const porCat=Object.keys(CAT_R).map(k=>{ const l=act.filter(x=>x.cat===k); return {k, v:l.length?l.reduce((t,x)=>t+x.r,0)/(25*l.length):null, n:l.length}; });
  return {L, act, idx, nConf, provisional:nConf<L.length, porCat, CA:cap.CA, sinCA:!!cap.sinDato, partsCA:cap.parts, top:[...act].sort((a,b)=>b.r-a.r)}; }
const CLASE_RG = v=> v<0.16?{n:E('Bajo','Low'),c:'ok'} : v<0.36?{n:E('Medio','Medium'),c:'warn'} : v<0.6?{n:E('Alto','High'),c:'bad'} : {n:E('Muy alto','Very high'),c:'bad'};

/* ---------------- Gráficas ---------------- */
function matrizRiesgo(rs, opt={}){ const c=opt.celda||64, L=86, Tp=16, W=L+5*c+20, H=Tp+5*c+56;
  let s=`<svg class="chart matriz-r" viewBox="0 0 ${W} ${H}" role="img" aria-label="${T('Matriz de probabilidad e impacto','Likelihood and impact matrix')}">`;
  for(let p=1;p<=5;p++) for(let i=1;i<=5;i++){ const x=L+(i-1)*c, y=Tp+(5-p)*c, nv=NIVEL_R(p*i); s+=`<rect x="${x}" y="${y}" width="${c-3}" height="${c-3}" rx="6" fill="${nv.c}" fill-opacity=".22" stroke="${nv.c}" stroke-opacity=".5"/>`; }
  const celdas={}; rs.act.forEach(x=>{ const k=Math.round(x.p)+'-'+x.i; (celdas[k]=celdas[k]||[]).push(x); });
  Object.entries(celdas).forEach(([k,l])=>{ const [p,i]=k.split('-').map(Number), x=L+(i-1)*c+(c-3)/2, y=Tp+(5-p)*c+(c-3)/2;
    s+=`<circle cx="${x}" cy="${y}" r="${12+Math.min(10,l.length*2)}" fill="${NIVEL_R(p*i).c}" data-tip="${esc(l.map(z=>tx(z.n)).join(' · '))}"/><text x="${x}" y="${y+4.5}" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">${l.length}</text>`; });
  for(let p=1;p<=5;p++) s+=`<text x="${L-8}" y="${Tp+(5-p)*c+c/2}" text-anchor="end" font-size="11.5" class="m">${p} · ${esc(tx(NIVEL15[p]))}</text>`;
  for(let i=1;i<=5;i++) s+=`<text x="${L+(i-1)*c+c/2-1}" y="${Tp+5*c+14}" text-anchor="middle" font-size="11.5" class="m">${i}</text>`;
  s+=`<text x="${L+2.5*c}" y="${H-8}" text-anchor="middle" font-size="12" font-weight="700">${T('Impacto','Impact')} →</text><text x="14" y="${Tp+2.5*c}" text-anchor="middle" font-size="12" font-weight="700" transform="rotate(-90 14 ${Tp+2.5*c})">${T('Probabilidad','Likelihood')} →</text>`;
  return s+'</svg>'; }
const radarRegen = rg => radar(rg.ind.map(x=>(x.s??0)/4), rg.ind.map(x=>tx(x.pr)), rg.ind.map(x=>x.col), {w:440});
function medidorIR(v, clase, etq){ if(v==null) return `<svg class="chart medidor" viewBox="0 0 260 186" role="img"><path d="M30,130 A100,100 0 0 1 230,130" stroke="var(--border)" stroke-width="18" fill="none" stroke-dasharray="6 6"/><text x="130" y="150" text-anchor="middle" font-size="28" font-weight="700" class="m">—</text><text x="130" y="176" text-anchor="middle" font-size="11.5" class="m">${esc(T('sin dato','no data'))}</text></svg>`;
  const W=260, H=186, C=130, R=100, a0=Math.PI, ang=a0-Math.PI*Math.max(0,Math.min(1,v)), x=C+0.78*R*Math.cos(ang), y=130-0.78*R*Math.sin(ang);
  const arco=(f0,f1,col)=>{ const s0=a0-Math.PI*f0, s1=a0-Math.PI*f1; return `<path d="M${C+R*Math.cos(s0)},${130-R*Math.sin(s0)} A${R},${R} 0 0 1 ${C+R*Math.cos(s1)},${130-R*Math.sin(s1)}" stroke="${col}" stroke-width="18" fill="none"/>`; };
  return `<svg class="chart medidor" viewBox="0 0 ${W} ${H}" role="img">${arco(0,.25,'#c43a2f')}${arco(.25,.5,'#e0a33a')}${arco(.5,.75,'#7fb35a')}${arco(.75,1,'#2f8f6a')}
    <line x1="${C}" y1="130" x2="${x}" y2="${y}" stroke="var(--text)" stroke-width="3.5" stroke-linecap="round"/><circle cx="${C}" cy="130" r="7" fill="var(--text)"/>
    <text x="${C}" y="166" text-anchor="middle" font-size="28" font-weight="700">${fmt(100*v,0)}</text><text x="${C}" y="182" text-anchor="middle" font-size="11.5" class="m">${esc(etq)}</text><text x="22" y="148" text-anchor="middle" font-size="11" class="m">0</text><text x="238" y="148" text-anchor="middle" font-size="11" class="m">100</text></svg>`; }

/* ---------------- Bloque 6 · Regeneración ---------------- */
function renderRegeneracion(el){ const rg=regeneracion();
  const perilla=(x)=>`<div class="perilla ${x.conf?'confirmada':'sin-confirmar'} ${x.ajustado?'ajustada':''}" style="--pc:${x.col}"><div class="row between"><b>${esc(tx(x.n))}</b><span class="pv">${x.s==null?'—':x.s+' · '+esc(tx(NIVEL04[x.s]))}</span></div>
    <span class="estado-p">${x.conf?'✓ '+T('Confirmado por ti','Confirmed by you'):x.s==null?T('Sin dato: mueve la perilla','No data: move the knob'):T('Sugerido, sin confirmar','Suggested, not confirmed')}</span>
    <input type="range" min="0" max="4" step="1" value="${x.s??2}" data-regen="${x.id}" aria-label="${esc(tx(x.n))}">
    <div class="marcas"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></div>
    <p class="nota">${esc(tx(x.q))}</p><p class="nota sug">${T('Sugerido','Suggested')}: <b>${x.sug??'—'}</b> · ${esc(x.motivo)}</p>
    <div class="row" style="gap:6px;flex-wrap:wrap">${!x.conf&&x.sug!=null?`<button type="button" class="btn sm" data-regen-ok="${x.id}">✓ ${T('Aceptar sugerencia','Accept suggestion')}</button>`:''}${x.conf?`<button type="button" class="btn sm ghost" data-regen-reset="${x.id}">${T('Quitar mi respuesta','Clear my answer')}</button>`:''}</div></div>`;
  el.innerHTML=`${cabecera('regeneracion',T('¿Tu sistema se regenera o se desgasta con cada ciclo? Aquí se mide si las prácticas devuelven al suelo, al agua y a la biodiversidad más de lo que toman. Cada perilla va de 0 a 4: empieza con un valor sugerido a partir de tus actividades y la ajustas a lo que pasa en tu parcela.','Does your system regenerate or wear out with each cycle? This measures whether practices give back to soil, water and biodiversity more than they take. Each knob goes from 0 to 4: it starts at a value suggested by your activities and you adjust it to what happens on your plot.'))}
  ${consejo(T('Mueve las perillas como si ajustaras el volumen: 0 es nada, 4 es lo máximo. Guarda una línea base hoy y vuelve en el próximo ciclo para ver si tu sistema se está regenerando.','Move the knobs like a volume control: 0 is nothing, 4 is the maximum. Save a baseline today and come back next cycle to see whether your system is regenerating.'),
    T('Ocho indicadores en escala ordinal 0–4 basados en los principios de salud del suelo (USDA-NRCS) y en las definiciones de agricultura regenerativa por procesos y resultados (Newton et al., 2020; Schreefel et al., 2020). IR = Σs/(4n). Los valores sugeridos y los cortes de clase son lectura de Ratio Viña.','Eight ordinal 0–4 indicators based on soil health principles (USDA-NRCS) and process- and outcome-based definitions of regenerative agriculture (Newton et al., 2020; Schreefel et al., 2020). IR = Σs/(4n). Suggested values and class cut-offs are Ratio Viña readings.'))}
  <div class="grid g2"><div class="card" style="text-align:center"><h3>${T('Índice de regeneración','Regeneration index')}${ayuda('regen')}</h3>${medidorIR(rg.IR, rg.clase, tx(rg.clase.n))}
     <p><span class="badge ${rg.clase.c}" style="font-size:14px">${esc(tx(rg.clase.n))}</span>${rg.provisional&&rg.IR!=null?` <span class="badge provisional">${T('provisional','provisional')}</span>`:''}</p>
     ${rg.provisional?`<p class="nota">${T(`Confirmaste ${rg.nConf} de 8 perillas. Mientras falten, el índice usa los valores sugeridos y es provisional.`,`You confirmed ${rg.nConf} of 8 knobs. Until all are confirmed the index uses suggested values and is provisional.`)}</p>`:''}
     ${rg.dIR!=null?`<p>${T('Cambio frente a la línea base','Change from baseline')} (${esc(rg.base.fecha)}): <b style="color:var(--${rg.dIR>=0?'ok':'bad'}-text)">${rg.dIR>=0?'+':''}${fmt(100*rg.dIR,0)}</b> ${rg.dIR>0.005?T('· el sistema se regenera','· the system is regenerating'):rg.dIR<-0.005?T('· el sistema se desgasta','· the system is wearing out'):T('· sin cambio','· no change')}</p>`:''}
     <div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap"><button class="btn sm" id="rgBase">${rg.base?T('Actualizar línea base','Update baseline'):T('Guardar como línea base','Save as baseline')}</button>${rg.base?`<button class="btn ghost sm" id="rgBaseX">${T('Quitar línea base','Remove baseline')}</button>`:''}</div>
     <p class="nota">${T('Clases (lectura de Ratio Viña): < 25 degradante · 25–49 convencional · 50–74 en transición regenerativa · ≥ 75 regenerativo.','Classes (Ratio Viña reading): < 25 degrading · 25–49 conventional · 50–74 regenerative transition · ≥ 75 regenerative.')}</p></div>
   <div class="card"><h3>${T('Perfil de regeneración','Regeneration profile')}</h3>${radarRegen(rg)}
     ${rg.base?`<p class="nota">${T('Línea base','Baseline')}: ${rg.base.ind.map(b=>{ const x=rg.ind.find(y=>y.id===b.id); const d=x?x.s-b.s:0; return `${esc(tx((REGEN_IND.find(y=>y.id===b.id)||{pr:b.id}).pr))} ${d>0?'↑':d<0?'↓':'→'}`; }).join(' · ')}</p>`:''}</div></div>
  <div class="card"><h3>${T('Las ocho perillas de la regeneración','The eight regeneration knobs')}</h3><div class="perillas">${rg.ind.map(perilla).join('')}</div></div>
  <div class="grid g2"><div class="card"><h3>${T('Materia orgánica del suelo (opcional)','Soil organic matter (optional)')}</h3>
     <div class="grid g2"><label class="f"><span>${T('% MO en la línea base','% SOM at baseline')}</span><input type="number" step="0.1" min="0" id="moB" value="${rg.mo.b??''}"></label><label class="f"><span>${T('% MO actual','Current % SOM')}</span><input type="number" step="0.1" min="0" id="moA" value="${rg.mo.a??''}"></label></div>
     ${rg.mo.b!=null&&rg.mo.a!=null&&rg.mo.b!==''&&rg.mo.a!==''?`<p>${T('Cambio','Change')}: <b style="color:var(--${(+rg.mo.a)>=(+rg.mo.b)?'ok':'bad'}-text)">${(+rg.mo.a)-(+rg.mo.b)>=0?'+':''}${fmt((+rg.mo.a)-(+rg.mo.b),2)}</b> ${T('puntos de MO','SOM points')} (${fmt(100*((+rg.mo.a)-(+rg.mo.b))/(+rg.mo.b||1),0)} %)</p>`:`<p class="nota">${T('Con dos análisis de suelo (antes y ahora) ves si la materia orgánica sube: es la prueba más directa de regeneración.','With two soil tests (before and now) you see whether organic matter rises: the most direct proof of regeneration.')}</p>`}</div>
   <div class="card"><h3>${T('Actividades que regeneran y que desgastan','Activities that regenerate and wear out')}</h3>
     <p class="nota">${T('Suma del impacto en suelo, agua, vegetación y fauna (Bloque 5).','Sum of impact on soil, water, vegetation and fauna (Block 5).')}</p>
     <div class="grid g2"><div><b style="color:var(--ok-text)">${T('Regeneran','Regenerate')}</b><ul>${rg.sube.map(x=>`<li>${esc(tx(x.a.n))} <span class="muted">(+${x.r})</span></li>`).join('')||`<li class="muted">—</li>`}</ul></div>
     <div><b style="color:var(--bad-text)">${T('Desgastan','Wear out')}</b><ul>${rg.baja.map(x=>`<li>${esc(tx(x.a.n))} <span class="muted">(${x.r})</span></li>`).join('')||`<li class="muted">—</li>`}</ul></div></div></div></div>
  ${siguiente('regeneracion')}`;
  $$('[data-regen]',el).forEach(i=>i.oninput=()=>{ const v=+i.value; i.closest('.perilla').querySelector('.pv').textContent=v+' · '+tx(NIVEL04[v]); });
  $$('[data-regen]',el).forEach(i=>i.onchange=()=>{ S.regen=S.regen||{}; S.regen[i.dataset.regen]=+i.value; guardar(); render(); });
  $$('[data-regen-reset]',el).forEach(b=>b.onclick=()=>{ delete S.regen[b.dataset.regenReset]; guardar(); render(); });
  $$('[data-regen-ok]',el).forEach(b=>b.onclick=()=>{ const x=rg.ind.find(y=>y.id===b.dataset.regenOk); S.regen=S.regen||{}; S.regen[x.id]=x.sug; guardar(); render(); });
  $('#rgBase',el).onclick=()=>{ if(rg.IR==null) return toast(T('Primero mueve o acepta las perillas','First move or accept the knobs')); S.regenBase={fecha:new Date().toISOString().slice(0,10), IR:rg.IR, ind:rg.ind.map(x=>({id:x.id,s:x.s}))}; guardar(); render(); toast(T('Línea base guardada','Baseline saved')); };
  if($('#rgBaseX',el)) $('#rgBaseX',el).onclick=()=>{ if(confirm(T('¿Quitar la línea base?','Remove the baseline?'))){ S.regenBase=null; guardar(); render(); } };
  ['moB','moA'].forEach(k=>$('#'+k,el).onchange=e=>{ S.regenMO=S.regenMO||{}; S.regenMO[k==='moB'?'b':'a']=e.target.value; guardar(); render(); });
  enlazarTips(el); }

/* ---------------- Bloque 7 · Riesgos ---------------- */
function renderRiesgos(el){ const rs=riesgos(), cls=CLASE_RG(rs.idx), filtro=renderRiesgos.cat||'todos';
  const fila=x=>`<tr class="${x.off?'r-off':''} ${x.conf?'r-conf':'r-sinconf'}"><td><input type="checkbox" data-roff="${x.id}" ${x.off?'':'checked'} aria-label="${T('Aplica','Applies')}"></td>
    <td><span class="punto" style="background:${CAT_R[x.cat].col}"></span>${esc(tx(x.n))} ${x.off?'':x.conf?`<span class="estado-p ok">✓ ${T('confirmado','confirmed')}</span>`:`<span class="estado-p">${T('sugerido, sin confirmar','suggested, not confirmed')}</span> <button type="button" class="btn sm" data-rok="${x.id}">✓ ${T('Aceptar','Accept')}</button>`}<br><small class="muted">${T('Sugerido','Suggested')}: P ${x.sug.p} · I ${x.sug.i} — ${esc(x.sug.m)}</small></td>
    <td class="perilla-c"><input type="range" min="1" max="5" step="1" value="${Math.round(x.p)}" data-rp="${x.id}" ${x.off?'disabled':''}><small>${Math.round(x.p)} · ${esc(tx(NIVEL15[Math.round(x.p)]))}</small></td>
    <td class="perilla-c"><input type="range" min="1" max="5" step="1" value="${x.i}" data-ri="${x.id}" ${x.off?'disabled':''}><small>${x.i} · ${esc(tx(NIVEL15[x.i]))}</small></td>
    <td class="perilla-c"><input type="range" min="0" max="3" step="1" value="${x.ctl}" data-rc="${x.id}" ${x.off?'disabled':''}><small>${[T('ninguno','none'),T('bajo','low'),T('medio','medium'),T('alto','high')][x.ctl]}</small></td>
    <td class="r"><b style="color:${x.nivel.c}">${fmt(x.r,1)}</b><br><small>${esc(tx(x.nivel.n))}</small></td></tr>`;
  const lista=rs.L.filter(x=>filtro==='todos'||x.cat===filtro);
  el.innerHTML=`${cabecera('riesgos',T('¿Qué puede salir mal y qué tan grave sería? Cada riesgo se mide con dos perillas: qué tan probable es (1 a 5) y qué tanto daño haría (1 a 5). La capacidad de adaptación de tu sistema —su regeneración, diversificación, conocimiento técnico e instituciones— lo reduce.','What could go wrong and how serious would it be? Each risk is measured with two knobs: how likely it is (1 to 5) and how much damage it would do (1 to 5). Your system’s adaptive capacity —its regeneration, diversification, technical knowledge and institutions— reduces it.'))}
  ${consejo(T('Empieza por los riesgos que ya viviste en tu localidad. Si un riesgo no aplica, desmárcalo. La tercera perilla es el control que ya tienes (seguro, reserva de semilla, bordo, venta anticipada…).','Start with the risks you have already lived through. If a risk does not apply, untick it. The third knob is the control you already have (insurance, seed reserve, contour bund, forward sale…).'),
    T('Matriz de probabilidad × impacto de 5 × 5 (IEC 31010:2019; ISO 31000:2018) dentro del marco de riesgo del IPCC (2014): amenaza, exposición y vulnerabilidad. r = P·I·(1 − 0.4·CA)·(1 − 0.15·control); índice = media de r / 25. Los factores 0.4 y 0.15 son supuestos de Ratio Viña.','5 × 5 likelihood × impact matrix (IEC 31010:2019; ISO 31000:2018) within the IPCC (2014) risk framework: hazard, exposure and vulnerability. r = P·I·(1 − 0.4·CA)·(1 − 0.15·control); index = mean r / 25. The 0.4 and 0.15 factors are Ratio Viña assumptions.'))}
  ${rs.provisional?`<div class="alert info no-print"><p><b>${T(`Confirmaste ${rs.nConf} de ${rs.L.length} riesgos.`,`You confirmed ${rs.nConf} of ${rs.L.length} risks.`)}</b> ${T('Los demás muestran valores sugeridos (en gris): no son tus respuestas. Mueve sus perillas, pulsa «Aceptar» o desmarca los que no aplican. Mientras falten, el índice es provisional.','The rest show suggested values (in grey): they are not your answers. Move their knobs, press “Accept” or untick those that do not apply. Until then the index is provisional.')}</p></div>`:''}
  <div class="kpis"><div class="kpi" style="border-top:4px solid var(--${cls.c})"><div class="l">${T('Índice de riesgo','Risk index')}${ayuda('riesgo')}</div><div class="v">${fmt(100*rs.idx,0)}</div><div class="s"><span class="badge ${cls.c}">${esc(tx(cls.n))}</span>${rs.provisional?` <span class="badge provisional">${T('provisional','provisional')}</span>`:''} ${T('de 0 a 100','from 0 to 100')}</div></div>
   <div class="kpi"><div class="l">${T('Capacidad adaptativa','Adaptive capacity')}${ayuda('CA')}</div><div class="v">${rs.sinCA?'—':fmt(100*rs.CA,0)}</div><div class="s">${rs.partsCA.map(p=>esc(tx(p.n))+' '+fmt(100*p.v,0)).join(' · ')}</div></div>
   <div class="kpi"><div class="l">${T('Riesgos altos o muy altos','High or very high risks')}</div><div class="v">${rs.act.filter(x=>x.r>9).length}</div><div class="s">${T('de','of')} ${rs.act.length} ${T('que aplican','that apply')}</div></div>
   <div class="kpi"><div class="l">${T('Mayor riesgo','Highest risk')}</div><div class="v" style="font-size:18px">${rs.top[0]?esc(tx(rs.top[0].n)):'—'}</div><div class="s">${rs.top[0]?fmt(rs.top[0].r,1)+' / 25':''}</div></div></div>
  <div class="grid g2"><div class="card"><h3>${T('Matriz de riesgos','Risk matrix')}</h3>${matrizRiesgo(rs)}<p class="nota">${T('Cada círculo indica cuántos riesgos caen en esa celda; pasa el cursor para ver cuáles.','Each circle shows how many risks fall in that cell; hover to see which.')}</p></div>
   <div class="card"><h3>${T('Riesgo por categoría','Risk by category')}</h3>${barrasH(rs.porCat.filter(c=>c.v!=null).map(c=>({l:tx(CAT_R[c.k].n), v:100*c.v, c:CAT_R[c.k].col, vl:fmt(100*c.v,0)})),{max:100, izq:170})}
     <h4 style="margin:10px 0 4px">${T('Los cinco riesgos mayores','The five highest risks')}</h4><ol>${rs.top.slice(0,5).map(x=>`<li>${esc(tx(x.n))} <b style="color:${x.nivel.c}">${fmt(x.r,1)}</b></li>`).join('')}</ol></div></div>
  <div class="card"><div class="row between"><h3 style="margin:0">${T('Perillas de cada riesgo','Knobs for each risk')}</h3><div class="basesw">${[['todos',T('Todos','All')],...Object.entries(CAT_R).map(([k,c])=>[k,tx(c.n)])].map(([k,n])=>`<button data-rcat="${k}" class="${k===filtro?'on':''}">${esc(n)}</button>`).join('')}</div></div>
   <div class="tbl-c"><table class="tbl riesgos-t"><thead><tr><th>${T('Aplica','Applies')}</th><th>${T('Riesgo','Risk')}</th><th>${T('Probabilidad','Likelihood')}</th><th>${T('Impacto','Impact')}</th><th>${T('Control','Control')}</th><th class="r">${T('Riesgo','Risk')} /25</th></tr></thead><tbody>${lista.map(fila).join('')}</tbody></table></div>
   <div class="row" style="gap:8px;margin-top:8px"><button class="btn ghost sm" id="rReset">${T('Borrar mis respuestas','Clear my answers')}</button></div>
</div>
  ${siguiente('riesgos')}`;
  // mover cualquier perilla de un riesgo confirma también las otras dos tal como se ven
  const U=()=>{ S.riesgo=S.riesgo||{}; return S.riesgo; }, set=(id,k,v)=>{ const u=U(), x=rs.L.find(y=>y.id===id); u[id]=u[id]||{}; if(k!=='off'){ if(u[id].p==null) u[id].p=x.sug.p; if(u[id].i==null) u[id].i=x.sug.i; } u[id][k]=v; guardar(); render(); };
  $$('[data-rok]',el).forEach(b=>b.onclick=()=>{ const u=U(), x=rs.L.find(y=>y.id===b.dataset.rok); u[x.id]=Object.assign(u[x.id]||{}, {p:x.sug.p, i:x.sug.i, ok:true}); guardar(); render(); });
  $$('[data-rp]',el).forEach(i=>i.onchange=()=>set(i.dataset.rp,'p',+i.value));
  $$('[data-ri]',el).forEach(i=>i.onchange=()=>set(i.dataset.ri,'i',+i.value));
  $$('[data-rc]',el).forEach(i=>i.onchange=()=>set(i.dataset.rc,'c',+i.value));
  $$('[data-roff]',el).forEach(i=>i.onchange=()=>set(i.dataset.roff,'off',!i.checked));
  $$('[data-rcat]',el).forEach(b=>b.onclick=()=>{ renderRiesgos.cat=b.dataset.rcat; render(); });
  $('#rReset',el).onclick=()=>{ if(confirm(T('¿Borrar tus respuestas en todos los riesgos? Volverán a verse los valores sugeridos, sin confirmar.','Clear your answers on all risks? Suggested, unconfirmed values will show again.'))){ S.riesgo={}; guardar(); render(); } };
  enlazarTips(el); }

/* ---------------- Tarjetas para los bloques siguientes ---------------- */
function tarjetaRegenRiesgo(id){ const rg=regeneracion(), rs=riesgos({rg}), crg=CLASE_RG(rs.idx);
  const k2=`<div class="kpis" style="margin:8px 0"><div class="kpi"><div class="l">${T('Regeneración (Bloque 6)','Regeneration (Block 6)')}</div><div class="v">${fmt(100*rg.IR,0)}</div><div class="s"><span class="badge ${rg.clase.c}">${esc(tx(rg.clase.n))}</span></div></div>
     <div class="kpi"><div class="l">${T('Riesgo (Bloque 7)','Risk (Block 7)')}</div><div class="v">${fmt(100*rs.idx,0)}</div><div class="s"><span class="badge ${crg.c}">${esc(tx(crg.n))}</span></div></div>
     <div class="kpi"><div class="l">${T('Capacidad adaptativa','Adaptive capacity')}</div><div class="v">${fmt(100*rs.CA,0)}</div><div class="s">0–100</div></div></div>`;
  if(id==='elementos'){ const exp={}; rs.act.forEach(x=>x.el.forEach(e=>{ exp[e]=Math.max(exp[e]||0,x.r); }));
    const l=Object.entries(exp).filter(([e])=>elemPorId(e)).sort((a,b)=>b[1]-a[1]).slice(0,10);
    return `<div class="card rr-card"><h3>${T('Regeneración y riesgo en los elementos','Regeneration and risk in the elements')}</h3>${k2}
      <p class="nota">${T('Elementos más expuestos: el riesgo mayor de las amenazas que los afectan (Bloque 7).','Most exposed elements: the highest risk among the hazards that affect them (Block 7).')}</p>
      ${barrasH(l.map(([e,r])=>{ const d=elemPorId(e); return {l:tx(d.n), v:r, c:CATS[d.cat].col, vl:fmt(r,1)}; }),{max:25, izq:240})}</div>`; }
  if(id==='formulacion') return `<div class="card rr-card"><h3>${T('Regeneración y riesgo en el modelo','Regeneration and risk in the model')}</h3>${k2}
      <div class="formula">IR = Σ<sub>k</sub> s<sub>k</sub> / (4·8) ; CA = media(IR, ${T('diversificación','diversification')}, ${T('conocimiento técnico','technical knowledge')}, ${T('integración institucional','institutional integration')})<br>r<sub>h</sub> = P<sub>h</sub>·I<sub>h</sub>·(1 − 0.4·CA)·(1 − 0.15·c<sub>h</sub>) ; ${T('índice de riesgo','risk index')} = Σ r<sub>h</sub> / (25·H)</div>
      <p class="nota">${T('La regeneración es una propiedad emergente: resulta de cómo se combinan las actividades y no de una sola práctica. El riesgo depende de la amenaza y de la vulnerabilidad del sistema, que la capacidad adaptativa reduce (IPCC, 2014).','Regeneration is an emergent property: it results from how activities combine, not from a single practice. Risk depends on the hazard and on system vulnerability, which adaptive capacity reduces (IPCC, 2014).')}</p></div>`;
  if(id==='tablero') return `<div class="card t12 rr-card"><h3>${T('Regeneración y riesgo del sistema','System regeneration and risk')}</h3>${k2}
      <div class="grid g2"><div>${radarRegen(rg)}</div><div>${matrizRiesgo(rs,{celda:54})}</div></div></div>`;
  if(id==='sostenible') return `<div class="card rr-card"><h3>${T('Regeneración, riesgo y sostenibilidad','Regeneration, risk and sustainability')}</h3>${k2}
      <p>${T('Un sistema sostenible se mantiene; uno regenerativo, además, mejora sus recursos con cada ciclo. Un riesgo alto amenaza ambos.','A sustainable system maintains itself; a regenerative one also improves its resources each cycle. High risk threatens both.')} ${T('Relación con los ODS (lectura de Ratio Viña): la regeneración aporta a los ODS 2, 13 y 15; la gestión del riesgo, a los ODS 1, 2 y 13.','SDG links (Ratio Viña reading): regeneration contributes to SDGs 2, 13 and 15; risk management to SDGs 1, 2 and 13.')}</p>
      ${barrasH(rg.ind.map(x=>({l:tx(x.n), v:x.s??0, c:x.col, vl:x.s==null?'—':x.s+' / 4'+(x.conf?'':' *')})),{max:4, izq:240})}${rg.provisional?`<p class="nota">* ${T('sugerido, sin confirmar','suggested, not confirmed')}</p>`:''}</div>`;
  return ''; }
function ponerRegenRiesgo(id, el){ if(!['elementos','formulacion','tablero','sostenible'].includes(id)) return; const h=tarjetaRegenRiesgo(id); if(!h) return;
  const nx=$('.next',el); if(id==='tablero'){ const t=$('.tablero',el); if(t){ t.insertAdjacentHTML('afterbegin',h); return; } }
  if(nx) nx.insertAdjacentHTML('beforebegin',h); else el.insertAdjacentHTML('beforeend',h); }
function informeRegenRiesgo(){ const rg=regeneracion(), rs=riesgos({rg}), crg=CLASE_RG(rs.idx);
  return `<div class="card"><h3>${T('Regeneración del sistema','System regeneration')}</h3>
     <div class="grid g2"><div style="text-align:center">${medidorIR(rg.IR, rg.clase, tx(rg.clase.n))}<p><span class="badge ${rg.clase.c}">${esc(tx(rg.clase.n))}</span>${rg.dIR!=null?` · ${T('cambio frente a la línea base','change from baseline')} ${rg.dIR>=0?'+':''}${fmt(100*rg.dIR,0)}`:''}</p></div><div>${radarRegen(rg)}</div></div>
     <table class="tbl"><tbody>${rg.ind.map(x=>`<tr><td>${esc(tx(x.n))}</td><td class="r"><b>${x.s??'—'}</b> / 4</td><td class="muted">${x.s!=null?esc(tx(NIVEL04[x.s])):''}${x.conf?'':' · '+T('sugerido, sin confirmar','suggested, not confirmed')}</td></tr>`).join('')}</tbody></table></div>
   <div class="card"><h3>${T('Riesgos del sistema','System risks')}</h3>
     <p>${T('Índice de riesgo','Risk index')}: <b>${fmt(100*rs.idx,0)}</b> / 100 · <span class="badge ${crg.c}">${esc(tx(crg.n))}</span> · ${T('capacidad adaptativa','adaptive capacity')} ${fmt(100*rs.CA,0)}</p>
     <div class="grid g2"><div>${matrizRiesgo(rs,{celda:54})}</div><div><table class="tbl"><thead><tr><th>${T('Riesgo','Risk')}</th><th class="r">P</th><th class="r">I</th><th class="r">r</th></tr></thead><tbody>${rs.top.slice(0,8).map(x=>`<tr><td>${esc(tx(x.n))}</td><td class="r">${fmt(x.p,0)}</td><td class="r">${x.i}</td><td class="r"><b style="color:${x.nivel.c}">${fmt(x.r,1)}</b></td></tr>`).join('')}</tbody></table></div></div></div>`; }
