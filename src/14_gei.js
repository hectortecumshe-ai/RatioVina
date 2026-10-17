// =====================================================================
// 12_gei.js — Gestión Estratégica Integrada (GEI) de los recursos naturales
// Fuente: Mojica Zárate HT. 2017. Modelo y procedimiento para la gestión estratégica integrada de los
// recursos naturales en territorios áridos con orientación agroproductiva. Tesis de Doctor en Ciencias
// Técnicas, Universidad Central «Marta Abreu» de Las Villas, Santa Clara, Cuba.
// =====================================================================
const TESIS = {
  cita: 'Mojica Zárate HT. 2017. Modelo y procedimiento para la gestión estratégica integrada de los recursos naturales en territorios áridos con orientación agroproductiva. Tesis doctoral (Dr. en Ciencias Técnicas), Universidad Central «Marta Abreu» de Las Villas, Cuba.',
  fundamentos: [['Socioeconómico','Socio-economic'],['Ambiental','Environmental'],['Turístico-ecotecnológico','Tourism–eco-technological']],
  enfoques: [['Participativo','Participatory'],['Sistemas complejos','Complex systems'],['Sostenible','Sustainable']],
  premisas: [['Sostenibilidad y agroproductividad','Sustainability and agro-productivity'],['Integración productiva para el uso de los recursos naturales','Productive integration for natural-resource use'],['Cohesión y relación compleja','Cohesion and complex relations'],['Ocupación laboral digna integrada','Integrated decent work'],['Educación ambiental integral','Comprehensive environmental education']],
  principios: [['lógico','logical'],['prospectivo','prospective'],['pertinente','pertinent'],['incluyente','inclusive'],['integrador','integrative'],['transparente y con parsimonia','transparent and parsimonious'],['versátil','versatile']],
  usuarios: [['Usuario objetivo','Target user','relación productiva directa con el recurso','direct productive use of the resource'],
             ['Usuario de segundo orden','Second-order user','usa los recursos de la UP con fines no productivos','non-productive use'],
             ['Usuario de tercer orden','Third-order user','uso demostrativo, educativo y de capacitación','demonstration, education and training']]
};

