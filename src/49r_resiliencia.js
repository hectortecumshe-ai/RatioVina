"use strict";
/* =====================================================================
   Bloque · RESILIENCIA DEL AGROECOSISTEMA
   ---------------------------------------------------------------------
   Parte 1. Los 13 indicadores de comportamiento de la resiliencia del
   agroecosistema de Cabell y Oelofse (2012, Ecology and Society 17(1): 18).
   El artículo los trata como presentes o ausentes («su ausencia o
   desaparición expone vulnerabilidades») y no propone una escala numérica:
   la perilla 0–4 (0 ausente … 4 muy presente) y el índice
   IRes = Σ s / (4·n) sobre las perillas respondidas son «Lectura de Ratio».
   Parte 2. Riesgo frente a un evento climático (Nicholls y Altieri, 2013,
   en Altieri et al., 2015, Agronomy for Sustainable Development 35: 869–890):
        Riesgo = Vulnerabilidad × Amenaza / Capacidad de respuesta.
   Indicadores de vulnerabilidad (pendiente, diversidad del paisaje,
   susceptibilidad del suelo a la erosión) y de capacidad de respuesta
   (conservación de suelo, manejo del agua, diversidad de cultivos,
   autosuficiencia alimentaria) del estudio de Henao (2013) citado por
   Altieri et al. (2015), calificados de 1 a 5, donde 1 o 2 expresan mayor
   vulnerabilidad. Para la fórmula: V = 6 − media de los indicadores de
   vulnerabilidad (1 = poco vulnerable … 5 = muy vulnerable), C = media de
   los de capacidad (1–5) y A = amenaza (1–5, intensidad, frecuencia,
   duración e impacto del evento). R va de 0.2 a 25; la inversión 6 − x,
   la media y los cortes de clase son «Lectura de Ratio».
   No hay valores sugeridos: todo lo responde la persona; sin respuesta,
   «sin dato».
   ===================================================================== */
