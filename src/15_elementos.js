"use strict";
/* =====================================================================
   1e. ELEMENTOS DEL SISTEMA COMPLEJO ADAPTATIVO DEL VIÑEDO (Bloque 9)
   Catálogo base de elementos de un viñedo en México: actores, instituciones,
   insumos, equipo, recursos naturales y financieros, conocimientos, políticas,
   perturbaciones y productos. No proviene de un Stack publicado: es una
   «Lectura de Ratio Viña» a partir de las labores del ciclo de la vid
   (Winkler et al., 1974; Keller, 2020). Cada localidad agrega los suyos.
   Los identificadores genéricos (PM, AT, FERTG, HERB, KTAC…) son los mismos
   de Ratio Telar y Ratio Viña, para que los índices se calculen igual.
   ===================================================================== */
const CATS = {
  actores:      {n:E('Actores','Actors'),                     col:'#b05434', sym:'◆'},
  instituciones:{n:E('Instituciones','Institutions'),         col:'#3b6aa0', sym:'▲'},
  insumos:      {n:E('Insumos','Inputs'),                     col:'#c27c0e', sym:'●'},
  equipo:       {n:E('Equipo e infraestructura','Equipment and infrastructure'), col:'#7d5a2c', sym:'■'},
  naturales:    {n:E('Recursos naturales','Natural resources'),col:'#2f7d4a', sym:'✿'},
  financieros:  {n:E('Recursos financieros','Financial resources'), col:'#8a6d1f', sym:'$'},
  conocimientos:{n:E('Conocimientos','Knowledge'),            col:'#7a4f9a', sym:'✦'},
  politicas:    {n:E('Políticas, programas y normas','Policies, programmes and standards'), col:'#5a6b8a', sym:'§'},
  perturbaciones:{n:E('Perturbaciones del entorno','Environmental disturbances'), col:'#c43a2f', sym:'≈'},
  productos:    {n:E('Productos','Products'),                 col:'#8a2f5a', sym:'★'}
};
const ELEM = [
  // actores
  {id:'PM', cat:'actores', n:E('Viticultores (productores de uva)','Grape growers')},
  {id:'JOR', cat:'actores', n:E('Jornaleros y cuadrillas de poda y cosecha','Pruning and harvest crews')},
  {id:'FAM', cat:'actores', n:E('Familia y comunidad (transmisión entre generaciones)','Family and community (intergenerational transfer)')},
  {id:'AT', cat:'actores', n:E('Asesores técnicos','Technical advisers')},
  {id:'PI', cat:'actores', n:E('Proveedores de insumos','Input suppliers')},
  {id:'ENO', cat:'actores', n:E('Enólogo o maestro de bodega','Winemaker or cellar master')},
  {id:'COMP', cat:'actores', n:E('Compradores (empacadoras, bodegas, intermediarios)','Buyers (packing houses, wineries, middlemen)')},
  {id:'IAC', cat:'actores', n:E('Investigadores','Researchers')},
  // instituciones
  {id:'ASOC', cat:'instituciones', n:E('Asociaciones y consejos de viticultores','Growers’ associations and councils')},
  {id:'CESV', cat:'instituciones', n:E('Comité Estatal de Sanidad Vegetal','State Plant Health Committee')},
  {id:'SENASICA', cat:'instituciones', n:E('SENASICA','SENASICA')},
  {id:'INIFAP', cat:'instituciones', n:E('INIFAP y centros de investigación','INIFAP and research centres')},
  {id:'UNI', cat:'instituciones', n:E('Universidades','Universities')},
  // insumos
  {id:'AZUF', cat:'insumos', n:E('Azufre','Sulfur')},
  {id:'FUNG', cat:'insumos', n:E('Fungicidas de síntesis','Synthetic fungicides')},
  {id:'INSEC', cat:'insumos', n:E('Insecticidas','Insecticides')},
  {id:'HERB', cat:'insumos', n:E('Herbicidas','Herbicides')},
  {id:'FERTG', cat:'insumos', n:E('Fertilizantes de síntesis','Synthetic fertilizers')},
  {id:'FOLIAR', cat:'insumos', n:E('Fertilizante foliar y micronutrientes','Foliar fertilizer and micronutrients')},
  {id:'BIOI', cat:'insumos', n:E('Bioinsumos y control biológico','Bio-inputs and biological control')},
  {id:'COMPO', cat:'insumos', n:E('Composta o estiércol','Compost or manure')},
  {id:'CIAN', cat:'insumos', n:E('Cianamida hidrogenada','Hydrogen cyanamide')},
  {id:'GIB', cat:'insumos', n:E('Giberelinas y otros reguladores','Gibberellins and other regulators')},
  {id:'AGUAR', cat:'insumos', n:E('Agua de riego','Irrigation water')},
  {id:'COMB', cat:'insumos', n:E('Combustible de la maquinaria','Machinery fuel'), i:true},
  {id:'EMP', cat:'insumos', n:E('Material de empaque','Packing material')},
  // equipo e infraestructura
  {id:'TIJ', cat:'equipo', n:E('Tijeras y herramientas de poda','Pruning shears and tools')},
  {id:'ESTR', cat:'equipo', n:E('Estructura de conducción (postes y alambres)','Training structure (posts and wires)')},
  {id:'GOT', cat:'equipo', n:E('Sistema de riego (goteo u otro)','Irrigation system (drip or other)')},
  {id:'ASP', cat:'equipo', n:E('Aspersora','Sprayer')},
  {id:'RASTRA', cat:'equipo', n:E('Tractor, rastra o desvaradora','Tractor, harrow or mower')},
  {id:'MALLA', cat:'equipo', n:E('Malla antigranizo o antiaves','Hail or bird netting')},
  {id:'REFR', cat:'equipo', n:E('Refractómetro y muestreo de madurez','Refractometer and ripeness sampling')},
  {id:'FRIO', cat:'equipo', n:E('Cuarto frío y empaque','Cold room and packing')},
  {id:'BOD', cat:'equipo', n:E('Bodega y equipo de transformación','Winery and processing equipment')},
  {id:'TRANS', cat:'equipo', n:E('Transporte','Transport')},
  {id:'LAB', cat:'equipo', n:E('Laboratorio de suelo y agua','Soil and water laboratory')},
  // recursos naturales
  {id:'SUELO', cat:'naturales', n:E('Suelo','Soil')},
  {id:'HUM', cat:'naturales', n:E('Agua del suelo y lluvia','Soil water and rain')},
  {id:'CUB', cat:'naturales', n:E('Cubierta vegetal entre hileras','Inter-row cover crop')},
  {id:'RAST', cat:'naturales', n:E('Sarmientos y materia orgánica','Prunings and organic matter')},
  {id:'ARV', cat:'naturales', n:E('Malezas (vegetación arvense)','Weeds (arable flora)')},
  {id:'PLAGA', cat:'naturales', n:E('Plagas y enfermedades (cenicilla, mildiu, pudriciones)','Pests and diseases (powdery and downy mildew, rots)')},
  {id:'CLIMA', cat:'naturales', n:E('Temperatura, horas frío y lluvia','Temperature, chilling and rainfall')},
  {id:'FAUB', cat:'naturales', n:E('Fauna benéfica y polinizadores','Beneficial fauna and pollinators')},
  // financieros
  {id:'COSTOS', cat:'financieros', n:E('Costos de producción','Production costs')},
  {id:'INGR', cat:'financieros', n:E('Ingresos','Income')},
  {id:'PRECIO', cat:'financieros', n:E('Precio y momento de venta','Price and sale timing')},
  {id:'CRED', cat:'financieros', n:E('Crédito y seguro agrícola','Credit and crop insurance')},
  // conocimientos
  {id:'KTAC', cat:'conocimientos', n:E('Conocimiento tácito','Tacit knowledge')},
  {id:'KCUL', cat:'conocimientos', n:E('Conocimiento cultural','Cultural knowledge')},
  {id:'KTEC', cat:'conocimientos', n:E('Conocimiento técnico','Technical knowledge')},
  {id:'KAMB', cat:'conocimientos', n:E('Conocimiento ambiental','Environmental knowledge')},
  {id:'KENO', cat:'conocimientos', n:E('Conocimiento enológico y de calidad','Oenological and quality knowledge')},
  {id:'PRON', cat:'conocimientos', n:E('Pronóstico del tiempo','Weather forecast')},
  // políticas, programas y normas
  {id:'PROG', cat:'politicas', n:E('Programas de apoyo al campo','Farm support programmes')},
  {id:'NORM', cat:'politicas', n:E('Normas de calidad, inocuidad y etiquetado','Quality, food-safety and labelling standards')},
  // perturbaciones
  {id:'HELADA', cat:'perturbaciones', n:E('Heladas','Frost')},
  {id:'GRANIZO', cat:'perturbaciones', n:E('Granizo','Hail')},
  {id:'CALOR', cat:'perturbaciones', n:E('Olas de calor','Heatwaves')},
  {id:'SEQ', cat:'perturbaciones', n:E('Sequía y escasez de agua','Drought and water scarcity')},
  // productos
  {id:'UVAM', cat:'productos', n:E('Uva de mesa','Table grapes')},
  {id:'UVAV', cat:'productos', n:E('Uva para vino','Wine grapes')},
  {id:'VINO', cat:'productos', n:E('Vino y otros transformados','Wine and other processed products')},
  {id:'PASA', cat:'productos', n:E('Pasa, jugo o mosto','Raisins, juice or must')}
];
/* Elementos que intervienen en cada actividad. Lectura de Ratio Viña del texto de cada actividad. */
const ACT_EL = {
  A:'PM ESTR KTAC PLAGA', B:'PM COSTOS INGR KTEC', C:'PM AT LAB SUELO KTEC', D:'PM AT LAB AGUAR KTEC',
  E:'PM JOR TIJ KTAC', F:'PM JOR TIJ KTAC KTEC', G:'PM RAST SUELO RASTRA COMB',
  H:'PM JOR ESTR', I:'PM PI COSTOS',
  J:'PM AT PI CIAN ASP CLIMA KTEC COSTOS',
  K:'PM RASTRA SUELO ARV COMB', L:'PM CUB SUELO HUM FAUB KAMB', M:'PM COMPO SUELO RAST',
  N:'PM AGUAR GOT HUM FERTG', O:'PM JOR FAM KTAC', P:'PM JOR ESTR KTAC', Q:'PM AT FERTG GOT COSTOS', R:'PM FOLIAR ASP',
  S:'PM AT PLAGA KTEC KAMB CESV', T:'PM PRON CLIMA KAMB', U:'PM AZUF ASP PLAGA', V:'PM PI FUNG ASP PLAGA COSTOS',
  W:'PM JOR ARV', X:'PM PI HERB ASP ARV COSTOS',
  Y:'PM AT GIB ASP KTEC COSTOS', Z:'PM HELADA CLIMA KTAC',
  ZA:'PM JOR KTAC', ZB:'PM JOR KTAC KTEC', ZC:'PM JOR TIJ KTEC', ZD:'PM JOR KTAC', ZE:'PM JOR TIJ RASTRA',
  ZF:'PM AGUAR GOT HUM', ZG:'PM AT AGUAR GOT HUM KTEC KENO', ZH:'PM PI INSEC ASP PLAGA COSTOS', ZI:'PM AT BIOI PLAGA FAUB KAMB',
  ZJ:'PM MALLA GRANIZO COSTOS', ZK:'PM REFR KTEC KENO', ZL:'PM ENO KTAC KENO', ZM:'PM COMP PRECIO ENO KENO',
  ZN:'PM JOR FAM UVAM UVAV', ZO:'PM RASTRA UVAV COMB', ZP:'PM JOR EMP UVAM NORM', ZQ:'PM FRIO UVAM',
  ZR:'PM TRANS COMB UVAM UVAV', ZS:'PM ENO BOD VINO PASA KENO KCUL', ZT:'PM AGUAR GOT FERTG',
  ZU:'PM AZUF ASP PLAGA', ZV:'PM COMP PRECIO INGR', ZW:'PM FAM PRECIO INGR VINO KCUL', ZX:'PM COSTOS INGR KTEC CRED',
  ZY:'PM FAM JOR KTAC KCUL', ZZ:'PM ASOC AT INIFAP KTEC KTAC'
};
/* Vínculos estructurales (no ligados a una actividad). Lectura de Ratio Viña: en tu proyecto entran solo si tocan un elemento de tus actividades. */
const LAZOS = [
  ['AT','INIFAP'],['AT','UNI'],['IAC','INIFAP'],['IAC','UNI'],['CESV','SENASICA'],['PM','ASOC'],['ENO','BOD'],
  ['RAST','SUELO'],['CUB','SUELO'],['INGR','COSTOS'],['CRED','PROG']
];
/* Perfil de impacto de cada elemento sobre [suelo, agua, atmósfera, vegetación, fauna], escala −2…+2.
   Lectura de Ratio Viña con su justificación; editable por actividad en el Bloque 6. */
