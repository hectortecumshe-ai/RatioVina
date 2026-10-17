"use strict";
/* =====================================================================
   Ventana «Guía de llenado» de cada bloque.
   Ratio Viña no tiene un caso publicado que mostrar: en lugar de datos de
   otra localidad, la ventana explica qué se captura en el bloque, de dónde
   sacar el dato y cómo llenarlo. Es solo de consulta: no toca los campos.
   ===================================================================== */
const _li = a => '<ul>'+a.map(x=>`<li>${x}</li>`).join('')+'</ul>';
const _ol = a => '<ol>'+a.map(x=>`<li>${x}</li>`).join('')+'</ol>';
const GUIA = {
  cultivo: ()=>({
    que: _li([T('Para qué cultivas la uva: mesa, vino, pasa, jugo o varios destinos.','What you grow grapes for: table, wine, raisins, juice or several.'),
      T('La variedad principal y el portainjerto, tal como los conoces.','The main variety and rootstock, as you know them.'),
      T('El sistema de conducción, la edad del viñedo y las plantas por hectárea.','The training system, vineyard age and vines per hectare.'),
      T('El sistema de producción, el tipo de unidad y la superficie.','The production system, unit type and area.')]),
    donde: T('Tu propio viñedo; la factura del vivero o la etiqueta de la planta para la variedad y el portainjerto.','Your own vineyard; the nursery invoice or plant label for variety and rootstock.'),
    pasos: _ol([T('Elige el destino: orienta las preguntas del Bloque 5.','Choose the destination: it guides Block 5 questions.'),
      T('Toca tu variedad y tu portainjerto en las listas, o escríbelos si no aparecen.','Tap your variety and rootstock in the lists, or type them if missing.'),
      T('Elige el sistema de conducción y anota la edad y la densidad.','Choose the training system and enter age and density.'),
      T('Marca el sistema de producción y completa la unidad.','Mark the production system and complete the unit.')])}),
  region: ()=>({
    que: _li([T('Estado, municipio y localidad del viñedo.','State, municipality and locality of the vineyard.')]),
    donde: T('El catálogo del INEGI ya viene en la app: solo eliges.','INEGI’s catalogue is built into the app: you just choose.'),
    pasos: _ol([T('Elige el estado; la región se asigna sola.','Choose the state; the region is set automatically.'),
      T('Elige el municipio y luego la localidad: verás su altitud y su punto en el mapa.','Choose the municipality, then the locality: you will see its altitude and map point.'),
      T('Si tu localidad no aparece, elige la más cercana y anótalo en las notas.','If your locality is missing, pick the nearest one and note it.')])}),
  clima: ()=>({
    que: _li([T('Temperatura máxima, media y mínima de cada mes (°C).','Monthly maximum, mean and minimum temperature (°C).'),
      T('Para los índices bastan abril a octubre (media), abril a septiembre (máxima) y septiembre (mínima).','The indices need April–October (mean), April–September (maximum) and September (minimum).')]),
    donde: T('Las normales climatológicas de la estación más cercana del Servicio Meteorológico Nacional, o los registros de tu propia estación.','Climate normals from the nearest National Weather Service station, or your own station’s records.'),
    pasos: _ol([T('Copia los valores mes por mes; la casilla siguiente se activa sola.','Copy the values month by month; the next box activates by itself.'),
      T('Anota la fuente (estación y periodo).','Record the source (station and period).'),
      T('Lee tu región de Winkler, tu clase de Huglin y tus noches de maduración.','Read your Winkler region, Huglin class and ripening nights.')])}),
  requerimientos: ()=>({
    que: _li([T('Si tu viñedo cumple cada uno de los seis requerimientos base (sí, parcial, no).','Whether your vineyard meets each of the six baseline requirements (yes, partly, no).'),
      T('Los requerimientos que tu localidad ha innovado, con su fuente.','Requirements your locality has innovated, with their source.')]),
    donde: T('La experiencia del viticultor, del asesor técnico y de la asociación.','The grower’s, the adviser’s and the association’s experience.'),
    pasos: _ol([T('Responde los seis requerimientos con honestidad: «parcial» también es una buena respuesta.','Answer the six requirements honestly: “partly” is a fine answer too.'),
      T('Agrega lo nuevo: análisis de savia, sensores de humedad, bioinsumos, variedades nuevas…','Add what is new: sap analysis, moisture sensors, bio-inputs, new varieties…'),
      T('Anota siempre quién lo propuso o dónde se publicó.','Always record who proposed it or where it was published.')])}),
  manejo: ()=>({
    que: _li([T(`Para cada una de las ${N_ACT_STACK()} actividades del cuestionario base: si la practicas o no.`,`For each of the ${N_ACT_STACK()} baseline activities: whether you practise it or not.`),
      T('Las fechas de las labores principales: poda, brotación, floración, envero y cosecha.','Dates of the main tasks: pruning, budburst, flowering, veraison and harvest.'),
      T('Las actividades propias o innovadoras de tu viñedo.','Your vineyard’s own or innovative activities.')]),
    donde: T('El calendario de trabajo del viñedo y la memoria de quienes lo trabajan.','The vineyard’s work calendar and the memory of those who work it.'),
    pasos: _ol([T('Abre las etapas en orden, del reposo a la poscosecha.','Open the stages in order, from dormancy to post-harvest.'),
      T('Contesta «Sí la practico» o «No»; usa «Todas sí» o «Todas no» si aplica a todo el paso.','Answer “Yes, I do” or “No”; use “All yes” or “All no” for a whole step.'),
      T('Pon las fechas de cada paso: alimentan el calendario circular.','Set each step’s dates: they feed the circular calendar.'),
      T('Con «+ Actividad innovadora» agrega lo que haces diferente y elige sus elementos.','Use “+ Innovative activity” for what you do differently and choose its elements.')])}),
  regeneracion: ()=>({
    que: _li([T('Ocho perillas de 0 a 4: labranza, cubierta, diversidad, raíces vivas, animales, insumos de síntesis, materia orgánica y saber local.','Eight 0–4 knobs: tillage, cover, diversity, living roots, animals, synthetic inputs, organic matter and local knowledge.')]),
    donde: T('Tus respuestas del Bloque 5 (la app sugiere un valor) y, si los tienes, tus análisis de suelo.','Your Block 5 answers (the app suggests a value) and, if you have them, your soil tests.'),
    pasos: _ol([T('Revisa cada sugerencia: si corresponde, toca «Aceptar sugerencia»; si no, mueve la perilla.','Check each suggestion: if it fits, tap “Accept suggestion”; if not, move the knob.'),
      T('Si tienes dos análisis de suelo, anota la materia orgánica de antes y de ahora.','If you have two soil tests, enter organic matter before and now.'),
      T('Guarda una línea base y vuelve el siguiente ciclo.','Save a baseline and come back next cycle.')])}),
  riesgos: ()=>({
    que: _li([T('Para cada amenaza: si aplica, qué tan probable es (1–5), cuánto daño haría (1–5) y qué control ya tienes.','For each hazard: whether it applies, its likelihood (1–5), its damage (1–5) and the control you already have.')]),
    donde: T('Lo que ha pasado en tu viñedo en los últimos diez años: heladas, granizo, plagas, precios.','What has happened in your vineyard over the last ten years: frost, hail, pests, prices.'),
    pasos: _ol([T('Desmarca las amenazas que no aplican.','Untick hazards that do not apply.'),
      T('Mueve probabilidad e impacto, o acepta la sugerencia si corresponde.','Move likelihood and impact, or accept the suggestion if it fits.'),
      T('Indica el control: seguro, malla, riego de auxilio, venta anticipada, organización.','Set the control: insurance, netting, relief irrigation, forward sale, organisation.')])}),
  elementos: ()=>({
    que: _li([T('Quién y qué interviene en el viñedo, por categoría.','Who and what takes part in the vineyard, by category.')]),
    donde: T('Recorre cada etapa y pregunta: ¿quién lo hace?, ¿qué se usa?, ¿quién compra?, ¿qué institución apoya?','Go through each stage and ask: who does it? what is used? who buys? which institution supports?'),
    pasos: _ol([T('Revisa las diez categorías.','Review the ten categories.'),
      T('Agrega los elementos de tu viñedo que falten.','Add your vineyard’s missing elements.'),
      T('Marca «Ya revisé los elementos de mi sistema».','Tick “I have reviewed my system’s elements”.')])}),
  precios: ()=>({
    que: _li([T('Precio, unidad y cantidad por hectárea de lo que compras o vendes.','Price, unit and amount per hectare of what you buy or sell.'),
      T('El valor de 0 a 5 de cada elemento: económico, de uso, cultural y ecológico.','Each element’s 0–5 value: economic, use, cultural and ecological.')]),
    donde: T('Tus notas de compra y venta del último ciclo.','Your purchase and sales records from the last cycle.'),
    pasos: _ol([T('Empieza por los recursos financieros: costo total e ingreso por hectárea.','Start with financial resources: total cost and income per hectare.'),
      T('Sigue con insumos y equipo.','Continue with inputs and equipment.'),
      T('Califica el valor aunque el elemento no tenga precio (el saber, la familia, el suelo).','Rate value even if the element has no price (knowledge, family, soil).')])}),
  formulacion: ()=>({
    que: _li([T('Nada que capturar: aquí se teje la red con lo que ya llenaste.','Nothing to enter: the network is woven from what you already filled in.')]),
    donde: T('Los bloques 1 a 9.','Blocks 1 to 9.'),
    pasos: _ol([T('Toca «Tejer el sistema».','Tap “Weave the system”.'),
      T('Si algo se ve raro, vuelve al bloque correspondiente y corrige.','If something looks odd, go back to the relevant block and fix it.')])}),
  tablero: ()=>({
    que: _li([T('Lectura de la red: quién sostiene el viñedo, qué grupos se forman y cuándo se hace cada labor.','Reading the network: who holds the vineyard together, which groups form and when each task is done.')]),
    donde: T('Se calcula con tus datos.','Computed from your data.'),
    pasos: _ol([T('Mira primero los nodos de mayor grado e intermediación.','First look at the nodes with the highest degree and betweenness.'),
      T('Revisa las comunidades y el cladograma.','Check the communities and the cladogram.'),
      T('Usa el calendario circular para ver si las labores se enciman.','Use the circular calendar to see whether tasks overlap.')])}),
  sostenible: ()=>({
    que: _li([T('Litros de diésel, kg de nitrógeno y de urea, y rendimiento por hectárea, para la huella de carbono.','Litres of diesel, kg of nitrogen and urea, and yield per hectare, for the carbon footprint.')]),
    donde: T('Tus registros de combustible y fertilización del ciclo.','Your fuel and fertilising records for the cycle.'),
    pasos: _ol([T('Revisa el efecto de cada labor sobre suelo, agua, atmósfera, vegetación y fauna.','Review each task’s effect on soil, water, atmosphere, vegetation and fauna.'),
      T('Captura los datos de la huella.','Enter the footprint data.'),
      T('Completa el Bloque 9 para la dimensión económica de Sarandón.','Complete Block 9 for Sarandón’s economic dimension.')])}),
  prospectiva: ()=>({
    que: _li([T('Supuestos de cada escenario: precio, costo, calentamiento, años extremos, mano de obra y adopción.','Each scenario’s assumptions: price, cost, warming, extreme years, labour and adoption.')]),
    donde: T('Tu experiencia y la de tu región; los valores iniciales son supuestos editables.','Your and your region’s experience; starting values are editable assumptions.'),
    pasos: _ol([T('Revisa los supuestos y ajústalos a tu región.','Review the assumptions and adjust them to your region.'),
      T('Compara los tres futuros a 2, 5 y 10 años.','Compare the three futures at 2, 5 and 10 years.')])}),
  informe: ()=>({
    que: _li([T('Nada que capturar: es el resumen de tu viñedo.','Nothing to enter: it is your vineyard’s summary.')]),
    donde: '—',
    pasos: _ol([T('Imprime o guarda en PDF.','Print or save as PDF.'),
      T('Toca «Guardar proyecto» para obtener el archivo .vina.json de tu viñedo: es el que se junta en el atlas.','Tap “Save project” to get your vineyard’s .vina.json file: it is the one combined in the atlas.')])}),
  atlas: ()=>({
    que: _li([T('Los archivos .vina.json de muchos viñedos.','The .vina.json files of many vineyards.')]),
    donde: T('Quien coordina el estudio los reúne de cada encuestador.','The study coordinator gathers them from each surveyor.'),
    pasos: _ol([T('Toca «Agregar archivos» y elige varios a la vez.','Tap “Add files” and choose several at once.'),
      T('Exporta el atlas para compartirlo o seguir agregando.','Export the atlas to share it or keep adding.')])})
};
function ejemploCalpan(id){   // (nombre conservado por compatibilidad) recuadro con el botón de la guía
  if(EJ || !GUIA[id]) return '';
  return `<div class="ejemplo-calpan aparece no-print"><span class="ej-ico">${ill('c-uva')}</span><div class="ej-txt">
    <div class="ej-k">${T('¿No sabes cómo llenarlo?','Not sure how to fill it in?')}</div>
    <p class="nota" style="margin:2px 0 6px">${T('Una guía corta de este bloque: qué se captura, de dónde sacar el dato y cómo llenarlo. Se abre aparte y no cambia tus datos.','A short guide to this block: what to enter, where to find the data and how to fill it in. It opens separately and does not change your data.')}</p>
    <button class="btn ghost sm" data-ejemplo="${id}">${T('Ver la guía de llenado','See the filling guide')} →</button></div></div>`; }
