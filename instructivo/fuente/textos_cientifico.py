"""Glosario y figuras propias (SVG) del Instructivo del Científico de Ratio Viña."""
from armar import bi, fig

GLOS = [
  ['BBCH', 'BBCH', 'Escala decimal de estadios fenológicos; para la vid, de la yema de invierno (00) a la caída de hojas (97) (Lorenz et al., 1995).', 'Decimal scale of phenological stages; for the grapevine, from winter bud (00) to leaf fall (97) (Lorenz et al., 1995).'],
  ['Brandes (algoritmo)', 'Brandes algorithm', 'Cálculo exacto de la intermediación en O(nm + n² log n) para redes ponderadas (Brandes, 2001).', 'Exact betweenness computation in O(nm + n² log n) for weighted networks (Brandes, 2001).'],
  ['Capacidad adaptativa (CA)', 'Adaptive capacity (CA)', 'Media de la regeneración y de tres subindicadores de Sarandón (diversificación, conocimiento técnico, integración institucional), en 0–1.', 'Mean of regeneration and three Sarandón sub-indicators (diversification, technical knowledge, institutional integration), on 0–1.'],
  ['Correlación cofenética', 'Cophenetic correlation', 'Correlación de Pearson entre las distancias originales y las alturas de unión del árbol (Sokal y Rohlf, 1962).', 'Pearson correlation between original distances and the tree’s merge heights (Sokal & Rohlf, 1962).'],
  ['ERA5', 'ERA5', 'Reanálisis global del ECMWF (1940 al presente, celdas de 0.25°) que reconstruye el clima pasado con un modelo y las observaciones disponibles (Hersbach et al., 2020).', 'ECMWF global reanalysis (1940 to present, 0.25° cells) reconstructing past climate with a model and the available observations (Hersbach et al., 2020).'],
  ['Enlace simple', 'Single linkage', 'Agrupamiento aglomerativo en el que la distancia entre grupos es la de su par de miembros más próximo (Sneath, 1957).', 'Agglomerative clustering in which the distance between groups is that of their closest pair of members (Sneath, 1957).'],
  ['Escenario exploratorio', 'Exploratory scenario', 'Futuro posible construido con supuestos explícitos, sin probabilidad asignada (Godet y Durance, 2011).', 'Possible future built on explicit assumptions, with no assigned probability (Godet & Durance, 2011).'],
  ['Frescor nocturno (CI)', 'Cool-night index (CI)', 'Temperatura mínima media de septiembre en el hemisferio norte (Tonietto y Carbonneau, 2004).', 'Mean September minimum temperature in the northern hemisphere (Tonietto & Carbonneau, 2004).'],
  ['Grados día de Winkler (W)', 'Winkler degree-days (W)', 'Σ abr–oct max(0, Tmed − 10) · días; cinco regiones (Amerine y Winkler, 1944).', 'Σ Apr–Oct max(0, Tmean − 10) · days; five regions (Amerine & Winkler, 1944).'],
  ['GWP100', 'GWP100', 'Potencial de calentamiento global a 100 años; para el N₂O, 273 (AR6).', '100-year global warming potential; 273 for N₂O (AR6).'],
  ['Índice de Huglin (HI)', 'Huglin index (HI)', 'Σ abr–sep de la media de (Tmed − 10) y (Tmáx − 10) por los días, por un coeficiente de latitud (Huglin, 1978).', 'Σ Apr–Sep of the mean of (Tmean − 10) and (Tmax − 10) times days, times a latitude coefficient (Huglin, 1978).'],
  ['Incidencia', 'Incidence', 'Matriz binaria elementos × actividades: 1 si el elemento participa en la actividad.', 'Binary elements × activities matrix: 1 if the element takes part in the activity.'],
  ['Lectura de Ratio Viña', 'Ratio Viña reading', 'Valor, regla o agrupación propuesta por la app y no publicada en la fuente; está marcada y es editable.', 'Value, rule or grouping proposed by the app and not published in the source; it is flagged and editable.'],
  ['Louvain', 'Louvain', 'Método de detección de comunidades que maximiza la modularidad por movimientos locales y agregación (Blondel et al., 2008).', 'Community detection method maximising modularity through local moves and aggregation (Blondel et al., 2008).'],
  ['Modularidad (Q)', 'Modularity (Q)', 'Fracción de peso dentro de las comunidades menos la esperada al azar (Newman, 2006).', 'Fraction of weight within communities minus that expected at random (Newman, 2006).'],
  ['Prospectiva', 'Foresight', 'Disciplina que construye futuros posibles para orientar la decisión presente (Berger; de Jouvenel; Godet).', 'Discipline building possible futures to guide present decisions (Berger; de Jouvenel; Godet).'],
  ['Stack de conocimiento local', 'Local knowledge stack', 'Estructura en capas del conocimiento agrícola: reglas, pasos y actividades (Díaz-José et al., 2026). En Ratio Viña, las etapas ocupan el lugar de las reglas.', 'Layered structure of farming knowledge: rules, steps and activities (Díaz-José et al., 2026). In Ratio Viña, stages take the place of rules.'],
  ['Valor estructural', 'Structural value', 'Participación relativa de un elemento en las actividades, usada como valor por defecto.', 'An element’s relative participation in activities, used as default value.'],
  ['Vector propio', 'Eigenvector centrality', 'Centralidad proporcional a la de los vecinos; se obtiene por iteración de potencias.', 'Centrality proportional to that of neighbours; obtained by power iteration.'],
]


