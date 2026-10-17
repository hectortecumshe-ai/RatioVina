"use strict";
/* =====================================================================
   Bloque 3 · CLIMA VITÍCOLA
   Con las temperaturas medias mensuales de la estación más cercana
   (p. ej., las normales climatológicas del Servicio Meteorológico
   Nacional) se calculan tres índices publicados:
   · Grados día de Winkler (Amerine y Winkler, 1944):
       W = Σ abr–oct max(0, Tmed − 10) · días del mes      [°C·día]
       Regiones: I < 1389 · II 1389–1667 · III 1667–1944 · IV 1944–2222 · V > 2222
   · Índice heliotérmico de Huglin (Huglin, 1978):
       HI = Σ abr–sep max(0, [(Tmed − 10) + (Tmax − 10)] / 2) · días · k ;  k = 1 bajo 40° de latitud
       Clases (Tonietto y Carbonneau, 2004): muy fresco ≤ 1500 · fresco 1500–1800 · templado 1800–2100 ·
       templado cálido 2100–2400 · cálido 2400–3000 · muy cálido > 3000
   · Índice de frescor nocturno (Tonietto y Carbonneau, 2004): CI = Tmín media de septiembre
       noches muy frescas ≤ 12 · frescas 12–14 · templadas 14–18 · cálidas > 18
   Los tres índices se desarrollaron para la viticultura templada; en climas
   sin invierno marcado se leen con cautela (lectura de Ratio Viña).
   ===================================================================== */
const DIAS_MES = [31,28,31,30,31,30,31,31,30,31,30,31];
const MES_N = ()=> [...Array(12)].map((_,i)=>new Date(2026,i,1).toLocaleDateString(LOC(),{month:'short'}).replace('.',''));
const _num = v=> v===''||v==null||!isFinite(+v) ? null : +v;
function climaMeses(){ const c=S.clima||{}; return [...Array(12)].map((_,i)=>{ const mx=_num((c.tmax||[])[i]), mn=_num((c.tmin||[])[i]); let md=_num((c.tmed||[])[i]), calc=false;
  if(md==null && mx!=null && mn!=null){ md=(mx+mn)/2; calc=true; } return {i, tmax:mx, tmin:mn, tmed:md, calc}; }); }
const CLASE_W = [[1389,'I',E('Región I · fresca','Region I · cool')],[1667,'II',E('Región II','Region II')],[1944,'III',E('Región III · templada','Region III · temperate')],[2222,'IV',E('Región IV','Region IV')],[1e9,'V',E('Región V · cálida','Region V · hot')]];
const CLASE_HI = [[1500,E('Muy fresco','Very cool')],[1800,E('Fresco','Cool')],[2100,E('Templado','Temperate')],[2400,E('Templado cálido','Warm temperate')],[3000,E('Cálido','Warm')],[1e9,E('Muy cálido','Very warm')]];
const CLASE_CI = [[12,E('Noches muy frescas','Very cool nights')],[14,E('Noches frescas','Cool nights')],[18,E('Noches templadas','Temperate nights')],[1e9,E('Noches cálidas','Warm nights')]];
const clase = (tabla, v)=> v==null ? null : tabla.find(x=>v<=x[0]) || tabla[tabla.length-1];
function indicesClima(){ const M=climaMeses(), win=[3,4,5,6,7,8,9], hug=[3,4,5,6,7,8];
  const W = win.every(i=>M[i].tmed!=null) ? win.reduce((s,i)=>s+Math.max(0,M[i].tmed-10)*DIAS_MES[i],0) : null;
  const HI = hug.every(i=>M[i].tmed!=null&&M[i].tmax!=null) ? hug.reduce((s,i)=>s+Math.max(0,((M[i].tmed-10)+(M[i].tmax-10))/2)*DIAS_MES[i],0) : null;   // k = 1 (latitud < 40°)
  const CI = M[8].tmin;
  const frio = Math.min(...M.map(x=>x.tmed).filter(x=>x!=null));
  return {M, W, HI, CI, cW:clase(CLASE_W,W), cHI:clase(CLASE_HI,HI), cCI:clase(CLASE_CI,CI), sinInvierno: isFinite(frio) && frio>=15, nMed:M.filter(x=>x.tmed!=null).length}; }