// Los diez preceptos del desarrollo local (DL) y la conservación ambiental (CA) — Anexo 2.2 y Tabla 2.2-1
// paso: valor que suma cada evidencia; max: tope (1.0); unidad: qué se cuenta; inst: instrumento
const PRECEPTOS = [
 {n:1, es:'Participación desde la localidad hacia la globalidad', en:'Participation from the local to the global',
  ind:['Beneficios brindados a los trabajadores por la UP (seguridad social, herramientas, productos de la UP, vacaciones, otros)','Benefits the farm gives workers (social security, tools, farm products, holidays, other)'], paso:0.20, max:1, ods:[1,8,10]},
 {n:2, es:'Gestión sostenible y productiva del conocimiento', en:'Sustainable, productive knowledge management',
  ind:['Cursos de capacitación al año para transformar el desarrollo de la UP','Training courses per year'], paso:0.10, max:1, ods:[4]},
 {n:3, es:'Beneficio integrado de la ciencia', en:'Integrated benefit of science',
  ind:['Proyectos o acciones científicas que benefician a la comunidad','Science-based projects benefiting the community'], paso:0.20, max:1, ods:[3,9]},
 {n:4, es:'Heterogeneidad y dimensión del territorio', en:'Heterogeneity and scale of the territory',
  ind:['Acciones planificadas y participativas que vinculan paisaje, relieve y otros atributos','Planned participatory actions linking landscape, relief and other attributes'], paso:0.20, max:1, ods:[5,11]},
 {n:5, es:'Armonía sostenible entre actores y recursos', en:'Sustainable harmony between actors and resources',
  ind:['Recursos potenciales presentes en la UP (conteo visual o referido por los actores)','Potential resources on the farm'], paso:0.25, max:1, ods:[12]},
 {n:6, es:'Uso sostenible del recurso hídrico', en:'Sustainable use of water',
  ind:['Ecotecnologías para el uso sostenible del agua presentes en la UP','Water eco-technologies on the farm'], paso:0.10, max:1, ods:[6]},
 {n:7, es:'Actividades agroproductivas sostenibles', en:'Sustainable farming activities',
  ind:['Procesos agroproductivos sostenibles en la UP','Sustainable farming processes on the farm'], paso:0.10, max:1, ods:[2,12]},
 {n:8, es:'Diseño de viviendas sostenibles de eficiencia ambiental', en:'Sustainable, environmentally efficient housing',
  ind:['Viviendas con al menos una característica ecotecnológica (1.0 si existe alguna)','Houses with at least one eco-technological feature (1.0 if any)'], paso:1, max:1, ods:[7,11]},
 {n:9, es:'Conservación del entorno natural y apoyo a la vida', en:'Conservation of the natural environment and support for life',
  ind:['Acciones sostenibles a favor de la conservación ambiental en la UP','Conservation actions on the farm'], paso:0.10, max:1, ods:[13,14,15]},
 {n:10, es:'Acciones internacionales responsables', en:'Responsible international action',
  ind:['Convenios útiles con entidades internacionales para acciones sostenibles','Useful agreements with international bodies'], paso:0.20, max:1, ods:[16,17]}
];
// Reglas de lectura del cumplimiento (Paso 2)
const REGLAS_PRECEPTO = [
  {hasta:0.5, es:'Incumplimiento: identificar causas básicas.', en:'Non-compliance: identify basic causes.', cls:'bad'},
  {hasta:0.8, es:'Cumplimiento parcial: analizar causas a detalle (espina de pescado); fundamenta la estrategia.', en:'Partial compliance: detailed cause analysis (fishbone); grounds the strategy.', cls:'warn'},
  {hasta:1.0001, es:'Cumplimiento alto: no requiere análisis de causas.', en:'High compliance: no cause analysis needed.', cls:'ok'}
];
// Procedimiento: 4 fases y 9 pasos (Figura 2.3)
const FASES = [
 {n:'I', es:'Reconocimiento del estado de la gestión de los recursos naturales del territorio', en:'Recognising the state of natural-resource management',
  pasos:[[1,'Caracterización integral de los elementos del territorio','Integral characterisation of the territory'],[2,'Valoración del cumplimiento de los preceptos de DL y CA','Compliance with the local-development and conservation precepts']]},
 {n:'II', es:'Dimensión del escenario agroproductivo–ambiental', en:'Sizing the agro-productive–environmental scenario',
  pasos:[[3,'Nivel de conocimiento ambiental de actores y usuarios','Environmental knowledge of actors and users'],[4,'Definición de variables e indicadores estratégicos','Defining variables and strategic indicators']]},
 {n:'III', es:'Implementación de acciones para la GEI', en:'Implementing actions for integrated management',
  pasos:[[5,'Diseño y confección del plan estratégico','Designing the strategic plan'],[6,'Ejecución de las acciones estratégicas','Executing strategic actions']]},
 {n:'IV', es:'Evaluación y mejora', en:'Evaluation and improvement',
  pasos:[[7,'Estado actual de las variables','Current state of the variables'],[8,'Actividades de control','Control activities'],[9,'Proyecto de mejora','Improvement project']]}
];

