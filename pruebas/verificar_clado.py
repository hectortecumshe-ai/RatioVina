"""Verifica el cladograma del vecino más cercano de Ratio Telar (Bloque 8) contra SciPy y NetworkX.
Red: pruebas/clado_maiz.json (red del maíz criollo de Calpan exportada desde Ratio Telar, 2026-10-11).
Distancia: camino más corto con longitud 1/peso (NetworkX, Dijkstra). Agrupamiento: enlace simple (scipy.cluster.hierarchy.linkage, method='single').
Compara las alturas de unión y la correlación cofenética con las que calcula la app (copiadas abajo).
Uso:  python pruebas/verificar_clado.py"""
import json, os
import numpy as np, networkx as nx
from scipy.cluster.hierarchy import linkage, cophenet
from scipy.spatial.distance import squareform

R = json.load(open(os.path.join(os.path.dirname(__file__), 'clado_maiz.json'), encoding='utf-8'))
G = nx.Graph()
for a, b, w in R['E']:
    G.add_edge(a, b, w=w, l=1 / w)
L = dict(nx.all_pairs_dijkstra_path_length(G, weight='l'))

ACT = ['PM', 'PI', 'AT', 'IAC', 'AL', 'FAM', 'COMP']
INST = ['UACH', 'COLPOS', 'BUAP', 'DGTEYCM', 'SDR', 'STP', 'CESV', 'CIMMYT']
APP = {  # alturas y r cofenética calculadas por Ratio Telar 0.2 (maíz, Calpan, sin ocultar PM)
    'actores': (ACT, [0.22178776975932374, 1.1524430571616109, 1.7743021580745904, 1.7743021580745904, 4.47213595499958, 20], 0.991693099129785),
    'actinst': (ACT + INST, [0.22178776975932374, 1.1524430571616109, 1.7743021580745904, 1.7743021580745904, 4.47213595499958] + [11.902380714238083] * 4 + [20] * 5, 0.8526378103676852),
    'todos': (sorted(G.nodes), None, 0.9103325152943076),
}
ok = True
for k, (ids, h_app, r_app) in APP.items():
    ids = [i for i in ids if i in G]
    D = np.array([[L[a][b] for b in ids] for a in ids])
    Z = linkage(squareform(D, checks=False), method='single')
    r, _ = cophenet(Z, squareform(D, checks=False))
    dh = max(abs(a - b) for a, b in zip(sorted(Z[:, 2]), sorted(h_app))) if h_app else 0.0
    dr = abs(r - r_app)
    print(f'{k:8s} n={len(ids):2d}  max|Δaltura|={dh:.2e}  r SciPy={r:.6f}  r app={r_app:.6f}  |Δr|={dr:.2e}')
    ok &= dh < 1e-9 and dr < 1e-9
print('COINCIDE' if ok else 'DIFIERE')
