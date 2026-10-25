// =====================================================================
// 46b_modelo3d.js — modelo 3D del sistema complejo adaptativo (Bloque 9)
// Capas apiladas de abajo arriba: entorno → entradas → agentes y conocimiento
// → manejo (5B) → salidas, con el halo de la emergencia encima. Los nodos y
// vínculos son los de la red real del proyecto; las líneas punteadas son las
// retroalimentaciones del ciclo. Proyección en perspectiva propia sobre SVG,
// sin bibliotecas. Se gira arrastrando (o con las flechas) y se acerca con
// los botones, con Ctrl + rueda o pellizcando.
// =====================================================================
/* Medidas de importancia de un nodo (todas ya calculadas por estadisticaRed); se muestran de 0 a 100 respecto del máximo de la red */
const IMP3D = {
  grado:{n:E('Grado ponderado (fuerza de sus vínculos)','Weighted degree (strength of its links)'), c:E('Suma de los pesos de sus vínculos: qué tanto interactúa directamente con los demás.','Sum of its link weights: how much it interacts directly with the others.')},
  inter:{n:E('Intermediación (puente entre partes del sistema)','Betweenness (bridge between parts of the system)'), c:E('Cuántos caminos más cortos pasan por el elemento: mide qué tanto conecta partes del sistema que sin él quedarían lejos.','How many shortest paths pass through the element: how much it connects parts of the system that would otherwise be far apart.')},
  eig:{n:E('Vector propio (vinculado con los importantes)','Eigenvector (linked to the important ones)'), c:E('Es alto si el elemento está vinculado con otros elementos a su vez muy vinculados.','High when the element is linked to elements that are themselves highly linked.')},
  val:{n:E('Valor del elemento','Element value'), c:E('El valor que le diste (económico, de uso, cultural y ecológico) o, si no lo calificaste, su participación en las actividades.','The value you gave it (economic, use, cultural and ecological) or, if unrated, its share of the activities.')}
};
const CAPAS3D = [
  {id:'entorno',  z:-250, cats:['perturbaciones'], col:'#c43a2f', n:E('Entorno: clima y perturbaciones','Environment: climate and disturbances')},
  {id:'entradas', z:-125, cats:['naturales','insumos','equipo','financieros'], col:'#2f7d4a', n:E('Entradas: recursos, insumos y finanzas','Inputs: resources, inputs and finance')},
  {id:'agentes',  z:0,    cats:['actores','conocimientos','instituciones','politicas'], col:'#b05434', n:E('Agentes, conocimiento e instituciones','Agents, knowledge and institutions')},
  {id:'manejo',   z:125,  cats:[], col:'#2f5d50', n:E('Manejo: 5B → pasos → actividades','Management: 5B → steps → activities')},
  {id:'salidas',  z:250,  cats:['productos'], col:'#d9a441', n:E('Salidas: productos, mercado y bienestar','Outputs: products, market and well-being')}
];
const R3D = 200;   // radio de cada capa (unidades del mundo)

/* Coloca cada nodo en su capa: un sector angular por categoría y, si hay muchos, dos anillos. */
function posiciones3D(nodos){ const P={};
  CAPAS3D.forEach(c=>{ if(!c.cats.length) return; const enCapa=c.cats.map(cat=>nodos.filter(d=>d.cat===cat)); const tot=enCapa.reduce((s,l)=>s+l.length,0); if(!tot) return;
    let a0=-Math.PI/2+(c.z/125)*0.35;   // cada capa arranca girada para que los vínculos verticales no se encimen
    enCapa.forEach(l=>{ const span=2*Math.PI*l.length/tot;
      l.forEach((d,i)=>{ const a=a0+span*(i+.5)/l.length, dos=l.length>6, r=R3D*(dos ? (i%2 ? .58 : .9) : .78); P[d.id]=[r*Math.cos(a), r*Math.sin(a), c.z]; });
      a0+=span; }); });
  return P; }

