"""Nueva versión en Zenodo de los instructivos de Ratio Viña (página legal sin afiliaciones).
El token NO se escribe aquí: lo lee zenodo_guias.py (archivo fuera de los repositorios).
Uso:  python zenodo_nueva_version.py crear     → abre la nueva versión de cada registro y reserva su DOI (doi_guias.json, clave «v2»)
      python zenodo_nueva_version.py subir     → reemplaza los PDF del borrador por los rearmados
      python zenodo_nueva_version.py publicar  → publica las dos versiones"""
import json, os, sys, time
sys.argv, _paso = sys.argv[:1], (sys.argv[1] if len(sys.argv) > 1 else '')
import zenodo_guias as zg   # reutiliza token, API, llamar() y la lista de PDF
est = json.load(open(zg.ESTADO, encoding='utf-8'))
NOTA = ' Versión corregida: la página legal lista a los cinco autores sin afiliaciones.'
if _paso == 'crear':
    for k in zg.GUIAS:
        if 'v2' in est[k]: print(k, 'ya creada:', est[k]['v2']['doi']); continue
        r = zg.llamar('POST', zg.API + '/deposit/depositions/%d/actions/newversion' % est[k]['id'])
        d = zg.llamar('GET', r['links']['latest_draft'])
        m = d['metadata']
        m['version'] = '1.ª edición, corregida'
        m['description'] = m['description'].rstrip() + NOTA
        m['publication_date'] = time.strftime('%Y-%m-%d')
        m['prereserve_doi'] = True
        m.pop('doi', None)
        d = zg.llamar('PUT', zg.API + '/deposit/depositions/%d' % d['id'], {'metadata': m})
        est[k]['v2'] = {'id': d['id'], 'doi': d['metadata']['prereserve_doi']['doi'], 'bucket': d['links']['bucket']}
        print(k, 'nueva versión', est[k]['v2']['doi'])
    json.dump(est, open(zg.ESTADO, 'w', encoding='utf-8'), indent=1)
elif _paso == 'subir':
    for k, g in zg.GUIAS.items():
        v = est[k]['v2']
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
        d = zg.llamar('POST', zg.API + '/deposit/depositions/%d/actions/publish' % est[k]['v2']['id'])
        print(k, 'publicado', d.get('doi'), d.get('links', {}).get('record_html'))
else:
    print(__doc__)
