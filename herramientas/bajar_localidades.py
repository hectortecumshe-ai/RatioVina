"""Descarga el catálogo de localidades del INEGI (wscatgeo v2) para cada municipio.
Guarda un JSON por municipio en fuentes/datos/loc/EEMMM.json. Reanudable."""
import json, os, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(R, 'fuentes', 'datos'); L = os.path.join(D, 'loc'); os.makedirs(L, exist_ok=True)
muns = json.load(open(os.path.join(D, 'inegi_municipios.json'), encoding='utf-8'))
def baja(m):
    k = m['cve_ent'] + m['cve_mun']; p = os.path.join(L, k + '.json')
    if os.path.exists(p) and os.path.getsize(p) > 20: return 'ya'
    for i in range(4):
        try:
            r = urllib.request.Request(f'https://gaia.inegi.org.mx/wscatgeo/v2/localidades/{k}', headers={'User-Agent': 'Mozilla/5.0'})
            d = json.load(urllib.request.urlopen(r, timeout=90))
            json.dump(d.get('datos', []), open(p, 'w', encoding='utf-8'), ensure_ascii=False)
            return 'ok'
        except Exception as e:
            time.sleep(2 + 3 * i)
    return 'error ' + k
with ThreadPoolExecutor(6) as ex:
    res = list(ex.map(baja, muns))
print({x: res.count(x) for x in set(r if not r.startswith('error') else 'error' for r in res)})
print([r for r in res if r.startswith('error')][:20])
