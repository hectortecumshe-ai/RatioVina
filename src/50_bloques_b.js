"use strict";
/* =====================================================================
   6b. BLOQUES · 4 Manejo, 5 Elementos, 6 Precio y valor, 7 Formulación
   ===================================================================== */
const chipEl = (id, boton, on)=>{ const e=elemPorId(id); if(!e) return ''; const c=CATS[e.cat];
  return boton ? `<button type="button" class="elchip ${on?'on':''}" data-chip="${esc(id)}" style="--ec:${c.col}"><b>${c.sym}</b>${esc(tx(e.n))}</button>`
               : `<span class="elchip" style="--ec:${c.col}" title="${esc(tx(c.n))}${e.i?' · '+T('inferido','inferred'):''}"><b>${c.sym}</b>${esc(tx(e.n))}${e.i?' ◆':''}</span>`; };
const clsImp = v=> v<=-2?'n2':v<0?'n1':v===0?'z':v>=2?'p2':'p1';
function impCeldas(v, data){ return `<div class="imps">${COMP.map((c,i)=>`<div><div class="ic">${esc(tx(c)).slice(0,4)}</div><div class="iv ${clsImp(v[i])}" ${data?`data-imp="${data}" data-c="${i}"`:''} title="${esc(tx(c))}: ${v[i]>0?'+':''}${v[i]} · ${T('clic para cambiar','click to change')}">${v[i]>0?'+':''}${v[i]}</div></div>`).join('')}</div>`; }

