"""Ajusta la proyección lon/lat → coordenadas del mapa (12_mapa.js) maximizando la fracción
de localidades del INEGI que caen dentro de su propio estado."""
import json,glob,re,random,math
import numpy as np
s=open('src/12_mapa.js',encoding='utf-8').read()
paths=dict(re.findall(r'"(MX-[A-Z]{3})":"(M[^"]+)"',s))
ISO=dict(AGU='01',BCN='02',BCS='03',CAM='04',COA='05',COL='06',CHP='07',CHH='08',DIF='09',DUR='10',GUA='11',GRO='12',HID='13',JAL='14',MEX='15',MIC='16',MOR='17',NAY='18',NLE='19',OAX='20',PUE='21',QUE='22',ROO='23',SLP='24',SIN='25',SON='26',TAB='27',TAM='28',TLA='29',VER='30',YUC='31',ZAC='32')
class Path:
  def __init__(s,v): s.v=v
  def contains_points(s,pts):
    x=pts[:,0][:,None]; y=pts[:,1][:,None]; v=s.v; x1=v[:,0][None,:]; y1=v[:,1][None,:]; x2=np.roll(v[:,0],1)[None,:]; y2=np.roll(v[:,1],1)[None,:]
    c=((y1>y)!=(y2>y)) & (x < (x2-x1)*(y-y1)/(y2-y1+1e-12)+x1)
    return c.sum(axis=1)%2==1
polys={ISO[k[3:]]:[Path(np.array([[float(a),float(b)] for a,b in re.findall(r'(-?\d+\.?\d*),(-?\d+\.?\d*)',seg)])) for seg in d.split('M') if seg.strip()] for k,d in paths.items()}
random.seed(2); S=[]
for f in glob.glob('fuentes/datos/loc/*.json'):
  d=json.load(open(f,encoding='utf-8'))
  for x in random.sample(d,min(4,len(d))):
    try: S.append((x['cve_ent'],float(x['longitud']),float(x['latitud'])))
    except: pass
E=np.array([e for e,_,_ in S]); LO=np.array([a for _,a,_ in S]); LA=np.array([b for _,_,b in S])
def proj(p,lo,la):
  a,b,c,d,k=p; x=a*(lo+102)*np.cos(np.radians(la))**k + b; y=c*la+d; return x,y
def score(p):
  x,y=proj(p,LO,LA); ok=0
  for e in set(E):
    m=E==e; pts=np.c_[x[m],y[m]]; ins=np.zeros(m.sum(),bool)
    for P in polys[e]: ins|=P.contains_points(pts)
    ok+=ins.sum()
  return ok/len(E)
best=[31.855,-3249.+3760.3092+31.855*102-3249., -34.3457,1122.8586,0.0]
best[1]=31.85524*(-102)+3760.3092
bs=score(best); print('inicio',bs)
pasos=[0.4,4,0.4,4,0.25]
for ronda in range(5):
  for i in range(5):
    for sg in (-1,1):
      while True:
        q=best[:]; q[i]+=sg*pasos[i]; sc=score(q)
        if sc>bs: best,bs=q,sc
        else: break
  pasos=[p/2 for p in pasos]; print(ronda,round(bs,4),[round(v,4) for v in best])
json.dump({'a':best[0],'b':best[1],'c':best[2],'d':best[3],'k':best[4],'acierto':bs},open('fuentes/datos/proyeccion.json','w'),indent=1)
