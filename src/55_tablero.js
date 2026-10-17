"use strict";
/* ================= BLOQUE 8 · TABLERO DE RESULTADOS ================= */
function renderTablero(el){ const R=construirRed(renderTablero.sinPM), st=estadisticaRed(R); const clave=renderTablero.clave||'grado', foco=renderTablero.foco||null;
  const ord=(k)=>[...st.nodos].sort((a,b)=>b[k]-a[k]); const top=ord(clave).slice(0,12);
  const pares=[...st.aristas].sort((a,b)=>b.w-a.w).slice(0,12);
  const ids=ord('grado').slice(0,14).map(d=>d.id), cor=correlaciones(R, ids);
  const cpar=[]; ids.forEach((a,i)=>ids.forEach((b,j)=>{ if(j>i) cpar.push([a,b,cor[i][j]]); })); cpar.sort((x,y)=>Math.abs(y[2])-Math.abs(x[2]));
  const mc=matrizCategorias(st), kp=mc.ks.filter((k,i)=>mc.M[i].some(v=>v>0));
  const Mk=kp.map(a=>kp.map(b=>mc.M[mc.ks.indexOf(a)][mc.ks.indexOf(b)]));
  const sos=sostenibilidad(); const met={grado:T('Grado ponderado','Weighted degree'), inter:T('Intermediación','Betweenness'), eig:T('Vector propio','Eigenvector'), cerc:T('Cercanía','Closeness')};
  el.innerHTML = `${cabecera('tablero',T('El sistema completo en una vista: quién está más relacionado, qué hilos pesan más, qué grupos se forman y qué elementos se mueven juntos. Pasa el cursor sobre nodos y vínculos; haz clic en un nodo para ver solo sus relaciones.','The whole system at a glance: who is most related, which threads weigh most, which groups form and which elements move together. Hover nodes and links; click a node to see only its relations.'))}
  ${!S.formulado?`<div class="alert warn"><p>${T('Aún no tejes el sistema en el Bloque 10; el tablero muestra el estado actual de tus datos.','You have not woven the system in Block 10 yet; the dashboard shows the current state of your data.')}</p><button class="btn sm" data-ir="formulacion">${T('Ir a formular','Go to formulation')}</button></div>`:''}
  <div class="kpis">
   <div class="kpi"><div class="l">${T('Nodos · vínculos','Nodes · links')}</div><div class="v">${st.n} · ${st.m}</div><div class="s">${R.acts.length} ${T('actividades','activities')}</div></div>
   <div class="kpi"><div class="l">${T('Densidad','Density')}${ayuda('densidad')}</div><div class="v">${fmt(st.densidad,3)}</div><div class="s">${T('grado medio','mean degree')} ${fmt(st.gradoMedio,1)}</div></div>
   <div class="kpi"><div class="l">${T('Agrupamiento medio','Mean clustering')}${ayuda('clus')}</div><div class="v">${fmt(st.clusMedio,2)}</div><div class="s">${T('camino medio','mean path')} ${fmt(st.caminoMedio,2)}${ayuda('camino')} · ${T('diámetro','diameter')} ${st.diametro}</div></div>
   <div class="kpi"><div class="l">${T('Modularidad Q','Modularity Q')}${ayuda('Q')}</div><div class="v">${fmt(st.Q,3)}</div><div class="s">${st.com.length} ${T('comunidades','communities')}</div></div>
   <div class="kpi"><div class="l">${T('Sostenibilidad media','Mean sustainability')}${ayuda('IS')}</div><div class="v" style="color:var(--${sos.global>0.6?'ok':sos.global<0.4?'bad':'warn'}-text)">${fmt(sos.global,2)}</div><div class="s">${T('índice 0–1 de las actividades','0–1 activity index')}</div></div></div>
  <div class="tablero">
   <div class="card t8"><div class="row between"><h3 style="margin:0">${T('Red del sistema','System network')}</h3>
     <div class="basesw">${Object.entries(met).map(([k,n])=>`<button data-clave="${k}" class="${k===clave?'on':''}">${n}</button>`).join('')}</div></div>
     <label class="row" style="gap:6px;margin:6px 0"><input type="checkbox" id="sinPM" ${renderTablero.sinPM?'checked':''}> ${T('Ocultar al nodo omnipresente (productores, presentes en casi todas las actividades) para ver la estructura interna','Hide the omnipresent node (farmers, present in almost every activity) to see the inner structure')}</label>
     ${redSistema(st,{clave, foco, h:620})}
     <div class="legend-cat">${Object.entries(CATS).filter(([k])=>st.nodos.some(d=>d.cat===k)).map(([k,c])=>`<span><i style="background:${c.col}"></i>${esc(tx(c.n))}</span>`).join('')}</div>
     <p class="nota">${T('Tamaño del nodo','Node size')}: ${met[clave]}${ayuda(clave==='grado'?'grado':clave)} · ${T('grosor del vínculo: peso','link thickness: weight')}. ${foco?`<button class="btn sm ghost" id="sinFoco">${T('Ver toda la red','Show whole network')}</button>`:T('Haz clic en un nodo para aislar sus relaciones.','Click a node to isolate its relations.')}</p></div>
   <div class="card t4"><h3>${T('Nodos más relacionados','Most related nodes')}</h3>
     <table class="tbl"><thead><tr><th>#</th><th>${T('Elemento','Element')}</th><th class="r">${met[clave]}</th></tr></thead><tbody>${top.map((d,i)=>`<tr data-nodo="${esc(d.id)}" style="cursor:pointer"><td>${i+1}</td><td><span style="color:${d.col}">${CATS[d.cat].sym}</span> ${esc(d.nombre)}</td><td class="r"><b>${fmt(d[clave],clave==='inter'?1:3)}</b></td></tr>`).join('')}</tbody></table></div>
   <div class="card t6"><h3>${T('Vínculos de mayor peso','Heaviest links')}</h3>
     <table class="tbl"><thead><tr><th>${T('Par de elementos','Element pair')}</th><th class="r">${T('Peso','Weight')}</th><th class="r">${T('Actividades','Activities')}</th></tr></thead><tbody>${pares.map(e=>`<tr><td>${esc(nombreEl(e.a))} — ${esc(nombreEl(e.b))}</td><td class="r"><b>${fmt(e.w,2)}</b></td><td class="r">${e.n}</td></tr>`).join('')}</tbody></table></div>
   <div class="card t6"><h3>${T('Comunidades que emergen','Emerging communities')}${ayuda('Q')}</h3>
     ${st.com.slice(0,6).map((c,i)=>`<p style="margin:.4em 0"><b>C${i+1}</b> (${c.length}): ${c.slice(0,10).map(id=>esc(nombreEl(id))).join(', ')}${c.length>10?' …':''}</p>`).join('')}
     <p class="nota sci">${T('Método de Louvain (Blondel et al., 2008); Q de Newman (2006).','Louvain method (Blondel et al., 2008); Newman (2006) Q.')}</p></div>
   <div class="card t5"><h3>${T('Distribución de grados','Degree distribution')}</h3>${histograma(st.grados)}<p class="nota">${T('Pocos elementos con muchos vecinos y muchos con pocos: los primeros son los ejes del sistema.','Few elements with many neighbours and many with few: the former are the system’s hubs.')}</p></div>
   <div class="card t7"><h3>${T('Interacción entre categorías','Interaction between categories')}</h3>${calor(Mk, kp.map(k=>tx(CATS[k].n)), {seq:true, min:0, max:Math.max(...Mk.flat(),1), etqV:T('peso','weight'), celda:40, izq:200, arriba:130})}</div>
   <div class="card t12 sci"><h3>${T('Correlaciones entre los elementos principales','Correlations among the main elements')}${ayuda('phi')}</h3>
     <div class="grid g2"><div>${calor(cor, ids.map(nombreEl), {celda:30})}</div>
     <div><table class="tbl"><thead><tr><th>${T('Par','Pair')}</th><th class="r">φ</th></tr></thead><tbody>${cpar.slice(0,14).map(([a,b,v])=>`<tr><td>${esc(nombreEl(a))} · ${esc(nombreEl(b))}</td><td class="r" style="color:var(--${v>=0?'ok':'bad'}-text)"><b>${fmt(v,2)}</b></td></tr>`).join('')}</tbody></table>
     <p class="nota">${T('φ = correlación de Pearson entre los vectores de incidencia de dos elementos en las','φ = Pearson correlation between two elements’ incidence vectors across the')} ${R.acts.length} ${T('actividades.','activities.')}</p></div></div></div>
   <div class="card t12 sci"><h3>${T('Estadística completa por nodo','Full node statistics')}</h3><div class="tbl-c"><table class="tbl"><thead><tr><th>${T('Elemento','Element')}</th><th>${T('Categoría','Category')}</th><th class="r">${T('Valor','Value')}</th><th class="r">${T('Particip.','Partic.')}</th><th class="r">${T('Vecinos','Neighbours')}</th><th class="r">${T('Grado pond.','W. degree')}</th><th class="r">${T('Interm.','Betw.')}</th><th class="r">${T('Cercanía','Closeness')}</th><th class="r">${T('Vector propio','Eigenvector')}</th><th class="r">${T('Agrup.','Clust.')}</th><th class="r">C</th></tr></thead><tbody>
     ${ord('grado').map(d=>`<tr><td>${esc(d.nombre)}</td><td><span style="color:${d.col}">${CATS[d.cat].sym}</span> ${esc(tx(CATS[d.cat].n))}</td><td class="r">${fmt(d.val,2)}</td><td class="r">${d.part}</td><td class="r">${d.vecinos}</td><td class="r">${fmt(d.grado,2)}</td><td class="r">${fmt(d.inter,1)}</td><td class="r">${fmt(d.cerc,3)}</td><td class="r">${fmt(d.eig,3)}</td><td class="r">${fmt(d.clus,2)}</td><td class="r">C${d.com+1}</td></tr>`).join('')}</tbody></table></div></div>
   <div class="card t7"><h3>${T('Calendario circular de actividades','Circular activity calendar')}</h3>${calendarioPasos().length?calendarioCircular({filtro:renderTablero.ev})+leyendaEventos(renderTablero.ev):`<p class="sindato">${T('Captura las fechas de los pasos en el Bloque 5.','Enter step dates in Block 5.')}</p>`}
     <p class="nota">${T('Cada anillo es un tipo de actividad; ★ actividades principales. La aguja marca hoy y el centro anuncia la siguiente actividad. Haz clic en un arco para abrir su paso; en la leyenda, para filtrar.','Each ring is an activity type; ★ main activities. The needle marks today and the centre announces the next activity. Click an arc to open its step; the legend to filter.')}</p></div>
   <div class="card t5"><h3>${T('Fechas de las actividades principales','Main-activity dates')}</h3>${tablaFechas()}</div>
   <div class="card t6"><h3>${T('Intensidad de conocimiento publicada','Published knowledge intensity')}${ayuda('iic')}</h3>${conStack()?barrasH(PASOS.filter(p=>p.iic).sort((a,b)=>b.iic-a.iic).map(p=>({l:p.n+'. '+T(p.es,p.en).slice(0,30), v:p.iic, c:colB(p.b), vl:fmt(p.iic,1)})),{max:100,izq:250,w:600,fila:24})+fuenteArt():`<p class="sindato">—</p>`}</div>
   ${tarjetaCorrElemento(R, st)}
   ${tarjetaCladograma(R)}
  </div>${siguiente('tablero')}`;
  if($('#corrEl',el)) $('#corrEl',el).onchange=e=>{ renderTablero.corrEl=e.target.value; render(); };
  $$('[data-clado]',el).forEach(b=>b.onclick=()=>{ renderTablero.clado=b.dataset.clado; render(); });
  $$('[data-clave]',el).forEach(b=>b.onclick=()=>{ renderTablero.clave=b.dataset.clave; render(); });
  $('#sinPM',el).onchange=e=>{ renderTablero.sinPM=e.target.checked; render(); };
  $$('[data-evf]',el).forEach(b=>b.onclick=()=>{ renderTablero.ev=b.dataset.evf||null; render(); });
  $$('[data-evpaso]',el).forEach(a=>a.onclick=()=>{ renderManejo.abierto=+a.dataset.evpaso; irA('manejo'); });
  $$('[data-nodo]',el).forEach(n=>n.onclick=()=>{ renderTablero.foco = renderTablero.foco===n.dataset.nodo ? null : n.dataset.nodo; render(); });
  const sf=$('#sinFoco',el); if(sf) sf.onclick=()=>{ renderTablero.foco=null; render(); };
  enlazarTips(el); }