/* ================= BLOQUE 4 · MANEJO ================= */
function renderManejo(el){ const fb=renderManejo.fb||null; const pasos = conStack()?pasosProyecto().filter(p=>!fb||p.b===fb):[];
  const nInn=Object.values(S.manejo).reduce((s,m)=>s+(m.inn||[]).length,0), resps=conStack()?pasosActivos().flatMap(p=>p.a.map(a=>manejoDe(p.n).resp[a[0]])):[], nSi=resps.filter(r=>r==='si').length, nNo=resps.filter(r=>r==='no').length, nTot=resps.length;
  el.innerHTML = `${cabecera('manejo',T('Cada paso del ciclo tiene actividades. Si tu cultivo tiene un Stack publicado, aquí aparecen sus actividades como preguntas: responde para cada una si la practicas o no; las que no respondas no cuentan. Después agrega las actividades innovadoras o propias de tu localidad: son los hilos nuevos del telar.','Each step of the cycle has activities. If your crop has a published Stack, its activities appear here as questions: answer for each whether you practise it or not; unanswered ones do not count. Then add your locality’s innovative or own activities: they are the loom’s new threads.'))}
  ${consejo(T('Abre un paso y contesta «Sí la practico» o «No» en cada actividad; con «Todas sí» o «Todas no» vas más rápido. Usa «+ Actividad en este paso» para lo que haces diferente o es propio de tu viñedo. Cada viñedo tiene sus pasos: muévelos con la agarradera ⠿ o con ↑ ↓, marca «No aplica en mi viñedo» los que no practicas y agrega los tuyos al final de la lista. Los cuadros de colores muestran si la actividad suma (verde) o resta (rojo) al suelo, el agua, la atmósfera, la vegetación y la fauna.','Open a step and answer “Yes, I practise it” or “No” for each activity; “All yes” or “All no” is faster. Use “+ Activity in this step” for what you do differently or is your vineyard’s own. Each vineyard has its steps: move them with the ⠿ handle or ↑ ↓, mark “Not applicable in my vineyard” for those you do not practise and add yours at the end of the list. Coloured boxes show whether the activity adds (green) or subtracts (red) for soil, water, air, vegetation and fauna.'),T('El impacto por omisión es la suma, recortada a ±2, de los perfiles de los elementos que intervienen (Bloque 8); es una lectura editable, no una medición. Solo las actividades respondidas «sí» entran a la red.','Default impact is the sum, clipped to ±2, of the profiles of the elements involved (Block 8); an editable reading, not a measurement. Only activities answered “yes” enter the network.'))}
  <div class="kpis">${conStack()?`<div class="kpi"><div class="l">${T('Respondidas por ti','Answered by you')}</div><div class="v">${nSi+nNo} <small style="font-size:15px;color:var(--muted)">/ ${nTot}</small></div><div class="s">${T('actividades del Stack publicado','activities of the published Stack')}</div></div>`:''}
   <div class="kpi"><div class="l">${T('Practicadas (entran a la red)','Practised (enter the network)')}</div><div class="v">${actividades().length}</div><div class="s">${conStack()?nSi+' '+T('del Stack','from the Stack')+' · ':''}${nInn} ${T('innovadas o propias','innovated or own')}</div></div>
   ${conStack()?`<div class="kpi"><div class="l">${T('No practicadas','Not practised')}</div><div class="v">${nNo}</div><div class="s">${T('quedan fuera de la red','stay out of the network')}</div></div>`:''}</div>
  <div class="card"><h3 style="margin:0 0 6px">${T('Etapas del ciclo de la vid','Grapevine cycle stages')}</h3>
   <p class="nota" style="margin:0">${T('El cuestionario sigue el año del viñedo por etapas fenológicas BBCH (Lorenz et al., 1995). Abre cada paso, responde y pon las fechas de las labores principales (poda, brotación, floración, envero, cosecha): con ellas se arma el calendario circular del Tablero y del Informe. Las labores marcadas «mesa» o «vino» son propias de ese destino.','The questionnaire follows the vineyard year by BBCH phenological stages (Lorenz et al., 1995). Open each step, answer and set the dates of the main tasks (pruning, budburst, flowering, veraison, harvest): they build the circular calendar in the Dashboard and Report. Tasks marked “table” or “wine” belong to that destination.')} ${marcaInterp()}</p></div>
  ${conStack()?`<div class="filtro5b">${B5.map(b=>`<button style="--fc:${b.col}" class="${fb===b.id?'on':''}" data-fb="${b.id}">${esc(tx(b))}</button>`).join('')}${fb?`<button style="--fc:var(--muted)" data-fb="">${T('Todos','All')}</button>`:''}</div>
   <p class="nota">${marcaInterp()} ${T('Las etapas agrupan los estadios principales BBCH; el cuestionario y su orden son una lectura de Ratio Viña, no un Stack publicado.','Stages group the BBCH principal stages; the questionnaire and its order are a Ratio Viña reading, not a published Stack.')}</p>`:''}
  ${pasos.map(p=>{ const m=manejoDe(p.n), b=B5.find(x=>x.id===p.b), nR=p.a.filter(a=>m.resp[a[0]]).length, nS=p.a.filter(a=>m.resp[a[0]]==='si').length;
    return `<details class="pacc${p.noAplica?' noaplica':''}${p.propio?' propio':''}" style="--pc:${b.col}" ${renderManejo.abierto===p.n?'open':''} data-paso="${p.n}"><summary><span class="arrastre" data-arr-paso="${p.n}" title="${T('Arrastra para mover el paso','Drag to move the step')}" aria-label="${T('Mover paso','Move step')}">⠿</span><span class="num">${p.num}</span><div><h4>${esc(T(p.es,p.en))}${p.propio?` <span class="badge">${T('paso propio','own step')}</span>`:''}</h4><small>${p.noAplica?`<b>${T('No aplica en tu viñedo','Not applicable in your vineyard')}</b> · `:''}${esc(tx(b))} · ${p.a.length?`${p.a.length} ${p.a.length===1?T('actividad publicada','published activity'):T('actividades publicadas','published activities')} ·<span class="${nR===p.a.length?'resp-ok':nR?'resp-parcial':'resp-no'}">${nR===p.a.length?'✓ ':''}${nR} ${T('de','of')} ${p.a.length} ${T('respondidas','answered')}</span>${nS?' · '+nS+' '+T('sí','yes'):''}`:T('paso propio de tu viñedo','own step of your vineyard')}${m.inn.length?' · <b style="color:var(--accent-text)">'+m.inn.length+' '+(m.inn.length===1?T('agregada','added'):T('agregadas','added'))+'</b>':''}</small></div>${p.iic?`<span class="badge pri">IIC ${fmt(p.iic,1)}${ayuda('iic')}</span>`:'<span></span>'}</summary>
    <div class="cuerpo">${ctlPaso(p)}<div class="resp-todas" ${p.a.length?'':'hidden'}><span class="nota">${T('Responder todo el paso:','Answer the whole step:')}</span><button class="btn sm ghost" data-rtodas="${p.n}|si">✓ ${T('Todas sí','All yes')}</button><button class="btn sm ghost" data-rtodas="${p.n}|no">✕ ${T('Todas no','All no')}</button>${nR?`<button class="btn sm ghost" data-rtodas="${p.n}|">${T('Borrar respuestas','Clear answers')}</button>`:''}</div>
      ${(()=>{ const f=S.fechas[p.n]||{}, w=ventanaPaso(p), ev=f.ev||EV_PASO[p.n];
      const pub=b.bbch?'BBCH '+b.bbch:'';
      return `<div class="fechas-paso"><label><span>${T('Actividad principal','Main activity')}</span><select data-fev="${p.n}">${Object.entries(EVENTOS).map(([k,e])=>`<option value="${k}" ${k===ev?'selected':''}>${esc(tx(e.n))}${EV_PRINCIPALES.includes(k)?' ★':''}</option>`).join('')}</select></label>
       <label><span>${T('Desde','From')}</span><input type="date" data-fini="${p.n}" value="${f.ini!=null?isoDeDia(f.ini):''}"></label><label><span>${T('Hasta','To')}</span><input type="date" data-ffin="${p.n}" value="${f.fin!=null?isoDeDia(f.fin):''}"></label>
       <span class="nota">${f.ini!=null?`<button class="btn sm ghost" data-frst="${p.n}">${T('Borrar fechas','Clear dates')}</button>`:`<span class="ej-pista">${T('Sin fecha: ponla para el calendario','No date: set it for the calendar')}${pub?' · '+esc(pub):''}</span>`}</span></div>`; })()}
      ${filasActividades(p,m)}
      <details class="nueva"><summary><b>+ ${T('Actividad en este paso','Activity in this step')}</b>${ayuda('innov')}</summary>
        <label class="f"><span>${T('Actividad','Activity')}</span><input data-nt="${p.n}" placeholder="${T('p. ej., Aplicación de biofertilizante de lombricomposta','e.g., Vermicompost biofertiliser application')}"></label>
        <div class="grid g2"><label class="f"><span>${T('¿Quién la propone? (opcional)','Who proposes it? (optional)')}</span><select data-nprop="${p.n}"><option value="">—</option>${optProponentes()}</select></label><label class="f"><span>${T('Desde cuándo (año, opcional)','Since when (year, optional)')}</span><input type="number" data-ndesde="${p.n}" min="1900" max="2100" step="1" placeholder="${T('p. ej., 2019','e.g., 2019')}"></label></div>
        <label class="f"><span>${T('Tipo de actividad','Activity type')}</span><select data-ntipo="${p.n}"><option value="inn" ${p.propio?'':'selected'}>${T('Innovada: nueva en la localidad','Innovated: new in the locality')}</option><option value="trad" ${p.propio?'selected':''}>${T('Tradicional de la localidad','Local traditional')}</option></select></label>
        <details class="nuevo-el"><summary class="btn sm">＋ ${T('Crear un elemento que no está en la lista','Create an element not in the list')}</summary><div class="row" style="gap:8px;flex-wrap:wrap;align-items:flex-end"><label class="f" style="flex:2;min-width:180px"><span>${T('Nombre','Name')}</span><input data-eln="${p.n}" placeholder="${T('p. ej., Comité de agua de la comunidad','e.g., Community water committee')}"></label><label class="f" style="flex:1;min-width:160px"><span>${T('Categoría','Category')}</span><select data-elc="${p.n}">${Object.entries(CATS).map(([k,c])=>`<option value="${k}">${esc(tx(c.n))}</option>`).join('')}</select></label><button type="button" class="btn sm ghost" data-eladd="${p.n}">${T('Crear y elegir','Create and select')}</button></div><p class="nota">${T('Queda en el Bloque 8 (Elementos), donde también puedes darle valor.','It goes to Block 8 (Elements), where you can also rate it.')}</p></details>
        <div class="nota">${T('Elementos que intervienen (clic para elegir):','Elements involved (click to choose):')}</div>
        <div class="elchips" data-nel="${p.n}"></div>
        <button class="btn sm" data-addinn="${p.n}" style="margin-top:8px">${T('Agregar actividad','Add activity')}</button></details></div></details>`; }).join('')}
  ${conStack()?formPasoPropio():''}
  ${!conStack()?`<div class="card"><h3>${T('Pasos de tu sistema','Your system steps')}</h3><p>${T('Agrega los pasos de manejo de','Add the management steps for')} <b>${esc(tx(cultivoSel().n))}</b>${T(' y sus actividades.','and their activities.')}</p>
    ${Object.entries(S.manejo).map(([n,m])=>`<div class="pacc" style="--pc:var(--primary)"><div class="cuerpo"><b>${T('Paso','Step')} ${n}${m.nombre?': '+esc(m.nombre):''}</b>${(m.inn||[]).map((x,i)=>`<div class="actrow inn"><span>✦</span><div>${esc(x.t)}<div class="elchips">${(x.el||[]).map(id=>chipEl(id)).join('')}</div></div>${impCeldas(x.imp||impactoAct({el:x.el||[],imp:null}), n+'|N'+i)}</div>`).join('')}</div></div>`).join('')||`<p class="sindato">${T('Aún no hay pasos.','No steps yet.')}</p>`}
    <div class="nueva"><div class="grid g3"><label class="f"><span>${T('Nombre del paso','Step name')}</span><input id="npN"></label><label class="f"><span>${T('Primera actividad','First activity')}</span><input id="npA"></label><label class="f"><span>${T('Actividad principal','Main activity')}</span><select id="npE">${Object.entries(EVENTOS).map(([k,e])=>`<option value="${k}">${esc(tx(e.n))}</option>`).join('')}</select></label><label class="f"><span>${T('Desde','From')}</span><input type="date" id="npI"></label><label class="f"><span>${T('Hasta','To')}</span><input type="date" id="npF"></label></div><button class="btn sm" id="npAdd">+ ${T('Agregar paso','Add step')}</button></div></div>`:''}
  ${fuenteArt()}${siguiente('manejo')}`;
  $$('[data-fb]',el).forEach(b=>b.onclick=()=>{ renderManejo.fb=b.dataset.fb||null; render(); });
  const rs=null; if(rs){ rs.oninput=()=>{ rs.closest('.card').querySelector('h3 b').textContent=diaFecha(+rs.value); }; rs.onchange=()=>{ S.siembraDia=+rs.value; guardar(); render(); }; }
  const fset=(n,k,v)=>{ S.fechas[n]=S.fechas[n]||{}; S.fechas[n][k]=v; guardar(); renderManejo.abierto=+n; render(); };
  const wdef=(n)=>{ const w=PASOS[n-1]&&conStack() ? ventanaPaso(PASOS[n-1]) : null; return {ini:w&&w.ini!=null&&w.origen!=='fig4'?w.ini:null, fin:w&&w.fin!=null&&w.origen!=='fig4'?w.fin:null}; };
  $$('[data-fev]',el).forEach(s=>s.onchange=()=>fset(s.dataset.fev,'ev',s.value));
  $$('[data-fini]',el).forEach(s=>s.onchange=()=>{ if(!s.value) return; const n=s.dataset.fini; S.fechas[n]=S.fechas[n]||{}; if(S.fechas[n].fin==null) S.fechas[n].fin=wdef(n).fin??diaDeIso(s.value); fset(n,'ini',diaDeIso(s.value)); });
  $$('[data-ffin]',el).forEach(s=>s.onchange=()=>{ if(!s.value) return; const n=s.dataset.ffin; S.fechas[n]=S.fechas[n]||{}; if(S.fechas[n].ini==null) S.fechas[n].ini=wdef(n).ini??diaDeIso(s.value); fset(n,'fin',diaDeIso(s.value)); });
  $$('[data-frst]',el).forEach(b=>b.onclick=()=>{ const n=b.dataset.frst; const ev=(S.fechas[n]||{}).ev; S.fechas[n]=ev?{ev}:{}; guardar(); renderManejo.abierto=+n; render(); });
  $$('details.pacc',el).forEach(d=>d.addEventListener('toggle',()=>{ if(d.open) renderManejo.abierto=+d.dataset.paso; }));
  $$('[data-act]',el).forEach(c=>c.onclick=()=>{ const [n,cod,v]=c.dataset.act.split('|'), m=manejoDe(+n); if(m.resp[cod]===v) delete m.resp[cod]; else m.resp[cod]=v; S.formulado=false; guardar(); renderManejo.abierto=+n; render(); });
  $$('[data-rtodas]',el).forEach(c=>c.onclick=()=>{ const [n,v]=c.dataset.rtodas.split('|'), m=manejoDe(+n), p=pasosProyecto().find(x=>x.n===+n); p.a.forEach(a=>{ if(v) m.resp[a[0]]=v; else delete m.resp[a[0]]; }); S.formulado=false; guardar(); renderManejo.abierto=+n; render(); });
  $$('[data-imp]',el).forEach(c=>c.onclick=()=>{ const [n,cod]=c.dataset.imp.split('|'), k=+c.dataset.c, m=manejoDe(+n);
    if(cod.startsWith('N')){ const x=m.inn[+cod.slice(1)]; x.imp=x.imp||impactoAct({el:x.el||[],imp:null}); x.imp[k]=x.imp[k]>=2?-2:x.imp[k]+1; }
    else { m.imp[cod]=m.imp[cod]||impactoAct({el:(ACT_EL[cod]||'').split(' '),imp:null}); m.imp[cod][k]=m.imp[cod][k]>=2?-2:m.imp[cod][k]+1; }
    guardar(); renderManejo.abierto=+n; render(); });
  $$('details.nueva',el).forEach(d=>d.addEventListener('toggle',()=>{ const c=d.querySelector('[data-nel]'); if(!c||!d.open||c.childElementCount) return;
    c.innerHTML=todosElem().map(e=>chipEl(e.id,true,false)).join(''); $$('.elchip',c).forEach(b=>b.onclick=()=>b.classList.toggle('on')); }));
  $$('[data-addinn]',el).forEach(b=>b.onclick=()=>{ const n=+b.dataset.addinn, t=$(`[data-nt="${n}"]`,el).value.trim(); if(!t) return toast(T('Escribe la actividad','Write the activity'));
    const els=$$(`[data-nel="${n}"] .elchip.on`,el).map(x=>x.dataset.chip), tipo=($(`[data-ntipo="${n}"]`,el)||{}).value||'inn';
    const prop=$(`[data-nprop="${n}"]`,el).value, desde=$(`[data-ndesde="${n}"]`,el).value.trim();
    manejoDe(n).inn.push({id:nuevoId(), t, el:els, tipo, prop, desde}); S.formulado=false; guardar(); renderManejo.abierto=n; render(); toast(tipo==='trad'?T('Actividad tradicional agregada','Traditional activity added'):T('Actividad innovadora agregada','Innovative activity added')); });
  manejadoresPasos(el);
  $$('[data-qinn]',el).forEach(b=>b.onclick=()=>{ const [n,i]=b.dataset.qinn.split('|').map(Number); manejoDe(n).inn.splice(i,1); guardar(); renderManejo.abierto=n; render(); });
  const np=$('#npAdd',el); if(np) np.onclick=()=>{ const nom=$('#npN',el).value.trim(), a=$('#npA',el).value.trim(); if(!nom) return; const n=Object.keys(S.manejo).length+1; S.manejo[n]={resp:{}, imp:{}, nombre:nom, inn:a?[{t:a, el:[]}]:[]}; const fi=$('#npI',el).value, ff=$('#npF',el).value; if(fi) S.fechas[n]={ev:$('#npE',el).value, ini:diaDeIso(fi), fin:ff?diaDeIso(ff):diaDeIso(fi)}; guardar(); render(); }; }

