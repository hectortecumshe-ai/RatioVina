"use strict";
/* =====================================================================
   5. MOTOR DEL SISTEMA COMPLEJO ADAPTATIVO
   Red de elementos ponderada por el valor, estadística de redes, correlaciones,
   sostenibilidad por actividad, cumplimiento de ODS y huella de carbono.
   ===================================================================== */
const todosElem = ()=> ELEM.concat(S.elemExtra||[]);
const elemPorId = (id)=> todosElem().find(e=>e.id===id);
const nombreEl = (id)=> { const e=elemPorId(id); return e ? tx(e.n) : id; };
const manejoDe = (n)=>{ const m = S.manejo[n] = S.manejo[n] || {resp:{}, inn:[], imp:{}}; m.resp=m.resp||{}; m.inn=m.inn||[]; m.imp=m.imp||{}; return m; };
const N_ACT_STACK = ()=> PASOS.reduce((s,p)=>s+p.a.length,0);

/* Actividades del sistema: las tradicionales del Stack publicado SOLO si el usuario respondió «sí, la practico»
   (sin respuesta no cuentan: nada se precarga) + las innovadoras o propias que agregó */
function actividades(){
  const out=[];
  if(conStack()) PASOS.forEach(p=>{ const m=manejoDe(p.n);
    p.a.forEach(a=>{ if(m.resp[a[0]]!=='si') return; out.push({paso:p.n, b:p.b, cod:a[0], n:E(a[1],a[2]), tipo:'trad', el:(ACT_EL[a[0]]||'').split(' ').filter(Boolean), imp:m.imp[a[0]]||null}); });
    (m.inn||[]).forEach((x,i)=> out.push({paso:p.n, b:p.b, cod:'N'+p.n+'.'+(i+1), n:E(x.t,x.t), tipo:'inn', el:x.el||[], imp:x.imp||null})); });
  else Object.entries(S.manejo).forEach(([n,m])=> (m.inn||[]).forEach((x,i)=> out.push({paso:+n, b:'', cod:'N'+n+'.'+(i+1), n:E(x.t,x.t), tipo:'inn', el:x.el||[], imp:x.imp||null})));
  return out;
}
/* Valor de un elemento (Bloque 9): media ponderada de cuatro dimensiones 0–5, normalizada 0–1.
   Si no se ha valorado, se usa su valor estructural: participación relativa en las actividades. */
function participacion(){ const c={}; actividades().forEach(a=>a.el.forEach(id=>c[id]=(c[id]||0)+1)); return c; }
function valorEl(id, part){ const v=S.valor[id], w=S.pesosValor;
  if(v && ['eco','uso','cul','eia'].some(k=>v[k]!==''&&v[k]!=null)){ let s=0, t=0; for(const k of ['eco','uso','cul','eia']) if(v[k]!==''&&v[k]!=null){ s+=w[k]*v[k]; t+=w[k]*5; } return {v:t?s/t:0, origen:'usuario'}; }
  const mx=Math.max(1,...Object.values(part)); return {v:(part[id]||0)/mx, origen:'estructural'}; }

/* Red de elementos: dos elementos se vinculan cuando concurren en una actividad.
   Peso w_ij = Σ_actividades √(v_i · v_j)  (media geométrica de sus valores), más los lazos estructurales documentados. */
