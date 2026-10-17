"""Deposita en Zenodo los instructivos de Ratio Viña, uno por registro (PDF en español + PDF en inglés), con DOI propio.
El token NO se escribe aquí: se lee del archivo C:\\Users\\<usuario>\\.zenodo_token (fuera de los repositorios).
Uso:
  python zenodo_guias.py reservar   → crea los dos borradores y reserva sus DOI (los escribe en doi_guias.json)
  python zenodo_guias.py subir      → sube los PDF (ya rearmados con su DOI) a cada borrador
  python zenodo_guias.py publicar   → publica los dos registros
Solo usa la biblioteca estándar de Python (urllib)."""
import json, os, sys, urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, '..', '..'))
API = 'https://zenodo.org/api'
_rutas = [os.environ.get('ZENODO_TOKEN_FILE', ''), r'D:\CLAUDE\ZENODO\TOKEN\TOKEN.txt', os.path.join(os.path.expanduser('~'), '.zenodo_token')]
TOKEN = open(next(r for r in _rutas if r and os.path.isfile(r)), encoding='utf-8').read().strip()
ESTADO = os.path.join(AQUI, 'doi_guias.json')
CREADORES = [{'name': 'Mojica-Zárate, Héctor Tecumshé', 'orcid': '0000-0002-9067-3983'}, {'name': 'Díaz-José, Oscar'},
             {'name': 'Sánchez-Moreno, Edgar Arturo'}, {'name': 'Alejo-Bello, Sergio'}]
GUIAS = {
  'productor': dict(pdfs=['RatioVina-Instructivo-Productor.pdf', 'RatioVina-Producer-Guide.pdf'],
    title='Ratio Viña: Instructivo del Productor / Producer Guide (1.ª edición, versión 0.2.0)',
    description='Instructivo bilingüe (español e inglés) para viticultores, técnicos y encuestadores de Ratio Viña 0.2.0, aplicación libre para un estudio nacional del conocimiento local de la vid en México como sistema complejo adaptativo. Recorre los 15 bloques con un caso real publicado: el establecimiento de uva de mesa (Perlette, Flame Seedless y Summer Royal) en una parcela cooperante de 1 ha en Mata de Zarza, Puente Nacional, Veracruz (Mojica-Zárate et al., 2026, UACh): historial del viñedo, clima vitícola (Winkler, Huglin y frescor nocturno), cuestionario base con la etapa de establecimiento, regeneración, riesgo, red, sostenibilidad, prospectiva, informe y atlas nacional. Incluye guía de entrevista, cinco hojas de campo imprimibles, problemas frecuentes y glosario. 1.ª edición, octubre de 2026.'),
  'cientifico': dict(pdfs=['RatioVina-Instructivo-Cientifico.pdf', 'RatioVina-Scientist-Guide.pdf'],
    title='Ratio Viña: Instructivo del Científico / Scientist Guide (1.ª edición, versión 0.2.0)',
    description='Instructivo bilingüe (español e inglés) para investigación y docencia de Ratio Viña 0.2.0: modelo de datos con la etapa de establecimiento, índices de clima vitícola (Winkler, Huglin, frescor nocturno) con datos del reanálisis ERA5, red ponderada y su estadística, cladograma, sostenibilidad, regeneración, riesgo, modelo de escenarios, agregación del atlas nacional, validación frente a NetworkX y SciPy con el caso publicado de Mata de Zarza, Veracruz, reproducibilidad y ejemplo resuelto a mano. 1.ª edición, octubre de 2026.'),
}
def llamar(metodo, url, datos=None, binario=None, tipo='application/json'):
    cuerpo = binario if binario is not None else (json.dumps(datos).encode('utf-8') if datos is not None else None)
    r = urllib.request.Request(url, data=cuerpo, method=metodo, headers={'Authorization': 'Bearer ' + TOKEN, 'Content-Type': tipo if cuerpo is not None else 'application/json'})
    with urllib.request.urlopen(r, timeout=1800) as f:
        t = f.read(); return json.loads(t) if t else {}
def meta(g):
    return {'metadata': {'upload_type': 'publication', 'publication_type': 'other', 'title': g['title'], 'description': g['description'],
        'creators': CREADORES, 'license': 'cc-by-4.0', 'language': 'spa', 'version': '1.ª edición', 'prereserve_doi': True,
        'keywords': ['Ratio Viña', 'instructivo', 'manual', 'vid', 'uva de mesa', 'establecimiento', 'índice de Winkler', 'sistemas complejos adaptativos', 'conocimiento local', 'atlas nacional', 'sostenibilidad', 'Veracruz', 'México'],
        'related_identifiers': [{'identifier': '10.5281/zenodo.23439305', 'relation': 'isSupplementTo', 'scheme': 'doi', 'resource_type': 'software'},
                                {'identifier': '978-607-12-0712-8', 'relation': 'references', 'scheme': 'isbn'},
                                {'identifier': '10.1002/qj.3803', 'relation': 'references', 'scheme': 'doi'}]}}
est = json.load(open(ESTADO, encoding='utf-8')) if os.path.exists(ESTADO) else {}
paso = sys.argv[1] if len(sys.argv) > 1 else ''
if paso == 'reservar':
    for k, g in GUIAS.items():
        if k in est: print(k, 'ya reservado:', est[k]['doi']); continue
        d = llamar('POST', API + '/deposit/depositions', meta(g))
        est[k] = {'id': d['id'], 'doi': d['metadata']['prereserve_doi']['doi'], 'bucket': d['links']['bucket']}
        print(k, est[k]['doi'])
    json.dump(est, open(ESTADO, 'w', encoding='utf-8'), indent=1)
elif paso == 'subir':
    import time
    for k, g in GUIAS.items():
        ya = {f['filename']: f.get('filesize') for f in llamar('GET', API + '/deposit/depositions/%d/files' % est[k]['id'])}
        for pdf in g['pdfs']:
            ruta = os.path.join(RAIZ, 'instructivo', pdf)
            if ya.get(pdf) == os.path.getsize(ruta): print(k, 'ya estaba', pdf); continue
            for intento in range(4):
                try:
                    llamar('PUT', est[k]['bucket'] + '/' + pdf, binario=open(ruta, 'rb').read(), tipo='application/octet-stream')
                    print(k, 'subido', pdf, round(os.path.getsize(ruta) / 1048576, 1), 'MB', flush=True); break
                except Exception as e:
                    print(k, 'reintento', intento + 1, pdf, type(e).__name__, flush=True); time.sleep(10)
            else: raise SystemExit('no se pudo subir ' + pdf)
elif paso == 'publicar':
    for k in GUIAS:
        d = llamar('POST', API + '/deposit/depositions/%d/actions/publish' % est[k]['id'])
        print(k, 'publicado', d.get('doi'), d.get('links', {}).get('record_html'))
else:
    print(__doc__)