/* Actividades de un paso en el orden del usuario: publicadas (también las que trajo de otro paso) y agregadas */
function itemsPaso(p, m){ const o=(S.actOrden||{})[p.n]||[], pos=k=>{ const j=o.indexOf(k); return j<0?1e6:j; };
  return p.a.map((a,k)=>({key:a[0], a, k})).concat(m.inn.map((x,i)=>({key:'i:'+x.id, x, i, k:1000+i}))).sort((u,v)=>pos(u.key)-pos(v.key)||u.k-v.k); }
const agarradera = (n, key)=> `<span class="arrastre" data-arr-act="${n}|${esc(key)}" title="${T('Arrastra para mover la actividad (también a otro paso)','Drag to move the activity (also to another step)')}" aria-label="${T('Mover actividad','Move activity')}">⠿</span>`;
function filasActividades(p, m){ return itemsPaso(p,m).map(it=>{
  if(it.a){ const a=it.a, r=m.resp[a[0]]||'', v=m.imp[a[0]]||impactoAct({el:(ACT_EL[a[0]]||'').split(' '), imp:null}), casa=CASA_ACT[a[0]];
    return `<div class="actrow resp-${r||'vacia'}" data-actkey="${p.n}|${a[0]}">${agarradera(p.n,a[0])}<div class="resp-sn" role="group" aria-label="${T('¿La practicas?','Do you practise it?')}"><button type="button" class="si ${r==='si'?'on':''}" data-act="${p.n}|${a[0]}|si">${T('Sí la practico','Yes, I do')}</button><button type="button" class="no ${r==='no'?'on':''}" data-act="${p.n}|${a[0]}|no">${T('No','No')}</button></div><div><code>${a[0]}</code>${esc(T(a[1],a[2]))}${a[3]?` <span class="badge ${S.vidDestino&&S.vidDestino!==a[3]&&S.vidDestino!=='varios'?'':'info'}" title="${T('Labor propia de este destino','Task specific to this destination')}">${a[3]==='mesa'?T('mesa','table'):T('vino','wine')}</span>`:''}${casa!==p.n?` <small class="tipo-act">${T('viene del paso','from step')} ${numPaso(casa)}</small>`:''}${m.imp[a[0]]?' <span class="badge acc">'+T('impacto editado','edited impact')+'</span>':''}${r?'':` <span class="sin-llenar">${T('sin responder','not answered')}</span>`}
      <div class="elchips">${(ACT_EL[a[0]]||'').split(' ').filter(Boolean).map(id=>chipEl(id)).join('')}</div></div>${impCeldas(v, p.n+'|'+a[0])}</div>`; }
  const x=it.x, i=it.i, pe=x.prop&&elemPorId(x.prop), info=[pe?T('Propuesta por','Proposed by')+' '+esc(tx(pe.n)):'', x.desde?T('desde','since')+' '+esc(String(x.desde)):'', x.nota?esc(x.nota):''].filter(Boolean).join(' · ');
  return `<div class="actrow inn${x.tipo==='trad'?' trad':''}" data-actkey="${p.n}|i:${x.id}">${agarradera(p.n,'i:'+x.id)}<span title="${x.tipo==='trad'?T('Tradicional de la localidad','Local traditional'):T('Innovada','Innovated')}">${x.tipo==='trad'?'●':'✦'}</span><div><b>${esc(x.t)}</b> <small class="tipo-act">${x.tipo==='trad'?T('tradicional de la localidad','local traditional'):T('innovada','innovated')}</small>${info?`<div class="nota">${info}</div>`:''}<div class="elchips">${(x.el||[]).map(id=>chipEl(id)).join('')}</div>
    <button class="btn sm ghost" data-qinn="${p.n}|${i}" style="margin-top:4px">${T('Quitar','Remove')}</button></div>${impCeldas(x.imp||impactoAct({el:x.el||[],imp:null}), p.n+'|N'+i)}</div>`; }).join(''); }

/* Opciones de «quién la propone»: actores e instituciones (del catálogo y los creados por el usuario) */
function optProponentes(){ return ['actores','instituciones'].map(c=>`<optgroup label="${esc(tx(CATS[c].n))}">${todosElem().filter(e=>e.cat===c).map(e=>`<option value="${esc(e.id)}">${esc(tx(e.n))}</option>`).join('')}</optgroup>`).join(''); }