function construirRed(sinPM){
  const acts=actividades(), part=participacion(); const val={}; todosElem().forEach(e=>val[e.id]=valorEl(e.id,part).v);
  const W=new Map(), key=(a,b)=>a<b?a+'|'+b:b+'|'+a, add=(a,b,w,act)=>{ if(a===b) return; const k=key(a,b); const o=W.get(k)||{a:a<b?a:b, b:a<b?b:a, w:0, n:0, acts:[]}; o.w+=w; o.n++; if(act) o.acts.push(act); W.set(k,o); };
  acts.forEach(x=>{ const el=[...new Set(x.el)].filter(id=>val[id]!=null && !(sinPM&&id==='PM')); for(let i=0;i<el.length;i++) for(let j=i+1;j<el.length;j++) add(el[i],el[j],Math.sqrt((val[el[i]]||0.05)*(val[el[j]]||0.05)),x.cod); });
  // Lazos estructurales documentados en Calpan: en el ejemplo publicado entran todos (red validada);
  // en tu proyecto, solo los que tocan un elemento de tus actividades, para no traer actores de otra localidad.
  const enActs=new Set(acts.flatMap(x=>x.el));
  if(conStack() && acts.length) LAZOS.forEach(([a,b])=>{ if(sinPM&&(a==='PM'||b==='PM')) return; if(!EJ && !enActs.has(a) && !enActs.has(b)) return; add(a,b,Math.sqrt((val[a]||0.05)*(val[b]||0.05)),null); });
  const usados=new Set(); W.forEach(o=>{ usados.add(o.a); usados.add(o.b); });
  const nodos=todosElem().filter(e=>usados.has(e.id)).map(e=>({id:e.id, nombre:tx(e.n), cat:e.cat, col:CATS[e.cat].col, val:val[e.id], part:part[e.id]||0}));
  const aristas=[...W.values()];
  return {nodos, aristas, acts, part, val};
}
/* Estadística de la red (Freeman 1978; Brandes 2001; Newman 2006; Watts y Strogatz 1998) */
function estadisticaRed(R){
  const n=R.nodos.length, idx=new Map(R.nodos.map((d,i)=>[d.id,i]));
  const met=metricasRed(R.nodos, R.aristas);                       // grado ponderado, intermediación, cercanía
  const A=Array.from({length:n},()=>new Float64Array(n)); R.aristas.forEach(e=>{ const i=idx.get(e.a), j=idx.get(e.b); A[i][j]+=e.w; A[j][i]+=e.w; });
  // vector propio (iteración de potencias)
  let x=new Float64Array(n).fill(1); for(let it=0;it<200;it++){ const y=new Float64Array(n); for(let i=0;i<n;i++){ let s=x[i]*1e-9; for(let j=0;j<n;j++) s+=A[i][j]*x[j]; y[i]=s; } const m=Math.max(...y)||1; x=y.map(v=>v/m); }
  // coeficiente de agrupamiento local (no ponderado)
  const vec=A.map(r=>{ const l=[]; r.forEach((w,j)=>{ if(w>0) l.push(j); }); return l; });
  const clus=vec.map((l,i)=>{ const k=l.length; if(k<2) return 0; let t=0; for(let a=0;a<k;a++) for(let b=a+1;b<k;b++) if(A[l[a]][l[b]]>0) t++; return 2*t/(k*(k-1)); });
  // caminos más cortos sin ponderar: longitud media y diámetro
  let suma=0, pares=0, diam=0; for(let s=0;s<n;s++){ const d=new Array(n).fill(-1); d[s]=0; const q=[s]; while(q.length){ const v=q.shift(); for(const w of vec[v]) if(d[w]<0){ d[w]=d[v]+1; q.push(w); } } d.forEach((v,t)=>{ if(t>s&&v>0){ suma+=v; pares++; if(v>diam) diam=v; } }); }
  // comunidades: método de Louvain (Blondel et al., 2008), determinista; modularidad Q (Newman 2006)
  const lab=louvain(A); const m2=A.reduce((s,r)=>s+r.reduce((a,b)=>a+b,0),0)||1, k=A.map(r=>r.reduce((a,b)=>a+b,0)); let Q=0;
  for(let i=0;i<n;i++) for(let j=0;j<n;j++) if(lab[i]===lab[j]) Q+=A[i][j]-k[i]*k[j]/m2; Q/=m2;
  const comunidades={}; lab.forEach((l,i)=>(comunidades[l]=comunidades[l]||[]).push(R.nodos[i].id));
  const com=Object.values(comunidades).sort((a,b)=>b.length-a.length);
  const nodos=R.nodos.map((d,i)=>({...d, grado:met.nodos[i].grado, vecinos:vec[i].length, inter:met.nodos[i].inter, cerc:met.nodos[i].cerc, eig:x[i], clus:clus[i], com:com.findIndex(c=>c.includes(d.id))}));
  const grados=nodos.map(d=>d.vecinos);
  return {nodos, aristas:R.aristas, n, m:R.aristas.length, densidad:met.densidad, gradoMedio:n?grados.reduce((a,b)=>a+b,0)/n:0,
    clusMedio:n?clus.reduce((a,b)=>a+b,0)/n:0, caminoMedio:pares?suma/pares:0, diametro:diam, Q, com, grados};
}
/* Louvain: fase de movimiento local que maximiza ΔQ y agregación de comunidades, repetidas hasta que Q no mejora. */
function louvain(A0){ let n0=A0.length, perten=[...Array(n0).keys()], A=A0.map(r=>Array.from(r));
  for(let nivel=0;nivel<10;nivel++){ const n=A.length, k=A.map(r=>r.reduce((a,b)=>a+b,0)), m2=k.reduce((a,b)=>a+b,0)||1;
    const com=[...Array(n).keys()], tot=k.slice(); let mejoro=false;
    for(let pasada=0;pasada<50;pasada++){ let mov=false;
      for(let i=0;i<n;i++){ const ci=com[i]; const w={}; for(let j=0;j<n;j++) if(A[i][j]>0&&j!==i) w[com[j]]=(w[com[j]]||0)+A[i][j];
        tot[ci]-=k[i]; let best=ci, bg=(w[ci]||0)-tot[ci]*k[i]/m2;
        Object.keys(w).map(Number).sort((a,b)=>a-b).forEach(c=>{ const g=w[c]-tot[c]*k[i]/m2; if(g>bg+1e-12){ bg=g; best=c; } });
        tot[best]+=k[i]; if(best!==ci){ com[i]=best; mov=true; mejoro=true; } }
      if(!mov) break; }
    if(!mejoro) break;
    const ids=[...new Set(com)], mapa=new Map(ids.map((c,q)=>[c,q])); perten=perten.map(p=>mapa.get(com[p]));
    const B=ids.map(()=>new Array(ids.length).fill(0)); for(let i=0;i<n;i++) for(let j=0;j<n;j++) B[mapa.get(com[i])][mapa.get(com[j])]+=A[i][j]; A=B; }
  return perten; }
