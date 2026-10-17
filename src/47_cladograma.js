"use strict";
/* =====================================================================
   Cladograma del vecino más cercano (Bloque 11).
   Distancia entre dos elementos = camino más corto en la red ponderada,
   con longitud de cada vínculo = 1/peso (la misma que usan cercanía e
   intermediación; Brandes, 2001). Agrupamiento jerárquico aglomerativo por
   enlace simple o del vecino más cercano (Sneath, 1957; Sokal y Sneath, 1963):
   en cada paso se unen los dos grupos cuyo par de miembros más próximo está
   más cerca. Correlación cofenética de Sokal y Rohlf (1962).
   El camino puede pasar por cualquier elemento de la red, aunque el cladograma
   muestre solo un subconjunto (p. ej., actores).
   ===================================================================== */
function distanciasRed(R){
  const n=R.nodos.length, idx=new Map(R.nodos.map((d,i)=>[d.id,i])), ady=Array.from({length:n},()=>[]);
  R.aristas.forEach(e=>{ const i=idx.get(e.a), j=idx.get(e.b); if(e.w>0){ ady[i].push([j,1/e.w]); ady[j].push([i,1/e.w]); } });
  return R.nodos.map((_,s)=>{ const d=new Array(n).fill(Infinity), hecho=new Array(n).fill(false); d[s]=0;
    for(let k=0;k<n;k++){ let u=-1; for(let i=0;i<n;i++) if(!hecho[i]&&(u<0||d[i]<d[u])) u=i; if(u<0||d[u]===Infinity) break; hecho[u]=true;
      for(const [v,l] of ady[u]) if(d[u]+l<d[v]) d[v]=d[u]+l; }
    return d; });
}
/* Enlace simple (vecino más cercano). Devuelve uniones al estilo de SciPy: [a, b, altura, tamaño], con grupos nuevos numerados n, n+1… */
function enlaceSimple(D){
  const n=D.length, act=new Map(); for(let i=0;i<n;i++) act.set(i,{m:[i]});
  const dist=(A,B)=>{ let m=Infinity; for(const i of A.m) for(const j of B.m) if(D[i][j]<m) m=D[i][j]; return m; };
  const U=[]; let sig=n;
  while(act.size>1){ let best=[Infinity,-1,-1]; const ks=[...act.keys()];
    for(let x=0;x<ks.length;x++) for(let y=x+1;y<ks.length;y++){ const d=dist(act.get(ks[x]),act.get(ks[y])); if(d<best[0]) best=[d,ks[x],ks[y]]; }
    if(best[1]<0){ best=[Infinity,ks[0],ks[1]]; }
    const [h,a,b]=best, m=[...act.get(a).m,...act.get(b).m]; U.push([Math.min(a,b),Math.max(a,b),h,m.length]); act.delete(a); act.delete(b); act.set(sig++,{m}); }
  return U;
}
function cofenetica(D,U){ const n=D.length, coph=Array.from({length:n},()=>new Array(n).fill(0)), miembros=new Map(); for(let i=0;i<n;i++) miembros.set(i,[i]);
  U.forEach(([a,b,h],k)=>{ const A=miembros.get(a), B=miembros.get(b); for(const i of A) for(const j of B){ coph[i][j]=coph[j][i]=h; } miembros.set(n+k,[...A,...B]); });
  const x=[], y=[]; for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) if(isFinite(D[i][j])&&isFinite(coph[i][j])){ x.push(D[i][j]); y.push(coph[i][j]); }
  if(x.length<3) return null; const mx=x.reduce((s,v)=>s+v,0)/x.length, my=y.reduce((s,v)=>s+v,0)/y.length; let sxy=0,sxx=0,syy=0;
  x.forEach((v,i)=>{ sxy+=(v-mx)*(y[i]-my); sxx+=(v-mx)**2; syy+=(y[i]-my)**2; }); return sxx&&syy?sxy/Math.sqrt(sxx*syy):null; }