/* Mover un paso antes o después de otro */
function moverPaso(n, dest, antes){ const o=pasosProyecto().map(x=>x.n).filter(x=>x!==n), j=o.indexOf(dest); if(j<0) return; o.splice(antes?j:j+1, 0, n); S.pasoOrden=o; guardar(); renderManejo.abierto=null; render(); }

/* Mover una actividad dentro de su paso o a otro paso; conserva su respuesta y sus impactos */
function moverAct(val, dest){ const [n0s, ...resto]=val.split('|'), n0=+n0s, k=resto.join('|'), n1=dest.paso; if(!n1) return;
  const m0=manejoDe(n0), m1=manejoDe(n1);
  if(n1!==n0){
    if(k.startsWith('i:')){ const j=m0.inn.findIndex(x=>'i:'+x.id===k); if(j<0) return; m1.inn.push(m0.inn.splice(j,1)[0]); }
    else { if(k in m0.resp){ m1.resp[k]=m0.resp[k]; delete m0.resp[k]; } if(k in m0.imp){ m1.imp[k]=m0.imp[k]; delete m0.imp[k]; }
      S.actPaso=S.actPaso||{}; if(n1===CASA_ACT[k]) delete S.actPaso[k]; else S.actPaso[k]=n1; }
    S.actOrden=S.actOrden||{}; if(S.actOrden[n0]) S.actOrden[n0]=S.actOrden[n0].filter(x=>x!==k); }
  const p1=pasosProyecto().find(x=>x.n===n1); if(!p1) return;
  const lista=itemsPaso(p1, m1).map(it=>it.key).filter(x=>x!==k);
  let j=dest.key ? lista.indexOf(dest.key) : -1; if(j<0) j=lista.length; else if(!dest.antes) j++;
  lista.splice(j, 0, k); S.actOrden=S.actOrden||{}; S.actOrden[n1]=lista;
  S.formulado=false; guardar(); renderManejo.abierto=n1; render(); if(n1!==n0) toast(T('Actividad movida al paso','Activity moved to step')+' '+p1.num); }

/* Arrastrar con agarradera (⠿): ratón, lápiz o dedo */
function arrastreManejo(el){ if(el.__arrastre) return; el.__arrastre=true;   // una sola vez por contenedor
  let dr=null;
  const limpiar=()=>$$('.drop-antes,.drop-despues,.drop-dentro',el).forEach(x=>x.classList.remove('drop-antes','drop-despues','drop-dentro'));
  el.addEventListener('click',e=>{ if(e.target.closest('[data-arr-paso],[data-arr-act]')){ e.preventDefault(); e.stopPropagation(); } }, true);
  el.addEventListener('pointerdown',e=>{ const h=e.target.closest('[data-arr-paso],[data-arr-act]'); if(!h) return; e.preventDefault(); e.stopPropagation();
    const paso=!!h.dataset.arrPaso; dr={paso, val:paso?h.dataset.arrPaso:h.dataset.arrAct, fuente:h.closest(paso?'details.pacc':'.actrow'), dest:null};
    dr.fuente.classList.add('arrastrando'); document.body.classList.add('arrastrando-manejo'); try{ h.setPointerCapture(e.pointerId); }catch(_){} });
  el.addEventListener('pointermove',e=>{ if(!dr) return; e.preventDefault(); limpiar(); dr.dest=null;
    if(e.clientY<70) scrollBy(0,-14); else if(e.clientY>innerHeight-70) scrollBy(0,14);
    const t=document.elementFromPoint(e.clientX,e.clientY); if(!t) return;
    if(dr.paso){ const d=t.closest('details.pacc'); if(!d||d===dr.fuente) return; const r=d.querySelector('summary').getBoundingClientRect(), antes=e.clientY<r.top+r.height/2 || (d.open && e.clientY<r.bottom);
      d.classList.add(antes?'drop-antes':'drop-despues'); dr.dest={n:+d.dataset.paso, antes}; return; }
    const row=t.closest('.actrow[data-actkey]');
    if(row && row!==dr.fuente){ const r=row.getBoundingClientRect(), antes=e.clientY<r.top+r.height/2, [ps,...kk]=row.dataset.actkey.split('|');
      row.classList.add(antes?'drop-antes':'drop-despues'); dr.dest={paso:+ps, key:kk.join('|'), antes}; return; }
    const d=t.closest('details.pacc'); if(d && !d.classList.contains('noaplica')){ d.classList.add('drop-dentro'); dr.dest={paso:+d.dataset.paso}; } });
  const fin=()=>{ if(!dr) return; limpiar(); dr.fuente.classList.remove('arrastrando'); document.body.classList.remove('arrastrando-manejo'); const x=dr; dr=null; if(!x.dest) return;
    if(x.paso) moverPaso(+x.val, x.dest.n, x.dest.antes); else moverAct(x.val, x.dest); };
  el.addEventListener('pointerup',fin); el.addEventListener('pointercancel',()=>{ if(dr){ limpiar(); dr.fuente.classList.remove('arrastrando'); document.body.classList.remove('arrastrando-manejo'); dr=null; } });
}

/* Barra de control de un paso: orden en el ciclo, B, «no aplica» y, si es propio, quitarlo */
function ctlPaso(p){ return `<div class="paso-ctl">
  <button type="button" class="btn sm ghost" data-pmov="${p.n}|-1" title="${T('Subir en el ciclo','Move up in the cycle')}">↑</button><button type="button" class="btn sm ghost" data-pmov="${p.n}|1" title="${T('Bajar en el ciclo','Move down in the cycle')}">↓</button>
  <label class="m3d-ctl">${T('Etapa','Stage')} <select data-pgrp="${p.n}">${B5.map(b=>`<option value="${b.id}" ${b.id===p.b?'selected':''}>${esc(tx(b))}</option>`).join('')}</select></label>
  <button type="button" class="btn sm ${p.noAplica?'':'ghost'}" data-pna="${p.n}">${p.noAplica?'↺ '+T('Sí aplica en mi viñedo','It does apply in my vineyard'):T('No aplica en mi viñedo','Not applicable in my vineyard')}</button>
  ${p.propio?`<button type="button" class="btn sm ghost" data-pdel="${p.n}">${T('Quitar este paso','Remove this step')}</button>`:''}</div>
  ${p.noAplica?`<p class="nota na-nota">${T('Este paso no se practica en tu viñedo: sus actividades quedan fuera de la red, de los índices y del avance. Puedes reactivarlo cuando quieras.','This step is not practised in your vineyard: its activities stay out of the network, the indices and the progress. You can re-enable it at any time.')}</p>`:''}`; }

/* Tarjeta para agregar un paso propio de la localidad, en el lugar del ciclo que elija el usuario */
function formPasoPropio(){ const l=pasosProyecto(), cambiado=(S.pasoOrden||[]).length||Object.keys(S.pasoGrupo||{}).length;
  return `<div class="card nuevo-paso"><h3>+ ${T('Paso propio de tu viñedo','Own step of your vineyard')}</h3>
   <p class="nota">${T('Cada viñedo y cada región tienen pasos propios. Agrega los que no estén en la lista; después le pones sus actividades, sus elementos y sus fechas como a cualquier otro paso.','Each vineyard and region has its own steps. Add those missing from the list; then give it activities, elements and dates like any other step.')}</p>
   <div class="grid g3"><label class="f"><span>${T('Nombre del paso','Step name')}</span><input id="ppN" placeholder="${T('p. ej., Desbrote manual','e.g., Manual shoot thinning')}"></label>
    <label class="f"><span>${T('Etapa del ciclo','Cycle stage')}</span><select id="ppB">${B5.map(b=>`<option value="${b.id}">${esc(tx(b))}</option>`).join('')}</select></label>
    <label class="f"><span>${T('Lugar en el ciclo','Place in the cycle')}</span><select id="ppD"><option value="">${T('Al final','At the end')}</option><option value="0">${T('Al principio','At the beginning')}</option>${l.map(p=>`<option value="${p.n}">${T('Después del paso','After step')} ${p.num}. ${esc(T(p.es,p.en)).slice(0,48)}</option>`).join('')}</select></label></div>
   <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn sm" id="ppAdd">${T('Agregar paso','Add step')}</button>
    ${cambiado?`<button class="btn sm ghost" id="ppReset">${T('Volver al orden y a las etapas del cuestionario base','Restore the baseline order and stages')}</button>`:''}</div></div>`; }