// Objetivos de Desarrollo Sostenible (Agenda 2030, ONU)
const ODS = [
 [1,'Fin de la pobreza','No poverty','#e5243b'],[2,'Hambre cero','Zero hunger','#dda63a'],[3,'Salud y bienestar','Good health and well-being','#4c9f38'],
 [4,'Educación de calidad','Quality education','#c5192d'],[5,'Igualdad de género','Gender equality','#ff3a21'],[6,'Agua limpia y saneamiento','Clean water and sanitation','#26bde2'],
 [7,'Energía asequible y no contaminante','Affordable and clean energy','#fcc30b'],[8,'Trabajo decente y crecimiento económico','Decent work and economic growth','#a21942'],
 [9,'Industria, innovación e infraestructura','Industry, innovation and infrastructure','#fd6925'],[10,'Reducción de las desigualdades','Reduced inequalities','#dd1367'],
 [11,'Ciudades y comunidades sostenibles','Sustainable cities and communities','#fd9d24'],[12,'Producción y consumo responsables','Responsible consumption and production','#bf8b2e'],
 [13,'Acción por el clima','Climate action','#3f7e44'],[14,'Vida submarina','Life below water','#0a97d9'],[15,'Vida de ecosistemas terrestres','Life on land','#56c02b'],
 [16,'Paz, justicia e instituciones sólidas','Peace, justice and strong institutions','#00689d'],[17,'Alianzas para lograr los objetivos','Partnerships for the goals','#19486a']
];

// Las nueve dimensiones de análisis (solicitadas por el autor). ods: relación propuesta por Ratio Viña.
const DIMENSIONES = [
 {id:'social', es:'Social', en:'Social', col:'#b05434', ods:[1,3,4,5,10],
  q:['Población, género, edad, escolaridad, organización comunitaria y transmisión del conocimiento.','Population, gender, age, schooling, community organisation and knowledge transmission.']},
 {id:'economico', es:'Económico', en:'Economic', col:'#c27c0e', ods:[1,8,12],
  q:['Rendimientos, costos, ingresos netos, empleo y mercado del grano y del forraje.','Yields, costs, net income, employment and grain/fodder markets.']},
 {id:'agricola', es:'Agrícola', en:'Agricultural', col:'#5f8f3e', ods:[2,12,15],
  q:['Sistema de cultivo, semilla criolla, calendario, labores y nutrición del cultivo.','Cropping system, landrace seed, calendar, field operations and crop nutrition.']},
 {id:'pecuario', es:'Pecuario', en:'Livestock', col:'#8a5a3a', ods:[2,12,13],
  q:['Integración agricultura–ganadería: forraje, rastrojo y estiércol.','Crop–livestock integration: fodder, stover and manure.']},
 {id:'ambiental', es:'Ambiental', en:'Environmental', col:'#2d78b0', ods:[6,13,15],
  q:['Humedad del suelo, clima, agroquímicos y estado de los recursos.','Soil moisture, climate, agrochemicals and resource status.']},
 {id:'ecologico', es:'Ecológico', en:'Ecological', col:'#3f7e44', ods:[15,2],
  q:['Agrobiodiversidad (razas nativas, milpa, frutales), interacciones y resiliencia del agroecosistema.','Agrobiodiversity (native races, milpa, fruit trees), interactions and resilience.']},
 {id:'emergencia', es:'Emergencia ambiental', en:'Environmental emergency', col:'#c43a2f', ods:[13,11,1],
  q:['Fenómenos y riesgos que alteran el ciclo: variabilidad climática, sequía, heladas, plagas.','Hazards that disrupt the cycle: climate variability, drought, frost, pests.']},
 {id:'recursos', es:'Recursos naturales', en:'Natural resources', col:'#26a1c4', ods:[6,15,12],
  q:['Recurso limitativo y recursos dependientes (agua, suelo, vegetación, fauna) según la gráfica de espejo.','Limiting and dependent resources (water, soil, vegetation, fauna) via the mirror graph.']},
 {id:'sostenibilidad', es:'Sostenibilidad', en:'Sustainability', col:'#2f5d50', ods:[2,12,13,15,17],
  q:['Síntesis: preceptos de DL y CA, ODS y capacidad de adaptación del sistema.','Synthesis: precepts, SDGs and the system\'s adaptive capacity.']}
];