const CLADO_SUB = {actores:['actores'], actinst:['actores','instituciones'], todos:null};
function datosCladograma(R, sub){
  const Dall=distanciasRed(R), cats=CLADO_SUB[sub];
  const sel=R.nodos.map((d,i)=>i).filter(i=>!cats||cats.includes(R.nodos[i].cat));
  const nodos=sel.map(i=>R.nodos[i]); let D=sel.map(i=>sel.map(j=>Dall[i][j]));
  const fin=D.flat().filter(v=>isFinite(v)&&v>0), tope=fin.length?Math.max(...fin)*1.15:1, desconectados=D.some(r=>r.some(v=>!isFinite(v)));
  if(desconectados) D=D.map(r=>r.map(v=>isFinite(v)?v:tope));
  const U=nodos.length>1?enlaceSimple(D):[], r=nodos.length>2?cofenetica(D,U):null;
  const vecino=nodos.map((d,i)=>{ let j=-1; D[i].forEach((v,k)=>{ if(k!==i&&(j<0||v<D[i][j])) j=k; }); return {i, j, d:j<0?null:D[i][j]}; });
  vecino.forEach(v=>{ v.mutuo = v.j>=0 && vecino[v.j].j===v.i; });
  return {nodos, D, U, r, vecino, desconectados, tope}; }
function svgCladograma(C){
  const n=C.nodos.length; if(n<2) return `<p class="sindato">${T('Hacen falta al menos dos elementos conectados.','At least two connected elements are needed.')}</p>`;
  const hijos=new Map(); C.U.forEach(([a,b],k)=>hijos.set(n+k,[a,b]));
  const orden=[]; const rec=g=>{ if(g<n){ orden.push(g); return; } const [a,b]=hijos.get(g); rec(a); rec(b); }; rec(n+C.U.length-1);
  const fila=21, izq=290, ancho=1000, der=24, arriba=14, alto=arriba+n*fila+40, hmax=Math.max(...C.U.map(u=>u[2]),1e-9);
  const X=h=>izq+Math.sqrt(h/hmax)*(ancho-izq-der), pos=new Map(); orden.forEach((g,k)=>pos.set(g,{y:arriba+k*fila+fila/2, h:0}));
  let s=`<svg class="clado" viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="${T('Cladograma del vecino más cercano','Nearest-neighbour cladogram')}">`;
  // ejes y guías
  for(let t=0;t<=4;t++){ const h=hmax*(t/4)**2, x=X(h); s+=`<line x1="${x}" y1="${arriba-4}" x2="${x}" y2="${alto-34}" stroke="var(--border)" stroke-dasharray="3 4"/><text x="${x}" y="${alto-20}" text-anchor="middle" font-size="11" fill="var(--muted)">${fmt(h,2)}</text>`; }
  s+=`<text x="${(izq+ancho-der)/2}" y="${alto-4}" text-anchor="middle" font-size="11.5" fill="var(--muted)">${T('distancia en la red (Σ 1/peso del camino más corto; eje en raíz cuadrada)','network distance (Σ 1/weight along the shortest path; square-root axis)')}</text>`;
  C.U.forEach(([a,b,h],k)=>{ const A=pos.get(a), B=pos.get(b), x=X(h), y=(A.y+B.y)/2;
    s+=`<path class="rama" style="animation-delay:${k*25}ms" d="M${X(A.h)},${A.y}H${x}V${B.y}H${X(B.h)}" fill="none" stroke="var(--text)" stroke-opacity=".55" stroke-width="1.4"><title>${fmt(h,3)}</title></path>`;
    pos.set(n+k,{y,h}); });
  orden.forEach(g=>{ const d=C.nodos[g], p=pos.get(g);
    s+=`<circle cx="${izq}" cy="${p.y}" r="4" fill="${d.col}"/><text x="${izq-10}" y="${p.y+4}" text-anchor="end" font-size="13.5" fill="var(--text)"><tspan fill="${d.col}">${CATS[d.cat].sym}</tspan> ${esc(d.nombre.length>38?d.nombre.slice(0,37)+'…':d.nombre)}<title>${esc(d.nombre)}</title></text>`; });
  return s+'</svg>'; }