function manejadoresPasos(el){
  const orden=()=>pasosProyecto().map(x=>x.n), fb=renderManejo.fb||null, visibles=()=>pasosProyecto().filter(p=>!fb||p.b===fb).map(x=>x.n);
  $$('[data-pmov]',el).forEach(b=>b.onclick=()=>{ const [n,d]=b.dataset.pmov.split('|').map(Number), v=visibles(), k=v.indexOf(n), vec=v[k+d]; if(vec==null) return;
    const o=orden().filter(x=>x!==n), j=o.indexOf(vec); o.splice(d<0?j:j+1, 0, n); S.pasoOrden=o; guardar(); renderManejo.abierto=n; render(); });
  $$('[data-pgrp]',el).forEach(s=>s.onchange=()=>{ const n=+s.dataset.pgrp, base=(PASOS.find(x=>x.n===n)||(S.pasosPropios||[]).find(x=>x.n===n)||{}).b;
    S.pasoGrupo=S.pasoGrupo||{}; if(s.value===base) delete S.pasoGrupo[n]; else S.pasoGrupo[n]=s.value; S.formulado=false; guardar(); renderManejo.abierto=n; render(); });
  $$('[data-pna]',el).forEach(b=>b.onclick=()=>{ const n=+b.dataset.pna; S.pasoNoAplica=S.pasoNoAplica||{}; if(S.pasoNoAplica[n]) delete S.pasoNoAplica[n]; else S.pasoNoAplica[n]=true;
    S.formulado=false; guardar(); renderManejo.abierto=S.pasoNoAplica[n]?null:n; render(); });
  $$('[data-pdel]',el).forEach(b=>b.onclick=()=>{ if(b.dataset.ok!=='1'){ b.dataset.ok='1'; b.textContent=T('¿Seguro? Toca otra vez para quitarlo','Sure? Tap again to remove it'); return; }
    const n=+b.dataset.pdel; S.pasosPropios=(S.pasosPropios||[]).filter(x=>x.n!==n); S.pasoOrden=(S.pasoOrden||[]).filter(x=>x!==n);
    delete S.manejo[n]; delete S.fechas[n]; if(S.pasoGrupo) delete S.pasoGrupo[n]; if(S.pasoNoAplica) delete S.pasoNoAplica[n]; S.formulado=false; guardar(); render(); toast(T('Paso quitado','Step removed')); });
  $$('[data-nprop]',el).forEach(s=>s.onchange=()=>{ if(!s.value) return; const c=$(`[data-nel="${s.dataset.nprop}"]`,el); if(!c) return;
    let ch=c.querySelector(`[data-chip="${s.value}"]`); if(!ch){ c.insertAdjacentHTML('beforeend', chipEl(s.value,true,true)); ch=c.lastElementChild; ch.onclick=()=>ch.classList.toggle('on'); } ch.classList.add('on'); });
  arrastreManejo(el);
  $$('[data-eladd]',el).forEach(b=>b.onclick=()=>{ const n=b.dataset.eladd, nom=$(`[data-eln="${n}"]`,el).value.trim(); if(!nom) return toast(T('Escribe el nombre del elemento','Write the element name'));
    const e={id:'U'+Date.now().toString(36), cat:$(`[data-elc="${n}"]`,el).value, n:E(nom,nom), usuario:true}; S.elemExtra=S.elemExtra||[]; S.elemExtra.push(e); guardar();
    const c=$(`[data-nel="${n}"]`,el); if(c){ c.insertAdjacentHTML('beforeend', chipEl(e.id,true,true)); const ch=c.lastElementChild; ch.onclick=()=>ch.classList.toggle('on'); }
    if(['actores','instituciones'].includes(e.cat)){ const sp=$(`[data-nprop="${n}"] optgroup[label="${tx(CATS[e.cat].n)}"]`,el); if(sp) sp.insertAdjacentHTML('beforeend', `<option value="${e.id}">${esc(nom)}</option>`); }
    $(`[data-eln="${n}"]`,el).value=''; toast(T('Elemento creado y elegido','Element created and selected')); });
  const add=$('#ppAdd',el); if(add) add.onclick=()=>{ const nom=$('#ppN',el).value.trim(); if(!nom) return toast(T('Escribe el nombre del paso','Write the step name'));
    const n=Math.max(100,...(S.pasosPropios||[]).map(x=>x.n))+1; S.pasosPropios=(S.pasosPropios||[]).concat([{n, es:nom, en:nom, b:$('#ppB',el).value}]);
    const o=orden().filter(x=>x!==n), d=$('#ppD',el).value; if(d==='') o.push(n); else if(d==='0') o.unshift(n); else o.splice(o.indexOf(+d)+1, 0, n);
    S.pasoOrden=o; manejoDe(n); renderManejo.fb=null; renderManejo.abierto=n; guardar(); render(); toast(T('Paso agregado: ponle sus actividades','Step added: give it its activities')); };
  const rs=$('#ppReset',el); if(rs) rs.onclick=()=>{ S.pasoOrden=(S.pasosPropios||[]).length?PASOS.map(p=>p.n).concat(S.pasosPropios.map(x=>x.n)):[]; S.pasoGrupo={}; guardar(); render(); };
}

/* ================= BLOQUE 5 · ELEMENTOS ================= */
function renderElementos(el){ const part=participacion(); const mx=Math.max(1,...Object.values(part));
  el.innerHTML = `${cabecera('elementos',T('Un sistema complejo adaptativo es la suma de sus elementos y, sobre todo, de sus interacciones. Aquí están todos los hilos del telar, por categoría, con el número de actividades en que participa cada uno.','A complex adaptive system is the sum of its elements and, above all, of their interactions. Here are all the loom’s threads by category, with how many activities each takes part in.'))}
  ${consejo(T('Si en tu localidad hay un actor, insumo o institución que no aparece, agrégalo abajo; luego lo podrás elegir en las actividades innovadoras del Bloque 5.','If your locality has an actor, input or institution not listed, add it below; you can then choose it in Block 5 innovative activities.'),T('Los elementos marcados con ◆ se infieren del texto de la actividad (p. ej., combustible de la maquinaria); los demás están nombrados en el artículo.','Elements marked ◆ are inferred from the activity text (e.g., machinery fuel); the others are named in the paper.'))}
  <div class="catgrid">${Object.entries(CATS).map(([k,c],q)=>{ const l=todosElem().filter(e=>e.cat===k);
    return `<div class="catbox aparece" style="--ec:${c.col};animation-delay:${q*50}ms"><h3><span class="sym">${c.sym}</span>${esc(tx(c.n))}<small class="muted" style="margin-left:auto;font-weight:400">${l.length}</small></h3><ul>${l.map(e=>`<li><span>${esc(tx(e.n))}${e.i?' <span title="'+T('inferido de la actividad','inferred from the activity')+'">◆</span>':''}${e.usuario?' <span class="badge acc">'+T('tuyo','yours')+'</span>':''}<div class="mini-bar"><i style="width:${100*(part[e.id]||0)/mx}%"></i></div></span><span class="p" title="${T('actividades en que participa','activities it takes part in')}">${part[e.id]||0}</span></li>`).join('')}</ul></div>`; }).join('')}</div>
  <p class="nota">${T('Número a la derecha: actividades activas en que participa el elemento','Number on the right: active activities the element takes part in')}${ayuda('elemento')}. ${T('Las perturbaciones y las políticas no siempre aparecen en actividades: entran a la red por sus vínculos documentados.','Disturbances and policies do not always appear in activities: they enter the network through documented links.')}</p>
  <div class="card"><h3>${T('Agregar un elemento de tu localidad','Add an element from your locality')}</h3><div class="grid g3">
    <label class="f"><span>${T('Nombre','Name')}</span><input id="eN"></label><label class="f"><span>${T('Categoría','Category')}</span><select id="eC">${Object.entries(CATS).map(([k,c])=>`<option value="${k}">${esc(tx(c.n))}</option>`).join('')}</select></label>
    <div style="align-self:end"><button class="btn" id="eAdd">+ ${T('Agregar','Add')}</button></div></div>
    ${(S.elemExtra||[]).length?`<div class="elchips">${S.elemExtra.map((e,i)=>chipEl(e.id)+`<button class="btn sm ghost" data-qel="${i}">×</button>`).join('')}</div>`:''}</div>
  <div class="card sci"><h3>${T('Vínculos estructurales documentados','Documented structural links')}</h3><p class="nota">${T('Además de concurrir en actividades, estos pares se vinculan por lo que dice el artículo: la academia local se relaciona con todos los actores; investigadores y extensionistas pertenecen a sus instituciones; y el ciclo se retroalimenta.','Besides co-occurring in activities, these pairs are linked by what the paper states: local academia relates to all actors; researchers and extension agents belong to their institutions; and the cycle feeds back.')}</p>
    <div class="elchips">${LAZOS.map(([a,b])=>`<span class="elchip" style="--ec:var(--primary)">${esc(nombreEl(a))} — ${esc(nombreEl(b))}</span>`).join('')}</div>${fuenteArt()}</div>
  ${siguiente('elementos')}`;
  $('#eAdd',el).onclick=()=>{ const n=$('#eN',el).value.trim(); if(!n) return; S.elemExtra=S.elemExtra||[]; S.elemExtra.push({id:'U'+Date.now().toString(36), cat:$('#eC',el).value, n:E(n,n), usuario:true}); guardar(); render(); toast(T('Elemento agregado','Element added')); };
  $$('[data-qel]',el).forEach(b=>b.onclick=()=>{ S.elemExtra.splice(+b.dataset.qel,1); guardar(); render(); }); }

