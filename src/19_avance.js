"use strict";
/* =====================================================================
   Llenado por el usuario, modo ejemplo y bloques sin datos.
   - avance(id): cuántos campos de un bloque llenó la persona (nunca cuenta
     sugerencias ni el ejemplo publicado) → Pendiente / En proceso / Completo.
   - Modo ejemplo: carga el caso publicado de Mata de Zarza (Mojica-Zárate et al., 2026; 18b_matazarza.js)
     en un estado aparte que no se guarda; una franja fija lo anuncia y el
     proyecto del usuario queda intacto.
   - Los bloques de resultados sin actividades muestran qué falta en vez de
     resultados vacíos.
   ===================================================================== */
const BLOQUES_LLENAR = ['cultivo','region','clima','requerimientos','manejo','regeneracion','riesgos','elementos','precios'];
const BLOQUES_RESULTADO = ['formulacion','tablero','sostenible','prospectiva','informe'];
function avance(id){ let h=0, t=0, nota='';
  if(id==='cultivo'){ const c=[!!S.vidDestino, !!S.vidVar, !!S.vidCond, !!S.sistema, S.tipoUP!==''&&S.tipoUP!=null, +S.superficie>0]; t=c.length; h=c.filter(Boolean).length; }
  else if(id==='clima'){ const cl=S.clima||{}, ok=(a,i)=>a&&a[i]!==''&&a[i]!=null&&isFinite(+a[i]); const req=[...[3,4,5,6,7,8,9].map(i=>ok(cl.tmed,i)), ...[3,4,5,6,7,8].map(i=>ok(cl.tmax,i)), ok(cl.tmin,8)]; t=req.length; h=req.filter(Boolean).length; }
  else if(id==='region'){ const c=[!!S.edo, !!S.mun, !!S.loc]; t=3; h=c.filter(Boolean).length; }
  else if(id==='requerimientos'){ if(conStack()){ t=REQ_TRAD.length; h=REQ_TRAD.filter((r,i)=>(S.reqEst||{})[i]).length; } else { t=1; h=S.reqInn.length?1:0; } }
  else if(id==='manejo'){ if(conStack()){ t=N_ACT_STACK(); h=PASOS.reduce((s,p)=>s+p.a.filter(a=>manejoDe(p.n).resp[a[0]]).length,0); }
    else { t=1; h=actividades().length?1:0; } }
  else if(id==='regeneracion'){ t=REGEN_IND.length; h=Object.keys(S.regen||{}).filter(k=>S.regen[k]!==''&&S.regen[k]!=null).length; }
  else if(id==='riesgos'){ t=RIESGOS.length; const U=S.riesgo||{}; h=RIESGOS.filter(d=>{ const u=U[d.id]||{}; return u.off===true||u.ok===true||(u.p!=null&&u.i!=null); }).length; }
  else if(id==='elementos'){ t=1; h=(S.revisado||{}).elementos?1:0; }
  else if(id==='precios'){ const ids=Object.keys(participacion()); t=ids.length; h=ids.filter(k=>{ const v=S.valor[k]||{}, p=S.precio[k]||{}; return ['eco','uso','cul','eia'].some(d=>v[d]!==''&&v[d]!=null) || (p.p!==''&&p.p!=null); }).length;
    if(!t) nota=T('primero responde el Bloque 5','first answer Block 5'); }
  else return null;
  const f=t?h/t:0, estado=!h?'pend':h>=t?'ok':'proc';
  return {h, t, f, estado, nota, txt:{pend:T('Pendiente','Pending'), proc:T('En proceso','In progress'), ok:T('Completo','Complete')}[estado]}; }
function avanceTotal(){ const l=BLOQUES_LLENAR.map(avance).filter(Boolean); return l.reduce((s,a)=>s+a.f,0)/l.length; }
/* Franja de avance bajo el título de cada bloque que se llena */
function franjaAvance(id){ if(EJ) return `<div class="avance ej"><b>${T('Ejemplo publicado','Published example')}</b> · ${T('estos datos son del caso de Mata de Zarza, Veracruz; no son tuyos','these data are from the Mata de Zarza, Veracruz case; they are not yours')}</div>`;
  const a=avance(id); if(!a) return '';
  return `<div class="avance est-${a.estado}"><div class="av-barra"><i style="width:${100*a.f}%"></i></div><span><b>${a.h} ${T('de','of')} ${a.t}</b> ${T('llenados por ti','filled in by you')} · ${a.txt}${a.nota?' · '+esc(a.nota):''}</span></div>`; }

/* ---------- Estado de prueba (solo para Validación) ----------
   Ratio Viña no tiene un caso publicado: no hay modo ejemplo. Este estado,
   con todas las actividades del cuestionario respondidas «sí», solo sirve
   para comprobar el motor y la agregación del atlas; nunca se muestra como datos. */
function estadoPrueba(){ const s=estadoInicial();
  Object.assign(s, {sistema:'riego_tec', vidDestino:'vino', proyecto:{nombre:'prueba', productor:'', fecha:'2026-01-01', notas:''}});
  PASOS.forEach(p=>{ s.manejo[p.n]={resp:Object.fromEntries(p.a.map(a=>[a[0],'si'])), inn:[], imp:{}}; });
  return s; }