const COMP = [E('Suelo','Soil'),E('Agua','Water'),E('Atmósfera','Atmosphere'),E('Vegetación','Vegetation'),E('Fauna','Fauna')];
const COMP_COL = ['#9a6a3a','#2d78b0','#8a8f86','#5f8f3e','#7a4f9a'];
const IMPACTO = {
  COMB:{v:[0,0,-1,0,0], r:E('Quema de combustible fósil: emisiones de CO₂.','Fossil fuel combustion: CO₂ emissions.')},
  RASTRA:{v:[-1,0,0,0,0], r:E('El paso de maquinaria compacta y remueve el suelo entre hileras.','Machinery passes compact and disturb inter-row soil.')},
  FERTG:{v:[0,-1,-1,0,0], r:E('Nitrógeno que se lixivia y emite óxido nitroso (IPCC, 2019).','Nitrogen leaching and nitrous oxide emissions (IPCC, 2019).')},
  HERB:{v:[0,-1,0,-1,-1], r:E('Residuos en agua y pérdida de flora asociada y de su fauna.','Residues in water; loss of associated flora and fauna.')},
  INSEC:{v:[0,-1,0,0,-2], r:E('Afecta insectos benéficos y polinizadores.','Harms beneficial insects and pollinators.')},
  FUNG:{v:[0,-1,0,0,-1], r:E('Residuos en agua y efecto sobre organismos no objetivo.','Residues in water and effects on non-target organisms.')},
  CIAN:{v:[0,0,0,0,-1], r:E('Producto tóxico de manejo restringido; riesgo para fauna y aplicadores.','Toxic, restricted-use product; risk to fauna and applicators.')},
  AZUF:{v:[-1,0,0,0,0], r:E('Aplicaciones repetidas acidifican el suelo; es un fungicida mineral de baja toxicidad.','Repeated use acidifies soil; it is a low-toxicity mineral fungicide.')},
  RAST:{v:[2,1,1,0,1], r:E('Sarmientos incorporados: materia orgánica, estructura y carbono en el suelo.','Incorporated prunings: organic matter, structure and soil carbon.')},
  CUB:{v:[2,1,1,1,1], r:E('La cubierta vegetal protege de la erosión, retiene agua y da refugio a la fauna benéfica.','Cover crops prevent erosion, retain water and shelter beneficial fauna.')},
  COMPO:{v:[2,0,0,0,1], r:E('La composta aporta materia orgánica y vida al suelo.','Compost adds organic matter and soil life.')},
  BIOI:{v:[0,0,0,0,1], r:E('El control biológico sustituye plaguicidas de síntesis.','Biological control replaces synthetic pesticides.')},
  FAUB:{v:[0,0,0,0,1], r:E('Conservar la fauna benéfica favorece el control natural de plagas.','Conserving beneficial fauna supports natural pest control.')},
  AGUAR:{v:[0,-1,0,0,0], r:E('Extracción de agua de pozos o presas; el goteo la reduce.','Water drawn from wells or dams; drip reduces it.')},
  GOT:{v:[0,1,0,0,0], r:E('El riego por goteo usa el agua con más eficiencia.','Drip irrigation uses water more efficiently.')},
  LAB:{v:[1,1,0,0,0], r:E('Fertilizar y regar según análisis evita excesos.','Fertilising and irrigating by analysis avoids excess.')}
};
/* Relación compartimento / indicador → ODS para el Bloque 13 (relación propuesta por Ratio Viña). */
const ODS_COMP = {2:[0,3], 6:[1], 13:[2], 15:[0,3,4]};