/* ================= BLOQUE 6 · PRECIO Y VALOR ================= */
const DIMV = [['eco',E('Económico','Economic'),'vEco'],['uso',E('De uso','Use'),'vUso'],['cul',E('Cultural','Cultural'),'vCul'],['eia',E('Ecológico','Ecological'),'vEia']];
function estrellas(id,k){ const v=(S.valor[id]||{})[k]; return `<span class="estrellas" data-val="${esc(id)}|${k}">${[1,2,3,4,5].map(i=>`<button type="button" class="${v>=i?'on':''}" data-i="${i}" title="${i}">★</button>`).join('')}</span>`; }
function renderPrecios(el){ const filtro=renderPrecios.cat||'insumos'; const part=participacion(); const l=todosElem().filter(e=>e.cat===filtro);
  el.innerHTML = `${cabecera('precios',T('El precio lo fija el mercado; el valor lo fija el sistema. Registra los precios que pagas o recibes y califica el valor de cada elemento en cuatro dimensiones. Con el valor se pesan los hilos de la red.','Price is set by the market; value is set by the system. Record the prices you pay or receive and rate each element’s value on four dimensions. Value weights the network threads.'))}
  ${consejo(T('No hace falta valorar todo: lo que no califiques toma su valor estructural (qué tanto participa). Empieza por la semilla, el suelo, la humedad y los actores.','You need not rate everything: what you leave unrated takes its structural value (how much it participates). Start with seed, soil, moisture and actors.'),T('Valor total = Σ wₖ·vₖ / Σ wₖ·5, con vₖ ∈ {0,…,5} en las dimensiones económica, de uso, cultural y ecológica. Sin calificaciones: participación / participación máxima.','Total value = Σ wₖ·vₖ / Σ wₖ·5, vₖ ∈ {0,…,5} on economic, use, cultural and ecological dimensions. Unrated: participation / max participation.'))}
  <div class="card"><div class="row between"><h3 style="margin:0">${T('Pesos de las dimensiones del valor','Weights of value dimensions')}${ayuda('peso')}</h3></div><div class="grid g4">${DIMV.map(([k,n])=>`<label class="f"><span>${esc(tx(n))}</span><input type="range" min="0" max="3" step="0.5" value="${S.pesosValor[k]}" data-peso="${k}"><small class="muted">${T('peso','weight')} ${fmt(S.pesosValor[k],1)}</small></label>`).join('')}</div></div>
  <div class="tipo-tabs" style="flex-wrap:wrap">${Object.entries(CATS).map(([k,c])=>`<button data-pcat="${k}" class="${k===filtro?'on':''}">${c.sym} ${esc(tx(c.n))}</button>`).join('')}</div>
  <div class="card"><div class="tbl-c"><table class="tbl val"><thead><tr><th>${T('Elemento','Element')}</th><th class="r">${T('Precio unitario ($)','Unit price ($)')}${ayuda('precioValor')}</th><th>${T('Unidad','Unit')}</th><th class="r">${T('Cantidad por ha','Quantity per ha')}</th><th class="r">$/ha</th>${DIMV.map(([k,n,a])=>`<th>${esc(tx(n))}${ayuda(a)}</th>`).join('')}<th class="r">${T('Valor','Value')}</th></tr></thead><tbody>
   ${l.map(e=>{ const p=S.precio[e.id]||{}, v=valorEl(e.id,part); const sub=(+p.p||0)*(+p.q||0);
     return `<tr><td><b>${esc(tx(e.n))}</b>${e.usuario?` <span class="badge acc">${T('tuyo','yours')}</span> <button class="btn sm ghost" data-qpel="${esc(e.id)}" title="${T('Quitar del catálogo','Remove from catalogue')}">×</button>${e.d?`<div class="tiny muted">${esc(e.d)}</div>`:''}`:''}${(part[e.id]||0)?'':`<div class="tiny muted">${T('aún no participa en actividades','not yet in any activity')}</div>`}</td><td class="r"><input type="number" step="any" min="0" data-pp="${e.id}" value="${p.p??''}"></td><td><input data-pu="${e.id}" value="${esc(p.u??'')}" style="width:80px" placeholder="kg, L, jornal"></td><td class="r"><input type="number" step="any" min="0" data-pq="${e.id}" value="${p.q??''}"></td><td class="r">${p.p&&p.q?fmt(sub,2):'—'}</td>${DIMV.map(([k])=>`<td>${estrellas(e.id,k)}</td>`).join('')}<td class="r"><b>${fmt(v.v,2)}</b><div class="tiny muted">${v.origen==='usuario'?T('valorado','rated'):T('estructural','structural')}</div></td></tr>`; }).join('')}
   </tbody></table></div>
   <div class="nueva"><b>+ ${T('Agregar a','Add to')} «${esc(tx(CATS[filtro].n))}»</b>
     <div class="grid g3" style="margin-top:8px"><label class="f"><span>${T('Nombre','Name')}</span><input id="nqN" placeholder="${esc(T(EJEMPLO_CAT[filtro][0],EJEMPLO_CAT[filtro][1]))}"></label>
      <label class="f"><span>${T('Descripción (opcional)','Description (optional)')}</span><input id="nqD"></label>
      <label class="f"><span>${T('Unidad','Unit')}</span><input id="nqU" placeholder="kg, L, jornal, ha, pieza"></label>
      <label class="f"><span>${T('Precio unitario ($)','Unit price ($)')}</span><input type="number" step="any" min="0" id="nqP"></label>
      <label class="f"><span>${T('Cantidad por ha','Quantity per ha')}</span><input type="number" step="any" min="0" id="nqQ"></label>
      <div style="align-self:end"><button class="btn" id="nqAdd">+ ${T('Agregar al catálogo','Add to catalogue')}</button></div></div>
     <p class="nota">${T('Para que un elemento nuevo entre a la red y a la sostenibilidad, elígelo en una actividad (Bloque 5, «+ Actividad innovadora»).','For a new element to enter the network and sustainability, choose it in an activity (Block 5, “+ Innovative activity”).')}</p></div>
   <p class="nota">${T('No hay precios regionales publicados para estos elementos en las fuentes de Ratio Viña: la base se alimenta con tus cotizaciones y se guarda en tu navegador.','There are no published regional prices for these elements in Ratio Viña sources: the database is fed with your quotes and saved in your browser.')}</p></div>
  <div class="card"><div class="row between"><h3 style="margin:0">${T('Mi catálogo','My catalogue')}</h3>
    <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm ghost" id="catBaj">⤓ ${T('Descargar catálogo (CSV)','Download catalogue (CSV)')}</button><button class="btn sm ghost" id="catCar">⤒ ${T('Cargar catálogo (CSV)','Load catalogue (CSV)')}</button><input type="file" id="catF" accept=".csv,text/csv" hidden></div></div>
   <div class="catgrid" style="margin-top:10px">${Object.entries(CATS).map(([k,c])=>{ const base=ELEM.filter(e=>e.cat===k).length, mio=(S.elemExtra||[]).filter(e=>e.cat===k).length;
     return `<button class="catbox" data-pcat="${k}" style="--ec:${c.col};text-align:left;cursor:pointer;font-family:inherit"><h3><span class="sym">${c.sym}</span>${esc(tx(c.n))}</h3><div class="nota">${base} ${T('del caso','from the case')} · <b style="color:var(--accent-text)">${mio} ${T('tuyos','yours')}</b></div></button>`; }).join('')}</div>
   <p class="nota">${T('El CSV lleva las columnas categoria, elemento, descripcion, unidad, precio, cantidad_ha, economico, uso, cultural y ecologico. Al cargarlo, los elementos que ya existen actualizan su precio y su valor, y los nuevos se agregan a tu catálogo. Sirve para compartir el catálogo entre unidades de producción o localidades.','The CSV has columns categoria, elemento, descripcion, unidad, precio, cantidad_ha, economico, uso, cultural, ecologico. When loaded, existing elements update price and value and new ones are added to your catalogue. Use it to share the catalogue across farms or localities.')}</p></div>
  <div class="card"><h3>${T('Costo por hectárea de los elementos con precio','Cost per hectare of priced elements')}</h3>${(()=>{ const it=todosElem().map(e=>{ const p=S.precio[e.id]||{}; return {l:tx(e.n), v:(+p.p||0)*(+p.q||0), c:CATS[e.cat].col}; }).filter(x=>x.v>0).sort((a,b)=>b.v-a.v);
    return it.length ? barrasH(it.map(x=>({...x, vl:'$'+fmt(x.v,0)})),{izq:260})+`<p><b>${T('Total','Total')}: $${fmt(it.reduce((s,x)=>s+x.v,0),2)} / ha</b> · ${T('unidad de','unit of')} ${fmt(S.superficie,1)} ha: <b>$${fmt(it.reduce((s,x)=>s+x.v,0)*S.superficie,2)}</b></p>` : `<p class="sindato">${T('Captura precio y cantidad por hectárea para ver la estructura de costos.','Enter price and quantity per hectare to see the cost structure.')}</p>`; })()}</div>
  ${siguiente('precios')}`;
  $$('[data-pcat]',el).forEach(b=>b.onclick=()=>{ renderPrecios.cat=b.dataset.pcat; render(); });
  $('#nqAdd',el).onclick=()=>{ const n=$('#nqN',el).value.trim(); if(!n) return toast(T('Escribe el nombre','Write the name'));
    if(todosElem().some(e=>e.cat===filtro && tx(e.n).toLowerCase()===n.toLowerCase())) return toast(T('Ya existe en esta categoría','Already in this category'));
    const id='U'+Date.now().toString(36); S.elemExtra=S.elemExtra||[]; S.elemExtra.push({id, cat:filtro, n:E(n,n), d:$('#nqD',el).value.trim(), usuario:true});
    const p=$('#nqP',el).value, q=$('#nqQ',el).value, u=$('#nqU',el).value.trim(); if(p!==''||q!==''||u) S.precio[id]={p:p===''?'':+p, q:q===''?'':+q, u};
    guardar(); render(); toast(T('Agregado al catálogo','Added to the catalogue')); };
  $$('[data-qpel]',el).forEach(b=>b.onclick=()=>{ const id=b.dataset.qpel; S.elemExtra=S.elemExtra.filter(e=>e.id!==id); delete S.precio[id]; delete S.valor[id];
    Object.values(S.manejo).forEach(m=>(m.inn||[]).forEach(x=>{ x.el=(x.el||[]).filter(z=>z!==id); })); guardar(); render(); });
  $('#catBaj',el).onclick=()=>descargar(slug()+'_catalogo.csv', csv([['categoria','elemento','descripcion','unidad','precio','cantidad_ha','economico','uso','cultural','ecologico','propio']].concat(todosElem().map(e=>{ const p=S.precio[e.id]||{}, v=S.valor[e.id]||{}; return [e.cat, tx(e.n), e.d||'', p.u||'', p.p??'', p.q??'', v.eco??'', v.uso??'', v.cul??'', v.eia??'', e.usuario?'si':'no']; }))), 'text/csv');
  $('#catCar',el).onclick=()=>$('#catF',el).click();
  $('#catF',el).onchange=ev=>{ const f=ev.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const n=importarCatalogo(r.result); guardar(); render(); toast(T(`Catálogo cargado: ${n.nuevos} nuevos, ${n.act} actualizados`,`Catalogue loaded: ${n.nuevos} new, ${n.act} updated`)); }catch(e){ toast(T('CSV no válido','Invalid CSV')); } }; r.readAsText(f,'utf-8'); };
  $$('[data-peso]',el).forEach(r=>r.onchange=()=>{ S.pesosValor[r.dataset.peso]=+r.value; guardar(); render(); });
  const setP=(attr,k,num)=>$$(`[data-${attr}]`,el).forEach(i=>i.onchange=()=>{ const id=i.dataset[attr]; S.precio[id]=S.precio[id]||{}; S.precio[id][k]= num ? (i.value===''?'':+i.value) : i.value; guardar(); render(); });
  setP('pp','p',true); setP('pu','u',false); setP('pq','q',true);
  $$('.estrellas',el).forEach(s=>s.onclick=ev=>{ const b=ev.target.closest('button'); if(!b) return; const [id,k]=s.dataset.val.split('|'), i=+b.dataset.i; S.valor[id]=S.valor[id]||{}; S.valor[id][k]= S.valor[id][k]===i ? '' : i; S.formulado=false; guardar(); render(); }); }

