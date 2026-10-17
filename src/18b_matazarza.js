"use strict";
/* =====================================================================
   CASO PUBLICADO DE REFERENCIA: Mata de Zarza, Puente Nacional, Veracruz.
   Fuente: Mojica-Zárate HT, Barrera-Guzmán LÁ, Alejo-Bello S, Partida-Sedas JG,
   Rojas-Reyes JO, Díaz-José O, Tinoco-Rueda JÁ, Torres-Palacios C. 2026.
   Guía práctica para el establecimiento de uva en Mata de Zarza, Veracruz.
   Colección Guías Prácticas para Productores, Tomo 5. UACh. ISBN 978-607-12-0712-8.
   Uva de mesa (Perlette, Flame Seedless y Summer Royal) introducida en enero de
   2025 con 3,600 esquejes de Hermosillo, Sonora, en 19 parcelas cooperantes;
   periodo documentado: enero de 2025 a febrero de 2026. Aquí se documenta una
   parcela cooperante de 1 ha con el marco de plantación de la guía
   (1.40 m × 3.0 m → 10,000 / 4.2 = 2,381 plantas).
   Solo se usa en el modo ejemplo: nunca se guarda ni se mezcla con el proyecto.
   Clima: la guía no publica temperaturas y no hay estación del SMN en la
   localidad; se usan las medias mensuales 1991–2020 del reanálisis ERA5
   (Hersbach et al., 2020) en la celda de 19.25° N, 96.75° O ajustada a 467 m,
   descargadas de Open-Meteo. Es un dato de reanálisis, no de estación.
   Lo que la guía no dice queda sin responder; las respuestas que dio el autor
   de la guía por comunicación personal (2026) se marcan así en las notas.
   ===================================================================== */
const MZ_CLIMA = {   // ERA5 1991–2020, medias mensuales (°C)
  tmax:[23.7,25.4,27.5,29.8,30.7,30.1,29.8,29.8,29.0,27.9,25.9,24.3],
  tmin:[14.7,15.5,17.1,19.3,20.9,21.5,20.5,20.8,21.2,19.7,17.2,15.3],
  tmed:[19.1,20.3,22.2,24.5,25.7,25.6,25.1,25.1,24.8,23.7,21.4,19.7]};