/* Correlación entre elementos: coeficiente φ (Pearson sobre la incidencia elemento × actividad) */
function correlaciones(R, ids){ const acts=R.acts, N=acts.length; const inc=ids.map(id=>acts.map(a=>a.el.includes(id)?1:0));
  const m=inc.map(v=>v.reduce((a,b)=>a+b,0)/N); const sd=inc.map((v,i)=>Math.sqrt(v.reduce((s,x)=>s+(x-m[i])**2,0)/N));
  return ids.map((_,i)=>ids.map((_,j)=>{ if(!sd[i]||!sd[j]) return 0; let c=0; for(let t=0;t<N;t++) c+=(inc[i][t]-m[i])*(inc[j][t]-m[j]); return c/N/(sd[i]*sd[j]); })); }
/* Matriz categoría × categoría: suma de pesos de los vínculos entre categorías */
function matrizCategorias(R){ const ks=Object.keys(CATS), cat=Object.fromEntries(R.nodos.map(d=>[d.id,d.cat])); const M=ks.map(()=>ks.map(()=>0));
  R.aristas.forEach(e=>{ const i=ks.indexOf(cat[e.a]), j=ks.indexOf(cat[e.b]); M[i][j]+=e.w; if(i!==j) M[j][i]+=e.w; }); return {ks, M}; }

/* ---------- Sostenibilidad (Bloque 12) ----------
   Impacto de una actividad en el compartimento c: s_c = recorte a [−2, 2] de Σ perfiles de sus elementos (o el valor editado).
   Índice de sostenibilidad de la actividad: IS = (1/5) Σ_c (s_c + 2)/4  ∈ [0, 1]   (0.5 = neutra). */
function impactoAct(a){ if(a.imp) return a.imp.slice(); const v=[0,0,0,0,0]; a.el.forEach(id=>{ const p=IMPACTO[id]; if(p) p.v.forEach((x,c)=>v[c]+=x); }); return v.map(x=>Math.max(-2,Math.min(2,x))); }
const IS = (v)=> v.reduce((s,x)=>s+(x+2)/4,0)/v.length;
function sostenibilidad(){ const acts=actividades().map(a=>({...a, v:impactoAct(a)})); acts.forEach(a=>a.is=IS(a.v));
  const media=(l)=> l.length ? l.reduce((a,b)=>a+b,0)/l.length : null;
  const comp=COMP.map((_,c)=>({suma:acts.reduce((s,a)=>s+a.v[c],0), pos:acts.reduce((s,a)=>s+Math.max(0,a.v[c]),0), neg:acts.reduce((s,a)=>s+Math.min(0,a.v[c]),0)}));
  const porPaso=PASOS.map(p=>{ const l=acts.filter(a=>a.paso===p.n); return {n:p.n, trad:media(l.filter(a=>a.tipo==='trad').map(a=>a.is)), inn:media(l.filter(a=>a.tipo==='inn').map(a=>a.is)), todos:media(l.map(a=>a.is))}; });
  return {acts, comp, porPaso, global:media(acts.map(a=>a.is)), trad:media(acts.filter(a=>a.tipo==='trad').map(a=>a.is)), inn:media(acts.filter(a=>a.tipo==='inn').map(a=>a.is))}; }