function tarjetaCladograma(R){
  const sub=renderTablero.clado||'actinst', C=datosCladograma(R, sub);
  const vn=[...C.vecino].filter(v=>v.j>=0).sort((a,b)=>a.d-b.d);
  const opc={actores:T('Actores','Actors'), actinst:T('Actores e instituciones','Actors and institutions'), todos:T('Todos los elementos','All elements')};
  return `<div class="card t12"><div class="row between"><h3 style="margin:0">${T('Cladograma del vecino más cercano','Nearest-neighbour cladogram')}${ayuda('clado')}</h3>
     <div class="basesw">${Object.entries(opc).map(([k,v])=>`<button data-clado="${k}" class="${k===sub?'on':''}">${v}</button>`).join('')}</div></div>
    <p class="nota">${T('Cada elemento se une primero con el que tiene más cerca en la red; las ramas cortas son vecinos muy ligados (comparten muchas actividades de alto valor) y las largas, elementos lejanos. Lee el árbol de izquierda a derecha.','Each element first joins the one closest to it in the network; short branches are tightly linked neighbours (sharing many high-value activities) and long ones are distant elements. Read the tree left to right.')}</p>
    <div>
     <div class="clado-c">${svgCladograma(C)}</div>
     <div style="margin-top:14px"><h4 style="margin:0 0 6px">${T('Vecino más cercano de cada elemento','Each element’s nearest neighbour')}</h4>
      <div class="tbl-c" style="max-height:420px"><table class="tbl"><thead><tr><th>${T('Elemento','Element')}</th><th>${T('Vecino más cercano','Nearest neighbour')}</th><th class="r">${T('Distancia','Distance')}</th></tr></thead><tbody>
      ${vn.map(v=>{ const a=C.nodos[v.i], b=C.nodos[v.j]; return `<tr><td><span style="color:${a.col}">${CATS[a.cat].sym}</span> ${esc(a.nombre)}</td><td><span style="color:${b.col}">${CATS[b.cat].sym}</span> ${esc(b.nombre)}${v.mutuo?` <span class="badge ok" title="${T('vecinos mutuos: cada uno es el más cercano del otro','mutual neighbours: each is the other’s nearest')}">↔</span>`:''}</td><td class="r">${fmt(v.d,3)}</td></tr>`; }).join('')}
      </tbody></table></div>
      <p class="nota">↔ ${T('vecinos mutuos: cada uno es el más cercano del otro.','mutual neighbours: each is the other’s nearest.')}${C.U.some(u=>u[2]>=19.99)?' '+T('Las uniones a distancia 20 son elementos que no participan en ninguna actividad capturada ni tienen valor asignado en el Bloque 9: los liga solo un vínculo estructural, con el peso mínimo (0.05).','Joins at distance 20 are elements that take part in no recorded activity and have no value set in Block 9: only a structural tie with the minimum weight (0.05) links them.'):''}${C.desconectados?' '+T('Hay elementos sin camino entre sí; se les asignó una distancia de '+fmt(C.tope,2)+' (115 % de la mayor observada).','Some elements have no path between them; they were given a distance of '+fmt(C.tope,2)+' (115 % of the largest observed).'):''}</p>
      <p class="nota sci">${T('Enlace simple sobre distancias de camino más corto (1/peso). Correlación cofenética','Single linkage on shortest-path distances (1/weight). Cophenetic correlation')}: <b>${C.r==null?'—':fmt(C.r,3)}</b> (Sokal y Rohlf, 1962) · n = ${C.nodos.length}.</p></div></div></div>`; }

