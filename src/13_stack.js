"use strict";
/* =====================================================================
   1c. CUESTIONARIO BASE DE LA VID (Bloque 6 · Manejo)
   No existe todavía un Stack de conocimiento local publicado para la vid en
   México. Este cuestionario lo propone Ratio Viña («Lectura de Ratio Viña»):
   ordena el ciclo anual del viñedo según las etapas fenológicas principales
   de la escala BBCH para la vid (Lorenz et al., 1995) y reúne las labores
   que describen los textos de viticultura general (Winkler et al., 1974;
   Keller, 2020). Cada localidad lo responde (sí / no) y lo amplía con sus
   propias actividades; así se documenta su Stack.
   La cuarta posición de una actividad indica si es propia de un destino (mesa, vino).
   ===================================================================== */
const ART = {   // ficha del cuestionario (no es un artículo publicado)
  doi: '', cita: 'Ratio Viña (2026). Cuestionario base del ciclo anual de la vid, ordenado por etapas BBCH (Lorenz et al., 1995). Lectura de Ratio Viña.',
  periodo: '—', informantes: 0, pasos: 31, actividades: 52, reglas: 6
};
/* Etapas del ciclo (ocupan el lugar de las 5B de Ratio Viña). bbch: estadios principales que abarca */
const B5 = [
  {id:'reposo', es:'Reposo y poda', en:'Dormancy and pruning', col:'#7d5a2c', bbch:'97–00',
   d:['Del final de la caída de hojas a la yema de invierno: diagnóstico, poda, estructura y preparación del suelo.','From leaf fall to the winter bud: assessment, pruning, trellis and soil preparation.']},
  {id:'brotacion', es:'Brotación y crecimiento', en:'Budburst and shoot growth', col:'#5f8f3e', bbch:'01–19',
   d:['De la yema hinchada a las hojas desplegadas: riego, desbrote, amarre, nutrición y sanidad.','From swollen bud to unfolded leaves: irrigation, shoot thinning, tying, nutrition and plant health.']},
  {id:'floracion', es:'Floración y cuajado', en:'Flowering and fruit set', col:'#c98b21', bbch:'53–71',
   d:['De las inflorescencias visibles al cuajado: protección, reguladores en uva de mesa y raleo.','From visible inflorescences to fruit set: protection, growth regulators in table grapes and thinning.']},
  {id:'fruto', es:'Desarrollo del fruto y envero', en:'Berry development and veraison', col:'#7a4f9a', bbch:'71–83',
   d:['Del cuajado al envero: manejo del dosel, riego, anillado en uva de mesa y protección de racimos.','From fruit set to veraison: canopy management, irrigation, girdling in table grapes and cluster protection.']},
  {id:'cosecha', es:'Maduración y cosecha', en:'Ripening and harvest', col:'#b0303f', bbch:'85–89',
   d:['De la maduración a la vendimia: seguimiento de la madurez, cosecha, selección y transporte.','From ripening to harvest: ripeness monitoring, harvest, sorting and transport.']},
  {id:'poscosecha', es:'Poscosecha, destino y balance', en:'Post-harvest, destination and balance', col:'#8a8f86', bbch:'91–97',
   d:['Después de la cosecha: transformación, recuperación de reservas, venta, balance y transmisión del saber.','After harvest: processing, reserve recovery, sales, balance and passing on knowledge.']}
];
/* Pasos y actividades. a: [código, es, en, destino?]. Sin ventanas de fechas: cambian mucho entre regiones y las pone cada localidad. */
const PASOS = [
 {n:1, b:'reposo', es:'Diagnóstico del viñedo', en:'Vineyard assessment', a:[['A','Inspección de cepas, brazos y estructura','Inspection of vines, arms and trellis'],['B','Registro de rendimiento y problemas del ciclo anterior','Record of last cycle’s yield and problems']]},
 {n:2, b:'reposo', es:'Análisis de suelo y agua', en:'Soil and water analysis', a:[['C','Muestreo y análisis de suelo','Soil sampling and analysis'],['D','Análisis del agua de riego','Irrigation water analysis']]},
 {n:3, b:'reposo', es:'Poda invernal', en:'Winter pruning', a:[['E','Poda de producción con tijera','Production pruning with shears'],['F','Elección de cargadores o pulgares según la variedad','Choice of canes or spurs by variety'],['G','Retiro, triturado o incorporación de los sarmientos','Removal, shredding or incorporation of prunings']]},
 {n:4, b:'reposo', es:'Mantenimiento de la estructura', en:'Trellis maintenance', a:[['H','Revisión de postes, alambres y sistema de conducción','Check of posts, wires and training system'],['I','Reposición de plantas faltantes','Replanting of missing vines']]},
 {n:5, b:'reposo', es:'Ruptura de la dormancia', en:'Breaking dormancy', a:[['J','Aplicación de cianamida hidrogenada donde faltan horas frío','Hydrogen cyanamide where chilling is insufficient','mesa']]},
 {n:6, b:'reposo', es:'Manejo del suelo entre hileras', en:'Inter-row soil management', a:[['K','Rastreo o desvare entre hileras','Inter-row harrowing or mowing'],['L','Siembra o conservación de una cubierta vegetal','Sowing or keeping a cover crop'],['M','Aplicación de composta o estiércol','Compost or manure application']]},
 {n:7, b:'brotacion', es:'Riego de brotación', en:'Budburst irrigation', a:[['N','Riego o fertirriego al inicio de la brotación','Irrigation or fertigation at budburst']]},
 {n:8, b:'brotacion', es:'Desbrote', en:'Shoot thinning', a:[['O','Eliminación de brotes dobles, chupones y brotes del tronco','Removal of double shoots, suckers and trunk shoots']]},
 {n:9, b:'brotacion', es:'Amarre y posicionamiento de brotes', en:'Tying and shoot positioning', a:[['P','Amarre o acomodo de brotes en los alambres','Tying or positioning shoots on the wires']]},
 {n:10, b:'brotacion', es:'Nutrición', en:'Nutrition', a:[['Q','Fertilización al suelo o por fertirriego','Soil or fertigation fertilising'],['R','Fertilización foliar','Foliar fertilising']]},
 {n:11, b:'brotacion', es:'Monitoreo de plagas y enfermedades', en:'Pest and disease monitoring', a:[['S','Recorridos para detectar cenicilla, mildiu y plagas','Scouting for powdery mildew, downy mildew and pests'],['T','Consulta del pronóstico del clima para decidir aplicaciones','Checking the weather forecast to time sprays']]},
 {n:12, b:'brotacion', es:'Control de cenicilla y mildiu', en:'Powdery and downy mildew control', a:[['U','Aplicación de azufre','Sulfur application'],['V','Aplicación de fungicidas de síntesis','Synthetic fungicide application']]},
 {n:13, b:'brotacion', es:'Control de malezas', en:'Weed control', a:[['W','Deshierbe manual o mecánico en la hilera','Manual or mechanical in-row weeding'],['X','Aplicación de herbicida','Herbicide application']]},
 {n:14, b:'floracion', es:'Floración', en:'Flowering', a:[['Y','Aplicación de giberelinas u otros reguladores','Gibberellin or other regulator application','mesa'],['Z','Protección contra heladas tardías','Protection against late frost']]},
 {n:15, b:'floracion', es:'Raleo', en:'Thinning', a:[['ZA','Raleo de racimos','Cluster thinning'],['ZB','Raleo de bayas o despunte del racimo','Berry thinning or cluster tipping','mesa']]},
 {n:16, b:'fruto', es:'Anillado', en:'Girdling', a:[['ZC','Anillado del tronco o de los brazos','Trunk or arm girdling','mesa']]},
 {n:17, b:'fruto', es:'Manejo del dosel', en:'Canopy management', a:[['ZD','Deshoje en la zona de racimos','Leaf removal in the cluster zone'],['ZE','Despunte o recorte de brotes','Shoot topping or hedging']]},
 {n:18, b:'fruto', es:'Riego durante el desarrollo del fruto', en:'Irrigation during berry development', a:[['ZF','Riego según la demanda de la planta','Irrigation by vine demand'],['ZG','Riego deficitario controlado','Regulated deficit irrigation','vino']]},
 {n:19, b:'fruto', es:'Control de plagas', en:'Pest control', a:[['ZH','Aplicación de insecticidas contra plagas','Insecticide application against pests'],['ZI','Control biológico o bioinsumos','Biological control or bio-inputs']]},
 {n:20, b:'fruto', es:'Protección de racimos', en:'Cluster protection', a:[['ZJ','Malla antigranizo o contra aves','Hail or bird netting']]},
 {n:21, b:'cosecha', es:'Seguimiento de la madurez', en:'Ripeness monitoring', a:[['ZK','Muestreo de grados Brix y acidez','Sampling of Brix and acidity'],['ZL','Revisión de color, sabor y semilla','Checking colour, taste and seed']]},
 {n:22, b:'cosecha', es:'Decisión de cosecha', en:'Harvest decision', a:[['ZM','Fecha de cosecha según el destino y el mercado','Harvest date by destination and market']]},
 {n:23, b:'cosecha', es:'Cosecha o vendimia', en:'Harvest', a:[['ZN','Corte manual de racimos','Hand cutting of clusters'],['ZO','Cosecha mecánica','Mechanical harvest','vino']]},
 {n:24, b:'cosecha', es:'Selección y empaque', en:'Sorting and packing', a:[['ZP','Selección, limpieza y empaque en campo','Sorting, cleaning and field packing','mesa'],['ZQ','Preenfriamiento y cadena de frío','Pre-cooling and cold chain','mesa']]},
 {n:25, b:'cosecha', es:'Transporte', en:'Transport', a:[['ZR','Transporte a bodega, empacadora o mercado','Transport to winery, packing house or market']]},
 {n:26, b:'poscosecha', es:'Transformación', en:'Processing', a:[['ZS','Elaboración de vino, pasa, jugo o vinagre en la unidad','Making wine, raisins, juice or vinegar on the farm']]},
 {n:27, b:'poscosecha', es:'Recuperación de reservas', en:'Reserve recovery', a:[['ZT','Riego y fertilización poscosecha','Post-harvest irrigation and fertilising']]},
 {n:28, b:'poscosecha', es:'Sanidad poscosecha', en:'Post-harvest plant health', a:[['ZU','Aplicación preventiva después de la cosecha','Preventive spray after harvest']]},
 {n:29, b:'poscosecha', es:'Venta', en:'Sales', a:[['ZV','Venta a empacadora, bodega o intermediario','Sale to packing house, winery or middleman'],['ZW','Venta directa, enoturismo o tienda propia','Direct sale, wine tourism or own shop']]},
 {n:30, b:'poscosecha', es:'Balance económico', en:'Economic balance', a:[['ZX','Registro de costos, ingresos y rendimiento del ciclo','Record of the cycle’s costs, income and yield']]},
 {n:31, b:'poscosecha', es:'Transmisión del saber', en:'Passing on knowledge', a:[['ZY','Enseñanza del oficio a la familia y a los jornaleros','Teaching the craft to family and workers'],['ZZ','Intercambio con otros viticultores y asociaciones','Exchange with other growers and associations']]}
];
/* Datos del caso publicado del maíz: no aplican a la vid; se dejan vacíos para el código común */
const CLUSTERS = [], GRUPOS = [], ACTORES = [], CUADRO1 = [];
const CAPAS = [['tácito','tacit'],['cultural','cultural'],['técnico','technical'],['ambiental','environmental']];
const RED_PUB = {cercania:[], leverage:''};
const CONTEXTO = {ods:[]};