/* Cumplimiento de cada ODS (0–100 %). Fuentes de evidencia:
   (a) ambientales: media de (s_c+2)/4 de los compartimentos ligados al ODS en todas las actividades;
   (b) estructurales: proporción de actividades que movilizan conocimiento técnico o asesoría (ODS 4), vínculos con instituciones (ODS 17), ingresos y costos registrados (ODS 1, 8);
   Se promedian las fuentes disponibles; si no hay ninguna, «sin dato». */
function cumplimientoODS(sos, R){ const res={}; const acts=sos.acts, N=acts.length||1;
  const env=(cs)=> acts.length ? acts.reduce((s,a)=>s+cs.reduce((t,c)=>t+(a.v[c]+2)/4,0)/cs.length,0)/acts.length : null;
  const prop=(f)=> acts.length ? acts.filter(f).length/N : null;
  const inst=R.nodos.filter(d=>d.cat==='instituciones').length, instTot=todosElem().filter(e=>e.cat==='instituciones').length||1;
  ODS.forEach(([o])=>{ const f=[];
    if(ODS_COMP[o]) f.push(['env', env(ODS_COMP[o])]);
    if(o===4) f.push(['est', prop(a=>a.el.some(id=>['KTEC','AT','IAC','AL'].includes(id)))]);
    if(o===17) f.push(['est', inst/instTot]);
    if(o===12) f.push(['env', env([1,3,4])]);
    if((o===1||o===8) && acts.some(a=>a.el.includes('INGR'))) f.push(['est', S.precio.INGR&&S.precio.COSTOS&&+S.precio.INGR.p>0 ? Math.max(0,Math.min(1,(+S.precio.INGR.p-(+S.precio.COSTOS.p||0))/(+S.precio.INGR.p))) : null]);
    const v=f.filter(x=>x[1]!=null); res[o]={v: v.length? 100*v.reduce((s,x)=>s+x[1],0)/v.length : null, fuentes:v.map(x=>x[0])}; });
  return res; }
/* ---------- Huella de carbono por hectárea (IPCC 2006/2019; GWP100 del AR6) ----------
   Diésel: 2.68 kg CO₂/L. N₂O del nitrógeno: directo EF1 = 0.010; indirecto por volatilización FracGASF 0.11 × EF4 0.010 y
   por lixiviación FracLEACH 0.24 × EF5 0.011 (IPCC 2019). N₂O = N × (0.010 + 0.0011 + 0.00264) × 44/28; GWP N₂O = 273.
   Urea: 0.20 t C / t urea → 0.733 kg CO₂ por kg de urea. */
const IPCC = {diesel:2.68, EF1:0.010, gasf:0.11, EF4:0.010, leach:0.24, EF5:0.011, gwpN2O:273, ureaC:0.20};
function huellaCarbono(){ const c=S.carbono, d=+c.diesel||0, N=+c.nKg||0, U=+c.urea||0, r=+c.rend||0;
  if(c.diesel===''&&c.nKg===''&&c.urea==='') return null;
  const comb=d*IPCC.diesel, n2o=N*(IPCC.EF1+IPCC.gasf*IPCC.EF4+IPCC.leach*IPCC.EF5)*44/28*IPCC.gwpN2O, urea=U*IPCC.ureaC*44/12;
  const tot=comb+n2o+urea; return {comb, n2o, urea, tot, porT: r>0 ? tot/r : null}; }
/* ---------- Índice general de sostenibilidad (Sarandón, 2002; Sarandón et al., 2006) ----------
   Cada dimensión se expresa en una escala de 0 a 4 a partir de sus subindicadores:
     IK  económica      = media(A margen, B diversificación de productos, C autonomía de insumos externos)
     IE  ecológica      = media de (s_c + 2) en todas las actividades y compartimentos
     ISC sociocultural  = media(A saber local, B acceso a conocimiento técnico, C integración institucional)
   ISGen = (IK + IE + ISC) / 3. Regla: el sistema es sostenible si ISGen > 2 y ninguna dimensión es < 2.
   La traducción de los datos de Ratio Viña a subindicadores 0–4 es una lectura de Ratio Viña. */
