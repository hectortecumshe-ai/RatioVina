"""Nueva versión en Zenodo de los instructivos (Productor y Científico) de una app Ratio.
El token NO se escribe aquí: lo lee zenodo_guias.py (archivo fuera de los repositorios).
Uso:  python zenodo_nueva_version.py crear "nota"  → abre la nueva versión de cada registro, a partir de la más reciente, y reserva su DOI
      python zenodo_nueva_version.py subir           → reemplaza los PDF del borrador por los rearmados
      python zenodo_nueva_version.py publicar        → publica las dos versiones
      python zenodo_nueva_version.py doi             → imprime los DOI de la versión en curso
Las versiones quedan en doi_guias.json con las claves v2, v3, …"""
import json, os, sys, time
_args = sys.argv[1:]; sys.argv = sys.argv[:1]
_paso = _args[0] if _args else ''
import zenodo_guias as zg   # reutiliza token, API, llamar() y la lista de PDF
est = json.load(open(zg.ESTADO, encoding='utf-8'))
def claves(k): return sorted([c for c in est[k] if c.startswith('v') and c[1:].isdigit()], key=lambda c: int(c[1:]))
def actual(k):
    c = claves(k); return est[k][c[-1]] if c else est[k]
if _paso == 'crear':
    nota = _args[1] if len(_args) > 1 else ''
    for k in zg.GUIAS:
        a = actual(k)
        if a.get('borrador'): print(k, 'ya hay un borrador:', a['doi']); continue
        r = zg.llamar('POST', zg.API + '/deposit/depositions/%d/actions/newversion' % a['id'])
        d = zg.llamar('GET', r['links']['latest_draft'])
        m = d['metadata']
        if nota and nota not in m['description']: m['description'] = m['description'].rstrip() + ' ' + nota
        m['publication_date'] = time.strftime('%Y-%m-%d'); m['prereserve_doi'] = True; m.pop('doi', None)
        d = zg.llamar('PUT', zg.API + '/deposit/depositions/%d' % d['id'], {'metadata': m})
        c = 'v%d' % (int(claves(k)[-1][1:]) + 1 if claves(k) else 2)
        est[k][c] = {'id': d['id'], 'doi': d['metadata']['prereserve_doi']['doi'], 'bucket': d['links']['bucket'], 'borrador': True}
        print(k, c, est[k][c]['doi'])
    json.dump(est, open(zg.ESTADO, 'w', encoding='utf-8'), indent=1)
elif _paso == 'doi':
    for k in zg.GUIAS: print(k, actual(k)['doi'])
elif _paso == 'subir':
    for k, g in zg.GUIAS.items():
        v = actual(k); assert v.get('borrador'), k
        for f in zg.llamar('GET', zg.API + '/deposit/depositions/%d/files' % v['id']):
            zg.llamar('DELETE', zg.API + '/deposit/depositions/%d/files/%s' % (v['id'], f['id']))
        for pdf in g['pdfs']:
            ruta = os.path.join(zg.RAIZ, 'instructivo', pdf)
            for intento in range(4):
                try:
                    zg.llamar('PUT', v['bucket'] + '/' + pdf, binario=open(ruta, 'rb').read(), tipo='application/octet-stream')
                    print(k, 'subido', pdf, round(os.path.getsize(ruta) / 1048576, 1), 'MB', flush=True); break
                except Exception as e:
                    print(k, 'reintento', intento + 1, type(e).__name__, flush=True); time.sleep(10)
            else: raise SystemExit('no se pudo subir ' + pdf)
elif _paso == 'publicar':
    for k in zg.GUIAS:
        v = actual(k); assert v.get('borrador'), k
        d = zg.llamar('POST', zg.API + '/deposit/depositions/%d/actions/publish' % v['id'])
        v.pop('borrador', None)
        print(k, 'publicado', d.get('doi'), d.get('links', {}).get('record_html'))
    json.dump(est, open(zg.ESTADO, 'w', encoding='utf-8'), indent=1)
else:
    print(__doc__)