/* Gráfica mensual: Tmín, Tmed y Tmáx con el umbral de 10 °C y la temporada de Winkler (abr–oct) */
function graficaClima(M){ const W=640, H=270, L=44, B=30, Tp=14, xs=i=>L+(i+.5)*(W-L-10)/12, vals=M.flatMap(m=>[m.tmax,m.tmin,m.tmed]).filter(v=>v!=null);
  if(!vals.length) return `<div class="empty"><p>${T('Captura las temperaturas para ver la gráfica.','Enter temperatures to see the chart.')}</p></div>`;
  const lo=Math.min(0,Math.floor(Math.min(...vals)/5)*5), hi=Math.max(35,Math.ceil(Math.max(...vals)/5)*5), y=v=>Tp+(H-B-Tp)*(1-(v-lo)/(hi-lo));
  let s=`<svg class="chart clima-g" viewBox="0 0 ${W} ${H}" role="img" aria-label="${T('Temperaturas mensuales','Monthly temperatures')}">`;
  s+=`<rect x="${xs(3)-(W-L-10)/24}" y="${Tp}" width="${7*(W-L-10)/12}" height="${H-B-Tp}" fill="var(--ok-soft)"/><text x="${xs(6)}" y="${Tp+12}" text-anchor="middle" font-size="11" class="m">${T('temporada de Winkler (abr–oct)','Winkler season (Apr–Oct)')}</text>`;
  for(let v=lo; v<=hi; v+=5) s+=`<line x1="${L}" x2="${W-10}" y1="${y(v)}" y2="${y(v)}" stroke="var(--border)"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end" font-size="11" class="m">${v}°</text>`;
  s+=`<line x1="${L}" x2="${W-10}" y1="${y(10)}" y2="${y(10)}" stroke="var(--accent)" stroke-dasharray="5 4"/><text x="${W-12}" y="${y(10)-4}" text-anchor="end" font-size="11" fill="var(--accent-text)">${T('umbral 10 °C','10 °C threshold')}</text>`;
  const linea=(k,col,dash)=>{ const p=M.filter(m=>m[k]!=null).map(m=>`${xs(m.i).toFixed(1)},${y(m[k]).toFixed(1)}`); return p.length>1?`<polyline points="${p.join(' ')}" fill="none" stroke="${col}" stroke-width="2.6" ${dash?'stroke-dasharray="4 3"':''}/>`:''; };
  s+=linea('tmax','#c43a2f')+linea('tmed','#7a4f9a')+linea('tmin','#2d78b0');
  M.forEach(m=>['tmax','tmed','tmin'].forEach((k,j)=>{ if(m[k]!=null) s+=`<circle cx="${xs(m.i)}" cy="${y(m[k])}" r="3.4" fill="${['#c43a2f','#7a4f9a','#2d78b0'][j]}" ${k==='tmed'&&m.calc?'fill-opacity=".4"':''}><title>${MES_N()[m.i]} · ${fmt(m[k],1)} °C</title></circle>`; }));
  MES_N().forEach((n,i)=>s+=`<text x="${xs(i)}" y="${H-10}" text-anchor="middle" font-size="11.5" class="m">${n}</text>`);
  return s+'</svg>'; }