const RESIL_IND = [
  {id:'autoorg', c:E('Autoorganización','Self-organisation'), n:E('Socialmente autoorganizado','Socially self-organized'), col:'#2f6b8a',
   q:E('¿La gente de la localidad se organiza por sí misma (grupos, cooperativas, faenas, mercados locales) para resolver lo que necesita?','Do local people organise themselves (groups, cooperatives, communal work, local markets) to solve what they need?')},
  {id:'autorreg', c:E('Autorregulación','Self-regulation'), n:E('Ecológicamente autorregulado','Ecologically self-regulated'), col:'#2f8f6a',
   q:E('¿El agua, la biodiversidad y la fertilidad del suelo mantienen el sistema funcionando con poca intervención (enemigos naturales de plagas, cobertura, árboles)?','Do water, biodiversity and soil fertility keep the system running with little intervention (natural pest enemies, cover, trees)?')},
  {id:'conectado', c:E('Conexión','Connectedness'), n:E('Conectado de forma adecuada','Appropriately connected'), col:'#5a7fa8',
   q:E('¿Tiene muchos vínculos flexibles (varios compradores, proveedores, vecinos, instituciones) de modo que ninguno sea indispensable?','Does it have many flexible links (several buyers, suppliers, neighbours, institutions) so that no single one is indispensable?')},
  {id:'diversidad', c:E('Diversidad','Diversity'), n:E('Diversidad funcional y de respuesta','Functional and response diversity'), col:'#3f9a4f',
   q:E('¿Hay muchas especies y variedades que cumplen funciones distintas y responden distinto a la sequía, la helada o las plagas?','Are there many species and varieties with different functions that respond differently to drought, frost or pests?')},
  {id:'redundancia', c:E('Redundancia','Redundancy'), n:E('Redundancia óptima','Optimally redundant'), col:'#7a9a3a',
   q:E('¿Hay respaldos si algo falla: semilla guardada, otra fuente de agua, otro cultivo o animal que cumpla la misma función?','Are there back-ups if something fails: saved seed, another water source, another crop or animal doing the same job?')},
  {id:'heterog', c:E('Heterogeneidad','Heterogeneity'), n:E('Heterogeneidad espacial y temporal','Spatial and temporal heterogeneity'), col:'#9a8a3a',
   q:E('¿El paisaje y la parcela cambian en el espacio y en el tiempo: mosaico de cultivos, rotaciones, barbechos, árboles y bordes?','Do the landscape and plot vary across space and time: crop mosaic, rotations, fallows, trees and borders?')},
  {id:'expuesto', c:E('Exposición','Exposure'), n:E('Expuesto con cuidado a la perturbación','Carefully exposed to disturbance'), col:'#c0772b',
   q:E('¿Se prueban cambios pequeños y controlados (nuevas variedades, manejo diferente en una parte) que enseñan a recuperarse sin arriesgar todo?','Are small, controlled changes tried (new varieties, different management on part of the plot) that teach recovery without risking everything?')},
  {id:'capital', c:E('Capital natural','Natural capital'), n:E('Acoplado con el capital natural local','Responsibly coupled with local natural capital'), col:'#8a6a3a',
   q:E('¿El sistema vive de lo que da el lugar sin agotarlo: abonos y semillas propias, residuos que vuelven como recurso?','Does the system live within what the place provides without depleting it: own manures and seed, residues returned as a resource?')},
  {id:'aprendizaje', c:E('Aprendizaje','Learning'), n:E('Aprendizaje reflexivo y compartido','Reflective and shared learning'), col:'#6a5aa8',
   q:E('¿Se aprende de la experiencia y se comparte (entre vecinos, con técnicos, de generación en generación), por escrito o de palabra?','Is experience learned from and shared (among neighbours, with technicians, across generations), in writing or by word of mouth?')},
  {id:'autonomia', c:E('Autonomía','Autonomy'), n:E('Autónomo hacia fuera, interdependiente hacia dentro','Globally autonomous and locally interdependent'), col:'#a85a6a',
   q:E('¿Depende poco de insumos, precios o decisiones de fuera, y mucho de la cooperación local?','Does it depend little on outside inputs, prices or decisions, and much on local cooperation?')},
  {id:'legado', c:E('Legado','Legacy'), n:E('Honra el legado e invierte en el futuro','Honors legacy while investing in the future'), col:'#b08a2f',
   q:E('¿Se conservan y usan las semillas nativas, las tradiciones y el saber de las personas mayores para adaptarse a lo que viene?','Are native seeds, traditions and elders’ knowledge kept and used to adapt to what is coming?')},
  {id:'humano', c:E('Capital humano','Human capital'), n:E('Construye capital humano','Builds human capital'), col:'#3a8a9a',
   q:E('¿Se forman y apoyan los conocimientos, habilidades y redes de las personas (capacitación, escuela, jóvenes que se quedan)?','Are people’s knowledge, skills and networks developed and supported (training, school, young people who stay)?')},
  {id:'rentable', c:E('Rentabilidad','Profitability'), n:E('Razonablemente rentable','Reasonably profitable'), col:'#4f7a3a',
   q:E('¿Se puede vivir de este trabajo sin depender mucho de ingresos fuera de la parcela o de subsidios?','Can people make a living from this work without depending heavily on off-farm income or subsidies?')}
];
/* Vulnerabilidad y capacidad de respuesta (Henao, 2013, en Altieri et al., 2015): 1–5, 1 o 2 = más vulnerable */
const RESIL_VUL = [
  {id:'pendiente', n:E('Pendiente del terreno','Slope'), q:E('1 = ladera muy inclinada · 5 = terreno plano','1 = very steep slope · 5 = flat land')},
  {id:'paisaje', n:E('Diversidad del paisaje','Landscape diversity'), q:E('1 = todo alrededor es un solo cultivo · 5 = mosaico de bosque, cercos vivos y cultivos diversos','1 = a single crop all around · 5 = mosaic of forest, living fences and diverse crops')},
  {id:'erosion', n:E('Susceptibilidad del suelo a la erosión','Soil susceptibility to erosion'), q:E('1 = el suelo se lava o se vuela con facilidad · 5 = suelo firme y protegido','1 = soil washes or blows away easily · 5 = firm, protected soil')}];
const RESIL_CAP = [
  {id:'conserva', n:E('Prácticas de conservación de suelo','Soil conservation practices'), q:E('1 = ninguna · 5 = terrazas, curvas de nivel, barreras vivas o cobertura en toda la parcela','1 = none · 5 = terraces, contour lines, living barriers or cover over the whole plot')},
  {id:'agua', n:E('Prácticas de manejo del agua','Water management practices'), q:E('1 = ninguna · 5 = cosecha de agua, zanjas, bordos, riego eficiente','1 = none · 5 = water harvesting, ditches, bunds, efficient irrigation')},
  {id:'cultivos', n:E('Diversidad de cultivos','Crop diversity'), q:E('1 = un solo cultivo · 5 = muchas especies y variedades','1 = a single crop · 5 = many species and varieties')},
  {id:'autosuf', n:E('Autosuficiencia alimentaria','Food self-sufficiency'), q:E('1 = la familia compra casi todo lo que come · 5 = produce casi todo lo que come','1 = the family buys almost everything it eats · 5 = it produces almost everything it eats')}];
