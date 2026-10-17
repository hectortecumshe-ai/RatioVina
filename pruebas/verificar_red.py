"""Verifica con NetworkX las métricas que Ratio Telar calcula para la red del maíz criollo (sin el nodo de productores).
Entrada: pruebas/red_maiz.json exportado desde la app (aristas con peso, intermediación, Q y comunidades)."""
import json, networkx as nx
d=json.load(open('pruebas/red_maiz.json',encoding='utf-8'))
G=nx.Graph()
for a,b,w in d['E']: G.add_edge(a,b,weight=w,dist=1/w)
bet=nx.betweenness_centrality(G,normalized=False,weight='dist')
dif=max(abs(bet[k]-v) for k,v in d['bet'].items())
part=[set(c) for c in d['com']]
Qnx=nx.community.modularity(G,part,weight='weight')
lv=nx.community.louvain_communities(G,weight='weight',seed=1); Qlv=nx.community.modularity(G,lv,weight='weight')
print('nodos',G.number_of_nodes(),'aristas',G.number_of_edges())
print('intermediación ponderada: diferencia máxima', round(dif,6))
print('Q de la partición de Ratio Telar: app',round(d['Q'],4),'NetworkX',round(Qnx,4))
print('Q de Louvain de NetworkX (semilla 1):',round(Qlv,4),'comunidades',sorted(len(c) for c in lv))
print('agrupamiento medio: app',round(d['clus'],4),'NetworkX',round(nx.average_clustering(G),4))
print('camino medio: app',round(d['aspl'],4),'NetworkX',round(nx.average_shortest_path_length(G),4) if nx.is_connected(G) else 'no conexa')
