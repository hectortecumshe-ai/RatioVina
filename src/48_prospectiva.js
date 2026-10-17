"use strict";
/* =====================================================================
   A. CORRELACIONES POR ELEMENTO (Bloque 11)
   φ = correlación de Pearson entre los vectores de incidencia (0/1) de dos
   elementos en las actividades del sistema (la misma de la matriz del Tablero).
   ===================================================================== */
function tarjetaCorrElemento(R, st){
  const ids=st.nodos.map(d=>d.id); if(ids.length<3) return '';
  const ordG=[...st.nodos].sort((a,b)=>b.grado-a.grado), sel=ids.includes(renderTablero.corrEl)?renderTablero.corrEl:(ordG.find(d=>d.id!=='PM')||ordG[0]).id;
  const cor=correlaciones(R, ids), i=ids.indexOf(sel), d0=st.nodos[i];
  const l=ids.map((id,j)=>({id, v:cor[i][j]})).filter(x=>x.id!==sel && Math.abs(x.v)>=0.005);
  const pos=l.filter(x=>x.v>0).sort((a,b)=>b.v-a.v).slice(0,12), neg=l.filter(x=>x.v<0).sort((a,b)=>a.v-b.v).slice(0,8);
  const filas=[...pos,...neg.reverse()], W=760, fila=24, izq=290, H=filas.length*fila+40, cx=izq+(W-izq-60)/2, esc1=(W-izq-60)/2;
  let s=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="φ">`;
  [-1,-.5,0,.5,1].forEach(t=>{ const x=cx+t*esc1; s+=`<line class="grid" x1="${x}" y1="4" x2="${x}" y2="${H-24}"/><text x="${x}" y="${H-8}" text-anchor="middle" font-size="11" class="m">${fmt(t,1)}</text>`; });
  filas.forEach((x,k)=>{ const y=6+k*fila, w=x.v*esc1, n=st.nodos.find(d=>d.id===x.id);
    s+=`<text x="${izq-8}" y="${y+fila/2}" text-anchor="end" dominant-baseline="middle" font-size="13"><tspan fill="${n.col}">${CATS[n.cat].sym}</tspan> ${esc(n.nombre.length>34?n.nombre.slice(0,33)+'…':n.nombre)}</text>`+
       `<rect class="barra-c" x="${Math.min(cx,cx+w)}" y="${y+4}" width="${Math.max(1,Math.abs(w))}" height="${fila-9}" rx="3" fill="${x.v>0?'var(--ok)':'var(--bad)'}" opacity=".85" data-tip="${esc(d0.nombre+' · '+n.nombre+': φ = '+fmt(x.v,3))}"/>`+
       `<text x="${x.v>0?cx+w+6:cx+w-6}" y="${y+fila/2}" text-anchor="${x.v>0?'start':'end'}" dominant-baseline="middle" font-size="12" font-weight="700">${fmt(x.v,2)}</text>`; });
  s+='</svg>';
  return `<div class="card t12"><div class="row between"><h3 style="margin:0">${T('Correlaciones de un elemento con los demás','One element’s correlations with the rest')}${ayuda('phi')}</h3>
    <label class="f" style="margin:0;min-width:280px"><select id="corrEl">${ordG.map(d=>`<option value="${esc(d.id)}" ${d.id===sel?'selected':''}>${CATS[d.cat].sym} ${esc(d.nombre)}</option>`).join('')}</select></label></div>
   <p class="nota">${T('Verde: aparecen juntos en las mismas actividades (se mueven a la par). Rojo: cuando uno está, el otro tiende a faltar. Se muestran los 12 vínculos positivos y los 8 negativos más fuertes.','Green: they appear together in the same activities (they move together). Red: when one is present, the other tends to be absent. The 12 strongest positive and 8 strongest negative ties are shown.')}</p>
   ${filas.length?s:`<p class="sindato">${T('Este elemento no comparte variación con otros.','This element shares no variation with others.')}</p>`}
   <p class="nota sci">φ ${T('de Pearson entre vectores de incidencia en','(Pearson) between incidence vectors over')} ${R.acts.length} ${T('actividades','activities')}; |φ| ≥ 0.5 ${T('es una asociación fuerte.','is a strong association.')}</p></div>`; }

/* =====================================================================
   B. PROSPECTIVA A 2, 5 Y 10 AÑOS (bloque Prospectiva)
   Escenarios exploratorios (Godet y Durance, 2007): no son pronósticos, sino
   futuros posibles construidos con supuestos explícitos y editables.
   Fuentes de los supuestos con base publicada:
   · Calentamiento: tasa actual ≈ 0.2 °C por década, intervalo probable 0.1–0.3 (IPCC, 2018, SR1.5, SPM A.1).
   · Efecto de +1 °C en el rendimiento: maíz −7.4 %, trigo −6.0 %, arroz −3.2 %, soya −3.1 % (Zhao et al., 2017).
   · Adopción de innovaciones en forma de S (Rogers, 2003).
   Todo lo demás (precios, costos, mano de obra, eventos extremos, efectos de las
   innovaciones) es supuesto de Ratio Viña, marcado y editable.
   El efecto de las innovaciones sobre la sostenibilidad sale de los datos del usuario:
   IS medio de sus actividades innovadas frente al de las tradicionales (Bloque 5).
   ===================================================================== */
const BETA_ZHAO = {maiz:-7.4, trigo:-6.0};
const ESCENARIOS = [
  {id:'des', n:E('Deseable (potencialidades)','Desirable (potentials)'), col:'#2f8f6a', p:{gP:1, gC:1, dT:0.1, pExt:0.12, gL:-0.5, aMax:0.9, t50:4}},
  {id:'ten', n:E('Tendencial','Trend'), col:'#c98b21', p:{gP:0, gC:2, dT:0.2, pExt:0.18, gL:-1.5, aMax:0.5, t50:6}},
  {id:'nod', n:E('No deseado','Undesired'), col:'#c43a2f', p:{gP:-1.5, gC:4, dT:0.3, pExt:0.25, gL:-3, aMax:0.15, t50:9}}
];
const PARAM_P = [
  ['gP', E('Precio real del producto (% por año)','Real product price (% per year)'), 'sup'],
  ['gC', E('Costo real de insumos y servicios (% por año)','Real input and service cost (% per year)'), 'sup'],
  ['dT', E('Calentamiento (°C por década)','Warming (°C per decade)'), 'ipcc'],
  ['pExt', E('Probabilidad de un año extremo a 10 años (sequía, helada, ciclón)','Probability of an extreme year by year 10 (drought, frost, cyclone)'), 'sup'],
  ['gL', E('Mano de obra familiar disponible (% por año)','Available family labour (% per year)'), 'sup'],
  ['aMax', E('Adopción máxima de las innovaciones (0–1)','Maximum innovation adoption (0–1)'), 'sup'],
  ['t50', E('Año en que se alcanza la mitad de la adopción','Year half of adoption is reached'), 'rogers']
];
function prospDef(){ return {esc:Object.fromEntries(ESCENARIOS.map(e=>[e.id,{...e.p}])), beta:BETA_ZHAO[S.cultivo]??-4.9, p0:0.10, Lext:30, eY:10, sC:5, rL:15}; }
function prosp(){ const d=prospDef(); const g=S.prosp||{}; return {...d, ...g, esc:Object.fromEntries(ESCENARIOS.map(e=>[e.id,{...d.esc[e.id], ...((g.esc||{})[e.id]||{})}]))}; }
function simularProspectiva(){
  const P=prosp(), sos=sostenibilidad(), acts=sos.acts, nI=acts.filter(a=>a.tipo==='inn').length, a0=acts.length? nI/acts.length : 0;
  const ISt=sos.trad, ISi=sos.inn, hayInn=nI>0 && ISi!=null;
  const I0=S.precio.INGR&&+S.precio.INGR.p>0 ? +S.precio.INGR.p : null, C0=S.precio.COSTOS&&+S.precio.COSTOS.p>0 ? +S.precio.COSTOS.p : null;
  const sig=(t,t50)=>1/(1+Math.exp(-(t-t50)));
  const rg0=regeneracion(), IR0=rg0.IR, cap0=capacidadAdaptativa(rg0), otros=cap0.parts.slice(1), Lef=P.Lext*(1-0.5*IR0);
  const CAde=(ir)=>(ir+otros.reduce((s,x)=>s+x.v,0))/(1+otros.length);
  const res=ESCENARIOS.map(e=>{ const p=P.esc[e.id], aMax=Math.max(p.aMax,a0), s0=sig(0,p.t50), serie=[];
    for(let t=0;t<=10;t++){
      const A=a0+(aMax-a0)*(sig(t,p.t50)-s0)/(1-s0), dA=hayInn?A-a0:0;
      const Fcl=Math.max(0, 1+(P.beta/100)*p.dT*t/10);
      const pt=P.p0+(p.pExt-P.p0)*t/10, Fex=(1-pt*Lef/100)/(1-P.p0*Lef/100);
      const IRt=Math.min(1, IR0+0.5*(1-IR0)*dA), RGt=riesgos({rg:{IR:IRt}, CA:CAde(IRt), dClima:5*(pt-P.p0)}).idx;
      const Ld=Math.pow(1+p.gL/100,t), Ln=1-(P.rL/100)*dA, def=Math.max(0,Ln-Ld)/Ln, Flab=1-0.5*def;
      const Y=100*Fcl*Fex*(1+(P.eY/100)*dA)*Flab, Pr=100*Math.pow(1+p.gP/100,t), C=100*Math.pow(1+p.gC/100,t)*(1-(P.sC/100)*dA);
      const IB=Pr*Y/100, rel=100*IB/C, IS_=hayInn&&ISt!=null ? ISt*(1-A)+ISi*A : sos.global;
      serie.push({t, A:hayInn?A*100:a0*100, Y, Pr, C, rel, Ld:Ld*100, Ln:Ln*100, def:def*100, IS:IS_, IR:100*IRt, RG:100*RGt, neto: I0!=null&&C0!=null ? I0*IB/100 - C0*C/100 : null}); }
    return {...e, p, serie}; });
  return {res, P, a0, hayInn, ISt, ISi, I0, C0, nI, IR0, Lef}; }
const IND_PROSP = [
  {k:'Y', n:E('Rendimiento','Yield'), u:E('índice, año 0 = 100','index, year 0 = 100'), d:0},
  {k:'Pr', n:E('Precio real del producto','Real product price'), u:E('índice','index'), d:0},
  {k:'C', n:E('Costo de producción por ha','Production cost per ha'), u:E('índice','index'), d:0},
  {k:'rel', n:E('Ingreso bruto ÷ costo','Gross income ÷ cost'), u:E('índice, año 0 = 100','index, year 0 = 100'), d:0},
  {k:'neto', n:E('Ingreso neto por ha','Net income per ha'), u:E('$ / ha (Bloque 9)','$ / ha (Block 9)'), d:0},
  {k:'Ld', n:E('Mano de obra familiar disponible','Available family labour'), u:E('índice; la línea punteada es la requerida','index; dotted line is the labour required'), d:0},
  {k:'A', n:E('Adopción de innovaciones','Innovation adoption'), u:E('% de las actividades','% of activities'), d:0},
  {k:'IS', n:E('Índice de sostenibilidad','Sustainability index'), u:E('0–1','0–1'), d:2},
  {k:'IR', n:E('Índice de regeneración','Regeneration index'), u:E('0–100 (Bloque 6)','0–100 (Block 6)'), d:0},
  {k:'RG', n:E('Índice de riesgo','Risk index'), u:E('0–100 (Bloque 7)','0–100 (Block 7)'), d:0}
];
function graficaProsp(sim, k){ const W=420, H=250, L=54, B=36, R=14, Tp=14, ser=sim.res.map(r=>r.serie.map(x=>x[k]));
  if(ser[0][0]==null) return `<p class="sindato">${T('Captura el ingreso y el costo por hectárea en el Bloque 9 (Recursos financieros) para ver el ingreso neto en pesos.','Enter income and cost per hectare in Block 9 (Financial resources) to see net income in pesos.')}</p>`;
  const extra=k==='Ld'?sim.res.map(r=>r.serie.map(x=>x.Ln)):[]; const all=[...ser.flat(),...extra.flat()];
  let mn=Math.min(...all), mx=Math.max(...all); if(k==='IS'){ mn=0; mx=1; } else if(k==='A'||k==='IR'||k==='RG'){ mn=0; mx=100; } else { if(mx-mn<1e-9){ mn-=Math.abs(mn)*.05||1; mx+=Math.abs(mx)*.05||1; } const pad=(mx-mn)*.08; mn-=pad; mx+=pad; }
  const X=t=>L+(W-L-R)*t/10, Yp=v=>Tp+(H-Tp-B)*(1-(v-mn)/(mx-mn));
  let s=`<svg class="chart prosp-g" viewBox="0 0 ${W} ${H}" role="img">`;
  for(let i=0;i<=4;i++){ const v=mn+(mx-mn)*i/4, y=Yp(v); s+=`<line class="grid" x1="${L}" y1="${y}" x2="${W-R}" y2="${y}"/><text x="${L-6}" y="${y+4}" text-anchor="end" font-size="13" class="m">${fmt(v,k==='IS'?2:0)}</text>`; }
  [2,5,10].forEach(t=>{ s+=`<line x1="${X(t)}" y1="${Tp}" x2="${X(t)}" y2="${H-B}" stroke="var(--border-strong)" stroke-dasharray="3 3"/><text x="${X(t)}" y="${H-B+16}" text-anchor="middle" font-size="13" font-weight="700">${t} ${T('años','yrs')}</text>`; });
  s+=`<text x="${X(0)+4}" y="${H-B+16}" text-anchor="start" font-size="12" class="m">${T('hoy','now')}</text>`;
  if(k==='Ld') sim.res.forEach((r,i)=>{ s+=`<polyline fill="none" stroke="${r.col}" stroke-width="1.6" stroke-dasharray="5 4" opacity=".8" points="${extra[i].map((v,t)=>X(t)+','+Yp(v)).join(' ')}"/>`; });
  sim.res.forEach((r,i)=>{ s+=`<polyline class="linea-p" fill="none" stroke="${r.col}" stroke-width="2.6" points="${ser[i].map((v,t)=>X(t)+','+Yp(v)).join(' ')}"/>`;
    [2,5,10].forEach(t=>{ s+=`<circle cx="${X(t)}" cy="${Yp(ser[i][t])}" r="4.2" fill="${r.col}" stroke="var(--card)" stroke-width="1.5" data-tip="${esc(tx(r.n)+' · '+t+' '+T('años','years')+': '+fmt(ser[i][t],k==='IS'?2:1))}"/>`; }); });
  return s+'</svg>'; }
function tablaHorizontes(sim, ks){ const hs=[2,5,10]; const flecha=(v,b)=>{ const d=b?((v-b)/Math.abs(b))*100:0; return Math.abs(d)<1?'→':d>0?'↑':'↓'; };
  return `<div class="tbl-c"><table class="tbl prosp-t"><thead><tr><th>${T('Indicador','Indicator')}</th><th>${T('Escenario','Scenario')}</th>${hs.map(h=>`<th class="r">${h} ${T('años','years')}</th>`).join('')}</tr></thead><tbody>
   ${ks.map(k=>{ const ind=IND_PROSP.find(x=>x.k===k); if(sim.res[0].serie[0][k]==null) return ''; return sim.res.map((r,i)=>`<tr>${i===0?`<td rowspan="3"><b>${esc(tx(ind.n))}</b><br><small class="muted">${esc(tx(ind.u))}</small></td>`:''}<td><span class="punto" style="background:${r.col}"></span>${esc(tx(r.n))}</td>${hs.map(h=>{ const v=r.serie[h][k], b=r.serie[0][k]; return `<td class="r">${fmt(v,ind.d||(k==='IS'?2:0))} <span style="color:${r.col}">${flecha(v,b)}</span></td>`; }).join('')}</tr>`).join(''); }).join('')}
   </tbody></table></div>`; }
function lecturaProsp(sim){ const ult=k=>sim.res.map(r=>r.serie[10][k]), [d,t,n]=[0,1,2], pc=v=>(v>=100?'+':'')+fmt(v-100,0)+' %';
  const Y=ult('Y'), rel=ult('rel'), L=ult('Ld'), def=sim.res.map(r=>Math.max(...r.serie.map(x=>x.def)));
  const pot=[], rie=[];
  pot.push(T(`Con el escenario deseable, a 10 años el rendimiento cambia ${pc(Y[d])} y la relación ingreso ÷ costo ${pc(rel[d])}.`,`In the desirable scenario, by year 10 yield changes ${pc(Y[d])} and the income ÷ cost ratio ${pc(rel[d])}.`));
  if(sim.hayInn) pot.push(T(`${sim.nI===1?'Tu actividad innovada tiene':'Tus '+sim.nI+' actividades innovadas tienen'} un IS medio de ${fmt(sim.ISi,2)} frente a ${fmt(sim.ISt,2)} de las tradicionales: difundirlas ${sim.ISi>=sim.ISt?'eleva':'reduce'} la sostenibilidad del sistema.`,`${sim.nI===1?'Your innovated activity has':'Your '+sim.nI+' innovated activities have'} a mean IS of ${fmt(sim.ISi,2)} versus ${fmt(sim.ISt,2)} for traditional ones: spreading them ${sim.ISi>=sim.ISt?'raises':'lowers'} system sustainability.`));
  else pot.push(T('Aún no hay actividades innovadas en el Bloque 5: la adopción no cambia los resultados. Agrégalas para ver su potencial.','There are no innovated activities in Block 5 yet: adoption does not change results. Add them to see their potential.'));
  rie.push(T(`En el escenario no deseado, a 10 años el rendimiento cambia ${pc(Y[n])} y la relación ingreso ÷ costo ${pc(rel[n])}.`,`In the undesired scenario, by year 10 yield changes ${pc(Y[n])} and income ÷ cost ${pc(rel[n])}.`));
  rie.push(T(`La mano de obra familiar disponible baja a ${fmt(L[n],0)} (tendencial: ${fmt(L[t],0)}); ${def[n]>0.5?`el déficit llega a ${fmt(def[n],0)} % de la requerida`:'sin déficit frente a la requerida'}.`,`Available family labour drops to ${fmt(L[n],0)} (trend: ${fmt(L[t],0)}); ${def[n]>0.5?`the shortfall reaches ${fmt(def[n],0)} % of what is needed`:'no shortfall against what is needed'}.`));
  rie.push(T(`Con ${fmt(sim.res[n].p.dT,1)} °C por década y ${fmt(sim.P.beta,1)} % de rendimiento por °C, el clima por sí solo resta ${fmt(-sim.P.beta*sim.res[n].p.dT,1)} % en 10 años, más las pérdidas de los años extremos.`,`With ${fmt(sim.res[n].p.dT,1)} °C per decade and ${fmt(sim.P.beta,1)} % yield per °C, climate alone removes ${fmt(-sim.P.beta*sim.res[n].p.dT,1)} % in 10 years, plus losses in extreme years.`));
  const IRu=ult('IR'), RGu=ult('RG');
  pot.push(T(`La regeneración pasa de ${fmt(100*sim.IR0,0)} a ${fmt(IRu[d],0)} en el escenario deseable; un sistema más regenerado pierde menos en los años extremos.`,`Regeneration goes from ${fmt(100*sim.IR0,0)} to ${fmt(IRu[d],0)} in the desirable scenario; a more regenerated system loses less in extreme years.`));
  rie.push(T(`El índice de riesgo llega a ${fmt(RGu[n],0)} en el escenario no deseado (tendencial: ${fmt(RGu[t],0)}), por la mayor frecuencia de eventos climáticos.`,`The risk index reaches ${fmt(RGu[n],0)} in the undesired scenario (trend: ${fmt(RGu[t],0)}), from more frequent climate events.`));
  return {pot, rie}; }
function renderProspectiva(el){ const sim=simularProspectiva(), P=sim.P, lec=lecturaProsp(sim), c=cultivoSel();
  const editable=(id,k,v)=>`<input type="number" step="${k==='aMax'?0.05:k==='t50'?1:0.1}" data-pe="${id}" data-pk="${k}" value="${v}">`;
  const marca=t=>t==='ipcc'?`<span class="dato">● IPCC (2018)</span>`:t==='rogers'?`<span class="dato">● Rogers (2003)</span>`:marcaInterp(T('Supuesto editable','Editable assumption'));
  el.innerHTML=`${cabecera('prospectiva',T('¿Hacia dónde va tu unidad productiva? Tres futuros posibles a 2, 5 y 10 años: uno deseable, uno tendencial y uno no deseado. Combinan los precios del producto, la emergencia climática, la pérdida de mano de obra en el campo y la adopción de las actividades innovadas de tu Stack.','Where is your farm heading? Three possible futures at 2, 5 and 10 years: desirable, trend and undesired. They combine product prices, the climate emergency, the loss of farm labour and the adoption of your Stack’s innovated activities.'))}
  ${consejo(T('No son pronósticos: son escenarios para conversar con la familia, los asesores y la comunidad sobre qué hacer hoy. Cambia los supuestos de la tabla y mira cómo se mueven las curvas.','These are not forecasts: they are scenarios to discuss with the family, advisers and community what to do today. Change the assumptions in the table and watch the curves move.'),
    T('Escenarios exploratorios (Godet y Durance, 2007). Clima: IPCC (2018) y Zhao et al. (2017); adopción logística (Rogers, 2003). Los demás parámetros son supuestos explícitos.','Exploratory scenarios (Godet & Durance, 2007). Climate: IPCC (2018) and Zhao et al. (2017); logistic adoption (Rogers, 2003). Other parameters are explicit assumptions.'))}
  <div class="kpis">${sim.res.map(r=>`<div class="kpi" style="border-top:4px solid ${r.col}"><div class="l">${esc(tx(r.n))}</div><div class="v" style="color:${r.col}">${fmt(r.serie[10].rel,0)}</div><div class="s">${T('ingreso ÷ costo a 10 años (hoy = 100)','income ÷ cost at 10 years (now = 100)')}</div></div>`).join('')}
   <div class="kpi"><div class="l">${T('Actividades innovadas hoy','Innovated activities today')}</div><div class="v">${fmt(sim.a0*100,0)} %</div><div class="s">${sim.nI} ${T('de','of')} ${sostenibilidad().acts.length}</div></div></div>
  <div class="prosp-grid">${IND_PROSP.map(ind=>`<div class="card"><h3 style="margin:0 0 2px">${esc(tx(ind.n))}</h3><p class="nota" style="margin:0 0 6px">${esc(tx(ind.u))}</p>${graficaProsp(sim, ind.k)}</div>`).join('')}</div>
  <div class="leyenda-esc">${sim.res.map(r=>`<span><i style="background:${r.col}"></i>${esc(tx(r.n))}</span>`).join('')}</div>
  <div class="grid g2">
   <div class="card" style="border-top:4px solid #2f8f6a"><h3>${T('Potencialidades','Potentials')}</h3><ul>${lec.pot.map(x=>`<li>${x}</li>`).join('')}</ul></div>
   <div class="card" style="border-top:4px solid #c43a2f"><h3>${T('Perspectivas no deseadas','Undesired prospects')}</h3><ul>${lec.rie.map(x=>`<li>${x}</li>`).join('')}</ul></div></div>
  <div class="card"><h3>${T('Resultados a 2, 5 y 10 años','Results at 2, 5 and 10 years')}</h3>${tablaHorizontes(sim, ['Y','rel','neto','Ld','A','IS','IR','RG'])}</div>
  <div class="card"><div class="row between"><h3 style="margin:0">${T('Supuestos de cada escenario','Assumptions per scenario')}</h3><button class="btn ghost sm" id="pReset">${T('Volver a los valores iniciales','Reset to defaults')}</button></div>
   <div class="tbl-c"><table class="tbl prosp-sup"><thead><tr><th>${T('Variable','Variable')}</th>${ESCENARIOS.map(e=>`<th style="color:${e.col}">${esc(tx(e.n))}</th>`).join('')}<th>${T('Base','Basis')}</th></tr></thead><tbody>
    ${PARAM_P.map(([k,n,b])=>`<tr><td>${esc(tx(n))}</td>${ESCENARIOS.map(e=>`<td>${editable(e.id,k,P.esc[e.id][k])}</td>`).join('')}<td>${marca(b)}</td></tr>`).join('')}
   </tbody></table></div>
   <h4 style="margin:14px 0 6px">${T('Supuestos comunes','Common assumptions')}</h4>
   <div class="grid g3">
    <label class="f"><span>${T('Cambio de rendimiento por cada +1 °C (%)','Yield change per +1 °C (%)')}</span><input type="number" step="0.1" data-pc="beta" value="${P.beta}"><small>${BETA_ZHAO[S.cultivo]!=null?`● Zhao et al. (2017), ${esc(tx(c.n))}`:T('◆ Supuesto: media de maíz, trigo, arroz y soya en Zhao et al. (2017); no hay estimación propia para este cultivo o especie.','◆ Assumption: mean of maize, wheat, rice and soybean in Zhao et al. (2017); no estimate for this crop or species.')}</small></label>
    <label class="f"><span>${T('Probabilidad actual de un año extremo','Current probability of an extreme year')}</span><input type="number" step="0.01" data-pc="p0" value="${P.p0}"><small>◆ ${T('Supuesto','Assumption')}</small></label>
    <label class="f"><span>${T('Pérdida de rendimiento en un año extremo (%)','Yield loss in an extreme year (%)')}</span><input type="number" step="1" data-pc="Lext" value="${P.Lext}"><small>◆ ${T('Supuesto','Assumption')}</small></label>
    <label class="f"><span>${T('Rendimiento extra con adopción plena de las innovaciones (%)','Extra yield with full innovation adoption (%)')}</span><input type="number" step="1" data-pc="eY" value="${P.eY}"><small>◆ ${T('Supuesto','Assumption')}</small></label>
    <label class="f"><span>${T('Ahorro de costos con adopción plena (%)','Cost saving with full adoption (%)')}</span><input type="number" step="1" data-pc="sC" value="${P.sC}"><small>◆ ${T('Supuesto','Assumption')}</small></label>
    <label class="f"><span>${T('Ahorro de mano de obra con adopción plena (%)','Labour saving with full adoption (%)')}</span><input type="number" step="1" data-pc="rL" value="${P.rL}"><small>◆ ${T('Supuesto','Assumption')}</small></label></div>
   <p class="nota">${T('La mano de obra y los precios cambian por región: contrasta los supuestos con el Censo Agropecuario y la ENOE del INEGI, y con los precios del SIAP de tu municipio.','Labour and prices vary by region: check the assumptions against INEGI’s Agricultural Census and ENOE, and SIAP prices for your municipality.')}</p></div>
  <div class="card sci"><h3>${T('Modelo','Model')}</h3><div class="formula">A(t) = a₀ + (A<sub>máx</sub> − a₀) · [σ(t − t₅₀) − σ(−t₅₀)] / [1 − σ(−t₅₀)] ; σ(x) = 1/(1+e<sup>−x</sup>)<br>
   Y(t) = 100 · [1 + β·ΔT·t/10] · [(1 − p(t)·L<sub>ext</sub>)/(1 − p₀·L<sub>ext</sub>)] · [1 + e<sub>Y</sub>·(A − a₀)] · [1 − 0.5·déficit(t)]<br>
   P(t) = 100·(1+g<sub>P</sub>)<sup>t</sup> ; C(t) = 100·(1+g<sub>C</sub>)<sup>t</sup>·[1 − s<sub>C</sub>·(A − a₀)] ; ${T('ingreso ÷ costo','income ÷ cost')} = 100·(P·Y/100)/C<br>
   L<sub>disp</sub>(t) = (1+g<sub>L</sub>)<sup>t</sup> ; L<sub>req</sub>(t) = 1 − r<sub>L</sub>·(A − a₀) ; ${T('déficit','shortfall')} = max(0, L<sub>req</sub> − L<sub>disp</sub>)/L<sub>req</sub><br>
   IR(t) = IR₀ + 0.5·(1 − IR₀)·(A − a₀) ; L<sub>ext,ef</sub> = L<sub>ext</sub>·(1 − 0.5·IR₀) ; ${T('riesgo','risk')}(t): P<sub>clima</sub> + 5·(p(t) − p₀) ${T('y CA con IR(t)','and CA with IR(t)')}<br>
   IS(t) = IS<sub>trad</sub>·(1 − A) + IS<sub>inn</sub>·A ${T('(medias de tus actividades, Bloque 12)','(means of your activities, Block 12)')}</div>
   <p class="nota">a₀ = ${fmt(sim.a0,3)} · IS<sub>trad</sub> = ${fmt(sim.ISt,3)} · IS<sub>inn</sub> = ${sim.ISi==null?'—':fmt(sim.ISi,3)} · β = ${fmt(P.beta,1)} %/°C. ${T('La elasticidad 0.5 del rendimiento al déficit de mano de obra, el amortiguamiento 0.5 de las pérdidas por la regeneración y la ganancia 0.5 de regeneración por adopción son supuestos.','The 0.5 elasticity of yield to labour shortfall, the 0.5 damping of losses by regeneration and the 0.5 regeneration gain from adoption are assumptions.')} IR₀ = ${fmt(sim.IR0,2)}.</p>
   <p class="fuente">${T('Fuentes','Sources')}: IPCC (2018), SR1.5, SPM A.1 · Zhao C, et al. (2017) PNAS 114(35): 9326–9331 · Rogers EM (2003) · Godet M, Durance P (2007).</p></div>
  ${siguiente('prospectiva')}`;
  const guardaP=()=>{ guardar(); render(); };
  $$('[data-pe]',el).forEach(i=>i.onchange=()=>{ const v=+i.value; if(!isFinite(v)) return; S.prosp=S.prosp||{}; S.prosp.esc=S.prosp.esc||{}; (S.prosp.esc[i.dataset.pe]=S.prosp.esc[i.dataset.pe]||{})[i.dataset.pk]=v; guardaP(); });
  $$('[data-pc]',el).forEach(i=>i.onchange=()=>{ const v=+i.value; if(!isFinite(v)) return; S.prosp=S.prosp||{}; S.prosp[i.dataset.pc]=v; guardaP(); });
  $('#pReset',el).onclick=()=>{ S.prosp=null; guardaP(); toast(T('Supuestos iniciales','Default assumptions')); };
  enlazarTips(el); }
function informeProspectiva(){ const sim=simularProspectiva(), lec=lecturaProsp(sim);
  return `<div class="card"><h3>${T('Prospectiva a 2, 5 y 10 años','Outlook at 2, 5 and 10 years')}</h3>
   <div class="prosp-grid inf">${IND_PROSP.map(ind=>`<div class="pg"><b>${esc(tx(ind.n))}</b><p class="nota" style="margin:0 0 4px">${esc(tx(ind.u))}</p>${graficaProsp(sim, ind.k)}</div>`).join('')}</div>
   <div class="leyenda-esc">${sim.res.map(r=>`<span><i style="background:${r.col}"></i>${esc(tx(r.n))}</span>`).join('')}</div>
   ${tablaHorizontes(sim, ['Y','rel','neto','Ld','A','IS'])}
   <div class="grid g2"><div><b>${T('Potencialidades','Potentials')}</b><ul>${lec.pot.map(x=>`<li>${x}</li>`).join('')}</ul></div><div><b>${T('Perspectivas no deseadas','Undesired prospects')}</b><ul>${lec.rie.map(x=>`<li>${x}</li>`).join('')}</ul></div></div>
   <p class="nota">${T('Escenarios exploratorios con supuestos explícitos (ver el bloque Prospectiva); no son pronósticos.','Exploratory scenarios with explicit assumptions (see the Outlook block); not forecasts.')}</p></div>`; }