const RESIL_EV = [['sequia',E('Sequía','Drought')],['helada',E('Helada','Frost')],['granizo',E('Granizo','Hail')],['lluvia',E('Lluvia intensa o inundación','Heavy rain or flood')],['huracan',E('Huracán o viento fuerte','Hurricane or strong wind')],['calor',E('Ola de calor','Heat wave')],['otro',E('Otro','Other')]];
const NIVEL_RES = [E('Ausente','Absent'),E('Apenas presente','Barely present'),E('Presente a medias','Partly present'),E('Presente','Present'),E('Muy presente','Very present')];
const CLASE_RES = v=> v==null?{n:E('Sin dato','No data'),c:''} : v<0.25?{n:E('Frágil','Fragile'),c:'bad'} : v<0.5?{n:E('Resiliencia baja','Low resilience'),c:'warn'} : v<0.75?{n:E('Resiliencia media','Medium resilience'),c:'ok'} : {n:E('Resiliencia alta','High resilience'),c:'ok'};
const CLASE_RRES = r=> r==null?{n:E('Sin dato','No data'),c:''} : r<2?{n:E('Riesgo bajo','Low risk'),c:'ok'} : r<5?{n:E('Riesgo medio','Medium risk'),c:'warn'} : r<10?{n:E('Riesgo alto','High risk'),c:'bad'} : {n:E('Riesgo muy alto','Very high risk'),c:'bad'};
const _num15 = v=> v===''||v==null||isNaN(+v)?null:Math.max(1,Math.min(5,+v));
function resilAgro(){ const R0=S.resil||{}, I=R0.ind||{}, Vu=R0.vul||{}, Ca=R0.cap||{};
  const ind=RESIL_IND.map(x=>({...x, s:I[x.id]==null||I[x.id]===''?null:+I[x.id]}));
  const r=ind.filter(x=>x.s!=null), IRes=r.length?r.reduce((t,x)=>t+x.s,0)/(4*r.length):null;
  const vul=RESIL_VUL.map(x=>({...x, s:_num15(Vu[x.id])})), cap=RESIL_CAP.map(x=>({...x, s:_num15(Ca[x.id])}));
  const media=l=>{ const k=l.filter(x=>x.s!=null); return k.length?k.reduce((t,x)=>t+x.s,0)/k.length:null; };
  const mV=media(vul), C=media(cap), A=_num15(R0.am), V=mV==null?null:6-mV;
  const R=V!=null&&C!=null&&A!=null?V*A/C:null;
  return {ind, nResp:r.length, IRes, clase:CLASE_RES(IRes), provisional:r.length>0&&r.length<RESIL_IND.length, vul, cap, V, C, A, R, claseR:CLASE_RRES(R), ev:R0.ev||'',
    nTot:RESIL_IND.length+RESIL_VUL.length+RESIL_CAP.length+1, nHecho:r.length+vul.filter(x=>x.s!=null).length+cap.filter(x=>x.s!=null).length+(A!=null?1:0)}; }