/* Escala de Winkler con marcador */
function escalaWinkler(W){ const A=600, x0=20, lim=[1000,1389,1667,1944,2222,2800], xs=v=>x0+(A-40)*(Math.min(Math.max(v,lim[0]),lim[5])-lim[0])/(lim[5]-lim[0]), cols=['#2d78b0','#5f9ec4','#7fb35a','#e0a33a','#c43a2f'];
  let s=`<svg class="chart" viewBox="0 0 ${A} 74" role="img" aria-label="${T('Regiones de Winkler','Winkler regions')}">`;
  for(let k=0;k<5;k++){ const a=xs(lim[k]), b=xs(lim[k+1]); s+=`<rect x="${a}" y="20" width="${b-a-2}" height="18" rx="4" fill="${cols[k]}" fill-opacity=".75"/><text x="${(a+b)/2}" y="33" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">${CLASE_W[k][1]}</text>`; }
  [1389,1667,1944,2222].forEach(v=>s+=`<text x="${xs(v)}" y="54" text-anchor="middle" font-size="10.5" class="m">${fmt(v,0)}</text>`);
  if(W!=null) s+=`<path d="M${xs(W)} 16 l-7 -12 h14z" fill="var(--text)"/><text x="${xs(W)}" y="70" text-anchor="middle" font-size="11.5" font-weight="700">${fmt(W,0)} °C·d</text>`;
  return s+'</svg>'; }
