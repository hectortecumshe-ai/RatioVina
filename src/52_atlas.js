"use strict";
/* =====================================================================
   Bloque 15 · ATLAS NACIONAL DEL CONOCIMIENTO LOCAL DE LA VID
   ---------------------------------------------------------------------
   Sin servidor ni terceros: cada localidad guarda su proyecto (.vina.json)
   y aquí se juntan muchos. De cada archivo se calcula un resumen con las
   mismas funciones de la app (actividades, red, sostenibilidad,
   regeneración y riesgo) y solo se guarda el resumen, en este navegador.
   Agregación:
     · frecuencia de una práctica  f_a = Σ[resp = sí] / Σ[resp ≠ vacío]
       (solo localidades que respondieron esa actividad)
     · por región de Banxico, la misma razón dentro de la región
     · red nacional: w_ij = n_ij / L, fracción de localidades cuya red
       (sin el nodo omnipresente PM) contiene el vínculo i–j
   Nada se imputa: lo no respondido queda fuera del denominador.
   ===================================================================== */
const ATLAS_KEY = 'vina_atlas';
function atlasLeer(){ try{ return JSON.parse(localStorage.getItem(ATLAS_KEY)||'[]'); }catch(e){ return []; } }
function atlasEscribir(L){ try{ localStorage.setItem(ATLAS_KEY, JSON.stringify(L)); return true; }catch(e){ toast(T('El atlas ya no cabe en este navegador: exporta el atlas consolidado y trabaja con él.','The atlas no longer fits in this browser: export the consolidated atlas and work with it.')); return false; } }
/* Evalúa un proyecto ajeno con las funciones de la app sin tocar el proyecto del usuario */
function conEstado(est, ref, fn){ const prev=S, prevEJ=EJ; S=Object.assign(estadoInicial(), JSON.parse(JSON.stringify(est))); EJ=!!ref; try{ return fn(); } finally{ S=prev; EJ=prevEJ; } }
function resumenProyecto(est, archivo, ref){ return conEstado(est, ref, ()=>{
  const acts=actividades(), l=locSel(), m=munSel(), ed=edoDe(S.edo)||EDO_VACIO;
  const resp={}; PASOS.forEach(p=>{ const mm=manejoDe(p.n); p.a.forEach(a=>{ if(mm.resp[a[0]]) resp[a[0]]=mm.resp[a[0]]; }); });
  const sos=acts.length?sostenibilidad():null, rg=regeneracion(), rs=riesgos({rg}), R=acts.length?construirRed(true):null;
  const nombres={}; if(R) R.nodos.forEach(d=>nombres[d.id]=[d.nombre, d.cat]);
  const r=Object.values(resp);
  return {id:[S.proyecto.nombre,S.edo,S.mun,S.loc,S.proyecto.fecha,archivo].join('|'), ref:!!ref, archivo:archivo||'', fecha:S.proyecto.fecha,
    nombre:S.proyecto.nombre||archivo||T('Sin nombre','Unnamed'), edo:S.edo, edoN:ed[1], reg:ed[3], mun:m?m[1]:'', loc:l?l[1]:'', lon:l?l[4]:null, lat:l?l[5]:null, alt:l?l[3]:null,
    dest:S.vidDestino||'', vari:S.vidVar||'', plant:S.vidPlant||'', mat:S.vidMat||'', edad:edadVinedo(), nPodas:(S.podas||[]).length, pie:S.vidPie||'', cond:S.vidCond||'', W:indicesClima().W, HI:indicesClima().HI, CI:indicesClima().CI, sistema:S.sistema, sisN:S.sistema?tx(sistemaSel().n):'',
    nSi:r.filter(v=>v==='si').length, nNo:r.filter(v=>v==='no').length, nInn:acts.filter(a=>a.tipo==='inn').length,
    inn:acts.filter(a=>a.tipo==='inn').map(a=>({paso:a.paso, t:tx(a.n)})),
    IS:sos?sos.global:null, IR:rg.IR, IRprov:rg.provisional, RG:acts.length?rs.idx:null, RGprov:rs.provisional, CA:rs.sinCA?null:rs.CA,
    resp, red:R?{v:R.aristas.map(x=>[x.a,x.b]), nombres}:null, lleno:avanceTotal()}; }); }