def fig_tubo():
    W, H = 780, 250
    pasos = [('Bloques 1–5', 'Blocks 1–5', 'clima W, HI, CI; actividades a', 'climate W, HI, CI; activities a', '#6b3fa0'),
             ('Bloque 9', 'Block 9', 'valores vᵢ', 'values vᵢ', '#8a6d1f'),
             ('Bloque 10', 'Block 10', 'red G = (V, E, w)', 'network G = (V, E, w)', '#4a5d6b'),
             ('Bloque 11', 'Block 11', 'centralidades, Q, φ, árbol', 'centralities, Q, φ, tree', '#3f6fb0'),
             ('Bloques 6, 7, 12', 'Blocks 6, 7, 12', 'IR, riesgo, IS, ISGen', 'IR, risk, IS, ISGen', '#2f8f6a'),
             ('Bloque 13', 'Block 13', 'escenarios t = 0…10', 'scenarios t = 0…10', '#8a3f5a')]
    s = [f'<svg viewBox="0 0 {W} {H}" role="img">', '<defs><marker id="ft" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--muted)"/></marker></defs>']
    bw, gap = 116, 16
    for i, (a, ae, b, be, col) in enumerate(pasos):
        x = 14 + i * (bw + gap)
        s.append(f'<rect x="{x}" y="60" width="{bw}" height="96" rx="12" fill="{col}" opacity=".12" stroke="{col}"/>')
        s.append(bi(a, ae, x=str(x + bw / 2), y='92', text_anchor='middle', font_size='13', font_weight='700', fill=col))
        s.append(bi(b, be, x=str(x + bw / 2), y='118', text_anchor='middle', font_size='12'))
        if i < len(pasos) - 1:
            s.append(f'<line x1="{x+bw+2}" y1="108" x2="{x+bw+gap-2}" y2="108" stroke="var(--muted)" stroke-width="1.6" marker-end="url(#ft)"/>')
    s.append(bi('Datos del usuario o del caso publicado → modelo → indicadores. Todo se recalcula al cambiar cualquier dato.',
                'User or published-case data → model → indicators. Everything is recomputed when any input changes.', x='14', y='30', font_size='14', font_weight='700'))
    s.append(bi('Cada valor conserva su origen: ● dato publicado · ◆ lectura de Ratio Viña · supuesto editable · sin dato',
                'Every value keeps its origin: ● published data · ◆ Ratio Viña reading · editable assumption · no data', x='14', y='196', font_size='12.5', class_='mu'))
    s.append('</svg>')
    return fig(''.join(s), '<b>El flujo de cálculo.</b> De las actividades al resto de los indicadores.', '<b>The computation flow.</b> From activities to all other indicators.')


def FIGURAS():
    return {'FIG_TUBO': fig_tubo()}