const estadoCalpan = estadoPrueba;   // nombre que usa el código común
/* entrarEjemplo y salirEjemplo: 18b_matazarza.js (caso publicado de Mata de Zarza) */
function franjaEjemplo(){ let f=$('#franjaEj'); if(!EJ){ if(f) f.remove(); return; }
  if(!f){ f=document.createElement('div'); f.id='franjaEj'; f.className='franja-ej no-print'; document.body.prepend(f); }
  f.innerHTML=`<span>⚑ <b>${T('Estás viendo el EJEMPLO publicado de Mata de Zarza, Veracruz.','You are viewing the published EXAMPLE of Mata de Zarza, Veracruz.')}</b> ${T('Tus datos no han cambiado y nada de esto se guarda.','Your data have not changed and nothing here is saved.')}</span><button class="btn sm" data-salir-ej>${T('Salir del ejemplo','Leave the example')} ✕</button>`; }
document.addEventListener('click',ev=>{ if(ev.target.closest('[data-entrar-ej]')){ const d=ev.target.closest('dialog'); if(d) d.close(); entrarEjemplo(); } if(ev.target.closest('[data-salir-ej]')) salirEjemplo(); });

/* ---------- Bloques de resultados sin datos ---------- */
function renderVacio(el, id){
  el.innerHTML=`${cabecera(id,'')}<div class="card vacio-res"><h2>${T('Todavía no hay datos tuyos para calcular este bloque','There are no data of yours to compute this block yet')}</h2>
   <p>${T('Los resultados se calculan solo con lo que tú llenas. Para empezar, responde en el Bloque 5 qué actividades practicas o agrega las tuyas.','Results are computed only from what you fill in. To start, answer in Block 5 which activities you practise or add your own.')}</p>
   <div class="vacio-lista">${BLOQUES_LLENAR.map(k=>{ const a=avance(k), b=B(k); return `<button class="vacio-item est-${a.estado}" data-ir="${k}"><span class="n">${b.n}</span><b>${esc(tx(b.corto))}</b><small>${a.h} / ${a.t} · ${a.txt}</small></button>`; }).join('')}</div>
   <div class="row" style="gap:10px;flex-wrap:wrap;margin-top:14px"><button class="btn" data-ir="manejo">${T('Ir al Bloque 5 · Manejo','Go to Block 5 · Management')} →</button><button class="btn ghost" data-entrar-ej>${T('Ver cómo se ve con el caso publicado (Mata de Zarza)','See how it looks with the published case (Mata de Zarza)')}</button></div></div>${siguiente(id)}`; }

/* ---------- Bloque sin campos propios: «ya lo revisé» ---------- */
function ponerRevisado(id, el){ if(id!=='elementos'||EJ) return; const ok=(S.revisado||{}).elementos, nx=$('.next',el);
  const h=`<div class="card revisado ${ok?'on':''} no-print"><label class="row" style="gap:10px;align-items:center;cursor:pointer"><input type="checkbox" id="chkRev" ${ok?'checked':''}><span><b>${T('Ya revisé los elementos de mi sistema','I have reviewed my system’s elements')}</b><br><small class="muted">${T('Márcalo cuando hayas agregado los que faltan; así este bloque cuenta como completo.','Tick it once you have added the missing ones; this block then counts as complete.')}</small></span></label></div>`;
  if(nx) nx.insertAdjacentHTML('beforebegin',h); else el.insertAdjacentHTML('beforeend',h);
  $('#chkRev',el).onchange=e=>{ S.revisado=S.revisado||{}; S.revisado.elementos=e.target.checked; guardar(); render(); }; }

/* ---------- Proyecto de la versión anterior ---------- */
function tarjetaAnterior(){ let visto=false; try{ visto=localStorage.getItem('vina_anterior_visto')==='1' || avanceTotal()>0; }catch(e){}
  const g=!EJ&&!visto?proyectoAnterior():null; if(!g) return '';
  return `<div class="alert warn" id="tAnterior"><p><b>${T('Hay un proyecto guardado con la versión anterior de Ratio Viña.','There is a project saved with the previous version of Ratio Viña.')}</b> ${T('En esa versión las actividades del caso de Calpan venían marcadas como practicadas. Si tú las revisaste, recupéralo; si no, empieza en blanco.','In that version the Calpan case activities came ticked as practised. If you reviewed them, recover it; if not, start blank.')}</p>
    <div class="row" style="gap:8px"><button class="btn sm" id="bRecup">${T('Recuperar mi proyecto','Recover my project')}</button><button class="btn sm ghost" id="bBlanco">${T('Empezar en blanco','Start blank')}</button></div></div>`; }
function enlazarAnterior(el){ const r=$('#bRecup',el), b=$('#bBlanco',el); if(!r) return;
  r.onclick=()=>{ S=migrarV2(proyectoAnterior()); S.bloque='inicio'; guardar(); try{ localStorage.setItem('vina_anterior_visto','1'); }catch(e){} render(); toast(T('Proyecto recuperado','Project recovered')); };
  b.onclick=()=>{ try{ localStorage.setItem('vina_anterior_visto','1'); }catch(e){} guardar(); render(); }; }