/* Archivos que entiende el atlas: proyecto de Ratio Viña (.vina.json), proyecto de uva de Ratio Telar, o un atlas consolidado */
function atlasLeerArchivo(nombre, texto){ const d=JSON.parse(texto);
  if(d && d.atlas && Array.isArray(d.localidades)) return d.localidades.filter(x=>x&&x.resp);
  if(d && d.estado && d.estado.manejo){ let st=d.estado; if(st.cultivo && st.cultivo!=='uva') throw new Error(T('no es un proyecto de vid','not a grapevine project'));
    if(!st.formato) st=migrarV2(Object.assign({}, st, {cultivo:'uva'}));
    st=migrarPasos(st);
    return [resumenProyecto(st, nombre, false)]; }
  throw new Error(T('formato no reconocido','unrecognised format')); }
function atlasAgregar(lista){ const L=atlasLeer(); let n=0, rep=0; lista.forEach(x=>{ const i=L.findIndex(y=>y.id===x.id); if(i>=0){ L[i]=x; rep++; } else { L.push(x); n++; } }); atlasEscribir(L); return {n, rep}; }

/* ---------------- Agregaciones ---------------- */
const REGS = ()=> Object.keys(REG_BX);
const media = a=>{ const v=a.filter(x=>x!=null&&isFinite(x)); return v.length?v.reduce((s,x)=>s+x,0)/v.length:null; };
function practicasAtlas(L){ return PASOS.flatMap(p=>p.a.map(a=>{ const fr=(lst)=>{ const r=lst.map(x=>x.resp[a[0]]).filter(Boolean); return {N:r.length, f:r.length?r.filter(v=>v==='si').length/r.length:null}; };
  const nac=fr(L), porReg=Object.fromEntries(REGS().map(k=>[k, fr(L.filter(x=>x.reg===k))]));
  return {paso:p.n, b:p.b, cod:a[0], n:T(a[1],a[2]), N:nac.N, f:nac.f, porReg}; })); }
function redNacional(L){ const conRed=L.filter(x=>x.red), Ln=conRed.length; if(!Ln) return null; const W=new Map(), nombres={}, pres={};
  conRed.forEach(x=>{ Object.entries(x.red.nombres).forEach(([id,v])=>{ nombres[id]=v; pres[id]=(pres[id]||0)+1; }); new Set(x.red.v.map(([a,b])=>a<b?a+'|'+b:b+'|'+a)).forEach(k=>W.set(k,(W.get(k)||0)+1)); });
  const ids=Object.keys(pres), cats=Object.keys(CATS);
  const nodos=ids.map(id=>{ const [nombre,cat]=nombres[id]; const c=CATS[cat]?cat:cats[0]; return {id, nombre, cat:c, col:CATS[c].col, val:pres[id]/Ln, part:pres[id]}; });
  const aristas=[...W.entries()].map(([k,n])=>{ const [a,b]=k.split('|'); return {a, b, w:n/Ln, n, acts:[]}; });
  return {R:{nodos, aristas, acts:[], part:pres, val:{}}, Ln}; }
function porRegion(L){ return REGS().map(k=>{ const l=L.filter(x=>x.reg===k); return {k, n:l.length, IS:media(l.map(x=>x.IS)), IR:media(l.map(x=>x.IR)), RG:media(l.map(x=>x.RG)), si:media(l.map(x=>x.nSi))}; }); }