function modelo3D(cont, opt={}){
  const sinPM=opt.sinPM!==false, R=construirRed(sinPM), st=estadisticaRed(R), nodos=st.nodos;
  const an=(cont.clientWidth||980)<640, W=an?520:980, H=an?820:780, D=2600, fz=an?1.45:1;   // en celular: lienzo compacto y letra mayor
  const P=posiciones3D(nodos), maxI=Math.max(1,...nodos.map(d=>d.inter)), wmax=Math.max(1e-9,...R.aristas.map(e=>e.w));
  const reducir=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let yaw=-0.55, pitch=0.3, zoom=1, girar=!reducir && opt.girar!==false && !window.__m3dQuieto,   // __m3dQuieto: capturas de los instructivos
      foco=null, frac=opt.frac||0.5, raf=0, med=opt.med||'grado', verVal=opt.verVal!==false;
  const aristas=R.aristas.slice().sort((a,b)=>b.w-a.w);
  const maxM={}; Object.keys(IMP3D).forEach(k=>maxM[k]=Math.max(1e-9,...nodos.map(d=>+d[k]||0)));
  const imp=d=>100*(+d[med]||0)/maxM[med];                       // importancia 0–100 según la medida elegida
  const rad=d=>5+12*Math.sqrt(imp(d)/100);
  const top=nodos.slice().sort((a,b)=>imp(b)-imp(a)).slice(0,6).map(d=>d.id);
  const vecinos=new Map(nodos.map(d=>[d.id,new Set()])); R.aristas.forEach(e=>{ vecinos.get(e.a)?.add(e.b); vecinos.get(e.b)?.add(e.a); });
  const nAct=R.acts.length, nInn=R.acts.filter(a=>a.tipo==='inn').length;

  cont.innerHTML=`<div class="m3d-barra">
     <button type="button" class="btn ghost sm" data-m3d="girar" aria-pressed="${girar}">${girar?'❚❚ '+T('Pausar giro','Pause rotation'):'⟳ '+T('Girar','Rotate')}</button>
     <button type="button" class="btn ghost sm" data-m3d="mas" aria-label="${T('Acercar','Zoom in')}">＋</button><button type="button" class="btn ghost sm" data-m3d="menos" aria-label="${T('Alejar','Zoom out')}">－</button>
     <button type="button" class="btn ghost sm" data-m3d="frente">${T('De frente','Front')}</button><button type="button" class="btn ghost sm" data-m3d="arriba">${T('Desde arriba','Top')}</button><button type="button" class="btn ghost sm" data-m3d="inicio">↺ ${T('Restablecer','Reset')}</button>
     <label class="m3d-ctl">${T('Vínculos visibles','Visible links')} <input type="range" min="0.1" max="1" step="0.05" value="${frac}" data-m3d="frac"> <b data-m3d="pct">${Math.round(frac*100)} %</b></label>
     <label class="m3d-ctl">${T('Importancia según','Importance by')} <select data-m3d="med">${Object.entries(IMP3D).map(([k,o])=>`<option value="${k}" ${k===med?'selected':''}>${esc(tx(o.n))}</option>`).join('')}</select></label>
     <label class="m3d-ctl"><input type="checkbox" data-m3d="ver" ${verVal?'checked':''}> ${T('Ver el valor en cada nodo','Show the value on each node')}</label>
     <label class="m3d-ctl"><input type="checkbox" data-m3d="pm" ${sinPM?'checked':''}> ${T('Ocultar a los productores (nodo omnipresente)','Hide farmers (omnipresent node)')}</label></div>
   <svg class="chart m3d" viewBox="0 0 ${W} ${H}" role="img" tabindex="0" aria-label="${T('Modelo 3D del sistema complejo adaptativo: arrastra para girar','3D model of the complex adaptive system: drag to rotate')}">
     <defs><radialGradient id="m3dHalo"><stop offset="0" stop-color="#7a4f9a" stop-opacity=".0"/><stop offset=".75" stop-color="#7a4f9a" stop-opacity=".10"/><stop offset="1" stop-color="#7a4f9a" stop-opacity=".28"/></radialGradient></defs>
     <g class="m3d-capas"></g><g class="m3d-retro"></g><g class="m3d-aristas"></g><g class="m3d-nodos"></g><g class="m3d-valores"></g><g class="m3d-etiq"></g><g class="m3d-rotulos"></g></svg>
   <div class="m3d-rank"></div>
   <p class="nota m3d-ayuda">${T('Arrastra para girar · flechas del teclado · Ctrl + rueda o pellizco para acercar · toca un nodo para ver sus vecinos.','Drag to rotate · arrow keys · Ctrl + wheel or pinch to zoom · tap a node to see its neighbours.')}</p>`;
  const svg=cont.querySelector('svg'), g=k=>svg.querySelector('.m3d-'+k);

  // ----- elementos persistentes -----
  const mk=(tag,attrs,padre)=>{ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); padre.appendChild(e); return e; };
  const capas=CAPAS3D.map(c=>({c, poli:mk('polygon',{fill:c.col,'fill-opacity':.07,stroke:c.col,'stroke-opacity':.55,'stroke-width':1.4},g('capas'))}));
  const halo=mk('polygon',{fill:'url(#m3dHalo)',stroke:'#7a4f9a','stroke-dasharray':'5 6','stroke-width':1.6,'stroke-opacity':.7},g('capas'));
  const arcos5B=B5.map(b=>mk('path',{fill:'none',stroke:b.col,'stroke-width':7,'stroke-linecap':'round','stroke-opacity':.85},g('capas')));
  const nucleo=mk('polygon',{fill:'#2f5d50','fill-opacity':.16,stroke:'#2f5d50','stroke-width':1.6},g('capas'));
  const rotulos=CAPAS3D.map(c=>{ const t=mk('text',{'font-size':13.5*fz,'font-weight':700,fill:c.col,'text-anchor':an?'middle':'start'},g('rotulos')); t.textContent=tx(c.n); const l=mk('line',{stroke:c.col,'stroke-opacity':.5,'stroke-dasharray':'3 4'},g('rotulos')); return {t,l}; });
  const rotHalo=mk('text',{'font-size':13.5*fz,'font-weight':700,fill:'#7a4f9a','text-anchor':an?'middle':'start'},g('rotulos')); rotHalo.textContent=an?T('Emergencia y adaptación','Emergence and adaptation'):T('Emergencia y adaptación: innovación local · resiliencia · sostenibilidad','Emergence and adaptation: local innovation · resilience · sustainability');
  const rotNucleo=mk('text',{'font-size':12*fz,'text-anchor':'middle',class:'m'},g('rotulos')); rotNucleo.textContent=`${nAct} ${T('actividades','activities')} · ${nInn} ${T('innovadas','innovated')}`;
  const lA=aristas.map(e=>{ const a=nodos.find(d=>d.id===e.a), b=nodos.find(d=>d.id===e.b), mismo=a&&b&&a.cat===b.cat;
    return {e, el:mk('line',{stroke:mismo?a.col:'var(--muted)','stroke-linecap':'round'},g('aristas'))}; });
  const lN=nodos.map(d=>{ const c=mk('circle',{r:rad(d),fill:d.col,stroke:'var(--card)','stroke-width':1.6,class:'m3d-nodo',
      'data-tip':esc(`<b>${d.nombre}</b><br>${tx(CATS[d.cat].n)}<br><b>${T('Importancia','Importance')}: ${f0(imp(d))} / 100</b> (${esc(tx(IMP3D[med].n))})<br>`+
        `${T('Intermediación','Betweenness')} ${f1(d.inter,1)} · ${T('grado ponderado','weighted degree')} ${f1(d.grado,2)} · ${T('vector propio','eigenvector')} ${f1(d.eig,2)} · ${T('valor','value')} ${f1(d.val,2)} · ${T('vecinos','neighbours')} ${d.vecinos}`)},g('nodos'));
    c.dataset.id=d.id; return {d,c}; });
  const lV=nodos.map(d=>{ const t=mk('text',{'font-size':10.5*fz,'font-weight':700,'text-anchor':'middle',class:'m3d-val'},g('valores')); t.textContent=f0(imp(d)); return {d,t}; });
  const lT=top.map(id=>{ const d=nodos.find(x=>x.id===id); const t=mk('text',{'font-size':13*fz,'font-weight':700,'text-anchor':'middle',class:'m3d-etq'},g('etiq')); t.textContent=d.nombre.replace(/\s*\(.*\)/,''); return {d,t}; });
  // retroalimentaciones: de las salidas a las entradas (semilla y rastrojo) y a los agentes (decisiones)
  const retro=[mk('path',{fill:'none',stroke:'var(--accent)','stroke-width':2.4,'stroke-dasharray':'8 6'},g('retro')), mk('path',{fill:'none',stroke:'var(--warn)','stroke-width':2.2,'stroke-dasharray':'3 5'},g('retro'))];
  if(an) retro.forEach(r=>r.setAttribute('visibility','hidden'));   // en celular no caben por fuera del cilindro
  const rotRetro=[mk('text',{'font-size':12.5,'font-weight':700,style:'fill:var(--accent-text)',visibility:an?'hidden':'visible'},g('rotulos')), mk('text',{'font-size':12,style:'fill:var(--warn-text)',visibility:an?'hidden':'visible'},g('rotulos'))];
  rotRetro[0].textContent='↺ '+T('poda → cosecha del año siguiente · sarmientos → suelo','pruning → next year’s crop · prunings → soil'); rotRetro[1].textContent='↺ '+T('balance → decisiones del ciclo siguiente','balance → next-cycle decisions');
  enlazarTips(svg);

  // ----- proyección -----
  const proy=([x,y,z])=>{ const c=Math.cos(yaw), s=Math.sin(yaw), x1=x*c-y*s, y1=x*s+y*c, cp=Math.cos(pitch), sp=Math.sin(pitch);
    const arriba=z*cp+y1*sp, prof=y1*cp-z*sp, k=D/(D+prof)*zoom; return [W/2+x1*k*(an?1.12:1), H/2+40-arriba*k*(an?1.12:1), prof, k*(an?1.12:1)]; };
  const circ=(r,z,n=64)=>{ const p=[]; for(let i=0;i<n;i++){ const a=2*Math.PI*i/n; p.push(proy([r*Math.cos(a), r*Math.sin(a), z])); } return p; };
  const pts=l=>l.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const arco3D=(a0,a1,r,z,n=16)=>{ let d=''; for(let i=0;i<=n;i++){ const a=a0+(a1-a0)*i/n, p=proy([r*Math.cos(a),r*Math.sin(a),z]); d+=(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1); } return d; };
  const curva=(ctrl)=>{ let d=''; for(let i=0;i<=40;i++){ const t=i/40, n=ctrl.length-1; let q=[0,0,0];   // Bézier de grado n
      ctrl.forEach((c,j)=>{ const b=comb(n,j)*Math.pow(t,j)*Math.pow(1-t,n-j); q=q.map((v,k)=>v+b*c[k]); }); const p=proy(q); d+=(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1); } return d; };
  const comb=(n,k)=>{ let r=1; for(let i=1;i<=k;i++) r=r*(n-k+i)/i; return r; };

  function dibujar(){
    capas.forEach(({c,poli},i)=>{ const p=circ(R3D,c.z); poli.setAttribute('points',pts(p));
      const izq=p.reduce((m,q)=>q[0]<m[0]?q:m,p[0]), y=izq[1]; const {t,l}=rotulos[i];
      if(an){ const arr=p.reduce((m,q)=>q[1]<m[1]?q:m,p[0]); t.setAttribute('x',W/2); t.setAttribute('y',arr[1]-5); l.setAttribute('visibility','hidden'); return; }
      t.setAttribute('x',8); t.setAttribute('y',y-6); l.setAttribute('x1',8); l.setAttribute('y1',y); l.setAttribute('x2',izq[0]); l.setAttribute('y2',y); });
    const ph=circ(R3D*1.08,345); halo.setAttribute('points',pts(ph)); const hi=ph.reduce((m,q)=>q[1]<m[1]?q:m,ph[0]); rotHalo.setAttribute('x',an?W/2:8); rotHalo.setAttribute('y',Math.max(18,hi[1]-8));
    nucleo.setAttribute('points',pts(circ(R3D*.42,125)));
    arcos5B.forEach((a,i)=>a.setAttribute('d',arco3D(2*Math.PI*i/5+.06, 2*Math.PI*(i+1)/5-.06, R3D*.42+12, 125)));
    const pc=proy([0,0,125]); rotNucleo.setAttribute('x',pc[0]); rotNucleo.setAttribute('y',pc[1]+4);
    // retroalimentaciones por fuera del cilindro
    const rr=R3D*1.22;
    const c0=[[R3D*.85,0,250],[rr*1.15,0,160],[rr*1.15,0,-40],[R3D*.85,0,-125]], c1=[[-R3D*.85,0,250],[-rr*1.1,0,190],[-rr*1.1,0,60],[-R3D*.85,0,0]];
    const rot=(c,a)=>c.map(([x,y,z])=>[x*Math.cos(a)-y*Math.sin(a), x*Math.sin(a)+y*Math.cos(a), z]);   // fijas al sistema: giran con él
    retro[0].setAttribute('d',curva(rot(c0,-0.35))); retro[1].setAttribute('d',curva(rot(c1,-0.35)));
    const e0=proy(rot([[rr*1.12,0,60]],-0.35)[0]), e1=proy(rot([[-rr*1.08,0,125]],-0.35)[0]);
    const lr=(rotRetro[0].getComputedTextLength&&rotRetro[0].getComputedTextLength())||300; rotRetro[0].setAttribute('x',Math.min(W-lr-8,Math.max(8,e0[0]+10))); rotRetro[0].setAttribute('y',e0[1]); rotRetro[1].setAttribute('x',Math.max(8,Math.min(W-280,e1[0]-260))); rotRetro[1].setAttribute('y',e1[1]-8);
    // aristas: solo la fracción más fuerte; con un nodo en foco, solo las suyas
    const n=Math.max(1,Math.round(aristas.length*frac)), Q={}; nodos.forEach(d=>Q[d.id]=proy(P[d.id]));
    lA.forEach(({e,el},i)=>{ const a=Q[e.a], b=Q[e.b]; const ve=foco ? (e.a===foco||e.b===foco) : i<n;
      if(!ve||!a||!b){ el.setAttribute('visibility','hidden'); return; } el.setAttribute('visibility','visible');
      el.setAttribute('x1',a[0]); el.setAttribute('y1',a[1]); el.setAttribute('x2',b[0]); el.setAttribute('y2',b[1]);
      el.setAttribute('stroke-width',(0.6+3.4*e.w/wmax).toFixed(2)); el.setAttribute('stroke-opacity',(foco?.75:.12+.5*e.w/wmax).toFixed(2)); });
    // nodos de atrás hacia adelante
    lN.slice().sort((u,v)=>Q[v.d.id][2]-Q[u.d.id][2]).forEach(({d,c})=>{ const q=Q[d.id]; c.setAttribute('cx',q[0].toFixed(1)); c.setAttribute('cy',q[1].toFixed(1)); c.setAttribute('r',(rad(d)*q[3]).toFixed(1));
      c.setAttribute('opacity', foco && d.id!==foco && !vecinos.get(foco).has(d.id) ? .15 : 1); c.parentNode.appendChild(c); });
    lV.forEach(({d,t})=>{ const q=Q[d.id], r=rad(d)*q[3]; t.setAttribute('visibility', verVal ? 'visible' : 'hidden');
      t.setAttribute('x',q[0].toFixed(1)); t.setAttribute('y',(q[1]+r+11).toFixed(1)); t.setAttribute('opacity', foco && d.id!==foco && !vecinos.get(foco).has(d.id) ? .15 : 1); });
    lT.forEach(({d,t})=>{ const q=Q[d.id]; t.setAttribute('x',q[0].toFixed(1)); t.setAttribute('y',(q[1]-rad(d)*q[3]-6).toFixed(1)); t.setAttribute('opacity', foco && d.id!==foco && !vecinos.get(foco).has(d.id) ? .15 : 1); });
  }
  function bucle(){ if(!svg.isConnected){ cancelAnimationFrame(raf); return; } if(girar){ yaw+=0.004; dibujar(); } raf=requestAnimationFrame(bucle); }
  const botonGiro=()=>{ const b=cont.querySelector('[data-m3d="girar"]'); b.setAttribute('aria-pressed',girar); b.textContent=girar?'❚❚ '+T('Pausar giro','Pause rotation'):'⟳ '+T('Girar','Rotate'); };
  const parar=()=>{ if(girar){ girar=false; botonGiro(); } };

  // ----- interacción: arrastrar, pellizcar, teclado, botones -----
  const ptr=new Map(); let dist0=0, zoom0=1, movio=false;
  svg.addEventListener('pointerdown',e=>{ ptr.set(e.pointerId,[e.clientX,e.clientY]); movio=false; try{ svg.setPointerCapture(e.pointerId); }catch(_){}
    if(ptr.size===2){ const [a,b]=[...ptr.values()]; dist0=Math.hypot(a[0]-b[0],a[1]-b[1]); zoom0=zoom; } });
  svg.addEventListener('pointermove',e=>{ if(!ptr.has(e.pointerId)) return; const [x0,y0]=ptr.get(e.pointerId); ptr.set(e.pointerId,[e.clientX,e.clientY]);
    if(ptr.size===2){ const [a,b]=[...ptr.values()]; zoom=Math.min(2.4,Math.max(.55,zoom0*Math.hypot(a[0]-b[0],a[1]-b[1])/(dist0||1))); }
    else { const dx=e.clientX-x0, dy=e.clientY-y0; if(Math.abs(dx)+Math.abs(dy)>2) movio=true; yaw+=dx*0.009; pitch=Math.min(1.45,Math.max(-0.1,pitch+dy*0.006)); }
    parar(); tip(null); dibujar(); });
  const soltar=e=>{ ptr.delete(e.pointerId); if(!movio && e.target.classList && e.target.classList.contains('m3d-nodo')){ const id=e.target.dataset.id; foco = foco===id ? null : id; dibujar(); }
    else if(!movio && foco){ foco=null; dibujar(); } };
  svg.addEventListener('pointerup',soltar); svg.addEventListener('pointercancel',e=>ptr.delete(e.pointerId));
  svg.addEventListener('wheel',e=>{ if(!e.ctrlKey && !e.metaKey) return; e.preventDefault(); zoom=Math.min(2.4,Math.max(.55,zoom*(e.deltaY<0?1.1:1/1.1))); dibujar(); },{passive:false});
  svg.addEventListener('keydown',e=>{ const k=e.key; if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(k)) return; e.preventDefault(); parar();
    if(k==='ArrowLeft') yaw-=.12; if(k==='ArrowRight') yaw+=.12; if(k==='ArrowUp') pitch=Math.min(1.45,pitch+.08); if(k==='ArrowDown') pitch=Math.max(-0.1,pitch-.08);
    if(k==='+'||k==='=') zoom=Math.min(2.4,zoom*1.12); if(k==='-') zoom=Math.max(.55,zoom/1.12); dibujar(); });
  cont.querySelector('.m3d-barra').addEventListener('click',e=>{ const b=e.target.closest('button[data-m3d]'); if(!b) return; const a=b.dataset.m3d;
    if(a==='girar'){ girar=!girar; botonGiro(); if(girar){ cancelAnimationFrame(raf); raf=requestAnimationFrame(bucle); } }
    if(a==='mas') zoom=Math.min(2.4,zoom*1.15); if(a==='menos') zoom=Math.max(.55,zoom/1.15);
    if(a==='frente'){ parar(); pitch=0.05; } if(a==='arriba'){ parar(); pitch=1.45; } if(a==='inicio'){ yaw=-0.55; pitch=0.3; zoom=1; foco=null; }
    dibujar(); });
  cont.querySelector('[data-m3d="frac"]').addEventListener('input',e=>{ frac=+e.target.value; cont.querySelector('[data-m3d="pct"]').textContent=Math.round(frac*100)+' %'; foco=null; dibujar(); });
  cont.querySelector('[data-m3d="pm"]').addEventListener('change',()=>rehacer());
  const orden=nodos.slice().sort((a,b)=>imp(b)-imp(a));
  cont.querySelector('.m3d-rank').innerHTML=`<h4>${T('Los 10 elementos más importantes','The 10 most important elements')} · ${esc(tx(IMP3D[med].n))}${ayuda(med==='val'?'':med)}</h4>
    <p class="nota">${esc(tx(IMP3D[med].c))} ${T('Escala de 0 a 100 respecto del elemento más importante de esta red.','Scale 0–100 relative to the most important element in this network.')}</p>
    <ol>${orden.slice(0,10).map(d=>`<li data-id="${d.id}"><span class="nm"><i style="background:${d.col}"></i>${esc(d.nombre)}</span><span class="bar"><b style="width:${imp(d).toFixed(1)}%;background:${d.col}"></b></span><span class="v">${f0(imp(d))}</span></li>`).join('')}</ol>`;
  cont.querySelector('.m3d-rank').addEventListener('click',e=>{ const li=e.target.closest('li[data-id]'); if(!li) return; foco = foco===li.dataset.id ? null : li.dataset.id; parar(); dibujar(); });
  const rehacer=()=>{ cancelAnimationFrame(raf); modelo3D(cont,{sinPM:cont.querySelector('[data-m3d="pm"]').checked, frac, girar, med, verVal}); };
  cont.querySelector('[data-m3d="med"]').addEventListener('change',e=>{ med=e.target.value; rehacer(); });
  cont.querySelector('[data-m3d="ver"]').addEventListener('change',e=>{ verVal=e.target.checked; dibujar(); });
  dibujar(); if(girar) raf=requestAnimationFrame(bucle);
}
