"""Genera src/11_territorio.js: estados, municipios y localidades (INEGI, wscatgeo v2; población del Censo 2020).
Localidades: todas las de 100 habitantes o más y todas las cabeceras municipales (clave 0001).
Regiones: Banco de México (Reporte sobre las Economías Regionales). Proyección al mapa: herramientas/proyeccion.py."""
import json, glob, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); D = os.path.join(R, 'fuentes', 'datos')
REG = {'N':['02','05','08','19','26','28'], 'CN':['01','03','06','10','14','16','18','24','25','32'],
       'C':['09','11','13','15','17','21','22','29'], 'S':['04','07','12','20','23','27','30','31']}
reg = {e:k for k,v in REG.items() for e in v}
ISO = dict(AGU='01',BCN='02',BCS='03',CAM='04',COA='05',COL='06',CHP='07',CHH='08',DIF='09',DUR='10',GUA='11',GRO='12',HID='13',JAL='14',MEX='15',MIC='16',MOR='17',NAY='18',NLE='19',OAX='20',PUE='21',QUE='22',ROO='23',SLP='24',SIN='25',SON='26',TAB='27',TAM='28',TLA='29',VER='30',YUC='31',ZAC='32')
iso = {v:'MX-'+k for k,v in ISO.items()}
est = json.load(open(os.path.join(D,'inegi_mgee.json'),encoding='utf-8'))['datos']
E = [[e['cve_ent'], e['nomgeo'], e['nom_abrev'], reg[e['cve_ent']], int(e['pob_total']), iso[e['cve_ent']]] for e in est]
ent = lambda v: int(v) if str(v).lstrip('-').isdigit() else None
M = {}; L = {}; nl = 0
for f in sorted(glob.glob(os.path.join(D,'mgem','*.json'))):
    for m in json.load(open(f,encoding='utf-8'))['datos']:
        M.setdefault(m['cve_ent'],[]).append([m['cve_mun'], m['nomgeo'], ent(m.get('pob_total')), ent(m.get('total_viviendas_habitadas'))])
        k = m['cve_ent']+m['cve_mun']; locs = []
        for x in json.load(open(os.path.join(D,'loc',k+'.json'),encoding='utf-8')):
            p = ent(x.get('pob_total'))
            if (p or 0) >= 100 or x['cve_loc']=='0001':
                try: lo, la = round(float(x['longitud']),3), round(float(x['latitud']),3)
                except: lo = la = None
                locs.append([x['cve_loc'], x['nomgeo'], p, ent(x.get('altitud')), lo, la, 1 if x.get('ambito')=='URBANO' else 0])
        locs.sort(key=lambda r: (r[0]!='0001', -(r[2] or 0))); L[k] = locs; nl += len(locs)
P = json.load(open(os.path.join(D,'proyeccion.json')))
js = ('// Generado por herramientas/territorio.py — NO editar a mano.\n'
      '// Fuente: INEGI, Catálogo Único de Claves Geoestadísticas (wscatgeo v2): entidades, municipios y localidades; población y viviendas del Censo 2020.\n'
      '// Localidades incluidas: 100 habitantes o más y todas las cabeceras. Campos: [clave, nombre, población, altitud m, longitud, latitud, urbana].\n'
      '// Regiones: Banco de México. PROY: ajuste lon/lat → mapa (acierto %.1f %% de localidades dentro de su estado).\n' % (100*P['acierto']) +
      'const TERR = ' + json.dumps({'estados':E,'municipios':M,'localidades':L}, ensure_ascii=False, separators=(',',':')) + ';\n' +
      'const PROY = ' + json.dumps({k:round(v,5) for k,v in P.items()}) + ';\n')
open(os.path.join(R,'src','11_territorio.js'),'w',encoding='utf-8',newline='\n').write(js)
print('estados',len(E),'municipios',sum(len(v) for v in M.values()),'localidades',nl,'KB',len(js.encode())//1024)