/* ---------------- Gráficas ---------------- */
function mapaAtlas(L){ const W=MAPA_MX.w, H=MAPA_MX.h, cveDe=Object.fromEntries(TERR.estados.map(e=>[e[5],e[0]])), cuenta={};
  L.forEach(x=>{ if(x.edo) cuenta[x.edo]=(cuenta[x.edo]||0)+1; });
  let s=`<svg class="mapa atlas-mapa" viewBox="0 0 ${W} ${H}" role="img" aria-label="${T('Localidades del atlas en el mapa de México','Atlas localities on the map of Mexico')}">`;
  s+=Object.entries(MAPA_MX.edo).map(([k,d])=>{ const c=cveDe[k], n=cuenta[c]||0, e=edoDe(c);
    return `<path d="${d}" class="edo-a" style="fill:${n?`color-mix(in srgb,var(--accent) ${Math.min(75,22+n*12)}%,var(--card))`:'var(--bg-soft)'}"><title>${esc(e?e[1]:k)} · ${n} ${n===1?T('localidad','locality'):T('localidades','localities')}</title></path>`; }).join('');
  L.forEach(x=>{ if(x.lon==null||x.lat==null) return; const [px,py]=proyecta(x.lon,x.lat), cl=CLASE_IR(x.IR);
    s+=`<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)})"><circle r="9" fill="${(REG_BX[x.reg]||{col:'#888'}).col}" stroke="#fff" stroke-width="2.5" ${x.ref?'stroke-dasharray="3 2"':''}/><title>${esc(x.loc+' · '+x.mun+', '+x.edoN)}${x.ref?' · '+esc(T('caso publicado','published case')):''} · IR ${x.IR!=null?fmt(100*x.IR,0):'—'} (${esc(tx(cl.n))})</title></g>`; });
  return s+'</svg>'; }
const celdaF = f=> f==null?`<td class="hc vacia">—</td>`:`<td class="hc" style="--f:${f.toFixed(3)}" title="${fmt(100*f,0)} %">${fmt(100*f,0)}</td>`;