const EXTERNOS = ['FERTG','HERB','INSEC','FOLIAR','FUNG','AZUF','CIAN','GIB','BIOI','COMB'];
function sarandon(sos){ const acts=sos.acts; if(!acts.length) return null;
  const pasosCon=(f)=>{ const p=new Set(acts.map(a=>a.paso)); const q=new Set(acts.filter(f).map(a=>a.paso)); return p.size? q.size/p.size : 0; };
  const reglasCon=(f)=>{ const r=new Set(acts.map(a=>a.b||a.paso)); const q=new Set(acts.filter(f).map(a=>a.b||a.paso)); return r.size? q.size/r.size : 0; };
  const media=(l)=>{ const v=l.filter(x=>x.v!=null); return v.length? v.reduce((s,x)=>s+x.v,0)/v.length : null; };
  const ing=S.precio.INGR&&+S.precio.INGR.p>0 ? +S.precio.INGR.p : null, cos=S.precio.COSTOS&&S.precio.COSTOS.p!==''&&S.precio.COSTOS.p!=null ? +S.precio.COSTOS.p : null;
  const prods=new Set(acts.flatMap(a=>a.el).filter(id=>(elemPorId(id)||{}).cat==='productos'));
  const IKs=[{k:'A', n:E('Margen sobre ingresos','Margin over income'), v: ing&&cos!=null ? 4*Math.max(0,Math.min(1,(ing-cos)/ing)) : null, f:'4 · (I − C) / I'},
    {k:'B', n:E('Diversificación de productos','Product diversification'), v: Math.min(4, prods.size), f:T('núm. de productos (tope 4)','no. of products (cap 4)')},
    {k:'C', n:E('Autonomía de insumos externos','Autonomy from external inputs'), v: 4*(1-pasosCon(a=>a.el.some(id=>EXTERNOS.includes(id)))), f:T('4 · (1 − pasos con insumos externos / pasos)','4 · (1 − steps with external inputs / steps)')}];
  const IEv=acts.reduce((s,a)=>s+a.v.reduce((t,x)=>t+x+2,0)/a.v.length,0)/acts.length;
  const actIds=new Set(acts.flatMap(a=>a.el)); const inst=todosElem().filter(e=>e.cat==='instituciones'), instV=new Set(); if(conStack()) LAZOS.forEach(([a,b])=>{ if(actIds.has(a)) instV.add(b); if(actIds.has(b)) instV.add(a); }); actIds.forEach(id=>{ if((elemPorId(id)||{}).cat==='instituciones') instV.add(id); });   // también cuentan las instituciones que participan en actividades
  const ISCs=[{k:'A', n:E('Saber local (tácito y cultural)','Local knowledge (tacit and cultural)'), v:4*reglasCon(a=>a.el.some(id=>['KTAC','KCUL','LUNA','FAM'].includes(id))), f:T('4 · reglas (5B y cosecha) con saber local / reglas','4 · rules (5B and harvest) with local knowledge / rules')},
    {k:'B', n:E('Acceso a conocimiento técnico','Access to technical knowledge'), v:4*reglasCon(a=>a.el.some(id=>['KTEC','AT','IAC','ENO','LAB','PRON','KENO'].includes(id))), f:T('4 · reglas (5B y cosecha) con conocimiento técnico o asesoría / reglas','4 · rules (5B and harvest) with technical knowledge or advice / rules')},
    {k:'C', n:E('Integración institucional','Institutional integration'), v: inst.length ? 4*inst.filter(e=>instV.has(e.id)).length/inst.length : null, f:T('4 · instituciones vinculadas / instituciones','4 · linked institutions / institutions')}];
  const IK=media(IKs), ISC=media(ISCs), IE=IEv; const dims=[IK,IE,ISC];
  const ISGen = dims.every(x=>x!=null) ? (IK+IE+ISC)/3 : null;
  return {IK, IE, ISC, ISGen, IKs, ISCs, sostenible: ISGen!=null && ISGen>2 && dims.every(x=>x>=2)}; }