function _resSet(grupo, id, v){ S.resil=S.resil||{}; if(grupo==='am'||grupo==='ev'){ S.resil[grupo]=v; } else { S.resil[grupo]=S.resil[grupo]||{}; if(v==null) delete S.resil[grupo][id]; else S.resil[grupo][id]=v; } guardar(); render(); }
function barrasVCA(z){ const fil=[[T('Vulnerabilidad','Vulnerability'),z.V,'#c43a2f'],[T('Amenaza','Threat'),z.A,'#e0a33a'],[T('Capacidad de respuesta','Response capacity'),z.C,'#2f8f6a']];
  const W=440, H=24+fil.length*40, L=170, w=W-L-50;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${T('Vulnerabilidad, amenaza y capacidad de respuesta','Vulnerability, threat and response capacity')}">${fil.map(([n,v,c],i)=>{ const y=14+i*40;
    return `<text x="${L-8}" y="${y+15}" text-anchor="end" font-size="12.5">${esc(n)}</text><rect x="${L}" y="${y}" width="${w}" height="20" rx="5" fill="var(--border)" opacity=".45"/>${v!=null?`<rect x="${L}" y="${y}" width="${(w*v/5).toFixed(1)}" height="20" rx="5" fill="${c}"/>`:''}<text x="${L+w+8}" y="${y+15}" font-size="12.5" font-weight="700">${v!=null?fmt(v,1):'—'}</text>`; }).join('')}</svg>`; }
function renderResiliencia(el){ const z=resilAgro(), RL=T('Lectura de '+CONFIG.app,CONFIG.app+' reading');
  const perilla=x=>`<div class="perilla ${x.s!=null?'confirmada':'sin-confirmar'}" style="--pc:${x.col}"><div class="row between"><b>${esc(tx(x.n))}</b><span class="pv">${x.s==null?'—':x.s+' · '+esc(tx(NIVEL_RES[x.s]))}</span></div>
    <span class="estado-p">${x.s!=null?'✓ '+T('Respondido','Answered'):T('Sin dato: mueve la perilla','No data: move the knob')}</span>
    <input type="range" min="0" max="4" step="1" value="${x.s??2}" data-res-ind="${x.id}" aria-label="${esc(tx(x.n))}">
    <div class="marcas"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></div>
    <p class="nota">${esc(tx(x.q))}</p>${x.s!=null?`<button type="button" class="btn sm ghost" data-res-x="ind:${x.id}">${T('Quitar mi respuesta','Clear my answer')}</button>`:''}</div>`;
  const esc15=(g,x)=>`<div class="res15"><div class="row between"><b>${esc(tx(x.n))}</b><span class="pv">${x.s??'—'}</span></div><div class="res15-b" role="group" aria-label="${esc(tx(x.n))}">${[1,2,3,4,5].map(k=>`<button type="button" class="btn sm ${x.s===k?'':'ghost'}" data-res15="${g}:${x.id}:${k}">${k}</button>`).join('')}${x.s!=null?`<button type="button" class="btn sm ghost" data-res-x="${g}:${x.id}" aria-label="${T('Quitar','Clear')}">✕</button>`:''}</div><p class="nota">${esc(tx(x.q))}</p></div>`;
  el.innerHTML=`${cabecera('resiliencia',T('¿Qué tan bien aguanta tu sistema un golpe (una sequía, una helada, una caída de precios) y qué tan rápido se levanta? Aquí respondes trece preguntas sobre cómo se comporta tu sistema y calificas qué tan expuesto está y con qué cuenta para responder a un evento del clima.','How well does your system withstand a blow (a drought, a frost, a price drop) and how fast does it recover? Here you answer thirteen questions about how your system behaves and rate how exposed it is and what it has to respond to a climatic event.'))}
  ${consejo(T('No hay respuestas buenas o malas: responde lo que pasa hoy. 0 es que no se da, 4 es que se da mucho. Lo que no sepas, déjalo sin mover: queda «sin dato».','There are no right or wrong answers: answer what happens today. 0 means it does not happen, 4 means it happens a lot. Leave what you do not know untouched: it stays «no data».'),
    T('Parte 1: los 13 indicadores de comportamiento de Cabell y Oelofse (2012). El artículo los trata como presentes o ausentes; la escala 0–4 y IRes = Σs/(4n) sobre las perillas respondidas son lectura de '+CONFIG.app+'. Parte 2: Riesgo = Vulnerabilidad × Amenaza / Capacidad de respuesta (Nicholls y Altieri, 2013, en Altieri et al., 2015), con los indicadores 1–5 de Henao (2013) donde 1 o 2 expresan mayor vulnerabilidad; V = 6 − media, C = media, A = 1–5; R ∈ [0.2, 25].','Part 1: the 13 behaviour-based indicators of Cabell and Oelofse (2012). The paper treats them as present or absent; the 0–4 scale and IRes = Σs/(4n) over answered knobs are a '+CONFIG.app+' reading. Part 2: Risk = Vulnerability × Threat / Response capacity (Nicholls and Altieri, 2013, in Altieri et al., 2015), with Henao’s (2013) 1–5 indicators where 1 or 2 express higher vulnerability; V = 6 − mean, C = mean, A = 1–5; R ∈ [0.2, 25].'))}
  <div class="grid g2"><div class="card" style="text-align:center"><h3>${T('Índice de resiliencia','Resilience index')}</h3>${medidorIR(z.IRes, z.clase, tx(z.clase.n))}
     <p>${z.IRes!=null?`<span class="badge ${z.clase.c}" style="font-size:14px">${esc(tx(z.clase.n))}</span>`:''}${z.provisional?` <span class="badge provisional">${T('provisional','provisional')}</span>`:''}</p>
     <p class="nota">${z.IRes==null?T('Sin dato: responde al menos una perilla.','No data: answer at least one knob.'):T(`Respondiste ${z.nResp} de 13 perillas.`,`You answered ${z.nResp} of 13 knobs.`)} ${T('Clases','Classes')} (${esc(RL)}): &lt; 25 ${T('frágil','fragile')} · 25–49 ${T('baja','low')} · 50–74 ${T('media','medium')} · ≥ 75 ${T('alta','high')}.</p></div>
   <div class="card"><h3>${T('Perfil de resiliencia','Resilience profile')}</h3>${z.nResp?radar(z.ind.map(x=>(x.s??0)/4), z.ind.map(x=>tx(x.c)), z.ind.map(x=>x.col), {w:440}):`<p class="sindato">${T('Sin dato','No data')}</p>`}
     ${z.nResp&&z.nResp<13?`<p class="nota">${T('Las perillas sin responder se dibujan en 0.','Unanswered knobs are drawn at 0.')}</p>`:''}</div></div>
  <div class="card"><h3>${T('Parte 1 · Los trece rasgos de un sistema resiliente','Part 1 · The thirteen traits of a resilient system')}</h3><p class="nota">${T('Cabell y Oelofse (2012).','Cabell and Oelofse (2012).')}</p><div class="perillas">${z.ind.map(perilla).join('')}</div></div>
  <div class="card"><h3>${T('Parte 2 · Riesgo frente a un evento del clima','Part 2 · Risk from a climatic event')}</h3>
   <p class="nota">${T('Riesgo = Vulnerabilidad × Amenaza / Capacidad de respuesta (Nicholls y Altieri, 2013, en Altieri et al., 2015). Califica de 1 a 5; 1 o 2 es la situación más vulnerable.','Risk = Vulnerability × Threat / Response capacity (Nicholls and Altieri, 2013, in Altieri et al., 2015). Rate from 1 to 5; 1 or 2 is the most vulnerable situation.')}</p>
   <div class="grid g2"><label class="f"><span>${T('Evento que más preocupa','Event of greatest concern')}</span><select id="resEv"><option value="">${T('— elige —','— choose —')}</option>${RESIL_EV.map(([k,n])=>`<option value="${k}" ${z.ev===k?'selected':''}>${esc(tx(n))}</option>`).join('')}</select></label>
    <div class="res15"><div class="row between"><b>${T('Amenaza del evento','Threat of the event')}</b><span class="pv">${z.A??'—'}</span></div><div class="res15-b">${[1,2,3,4,5].map(k=>`<button type="button" class="btn sm ${z.A===k?'':'ghost'}" data-res-am="${k}">${k}</button>`).join('')}${z.A!=null?`<button type="button" class="btn sm ghost" data-res-am="x" aria-label="${T('Quitar','Clear')}">✕</button>`:''}</div>
     <p class="nota">${T('Intensidad, frecuencia, duración e impacto del evento: 1 = rara vez y leve · 5 = frecuente y devastador.','Intensity, frequency, duration and impact of the event: 1 = rare and mild · 5 = frequent and devastating.')}</p></div></div>
   <div class="grid g2"><div><h4>${T('Vulnerabilidad','Vulnerability')}</h4>${z.vul.map(x=>esc15('vul',x)).join('')}</div><div><h4>${T('Capacidad de respuesta','Response capacity')}</h4>${z.cap.map(x=>esc15('cap',x)).join('')}</div></div></div>
  <div class="grid g2"><div class="card"><h3>${T('Vulnerabilidad, amenaza y capacidad','Vulnerability, threat and capacity')}</h3>${barrasVCA(z)}
     <p class="nota">${T('V = 6 − media de los indicadores de vulnerabilidad (más alto = más vulnerable); C = media de los de capacidad; A = amenaza. Escala 1–5.','V = 6 − mean of vulnerability indicators (higher = more vulnerable); C = mean of capacity indicators; A = threat. 1–5 scale.')}</p></div>
   <div class="card" style="text-align:center"><h3>${T('Riesgo relativo','Relative risk')}</h3>
     <p style="font-size:40px;font-weight:700;margin:8px 0">${z.R!=null?fmt(z.R,2):'—'}</p>
     ${z.R!=null?`<p><span class="badge ${z.claseR.c}" style="font-size:14px">${esc(tx(z.claseR.n))}</span></p><p>${T(`Con una amenaza de ${z.A} y una vulnerabilidad de ${fmt(z.V,1)}, tu capacidad de respuesta de ${fmt(z.C,1)} ${z.C>=z.V?'compensa':'no alcanza a compensar'} la exposición.`,`With a threat of ${z.A} and a vulnerability of ${fmt(z.V,1)}, your response capacity of ${fmt(z.C,1)} ${z.C>=z.V?'offsets':'does not offset'} the exposure.`)}</p>`:`<p class="sindato">${T('Sin dato: califica la amenaza y al menos un indicador de vulnerabilidad y uno de capacidad.','No data: rate the threat and at least one vulnerability and one capacity indicator.')}</p>`}
     <p class="nota">R ∈ [0.2, 25]. ${T('Clases','Classes')} (${esc(RL)}): &lt; 2 ${T('bajo','low')} · 2–4.9 ${T('medio','medium')} · 5–9.9 ${T('alto','high')} · ≥ 10 ${T('muy alto','very high')}.</p></div></div>
  ${siguiente('resiliencia')}`;
  $$('[data-res-ind]',el).forEach(i=>{ i.oninput=()=>{ const v=+i.value; i.closest('.perilla').querySelector('.pv').textContent=v+' · '+tx(NIVEL_RES[v]); }; i.onchange=()=>_resSet('ind', i.dataset.resInd, +i.value); });
  $$('[data-res15]',el).forEach(b=>b.onclick=()=>{ const [g,id,k]=b.dataset.res15.split(':'); _resSet(g, id, +k); });
  $$('[data-res-x]',el).forEach(b=>b.onclick=()=>{ const [g,id]=b.dataset.resX.split(':'); _resSet(g, id, null); });
  $$('[data-res-am]',el).forEach(b=>b.onclick=()=>_resSet('am', null, b.dataset.resAm==='x'?null:+b.dataset.resAm));
  $('#resEv',el).onchange=e=>_resSet('ev', null, e.target.value);
  enlazarTips(el); }
function informeResiliencia(){ const z=resilAgro(); if(!z.nHecho) return `<div class="card"><h3>${T('Resiliencia','Resilience')}</h3><p class="sindato">${T('Sin dato: el bloque de resiliencia no se ha respondido.','No data: the resilience block has not been answered.')}</p></div>`;
  const ev=(RESIL_EV.find(([k])=>k===z.ev)||[0,null])[1];
  return `<div class="card"><h3>${T('Resiliencia','Resilience')}</h3><div class="kpis" style="margin:8px 0">
   <div class="kpi"><div class="l">${T('Índice de resiliencia','Resilience index')}</div><div class="v">${z.IRes!=null?fmt(100*z.IRes,0):'—'}</div><div class="s">${z.IRes!=null?`<span class="badge ${z.clase.c}">${esc(tx(z.clase.n))}</span>`:''} ${z.nResp}/13</div></div>
   <div class="kpi"><div class="l">${T('Riesgo relativo','Relative risk')}${ev?' · '+esc(tx(ev)):''}</div><div class="v">${z.R!=null?fmt(z.R,2):'—'}</div><div class="s">${z.R!=null?`<span class="badge ${z.claseR.c}">${esc(tx(z.claseR.n))}</span>`:''}</div></div>
   <div class="kpi"><div class="l">V · A · C</div><div class="v">${z.V!=null?fmt(z.V,1):'—'} · ${z.A??'—'} · ${z.C!=null?fmt(z.C,1):'—'}</div></div></div>
   ${z.nResp?`<p class="nota">${T('Rasgos más débiles','Weakest traits')}: ${z.ind.filter(x=>x.s!=null).sort((a,b)=>a.s-b.s).slice(0,3).map(x=>esc(tx(x.n))+' ('+x.s+')').join(' · ')}</p>`:''}</div>`; }
(function(){ const st=document.createElement('style'); st.textContent='.res15{margin:8px 0 12px}.res15-b{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0}.res15-b .btn{min-width:38px}'; document.head.appendChild(st); })();