function estadoMataZarza(){ const s=estadoInicial(), G='Mojica-Zárate et al., 2026';
  Object.assign(s, {cultivo:'uva', sistema:'riego_tec', tipoUP:5, superficie:1,
    vidDestino:'mesa', vidVar:'Flame Seedless, Perlette y Summer Royal', vidPie:'Pie franco (sin portainjerto)', vidCond:'espaldera', vidDens:2381,
    vidPlant:'2025-02-24', vidMat:'barbado',
    podas:[{f:'2025-12-30', t:'formacion', nota:T('Desde la base del tallo, para engrosar los tallos del segundo año (fecha aproximada: fines de diciembre; '+G+')','From the base of the stem, to thicken second-year shoots (approximate date: late December; '+G+')')}],
    clima:{tmax:MZ_CLIMA.tmax.slice(), tmin:MZ_CLIMA.tmin.slice(), tmed:MZ_CLIMA.tmed.slice(), fuente:T('ERA5 (Hersbach et al., 2020), medias 1991–2020, celda 19.25° N 96.75° O ajustada a 467 m; vía Open-Meteo. Reanálisis, no estación.','ERA5 (Hersbach et al., 2020), 1991–2020 means, cell 19.25° N 96.75° W adjusted to 467 m; via Open-Meteo. Reanalysis, not a station.')},
    edo:'30', mun:'134', loc:'0018',
    proyecto:{nombre:T('Caso publicado: parcela cooperante de 1 ha, Mata de Zarza, Veracruz','Published case: 1 ha cooperating plot, Mata de Zarza, Veracruz'), productor:G, fecha:'2026-02-28',
      notas:T('Establecimiento de uva de mesa en clima cálido subhúmedo, de enero de 2025 a febrero de 2026. La plantación es de febrero de 2025; el día exacto es aproximado (inicio del enraizamiento en los primeros 10 días de enero + 45 días en la cámara).','Table-grape establishment in a warm sub-humid climate, January 2025 to February 2026. Planting was in February 2025; the exact day is approximate (rooting started in the first 10 days of January + 45 days in the chamber).')},
    reqEst:{0:'ok'},
    reqInn:[{t:T('Arena de río limpia y cernida para la cámara de enraizamiento (no arena de construcción)','Clean, sieved river sand for the rooting chamber (not building sand)'), b:'establecimiento', d:'', fuente:G},
            {t:T('Agua para riego constante durante los primeros tres meses después de plantar','Water for constant irrigation during the first three months after planting'), b:'establecimiento', d:'', fuente:G}],
    revisado:{elementos:true}, formulado:true});
  const si=(n,cods)=>{ const m=s.manejo[n]=s.manejo[n]||{resp:{}, inn:[], imp:{}}; cods.forEach(c=>m.resp[c]='si'); return m; };
  const no=(n,cods)=>{ const m=s.manejo[n]=s.manejo[n]||{resp:{}, inn:[], imp:{}}; cods.forEach(c=>m.resp[c]='no'); return m; };
  // Etapa de establecimiento (pasos 1–6): todo lo describe la guía
  si(1,['EA','EB']); si(2,['EC','ED','EE','EF']);
  s.manejo[1].inn.push({t:T('Elección de la localidad por profesores-investigadores del CARSH-UACh, con investigación documental y recorridos de campo','Choice of the locality by CARSH-UACh lecturer-researchers, through desk research and field visits'), el:['PM','IAC','UNI','CLIMA','SUELO','KTEC'], nota:G});
  s.manejo[1].inn.push({t:T('Esquejes de viñedos de Hermosillo, Sonora, cortados por una cuadrilla de 22 cortadores y traídos a Veracruz','Cuttings from Hermosillo, Sonora vineyards, cut by a crew of 22 and brought to Veracruz'), el:['PM','VIV','JOR','ESQ','TRANS','COSTOS'], nota:G}); si(3,['EG','EH']); si(4,['EI','EJ','EK']); si(5,['EL','EM','EN']); si(6,['EO']);
  s.manejo[2].inn.push({t:T('Cámara de enraizamiento excavada en el suelo, sin plástico, con arena de río: 45 días, humedad ≥ 95 % y 24–28 °C','Rooting chamber dug in the ground, without plastic, with river sand: 45 days, humidity ≥ 95 % and 24–28 °C'), el:['PM','CAMARA','ARENA','AGUAR','ESQ','KTEC','KTAC'], nota:G});
  s.manejo[4].inn.push({t:T('Dos o tres esquejes por cepa según la cantidad de raíz, para asegurar al menos una planta','Two or three cuttings per hole depending on root amount, to secure at least one vine'), el:['PM','ESQ','KTAC'], nota:G});
  s.manejo[4].inn.push({t:T('Acolchado con material vegetal seco solarizado 48 horas','Mulch of dry plant material solarised for 48 hours'), el:['PM','ACOL','SUELO','HUM','KAMB'], nota:G});
  s.manejo[5].inn.push({t:T('Protección de cada planta con costales de red sostenidos por estacas','Protecting each vine with net sacks held by stakes'), el:['PM','PROT','HORM','KTAC'], nota:G});
  // Ciclo anual (pasos 7–37): primer año, sin floración ni cosecha todavía
  si(9,['E']); no(9,['F']);                        // poda invernal (de formación, desde la base): comunicación personal
  si(10,['H']);                                    // alambres de sostén
  si(12,['M']);                                    // gallinaza o pollinaza
  si(13,['N']);                                    // riego
  si(15,['P']);                                    // alzado y amarre a soportes y alambres
  si(16,['Q']);                                    // fosfato diamónico 18-46-0, 40 g por planta
  s.manejo[16].inn.push({t:T('Aplicación de microorganismos de montaña al suelo','Applying mountain microorganisms to the soil'), el:['PM','BIOI','SUELO','KTAC'], nota:T('Comunicación personal del autor de la guía (2026)','Personal communication from the guide’s author (2026)')});
  si(19,['W']);                                    // deshierbe con desbrozadora en la hilera (com. pers.)
  no(20,['Y','Z']); no(21,['ZA','ZB']); no(22,['ZC']); no(26,['ZJ']);
  si(24,['ZF']); no(24,['ZG']);
  si(25,['ZI']);                                   // bioinsumos: microorganismos de montaña (com. pers.)
  no(27,['ZK','ZL']); no(28,['ZM']); no(29,['ZN','ZO']); no(30,['ZP','ZQ']); no(31,['ZR']); no(32,['ZS']); no(33,['ZT']); no(34,['ZU']); no(35,['ZV','ZW']);
  si(36,['ZX']);                                   // bitácoras de campo y costos (Tabla 2)
  si(37,['ZY','ZZ']);
  s.manejo[37].inn.push({t:T('Plataforma tecnológica con productores cooperantes, estudiantes y profesores de la UACh que sistematiza lo aprendido (estudio de caso)','Technology platform with cooperating farmers, UACh students and lecturers that systematises what is learnt (case study)'), el:['PM','EST','UNI','IAC','KTEC','KTAC'], nota:G});                              // estudiantes y productores aprenden; intercambio con viticultores de Sonora
  // Fechas (día del año, 0 = 1 de enero)
  s.fechas={1:{ini:0,fin:9,ev:'establece'}, 2:{ini:9,fin:54,ev:'establece'}, 3:{ini:0,fin:58,ev:'suelo'}, 4:{ini:54,fin:58,ev:'establece'}, 5:{ini:54,fin:144,ev:'riego'}, 9:{ini:355,fin:364,ev:'poda'}};
  // Riesgos que documenta la guía (lectura de Ratio Viña sobre su texto; el productor los ajusta)
  s.riesgo={hormiga:{p:4,i:3}, fauna:{p:3,i:3}, material:{p:3,i:3}, agua:{p:4,i:4}, arcilla:{p:3,i:3}, nuevo:{p:4,i:3}, adopcion:{p:4,i:4}, frio:{p:4,i:3}, helada:{off:true}};
  s.precio={ESQ:{p:17, u:T('esqueje','cutting')}, TRANS:{p:6.1, u:T('esqueje','cutting')}, JOR:{p:400, u:T('jornal','day')}, ENR:{p:150, u:T('lote','batch')}};
  return s; }

/* ---------- Modo ejemplo: el caso publicado de Mata de Zarza ---------- */
function entrarEjemplo(){ if(EJ) return; S_USUARIO=S; const b=S.bloque; S=estadoMataZarza(); S.bloque=b==='inicio'?'tablero':b; EJ=true; document.documentElement.classList.add('modo-ejemplo'); render(); scrollTo(0,0);
  toast(T('Modo ejemplo: tus datos no cambian','Example mode: your data stay unchanged')); }
function salirEjemplo(){ if(!EJ) return; const b=S.bloque; S=S_USUARIO; S_USUARIO=null; EJ=false; S.bloque=b; document.documentElement.classList.remove('modo-ejemplo'); render(); scrollTo(0,0);
  toast(T('De vuelta a tu proyecto','Back to your project')); }