/* ---------------- Bloque 15 ---------------- */
function renderAtlas(el){ const L=atlasLeer(), orden=renderAtlas.orden||'paso', ab=renderAtlas.ab||false;
  const P=L.length?practicasAtlas(L):[], RN=L.length?redNacional(L):null, stN=RN&&RN.R.nodos.length?estadisticaRed(RN.R):null, PR=porRegion(L);
  const razas={}; L.forEach(x=>{ const k=x.vari||T('Variedad sin especificar','Variety not specified'); razas[k]=(razas[k]||0)+1; });
  const destinos=VID_DESTINOS.map(d=>({d, n:L.filter(x=>x.dest===d.id).length})), sinDest=L.filter(x=>!x.dest).length;
  const porW=CLASE_W.map(c=>({c, l:L.filter(x=>x.W!=null&&clase(CLASE_W,x.W)===c)})), sinW=L.filter(x=>x.W==null).length;
  const estados=new Set(L.map(x=>x.edo).filter(Boolean)), regiones=new Set(L.map(x=>x.reg).filter(Boolean)), innov=L.flatMap(x=>x.inn.map(i=>({...i, loc:x.loc||x.nombre, edo:x.edoN})));
  const Pord=[...P].sort(orden==='mas'?(a,b)=>(b.f??-1)-(a.f??-1):orden==='menos'?(a,b)=>(a.f??2)-(b.f??2):(a,b)=>a.paso-b.paso||a.cod.localeCompare(b.cod)), Pver=ab?Pord:Pord.slice(0,25);
  el.innerHTML=`${cabecera('atlas',T('El atlas junta los archivos de muchos viñedos para leer el conocimiento local de la vid a escala nacional: dónde se documentó, en qué clima, qué prácticas se conservan en cada región y en cada destino, qué variedades se cultivan y cómo se teje la red nacional. Todo ocurre en este navegador; ningún dato sale a un servidor.','The atlas combines files from many vineyards to read local grapevine knowledge at national scale: where it was documented, in which climate, which practices persist in each region and destination, which varieties are grown and how the national network is woven. Everything happens in this browser; no data goes to a server.'))}
  ${consejo(T('Cada encuestador llena un viñedo y lo guarda en el Bloque 14 con «Guardar proyecto». Quien coordina el estudio reúne esos archivos y los agrega aquí, varios a la vez. El atlas se puede exportar como un solo archivo para compartirlo o seguir agregando.','Each surveyor fills in one vineyard and saves it in Block 14 with “Save project”. The study coordinator gathers those files and adds them here, several at once. The atlas can be exported as a single file to share it or keep adding.'),
    T('Frecuencia de una práctica: f = localidades que respondieron «sí» ÷ localidades que respondieron (sí o no); lo no respondido no entra al denominador. Red nacional: peso de un vínculo = fracción de localidades cuya red (sin PM) lo contiene. Los índices regionales son medias simples de los valores de cada localidad.','Practice frequency: f = localities answering “yes” ÷ localities answering (yes or no); unanswered items stay out of the denominator. National network: link weight = share of localities whose network (without PM) contains it. Regional indices are simple means of each locality’s values.'))}
  <div class="card no-print"><div class="row" style="gap:8px;flex-wrap:wrap">
    <button class="btn" id="aArch">＋ ${T('Agregar archivos de localidades','Add locality files')}</button><input type="file" id="aFile" accept=".json,application/json" multiple hidden>
    <button class="btn ghost" id="aMio" ${EJ?'disabled':''}>${T('Agregar mi proyecto actual','Add my current project')}</button>
    ${L.length?`<button class="btn ghost" id="aExp">⤓ ${T('Exportar atlas','Export atlas')}</button><button class="btn ghost" id="aCsvL">${T('CSV de localidades','Localities CSV')}</button><button class="btn ghost" id="aCsvP">${T('CSV de prácticas','Practices CSV')}</button><button class="btn ghost danger" id="aVac">${T('Vaciar el atlas','Empty the atlas')}</button>`:''}</div>
    <p class="nota">${T('Acepta proyectos de Ratio Viña (.vina.json), proyectos de uva de Ratio Telar (.telar.json) y atlas exportados. Si un archivo ya estaba, se actualiza.','Accepts Ratio Viña projects (.vina.json), Ratio Telar grape projects (.telar.json) and exported atlases. If a file was already there, it is updated.')}</p></div>
  ${!L.length?`<div class="card vacio-res"><h2>${T('El atlas está vacío','The atlas is empty')}</h2><p>${T('Agrega los archivos .vina.json de los viñedos documentados.','Add the .vina.json files of the documented vineyards.')}</p></div>${siguiente('atlas')}`:`
  <div class="kpis"><div class="kpi"><div class="l">${T('Localidades','Localities')}</div><div class="v">${L.length}</div><div class="s">${L.filter(x=>x.ref).length?L.filter(x=>x.ref).length+' '+T('caso publicado','published case'):T('documentadas','documented')}</div></div>
   <div class="kpi"><div class="l">${T('Estados · regiones','States · regions')}</div><div class="v">${estados.size} · ${regiones.size}</div><div class="s">${T('de 32 y 4','of 32 and 4')}</div></div>
   <div class="kpi"><div class="l">${T('Variedades distintas','Distinct varieties')}</div><div class="v">${Object.keys(razas).length}</div><div class="s">${destinos.filter(x=>x.n).map(x=>x.n+' '+tx(x.d.n).toLowerCase()).join(' · ')||'—'}</div></div>
   <div class="kpi"><div class="l">${T('Innovaciones registradas','Recorded innovations')}</div><div class="v">${innov.length}</div><div class="s">${T('actividades nuevas de las localidades','new activities from the localities')}</div></div></div>
  <div class="grid g2"><div class="card"><h3>${T('Dónde se ha documentado','Where it has been documented')}</h3>${mapaAtlas(L)}
     <div class="chips" style="margin-top:6px">${Object.entries(REG_BX).map(([k,r])=>`<span class="chip rchip" style="--rc:${r.col}"><i></i>${esc(tx(r.n))} · ${PR.find(x=>x.k===k).n}</span>`).join('')}</div>
     <p class="tiny muted">${T('Color del estado: número de localidades. Punto: localidad, color de su región (Banco de México); borde punteado = caso publicado.','State colour: number of localities. Dot: locality, coloured by region (Banco de México); dashed outline = published case.')}</p></div>
   <div class="card"><h3>${T('Comparación por región','Comparison by region')}</h3>
     <table class="tbl"><thead><tr><th>${T('Región','Region')}</th><th class="r">n</th><th class="r">${T('Sostenib.','Sustain.')}</th><th class="r">${T('Regenerac.','Regenerat.')}</th><th class="r">${T('Riesgo','Risk')}</th><th class="r">${T('Prácticas «sí»','“Yes” practices')}</th></tr></thead>
     <tbody>${PR.map(x=>`<tr><td><span class="punto" style="background:${REG_BX[x.k].col}"></span>${esc(tx(REG_BX[x.k].n))}</td><td class="r">${x.n}</td><td class="r">${x.IS!=null?fmt(x.IS,2):'—'}</td><td class="r">${x.IR!=null?fmt(100*x.IR,0):'—'}</td><td class="r">${x.RG!=null?fmt(100*x.RG,0):'—'}</td><td class="r">${x.si!=null?fmt(x.si,0):'—'}</td></tr>`).join('')}</tbody></table>
     <p class="nota">${T('Medias simples de las localidades de cada región; sostenibilidad 0–1, regeneración y riesgo 0–100. Si una localidad no confirmó todas sus perillas, su valor es provisional.','Simple means of each region’s localities; sustainability 0–1, regeneration and risk 0–100. If a locality did not confirm all its knobs, its value is provisional.')}</p>
     ${barrasH(PR.filter(x=>x.IR!=null).map(x=>({l:tx(REG_BX[x.k].n)+' · '+T('regeneración','regeneration'), v:100*x.IR, c:REG_BX[x.k].col, vl:fmt(100*x.IR,0)})),{max:100, izq:220})}</div></div>
  <div class="card"><div class="row between"><h3 style="margin:0">${T('Prácticas del cuestionario base: ¿quién las conserva?','Baseline questionnaire practices: who keeps them?')}</h3>
     <div class="basesw">${[['paso',T('Por paso','By step')],['mas',T('Más practicadas','Most practised')],['menos',T('Menos practicadas','Least practised')]].map(([k,n])=>`<button data-aord="${k}" class="${k===orden?'on':''}">${n}</button>`).join('')}</div></div>
   <p class="nota">${T('Porcentaje de localidades que respondieron «sí»; entre paréntesis, cuántas respondieron. Por región, el mismo porcentaje dentro de la región.','Percentage of localities answering “yes”; in brackets, how many answered. By region, the same percentage within the region.')}</p>
   <div class="tbl-c"><table class="tbl atlas-p"><thead><tr><th>${T('Paso','Step')}</th><th>${T('Actividad','Activity')}</th><th class="r">${T('Nacional','National')}</th>${REGS().map(k=>`<th class="r">${esc(tx(REG_BX[k].n))}</th>`).join('')}</tr></thead>
   <tbody>${Pver.map(x=>`<tr><td>${x.paso}</td><td><code>${x.cod}</code> ${esc(x.n)}</td>${x.f==null?`<td class="hc vacia">—</td>`:`<td class="hc" style="--f:${x.f.toFixed(3)}">${fmt(100*x.f,0)} <small>(${x.N})</small></td>`}${REGS().map(k=>celdaF(x.porReg[k].f)).join('')}</tr>`).join('')}</tbody></table></div>
   ${P.length>25?`<button class="btn sm ghost" id="aAb">${ab?T('Ver menos','Show less'):T(`Ver las ${P.length} actividades`,`Show all ${P.length} activities`)}</button>`:''}</div>
  <div class="grid g2"><div class="card"><h3>${T('Variedades cultivadas','Varieties grown')}</h3>${barrasH(Object.entries(razas).sort((a,b)=>b[1]-a[1]).slice(0,16).map(([k,n])=>({l:k, v:n, c:'#6b3fa0', vl:String(n)})),{izq:260})}
     <h4 style="margin:12px 0 4px">${T('Destino de la uva','Grape destination')}</h4>${barrasH(destinos.filter(x=>x.n).map(x=>({l:tx(x.d.n), v:x.n, c:x.d.col, vl:String(x.n)})).concat(sinDest?[{l:T('Sin especificar','Not specified'), v:sinDest, c:'#8a8f86', vl:String(sinDest)}]:[]),{izq:220})}</div>
   <div class="card"><h3>${T('Viñedos por región de Winkler','Vineyards by Winkler region')}</h3>${barrasH(porW.map(x=>({l:x.c[1]+' · '+tx(x.c[2]), v:x.l.length, c:'#7a4f9a', vl:String(x.l.length)})),{izq:220})}
     <p class="nota">${sinW?sinW+' '+T('viñedos sin datos de clima completos.','vineyards without complete climate data.')+' ':''}${T('Región calculada con las temperaturas que capturó cada viñedo (Bloque 3; Amerine y Winkler, 1944).','Region computed from each vineyard’s entered temperatures (Block 3; Amerine & Winkler, 1944).')}</p>
     <table class="tbl"><thead><tr><th>${T('Región','Region')}</th><th class="r">n</th><th class="r">${T('Prácticas «sí»','“Yes” practices')}</th><th class="r">${T('Regenerac.','Regenerat.')}</th><th class="r">${T('Riesgo','Risk')}</th></tr></thead>
     <tbody>${porW.map(x=>`<tr><td>${x.c[1]}</td><td class="r">${x.l.length}</td><td class="r">${x.l.length?fmt(media(x.l.map(y=>y.nSi)),0):'—'}</td><td class="r">${x.l.length&&media(x.l.map(y=>y.IR))!=null?fmt(100*media(x.l.map(y=>y.IR)),0):'—'}</td><td class="r">${x.l.length&&media(x.l.map(y=>y.RG))!=null?fmt(100*media(x.l.map(y=>y.RG)),0):'—'}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="grid g2">   <div class="card"><h3>${T('Innovaciones de las localidades','Innovations from the localities')}</h3>${innov.length?`<ul class="atlas-inn">${innov.slice(0,40).map(i=>`<li><b>${esc(i.t)}</b> <span class="muted">· ${T('paso','step')} ${i.paso} · ${esc(i.loc)}${i.edo&&i.edo!=='—'?', '+esc(i.edo):''}</span></li>`).join('')}</ul>${innov.length>40?`<p class="nota">… ${innov.length-40} ${T('más en el CSV de localidades','more in the localities CSV')}</p>`:''}`:`<p class="sindato">${T('Ninguna localidad ha registrado actividades innovadoras todavía.','No locality has recorded innovative activities yet.')}</p>`}</div></div>
  <div class="card"><h3>${T('Red nacional del conocimiento de la vid','National grapevine-knowledge network')}</h3>
   ${stN?`<div class="kpis"><div class="kpi"><div class="l">${T('Elementos · vínculos','Elements · links')}</div><div class="v">${stN.n} · ${stN.m}</div><div class="s">${T('de','from')} ${RN.Ln} ${T('localidades con red','localities with a network')}</div></div><div class="kpi"><div class="l">${T('Modularidad Q','Modularity Q')}</div><div class="v">${fmt(stN.Q,3)}</div><div class="s">${stN.com.length} ${T('comunidades','communities')}</div></div><div class="kpi"><div class="l">${T('Elemento más central','Most central element')}</div><div class="v" style="font-size:18px">${esc([...stN.nodos].sort((a,b)=>b.grado-a.grado)[0].nombre)}</div><div class="s">${T('mayor grado ponderado','highest weighted degree')}</div></div></div>
   ${redSistema(stN,{h:560})}<p class="nota">${T('Grosor del vínculo: fracción de localidades donde aparece. Sin el nodo omnipresente (productores).','Link width: share of localities where it appears. Without the omnipresent node (farmers).')}</p>`:`<p class="sindato">${T('Ninguna localidad tiene actividades respondidas «sí» todavía.','No locality has activities answered “yes” yet.')}</p>`}</div>
  <div class="card"><h3>${T('Localidades del atlas','Atlas localities')}</h3><div class="tbl-c"><table class="tbl"><thead><tr><th>${T('Localidad','Locality')}</th><th>${T('Estado','State')}</th><th>${T('Destino · variedad','Use · variety')}</th><th>${T('Sistema','System')}</th><th class="r">${T('Sí / No','Yes / No')}</th><th class="r">IS</th><th class="r">IR</th><th class="r">${T('Riesgo','Risk')}</th><th class="r">${T('Llenado','Filled')}</th><th></th></tr></thead>
   <tbody>${L.map((x,i)=>`<tr${x.ref?' class="atlas-ref"':''}><td>${esc(x.loc||'—')}${x.ref?` <span class="badge acc">${T('caso publicado','published case')}</span>`:''}<br><small class="muted">${esc(x.nombre)}</small></td><td>${esc(x.edoN)}</td><td>${esc([x.dest?tx((VID_DESTINOS.find(d=>d.id===x.dest)||{n:''}).n):'', x.vari].filter(Boolean).join(' · ')||'—')}${x.W!=null?`<br><small class="muted">Winkler ${clase(CLASE_W,x.W)[1]} · ${fmt(x.W,0)} °C·d</small>`:''}</td><td>${esc(x.sisN||'—')}</td><td class="r">${x.nSi} / ${x.nNo}</td><td class="r">${x.IS!=null?fmt(x.IS,2):'—'}</td><td class="r">${x.IR!=null?fmt(100*x.IR,0)+(x.IRprov?'*':''):'—'}</td><td class="r">${x.RG!=null?fmt(100*x.RG,0)+(x.RGprov?'*':''):'—'}</td><td class="r">${fmt(100*(x.lleno||0),0)} %</td><td><button class="btn sm ghost no-print" data-aq="${i}" aria-label="${T('Quitar','Remove')}">×</button></td></tr>`).join('')}</tbody></table></div>
   <p class="nota">* ${T('provisional: la localidad no confirmó todas sus perillas.','provisional: the locality did not confirm all its knobs.')} ${T('«Llenado»: proporción de los ocho bloques de captura que llenó la localidad.','“Filled”: share of the eight data-entry blocks the locality filled in.')}</p></div>
  ${siguiente('atlas')}`}`;
  const f=$('#aFile',el); $('#aArch',el).onclick=()=>f.click();
  f.onchange=async()=>{ const nuevos=[], malos=[]; for(const a of f.files){ try{ nuevos.push(...atlasLeerArchivo(a.name, await a.text())); }catch(e){ malos.push(a.name+' ('+e.message+')'); } }
    const r=atlasAgregar(nuevos); render(); toast(T(`${r.n} agregadas, ${r.rep} actualizadas`,`${r.n} added, ${r.rep} updated`)+(malos.length?' · '+T('no se pudieron leer: ','could not read: ')+malos.join(', '):'')); };
  $('#aMio',el).onclick=()=>{ if(!actividades().length && !S.edo) return toast(T('Tu proyecto aún no tiene datos','Your project has no data yet')); const r=atlasAgregar([resumenProyecto(S, slug()+'.vina.json', false)]); render(); toast(r.n?T('Tu proyecto se agregó al atlas','Your project was added to the atlas'):T('Tu proyecto se actualizó en el atlas','Your project was updated in the atlas')); };
  $$('[data-aord]',el).forEach(b=>b.onclick=()=>{ renderAtlas.orden=b.dataset.aord; render(); });
  if($('#aAb',el)) $('#aAb',el).onclick=()=>{ renderAtlas.ab=!ab; render(); };
  $$('[data-aq]',el).forEach(b=>b.onclick=()=>{ const L2=atlasLeer(), x=L2[+b.dataset.aq]; if(x&&confirm(T(`¿Quitar «${x.loc||x.nombre}» del atlas? El archivo original no se borra.`,`Remove “${x.loc||x.nombre}” from the atlas? The original file is not deleted.`))){ L2.splice(+b.dataset.aq,1); atlasEscribir(L2); render(); } });
  if(!L.length) return;
  $('#aVac',el).onclick=()=>{ if(confirm(T('¿Vaciar el atlas de este navegador? Los archivos de las localidades no se borran; expórtalo antes si lo necesitas.','Empty this browser’s atlas? The locality files are not deleted; export it first if you need it.'))){ atlasEscribir([]); render(); } };
  $('#aExp',el).onclick=()=>descargar('atlas_vid_'+new Date().toISOString().slice(0,10)+'.atlas.json', JSON.stringify({app:'Ratio Viña', version:CONFIG.version, atlas:true, fecha:new Date().toISOString().slice(0,10), localidades:L},null,1), 'application/json');
  $('#aCsvL',el).onclick=()=>descargar('atlas_localidades.csv', csv([['localidad','municipio','estado','region','lat','lon','altitud_m','destino','variedad','portainjerto','conduccion','fecha_plantacion','material_plantacion','edad_anios','podas_registradas','winkler_GDD','huglin','frescor_nocturno','sistema','practicas_si','practicas_no','innovaciones','IS','IR_0_100','IR_provisional','riesgo_0_100','riesgo_provisional','capacidad_adaptativa','llenado_%','caso_publicado','archivo','innovaciones_detalle']].concat(L.map(x=>[x.loc,x.mun,x.edoN,x.reg?tx(REG_BX[x.reg].n):'',x.lat??'',x.lon??'',x.alt??'',x.dest,x.vari,x.pie,x.cond,x.plant,x.mat,x.edad!=null?x.edad.toFixed(1):'',x.nPodas,x.W!=null?x.W.toFixed(0):'',x.HI!=null?x.HI.toFixed(0):'',x.CI!=null?x.CI.toFixed(1):'',x.sisN,x.nSi,x.nNo,x.nInn,x.IS!=null?x.IS.toFixed(3):'',x.IR!=null?(100*x.IR).toFixed(1):'',x.IRprov?1:0,x.RG!=null?(100*x.RG).toFixed(1):'',x.RGprov?1:0,x.CA!=null?x.CA.toFixed(3):'',(100*(x.lleno||0)).toFixed(0),x.ref?1:0,x.archivo,x.inn.map(i=>i.paso+': '+i.t).join(' | ')]))), 'text/csv');
  $('#aCsvP',el).onclick=()=>descargar('atlas_practicas.csv', csv([['paso','codigo','actividad','localidades_que_respondieron','frecuencia_si_nacional',...REGS().flatMap(k=>['n_'+k,'f_'+k])]].concat(P.map(x=>[x.paso,x.cod,x.n,x.N,x.f!=null?x.f.toFixed(3):'',...REGS().flatMap(k=>[x.porReg[k].N, x.porReg[k].f!=null?x.porReg[k].f.toFixed(3):''])]))), 'text/csv');
  enlazarTips(el); }