/* Versión para el Informe (Bloque 14): cladograma, vecinos más cercanos y CSV de uniones; se imprime completo. */
function informeCladograma(R){
  const sub=renderInforme.clado||renderTablero.clado||'actinst', C=datosCladograma(R, sub);
  const opc={actores:T('Actores','Actors'), actinst:T('Actores e instituciones','Actors and institutions'), todos:T('Todos los elementos','All elements')};
  const vn=[...C.vecino].filter(v=>v.j>=0).sort((a,b)=>a.d-b.d);
  const fila=v=>{ const a=C.nodos[v.i], b=C.nodos[v.j]; return `<tr><td><span style="color:${a.col}">${CATS[a.cat].sym}</span> ${esc(a.nombre)}</td><td><span style="color:${b.col}">${CATS[b.cat].sym}</span> ${esc(b.nombre)}${v.mutuo?' ↔':''}</td><td class="r">${fmt(v.d,3)}</td></tr>`; };
  const tabla=l=>`<table class="tbl"><thead><tr><th>${T('Elemento','Element')}</th><th>${T('Vecino más cercano','Nearest neighbour')}</th><th class="r">${T('Distancia','Distance')}</th></tr></thead><tbody>${l.map(fila).join('')}</tbody></table>`;
  return `<div class="card clado-inf"><div class="row between"><h3 style="margin:0">${T('Cladograma del vecino más cercano','Nearest-neighbour cladogram')} · ${opc[sub]}</h3>
     <div class="basesw no-print">${Object.entries(opc).map(([k,v])=>`<button data-icla="${k}" class="${k===sub?'on':''}">${v}</button>`).join('')}</div></div>
    <p class="nota">${T('Agrupa a los elementos según su cercanía en la red: cada uno se une primero con su vecino más cercano; las ramas cortas son elementos muy ligados.','Groups elements by their closeness in the network: each first joins its nearest neighbour; short branches are tightly linked elements.')}</p>
    <div class="clado-c">${svgCladograma(C)}</div>
    ${vn.length?`<div style="margin-top:10px">${tabla(vn)}</div>`:''}
    <p class="nota">↔ ${T('vecinos mutuos.','mutual neighbours.')} ${T('Distancia: camino más corto en la red sumando 1/peso de cada vínculo; enlace simple (Sneath, 1957).','Distance: shortest network path summing 1/weight per link; single linkage (Sneath, 1957).')}${C.U.some(u=>u[2]>=19.99)?' '+T('Las uniones a distancia 20 son elementos sin actividades capturadas ni valor asignado: los liga solo un vínculo estructural.','Joins at distance 20 are elements with no recorded activities or value: only a structural tie links them.'):''}</p>
    <p class="nota sci">${T('Correlación cofenética','Cophenetic correlation')}: <b>${C.r==null?'—':fmt(C.r,3)}</b> (Sokal y Rohlf, 1962) · n = ${C.nodos.length}. ${T('Validado contra SciPy (pruebas/verificar_clado.py).','Validated against SciPy (pruebas/verificar_clado.py).')}</p></div>`; }
function csvCladograma(R){ const sub=renderInforme.clado||renderTablero.clado||'actinst', C=datosCladograma(R, sub), n=C.nodos.length, nom=k=>k<n?C.nodos[k].id:'G'+(k-n+1);
  return csv([['union','grupo_a','grupo_b','distancia','tamano']].concat(C.U.map((u,k)=>['G'+(k+1),nom(u[0]),nom(u[1]),u[2].toFixed(6),u[3]]))
    .concat([[],['elemento','vecino_mas_cercano','distancia','mutuo']]).concat(C.vecino.filter(v=>v.j>=0).map(v=>[C.nodos[v.i].id,C.nodos[v.j].id,v.d.toFixed(6),v.mutuo?'si':'no']))); }
