"""Verifica con NetworkX y SciPy las métricas que Ratio Viña calcula para el caso publicado de Mata de Zarza.
Entrada: pruebas/red_matazarza.json, exportado desde la app (modo ejemplo, 0.2.0).
Red sin el nodo omnipresente (PM): intermediación ponderada (longitud 1/w), Q de la partición de la app,
Louvain de NetworkX como referencia, agrupamiento medio y camino medio.
Red completa (con PM): cladograma del vecino más cercano por enlace simple sobre distancias 1/w (SciPy).
Uso:  python pruebas/verificar_matazarza.py"""
import json, os
import numpy as np, networkx as nx
from scipy.cluster.hierarchy import linkage, cophenet
from scipy.spatial.distance import squareform

d = json.load(open(os.path.join(os.path.dirname(__file__), 'red_matazarza.json'), encoding='utf-8'))
s = d['sinPM']
G = nx.Graph()
G.add_nodes_from(s['nodos'])
for a, b, w in s['aristas']:
    G.add_edge(a, b, weight=w, dist=1 / w)
bet = nx.betweenness_centrality(G, normalized=False, weight='dist')
dif = max(abs(bet[k] - v) for k, v in s['inter'].items())
Qnx = nx.community.modularity(G, [set(c) for c in s['com']], weight='weight')
lv = nx.community.louvain_communities(G, weight='weight', seed=1)
Qlv = nx.community.modularity(G, lv, weight='weight')
print('Red sin PM: nodos', G.number_of_nodes(), 'aristas', G.number_of_edges(), 'conexa', nx.is_connected(G))
print('  intermediación ponderada: diferencia máxima', f'{dif:.2e}')
print('  Q de la partición de Ratio Viña: app', round(s['Q'], 4), 'NetworkX', round(Qnx, 4), f'|Δ|={abs(s["Q"] - Qnx):.2e}')
print('  Louvain de NetworkX (semilla 1): Q', round(Qlv, 4), 'comunidades', sorted(len(c) for c in lv))
print('  agrupamiento medio: app', round(s['clus'], 4), 'NetworkX', round(nx.average_clustering(G), 4))
print('  camino medio: app', round(s['cam'], 4), 'NetworkX', round(nx.average_shortest_path_length(G), 4))

H = G.copy()
for a, b, w in d['conPM']['aristasPM']:
    H.add_edge(a, b, weight=w, dist=1 / w)
Qc = nx.community.modularity(H, nx.community.louvain_communities(H, weight='weight', seed=1), weight='weight')
print('Red completa: nodos', H.number_of_nodes(), 'aristas', H.number_of_edges())
L = dict(nx.all_pairs_dijkstra_path_length(H, weight='dist'))
act, inst = d['conPM']['actores'], d['conPM']['instituciones']
subs = {'actores': act, 'actinst': act + inst, 'todos': sorted(H.nodes)}
ok = True
for k, ids in subs.items():
    D = np.array([[L[a][b] for b in ids] for a in ids])
    Z = linkage(squareform(D, checks=False), method='single')
    r, _ = cophenet(Z, squareform(D, checks=False))
    app = d['clado'][k]
    h = app.get('alturas')
    dh = max(abs(x - y) for x, y in zip(sorted(Z[:, 2]), sorted(h))) if h else 0.0
    dr = abs(r - app['r'])
    print(f'  cladograma {k:8s} n={len(ids):2d}  max|Δaltura|={dh:.2e}  r SciPy={r:.4f}  r app={app["r"]:.4f}  |Δr|={dr:.2e}')
    ok &= dr < 1e-9 and dh < 1e-9
print('CLADOGRAMA COINCIDE' if ok else 'CLADOGRAMA DIFIERE')