function renderClima(el){ const R=indicesClima(), M=R.M, c=S.clima;
  const celda=(k,i)=>`<td><input type="number" step="0.1" data-cl="${k}|${i}" value="${(c[k]||[])[i]??''}" aria-label="${k} ${MES_N()[i]}" placeholder="${k==='tmed'&&M[i].calc?fmt(M[i].tmed,1):'—'}"></td>`;
  const kpi=(t,v,u,cl,nota)=>`<div class="kpi"><div class="l">${t}</div><div class="v">${v==null?'—':fmt(v,v>100?0:1)}<small style="font-size:14px;color:var(--muted)"> ${u}</small></div><div class="s">${cl?`<span class="badge info">${esc(cl)}</span>`:`<span class="sin-llenar">${T('faltan meses','months missing')}</span>`} ${nota||''}</div></div>`;
  el.innerHTML=`${cabecera('clima',T('La vid responde al calor acumulado durante su temporada, a la luz y a la temperatura de las noches de maduración. Con las temperaturas medias de cada mes de tu estación más cercana, Ratio Viña calcula los tres índices con que se clasifican las regiones vitícolas del mundo.','The vine responds to heat accumulated over its season, to light and to the temperature of ripening nights. With your nearest station’s monthly mean temperatures, Ratio Viña computes the three indices used to classify the world’s wine regions.'))}
  ${consejo(T('Busca las normales climatológicas de la estación más cercana (Servicio Meteorológico Nacional) y copia la temperatura máxima, media y mínima de cada mes. Si no tienes la media, déjala vacía: se calcula con la máxima y la mínima.','Look up the climate normals of the nearest station (National Weather Service) and copy each month’s maximum, mean and minimum temperature. If you lack the mean, leave it blank: it is computed from maximum and minimum.'),
    T('W = Σ abr–oct max(0, Tmed − 10)·días (Amerine y Winkler, 1944). HI = Σ abr–sep max(0, [(Tmed − 10) + (Tmáx − 10)]/2)·días·k, k = 1 bajo 40° (Huglin, 1978). CI = Tmín de septiembre (Tonietto y Carbonneau, 2004). Hemisferio norte.','W = Σ Apr–Oct max(0, Tmean − 10)·days (Amerine & Winkler, 1944). HI = Σ Apr–Sep max(0, [(Tmean − 10) + (Tmax − 10)]/2)·days·k, k = 1 below 40° (Huglin, 1978). CI = September Tmin (Tonietto & Carbonneau, 2004). Northern hemisphere.'))}
  <div class="card"><h3>${T('Temperaturas mensuales (°C)','Monthly temperatures (°C)')}</h3><div class="tbl-c"><table class="tbl clima-t"><thead><tr><th></th>${MES_N().map((n,i)=>`<th class="${i>=3&&i<=9?'temp':''}">${n}</th>`).join('')}</tr></thead>
    <tbody><tr><th>${T('Máxima','Maximum')}</th>${M.map((_,i)=>celda('tmax',i)).join('')}</tr><tr><th>${T('Media','Mean')}</th>${M.map((_,i)=>celda('tmed',i)).join('')}</tr><tr><th>${T('Mínima','Minimum')}</th>${M.map((_,i)=>celda('tmin',i)).join('')}</tr></tbody></table></div>
    <label class="f" style="margin-top:8px"><span>${T('Fuente de los datos','Data source')}</span><input id="clF" value="${esc(c.fuente||'')}" placeholder="${T('p. ej., SMN, normales 1991–2020, estación 00000','e.g., SMN, 1991–2020 normals, station 00000')}"></label>
    <p class="nota">${T('Los meses sombreados (abril a octubre) son los que usan los índices. Las medias calculadas con máxima y mínima se ven en gris dentro de la casilla.','Shaded months (April to October) are the ones the indices use. Means computed from maximum and minimum show in grey inside the box.')}</p></div>
  <div class="kpis">${kpi(T('Grados día de Winkler','Winkler degree days')+ayuda('winkler'),R.W,'°C·d',R.cW?tx(R.cW[2]):null)}
   ${kpi(T('Índice de Huglin','Huglin index')+ayuda('huglin'),R.HI,'',R.cHI?tx(R.cHI[1]):null)}
   ${kpi(T('Frescor nocturno (sept.)','Cool night index (Sept.)')+ayuda('frescor'),R.CI,'°C',R.cCI?tx(R.cCI[1]):null)}</div>
  ${R.sinInvierno?`<div class="alert warn"><p><b>${T('Clima sin invierno marcado.','Climate without a marked winter.')}</b> ${T('Ningún mes baja de 15 °C de media. Los tres índices se crearon para la viticultura templada; aquí la vid puede no entrar en reposo y dar dos cosechas al año. Léelos con cautela.','No month has a mean below 15 °C. The three indices were built for temperate viticulture; here the vine may not go dormant and can give two harvests a year. Read them with caution.')} ${marcaInterp()}</p></div>`:''}
  <div class="grid g2"><div class="card"><h3>${T('El año de tu viñedo','Your vineyard’s year')}</h3>${graficaClima(M)}<p class="nota"><span style="color:#c43a2f">●</span> ${T('máxima','maximum')} · <span style="color:#7a4f9a">●</span> ${T('media','mean')} · <span style="color:#2d78b0">●</span> ${T('mínima','minimum')}</p></div>
   <div class="card"><h3>${T('¿En qué región de Winkler está?','Which Winkler region is it in?')}${ayuda('winkler')}</h3>${escalaWinkler(R.W)}
     <div class="tbl-c"><table class="tbl winkler-t"><tbody>
      <tr><td>I · &lt; 1389</td><td>${T('Fresca: vinos blancos y tintos ligeros de variedades tempranas.','Cool: white wines and light reds from early varieties.')}</td></tr>
      <tr><td>II–III · 1389–1944</td><td>${T('Templada: tintos con cuerpo y blancos.','Temperate: full reds and whites.')}</td></tr>
      <tr><td>IV–V · &gt; 1944</td><td>${T('Cálida: uva de mesa, pasa, vinos generosos y variedades tardías.','Warm: table grapes, raisins, fortified wines and late varieties.')}</td></tr></tbody></table></div>
     <div class="fuente">${T('Fuentes','Sources')}: Amerine y Winkler (1944); Huglin (1978); Tonietto y Carbonneau (2004). ${T('La orientación por región es la clásica de Winkler et al. (1974).','The guidance by region is the classic one of Winkler et al. (1974).')}</div></div></div>
  ${siguiente('clima')}`;
  $$('[data-cl]',el).forEach(inp=>inp.onchange=()=>{ const [k,i]=inp.dataset.cl.split('|'); S.clima[k]=S.clima[k]||Array(12).fill(''); S.clima[k][+i]=inp.value;
    renderClima.foco = +i<11 ? k+'|'+(+i+1) : null; guardar(); render(); });
  if(renderClima.foco){ const f=$(`[data-cl="${renderClima.foco}"]`,el); renderClima.foco=null; if(f){ f.focus({preventScroll:true}); f.select(); } }
  $('#clF',el).onchange=e=>{ S.clima.fuente=e.target.value; guardar(); }; }