/* Lectura de un CSV de catálogo (comillas dobles opcionales; separador coma) */
function leerCSV(t){ const filas=[]; let f=[], c='', q=false; t=t.replace(/^\ufeff/,'');
  for(let i=0;i<t.length;i++){ const ch=t[i];
    if(q){ if(ch==='"'){ if(t[i+1]==='"'){ c+='"'; i++; } else q=false; } else c+=ch; }
    else if(ch==='"') q=true; else if(ch===','){ f.push(c); c=''; } else if(ch==='\n'||ch==='\r'){ if(ch==='\r'&&t[i+1]==='\n') i++; f.push(c); filas.push(f); f=[]; c=''; } else c+=ch; }
  if(c!==''||f.length){ f.push(c); filas.push(f); } return filas.filter(r=>r.some(x=>x.trim()!=='')); }
function importarCatalogo(texto){ const filas=leerCSV(texto), cab=filas.shift().map(h=>h.trim().toLowerCase()); const ix=(k)=>cab.indexOf(k); let nuevos=0, act=0;
  const catDe=(v)=>{ v=(v||'').trim().toLowerCase(); return Object.keys(CATS).find(k=>k===v || tx(CATS[k].n).toLowerCase()===v || CATS[k].n.es.toLowerCase()===v || CATS[k].n.en.toLowerCase()===v); };
  filas.forEach(r=>{ const cat=catDe(r[ix('categoria')]), nom=(r[ix('elemento')]||'').trim(); if(!cat||!nom) return;
    let e=todosElem().find(x=>x.cat===cat && (tx(x.n).toLowerCase()===nom.toLowerCase() || x.n.es.toLowerCase()===nom.toLowerCase()));
    if(!e){ e={id:'U'+Date.now().toString(36)+nuevos, cat, n:E(nom,nom), d:(r[ix('descripcion')]||'').trim(), usuario:true}; S.elemExtra=S.elemExtra||[]; S.elemExtra.push(e); nuevos++; } else act++;
    const num=(k)=>{ const v=(r[ix(k)]||'').trim(); return v===''?'':+v; };
    const p={u:(r[ix('unidad')]||'').trim(), p:num('precio'), q:num('cantidad_ha')}; if(p.u||p.p!==''||p.q!=='') S.precio[e.id]=Object.assign(S.precio[e.id]||{}, p);
    const v={eco:num('economico'), uso:num('uso'), cul:num('cultural'), eia:num('ecologico')}; if(Object.values(v).some(x=>x!=='')) S.valor[e.id]=v; });
  return {nuevos, act}; }