// Marco teórico (referencias verificables). k: clave corta usada en la app
const TEORIA = [
 {k:'Leff 1994', c:'Leff E. 1994. Ecología y capital: racionalidad ambiental, democracia participativa y desarrollo sustentable. Siglo XXI, México.', t:'racionalidad ambiental'},
 {k:'Leff 2004', c:'Leff E. 2004. Racionalidad ambiental: la reapropiación social de la naturaleza. Siglo XXI, México.', t:'racionalidad ambiental'},
 {k:'García 2006', c:'García R. 2006. Sistemas complejos: conceptos, método y fundamentación epistemológica de la investigación interdisciplinaria. Gedisa, Barcelona.', t:'sistemas complejos'},
 {k:'Morin 1990', c:'Morin E. 1990. Introduction à la pensée complexe. ESF, París.', t:'pensamiento complejo'},
 {k:'Holland 1995', c:'Holland JH. 1995. Hidden order: how adaptation builds complexity. Addison-Wesley, Reading.', t:'sistemas complejos adaptativos'},
 {k:'Holling 2001', c:'Holling CS. 2001. Understanding the complexity of economic, ecological, and social systems. Ecosystems 4: 390–405.', t:'panarquía, ciclo adaptativo'},
 {k:'Gunderson y Holling 2002', c:'Gunderson LH, Holling CS (eds.). 2002. Panarchy: understanding transformations in human and natural systems. Island Press, Washington.', t:'panarquía'},
 {k:'Ostrom 2009', c:'Ostrom E. 2009. A general framework for analyzing sustainability of social-ecological systems. Science 325: 419–422.', t:'sistemas socioecológicos'},
 {k:'Masera et al. 1999', c:'Masera O, Astier M, López-Ridaura S. 1999. Sustentabilidad y manejo de recursos naturales: el marco de evaluación MESMIS. Mundi-Prensa, GIRA, UNAM, México.', t:'evaluación de sostenibilidad'},
 {k:'Prigogine 1983', c:'Prigogine I. 1983. ¿Tan solo una ilusión? Una exploración del caos al orden. Tusquets, Barcelona.', t:'orden y caos (citado en la tesis)'},
 {k:'Hock 1999', c:'Hock D. 1999. Birth of the chaordic age. Berrett-Koehler, San Francisco.', t:'organización caórdica'},
 {k:'Godet 2007', c:'Godet M. 2007. Manuel de prospective stratégique. Dunod, París.', t:'MICMAC, MACTOR (citado en la tesis)'},
 {k:'Godet y Durance 2011', c:'Godet M, Durance P. 2011. La prospectiva estratégica para las empresas y los territorios. Dunod/UNESCO.', t:'prospectiva territorial'},
 {k:'Freeman 1978', c:'Freeman LC. 1978. Centrality in social networks: conceptual clarification. Social Networks 1: 215–239.', t:'centralidad, intermediación'},
 {k:'Brandes 2001', c:'Brandes U. 2001. A faster algorithm for betweenness centrality. Journal of Mathematical Sociology 25(2): 163–177.', t:'algoritmo de intermediación'},
 {k:'Toledo y Barrera-Bassols 2008', c:'Toledo VM, Barrera-Bassols N. 2008. La memoria biocultural: la importancia ecológica de las sabidurías tradicionales. Icaria, Barcelona.', t:'saberes tradicionales (citado en el artículo)'},
 {k:'Nonaka y Takeuchi 1995', c:'Nonaka I, Takeuchi H. 1995. The knowledge-creating company. Oxford University Press, Nueva York.', t:'conocimiento tácito y explícito (citado en el artículo)'},
 {k:'Altieri y Nicholls 2012', c:'Altieri MA, Nicholls CI. 2012. Agroecología: bases científicas para una agricultura sustentable. Fundación de Cultura Universitaria, Montevideo.', t:'agroecología (citado en el artículo)'}
];