function abrirEjemplo(id){ const g=GUIA[id](); let d=$('#dlgEjemplo');
  if(!d){ d=document.createElement('dialog'); d.id='dlgEjemplo'; d.className='dlg-ejemplo'; document.body.appendChild(d); d.addEventListener('click',ev=>{ if(ev.target===d) d.close(); }); }
  d.innerHTML=`<div class="marca-agua" aria-hidden="true">${T('GUÍA · SOLO CONSULTA','GUIDE · REFERENCE ONLY')}</div>
   <div class="dh"><h2>${ill('c-uva','','width:30px;height:36px;vertical-align:middle;margin-right:6px')}${T('Guía de llenado','Filling guide')} · ${esc(tx(B(id).corto))}</h2><button class="ibtn round" onclick="this.closest('dialog').close()" aria-label="×">✕</button></div>
   <div class="db ej-dlg"><p class="ej-aviso">${T('Es solo de consulta: al cerrar esta ventana, tus campos siguen exactamente como los dejaste.','For reference only: when you close this window your fields stay exactly as you left them.')}</p>
   <h3>${T('Qué se captura','What you enter')}</h3>${g.que}
   <h3>${T('De dónde sacar el dato','Where to find the data')}</h3><p>${g.donde}</p>
   <h3>${T('Cómo llenarlo','How to fill it in')}</h3>${g.pasos}
   <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn" onclick="this.closest('dialog').close()">${T('Cerrar y volver a mis datos','Close and return to my data')}</button><button class="btn ghost" data-entrar-ej>${T('Ver el caso publicado de Mata de Zarza','See the published Mata de Zarza case')}</button></div></div>`;
  d.showModal(); }
document.addEventListener('click',ev=>{ const t=ev.target.closest('[data-ejemplo]'); if(t) abrirEjemplo(t.dataset.ejemplo); });
function ponerEjemplo(id, el){ const h=ejemploCalpan(id); if(!h) return; const cab=$('.bhead',el); if(cab) cab.insertAdjacentHTML('afterend',h); else el.insertAdjacentHTML('beforeend',h); }