const EJEMPLO_CAT = {actores:['p. ej., Mayordomo de la viña','e.g., Vineyard foreman'], instituciones:['p. ej., Universidad Veracruzana','e.g., Universidad Veracruzana'], insumos:['p. ej., Abono de lombricomposta','e.g., Vermicompost'],
  equipo:['p. ej., Tijeras de poda','e.g., Pruning shears'], naturales:['p. ej., Manantial','e.g., Spring'], financieros:['p. ej., Crédito de avío','e.g., Working-capital loan'], conocimientos:['p. ej., Saber de poda de la región','e.g., Local pruning know-how'],
  politicas:['p. ej., Programa estatal de fomento','e.g., State support programme'], perturbaciones:['p. ej., Norte (vientos del norte)','e.g., Norther winds'], productos:['p. ej., Vino artesanal','e.g., Craft wine']};
/* ================= BLOQUE 7 · FORMULACIÓN DEL SCA ================= */
function propiedadesSCA(R, st){ const nInn=R.acts.filter(a=>a.tipo==='inn').length, nCat=new Set(R.nodos.map(d=>d.cat)).size;
  return [
   [T('Agentes heterogéneos','Heterogeneous agents'), `${R.nodos.filter(d=>d.cat==='actores').length} ${T('grupos de actores y','actor groups and')} ${R.nodos.filter(d=>d.cat==='instituciones').length} ${T('instituciones con saberes y fines distintos.','institutions with different knowledge and aims.')}`],
   [T('Interacción local','Local interaction'), `${st.m} ${T('vínculos entre','links among')} ${st.n} ${T('elementos de','elements in')} ${nCat} ${T('categorías.','categories.')}`],
   [T('No linealidad','Nonlinearity'), T('Una sola decisión (la fecha de poda, un riego de más, una helada en brotación) cambia la cosecha de todo el ciclo y la del siguiente: los efectos no son proporcionales a la causa.','A single decision (pruning date, one irrigation too many, a frost at budburst) changes the whole cycle’s harvest and the next: effects are not proportional to causes.')],
   [T('Retroalimentación','Feedback'), T('La poda de hoy define la cosecha del año siguiente; los sarmientos y la cubierta vuelven al suelo; el balance del ciclo orienta las decisiones del siguiente.','Today’s pruning shapes next year’s crop; prunings and cover return to the soil; the cycle’s balance guides the next one’s decisions.')],
   [T('Memoria','Memory'), T('La planta es perenne: cada cepa guarda en su madera y en sus reservas la historia de los ciclos anteriores, y el saber del viticultor guarda la de su familia.','The vine is perennial: each plant stores in its wood and reserves the history of past cycles, and the grower’s knowledge stores the family’s.')],
   [T('Adaptación','Adaptation'), nInn ? `${nInn} ${T('actividades innovadas por la localidad.','activities innovated by the locality.')}` : T('Aún no registras innovaciones: agrégalas en el Bloque 5.','No innovations recorded yet: add them in Block 5.')],
   [T('Autoorganización','Self-organisation'), `${st.com.length} ${T('comunidades emergen sin que nadie las diseñe (modularidad Q =','communities emerge undesigned (modularity Q =')} ${fmt(st.Q,2)}).`],
   [T('Perturbaciones','Disturbances'), T('Heladas tardías, granizo, olas de calor y escasez de agua (Bloque 7) ponen a prueba la capacidad del viñedo para adaptarse.','Late frost, hail, heatwaves and water scarcity (Block 7) test the vineyard’s capacity to adapt.')]]; }
function renderFormulacion(el){ const R=construirRed(), st=estadisticaRed(R);
  el.innerHTML = `${cabecera('formulacion',T('Formular el sistema es tejerlo: los elementos se vuelven nodos, las actividades compartidas se vuelven vínculos y el valor da el grosor de cada hilo. Aquí ves el modelo del sistema complejo adaptativo de tu unidad de producción.','Formulating the system is weaving it: elements become nodes, shared activities become links and value sets each thread’s thickness. Here is the complex adaptive system model of your farm.'))}
  <div class="card formular"><button class="btn formula" id="bForm">${S.formulado?'↻ '+T('Volver a tejer el sistema','Re-weave the system'):T('Tejer el sistema','Weave the system')} <span class="tejiendo" style="display:none" id="tej">✺</span></button>
   <div><b>${R.nodos.length}</b> ${T('nodos','nodes')} · <b>${R.aristas.length}</b> ${T('vínculos','links')} · <b>${R.acts.length}</b> ${T('actividades','activities')} · ${T('densidad','density')} <b>${fmt(st.densidad,3)}</b>${ayuda('densidad')}</div></div>
  <div class="card"><div class="row between" style="flex-wrap:wrap;gap:8px"><h3 style="margin:0">${T('Modelo del sistema','System model')}</h3><div class="seg-m3d" role="tablist"><button type="button" class="btn sm" role="tab" aria-selected="true" data-m3dvista="3d">${T('Modelo 3D','3D model')}</button><button type="button" class="btn ghost sm" role="tab" aria-selected="false" data-m3dvista="2d">${T('Esquema 2D','2D sketch')}</button></div></div>
   <div id="m3d" class="m3d-caja"></div><div id="m2d" hidden>${modeloSCA(R)}</div>
   <p class="nota">${marcaInterp()} ${T('Modelo por capas, de abajo arriba: entorno de perturbaciones, entradas (recursos, insumos, finanzas), agentes y conocimiento, núcleo de manejo (5B → pasos → actividades) y salidas (productos, mercado, bienestar); encima, la emergencia y la adaptación. Los nodos y vínculos son los de tu red: el número de cada nodo es su importancia de 0 a 100 y las líneas punteadas son las retroalimentaciones del ciclo.','Layered model, bottom to top: disturbance environment, inputs (resources, inputs, finance), agents and knowledge, management core (5B → steps → activities) and outputs (products, market, well-being); above, emergence and adaptation. Nodes and links are those of your network: each node’s number is its importance from 0 to 100 and dashed lines are the cycle feedbacks.')}</p></div>
  <h2 class="section-t">${T('Propiedades de sistema complejo adaptativo','Complex adaptive system properties')}</h2>
  <div class="props">${propiedadesSCA(R,st).map((p,i)=>`<div class="prop aparece" style="animation-delay:${i*60}ms"><b>${p[0]}</b><span class="ev">${p[1]}</span></div>`).join('')}</div>
  <div class="card sci"><h3>${T('Formulación matemática','Mathematical formulation')}</h3>
   <div class="formula">G = (V, A, w) ; V = ${T('elementos','elements')} ; (i, j) ∈ A ⇔ ∃ ${T('actividad','activity')} a: i, j ∈ a ${T('o lazo documentado','or documented link')}</div>
   <div class="formula">w<sub>ij</sub> = Σ<sub>a ∋ i, j</sub> √(v<sub>i</sub> · v<sub>j</sub>) ; v<sub>i</sub> = Σ<sub>k</sub> ω<sub>k</sub> v<sub>ik</sub> / (5 Σ<sub>k</sub> ω<sub>k</sub>) ${T('o','or')} p<sub>i</sub> / max p</div>
   <p class="nota">${T('La media geométrica hace que un vínculo pese poco si cualquiera de sus dos elementos vale poco: el hilo es tan fuerte como el más débil de sus extremos.','The geometric mean makes a link weigh little if either element is worth little: the thread is as strong as its weakest end.')}</p></div>
  ${siguiente('formulacion')}`;
  modelo3D($('#m3d',el));
  $$('.seg-m3d [data-m3dvista]',el).forEach(b=>b.onclick=()=>{ const v=b.dataset.m3dvista; $$('.seg-m3d [data-m3dvista]',el).forEach(x=>{ const on=x.dataset.m3dvista===v; x.classList.toggle('ghost',!on); x.setAttribute('aria-selected',on); });
    $('#m3d',el).hidden=v!=='3d'; $('#m2d',el).hidden=v!=='2d'; });
  $('#bForm',el).onclick=()=>{ $('#tej',el).style.display='inline-block'; setTimeout(()=>{ S.formulado=true; guardar(); toast(T('Sistema tejido: mira el tablero','System woven: see the dashboard')); irA('tablero'); },700); }; }
