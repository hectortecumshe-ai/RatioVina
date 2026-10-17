"""Glosario y figuras propias (SVG) del Instructivo del Productor de Ratio Viña."""
from armar import bi, fig, BLOQUES

GLOS = [['Actividad', 'Activity', 'Lo que se hace dentro de un paso de manejo (por ejemplo, «riego de las cepas antes de plantar»). Cada actividad liga a los elementos que participan en ella.', 'What is done within a management step (for example, “watering the holes before planting”). Each activity links the elements taking part in it.'],
  ['Actividad innovadora', 'Innovative activity', 'Una práctica nueva que el viñedo agregó al cuestionario base; en la app se agrega con «+ Actividad innovadora».', 'A new practice the vineyard added to the baseline questionnaire; in the app it is added with “+ Innovative activity”.'],
  ['Acolchado', 'Mulch', 'Capa de material vegetal seco alrededor de la planta que conserva la humedad y protege el suelo.', 'A layer of dry plant material around the vine that keeps moisture in and protects the soil.'],
  ['Barbado', 'Rooted cutting', 'Esqueje que ya echó raíces y se planta en el sitio definitivo.', 'A cutting that has already rooted and is planted in its final place.'],
  ['BBCH', 'BBCH', 'Escala que numera las etapas de desarrollo de la vid, de la yema de invierno a la caída de hojas (Lorenz et al., 1995).', 'Scale numbering the vine’s development stages, from winter bud to leaf fall (Lorenz et al., 1995).'],
  ['Cámara de enraizamiento', 'Rooting chamber', 'Fosa en el suelo, llena de arena de río húmeda, donde los esquejes forman raíces durante unos 45 días antes de plantarse (Mojica-Zárate et al., 2026).', 'A pit in the ground, filled with moist river sand, where cuttings form roots for about 45 days before planting (Mojica-Zárate et al., 2026).'],
  ['Capacidad adaptativa', 'Adaptive capacity', 'Qué tanto puede el viñedo absorber un golpe y reorganizarse. Ratio Viña la mide con la regeneración, la diversificación, el conocimiento técnico y las instituciones.', 'How well the vineyard can absorb a shock and reorganise. Ratio Viña measures it with regeneration, diversification, technical knowledge and institutions.'],
  ['Cepa de plantación', 'Planting hole', 'Hoyo donde se planta el esqueje; en Mata de Zarza, de 20 cm de diámetro y 70 cm de profundidad.', 'Hole where the cutting is planted; in Mata de Zarza, 20 cm wide and 70 cm deep.'],
  ['Cladograma', 'Cladogram', 'Árbol que agrupa a los elementos según qué tan cerca están en la red: las ramas cortas son vecinos muy ligados.', 'Tree that groups elements by how close they are in the network: short branches are tightly linked neighbours.'],
  ['Comunidad', 'Community', 'Grupo de elementos que se relacionan más entre sí que con el resto de la red.', 'Group of elements more related to each other than to the rest of the network.'],
  ['Conducción', 'Training system', 'La forma que se le da a la planta sobre su estructura: espaldera, cordón, parral, lira o vaso.', 'The shape given to the vine on its structure: vertical trellis, cordon, pergola, lyre or bush vine.'],
  ['Elemento', 'Element', 'Todo lo que interviene en el sistema: actores, instituciones, insumos, equipo, recursos naturales y financieros, conocimientos, políticas, perturbaciones y productos.', 'Everything taking part in the system: actors, institutions, inputs, equipment, natural and financial resources, knowledge, policies, disturbances and products.'],
  ['Envero', 'Veraison', 'Momento en que la baya cambia de color y empieza a madurar.', 'The moment the berry changes colour and starts ripening.'],
  ['Escenario', 'Scenario', 'Un futuro posible construido con supuestos explícitos. No es un pronóstico.', 'A possible future built on explicit assumptions. It is not a forecast.'],
  ['Esqueje', 'Cutting', 'Trozo de sarmiento de una poda, de unos 70 cm y con al menos seis nudos, que se enraíza para obtener una planta nueva.', 'A piece of cane from pruning, about 70 cm long with at least six nodes, rooted to obtain a new vine.'],
  ['Frescor nocturno', 'Cool-night index', 'Temperatura mínima media del mes de maduración; dice qué tan frescas son las noches (Tonietto y Carbonneau, 2004).', 'Mean minimum temperature of the ripening month; it says how cool the nights are (Tonietto and Carbonneau, 2004).'],
  ['Grados día de Winkler', 'Winkler degree-days', 'Suma del calor útil para la vid de abril a octubre, por encima de 10 °C (Amerine y Winkler, 1944).', 'Sum of heat useful to the vine from April to October, above 10 °C (Amerine and Winkler, 1944).'],
  ['Huella de carbono', 'Carbon footprint', 'Gases de efecto invernadero emitidos por hectárea (diésel, nitrógeno y urea), en kg de CO₂ equivalente.', 'Greenhouse gases emitted per hectare (diesel, nitrogen and urea), in kg of CO₂ equivalent.'],
  ['Índice de Huglin', 'Huglin index', 'Suma del calor de abril a septiembre que da más peso a las horas de sol (Huglin, 1978).', 'Sum of April–September heat that weighs sunny hours more (Huglin, 1978).'],
  ['Índice de regeneración', 'Regeneration index', 'Promedio de las ocho perillas de regeneración, de 0 a 100. Dice si el viñedo devuelve más de lo que toma.', 'Average of the eight regeneration knobs, from 0 to 100. Tells whether the vineyard gives back more than it takes.'],
  ['Índice de riesgo', 'Risk index', 'Promedio del riesgo de todas las amenazas que aplican, de 0 a 100.', 'Average risk of all applicable hazards, from 0 to 100.'],
  ['Índice de sostenibilidad (IS)', 'Sustainability index (IS)', 'Qué tanto suma o resta cada actividad al suelo, el agua, la atmósfera, la vegetación y la fauna, de 0 a 1 (0.5 es neutro).', 'How much each activity adds to or subtracts from soil, water, atmosphere, vegetation and fauna, from 0 to 1 (0.5 is neutral).'],
  ['Intermediación', 'Betweenness', 'Cuántos caminos cortos de la red pasan por un elemento: mide quién sirve de puente.', 'How many short network paths pass through an element: it measures who acts as a bridge.'],
  ['ISGen', 'ISGen', 'Índice general de sostenibilidad de Sarandón: promedio de las dimensiones económica, ecológica y sociocultural, de 0 a 4.', 'Sarandón’s general sustainability index: average of the economic, ecological and socio-cultural dimensions, from 0 to 4.'],
  ['Lectura de Ratio Viña', 'Ratio Viña reading', 'Un valor o una agrupación propuesta por la app, no publicada en la fuente. Siempre está marcada y se puede cambiar.', 'A value or grouping proposed by the app, not published in the source. It is always flagged and can be changed.'],
  ['Línea base', 'Baseline', 'La foto del viñedo en una fecha, para compararla después y ver si mejora.', 'A snapshot of the vineyard on a date, to compare later and see whether it improves.'],
  ['Matriz de riesgos', 'Risk matrix', 'Tabla de 5 × 5 que cruza qué tan probable es un riesgo con cuánto daño haría.', 'A 5 × 5 table crossing how likely a risk is with how much damage it would do.'],
  ['Microorganismos de montaña', 'Mountain microorganisms', 'Bioinsumo hecho con microorganismos colectados en el suelo de un bosque y reproducidos en la finca, que se aplica al suelo.', 'A bio-input made from microorganisms collected from forest soil and multiplied on the farm, applied to the soil.'],
  ['Modularidad (Q)', 'Modularity (Q)', 'Qué tan marcados están los grupos (comunidades) de la red. Por encima de 0.3, los grupos son claros.', 'How marked the network’s groups (communities) are. Above 0.3, groups are clear.'],
  ['ODS', 'SDG', 'Objetivos de Desarrollo Sostenible de la Agenda 2030 de las Naciones Unidas.', 'Sustainable Development Goals of the United Nations 2030 Agenda.'],
  ['Paso de manejo', 'Management step', 'Una etapa del ciclo del viñedo (por ejemplo, «propagación de esquejes»). El cuestionario base tiene 37.', 'A stage of the vineyard cycle (for example, “propagating cuttings”). The baseline questionnaire has 37.'],
  ['Perilla', 'Knob', 'Control deslizante que se mueve como el volumen de un aparato, de un valor bajo a uno alto.', 'A slider you move like a volume control, from a low value to a high one.'],
  ['Pie franco', 'Own-rooted vine', 'Vid que crece sobre sus propias raíces, sin portainjerto.', 'A vine growing on its own roots, without a rootstock.'],
  ['Poda de formación', 'Training pruning', 'Poda de los primeros años que da forma a la planta; en Mata de Zarza, la del primer año se hace desde la base del tallo.', 'Pruning in the first years that shapes the vine; in Mata de Zarza, the first-year one is done from the base of the stem.'],
  ['Portainjerto', 'Rootstock', 'La planta que pone las raíces cuando la variedad se injerta sobre otra.', 'The plant that provides the roots when the variety is grafted onto another.'],
  ['Prospectiva', 'Foresight', 'Disciplina que explora futuros posibles para decidir mejor hoy.', 'Discipline that explores possible futures to decide better today.'],
  ['Reanálisis (ERA5)', 'Reanalysis (ERA5)', 'Reconstrucción del clima pasado con un modelo y todas las observaciones disponibles; da datos para cualquier punto, aunque no haya estación (Hersbach et al., 2020).', 'A reconstruction of past climate with a model and all available observations; it gives data for any point, even without a station (Hersbach et al., 2020).'],
  ['Red ponderada', 'Weighted network', 'Red donde cada vínculo tiene un grosor: más grueso si los elementos comparten muchas actividades valiosas.', 'Network in which each link has a thickness: thicker if the elements share many valuable activities.'],
  ['Regeneración', 'Regeneration', 'Que el viñedo mejore con cada ciclo el suelo, el agua y la biodiversidad de los que depende.', 'The vineyard improving, each cycle, the soil, water and biodiversity it depends on.'],
  ['Sistema complejo adaptativo', 'Complex adaptive system', 'Conjunto de agentes y recursos que interactúan, aprenden y se adaptan; de sus relaciones surgen comportamientos que nadie diseñó.', 'A set of interacting agents and resources that learn and adapt; behaviours nobody designed emerge from their relationships.'],
  ['Sostenibilidad', 'Sustainability', 'Producir hoy sin comprometer la capacidad de producir mañana, en lo ambiental, lo económico y lo social.', 'Producing today without compromising the capacity to produce tomorrow, environmentally, economically and socially.'],
  ['Stack de conocimiento local', 'Local knowledge stack', 'Organización en capas del saber de una localidad sobre un cultivo: reglas, pasos y actividades (Díaz-José et al., 2026).', 'Layered organisation of a locality’s knowledge of a crop: rules, steps and activities (Díaz-José et al., 2026).'],
  ['Valor', 'Value', 'Importancia de un elemento para el sistema en cuatro dimensiones: económica, de uso, cultural y ecológica. No es lo mismo que el precio.', 'An element’s importance to the system in four dimensions: economic, use, cultural and ecological. Not the same as price.']]


def fig_telar():
    W, H = 780, 300
    fases = [(0, 5, 'Tu viñedo', 'Your vineyard', '#6b3fa0'), (5, 9, 'Evaluar', 'Assess', '#b8562e'), (9, 12, 'Tejer y leer', 'Weave and read', '#3f6fb0'), (12, 14, 'Futuro e informe', 'Future and report', '#8a3f5a'), (14, 15, 'Atlas', 'Atlas', '#2f5d50')]
    s = [f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="Ratio Viña">']
    cw = (W - 40) / 15
    for a, b, es, en, col in fases:
        x0, x1 = 20 + a * cw, 20 + b * cw
        s.append(f'<rect x="{x0+3:.1f}" y="18" width="{x1-x0-6:.1f}" height="30" rx="8" fill="{col}" opacity=".14"/>')
        s.append(bi(es, en, x=f'{(x0+x1)/2:.1f}', y='38', text_anchor='middle', font_size='13', font_weight='700', fill=col))
    for i, bl in enumerate(BLOQUES):
        cx = 20 + i * cw + cw / 2
        s.append(f'<circle cx="{cx:.1f}" cy="120" r="22" fill="var(--b{i+1})"/><text x="{cx:.1f}" y="126" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">{i+1}</text>')
        s.append(f'<g transform="translate({cx:.1f} 156) rotate(40)">' + bi(bl[1], bl[2], x='0', y='0', font_size='12.5') + '</g>')
        if i < 14:
            s.append(f'<line x1="{cx+23:.1f}" y1="120" x2="{cx+cw-23:.1f}" y2="120" stroke="var(--line2)" stroke-width="2"/>')
    # flechas de retroalimentación
    def arco(i, j, es, en, y):
        xi, xj = 20 + i * cw + cw / 2, 20 + j * cw + cw / 2
        return (f'<path d="M{xi:.1f},96 C{xi:.1f},{y} {xj:.1f},{y} {xj:.1f},96" fill="none" stroke="var(--acc)" stroke-width="1.6" stroke-dasharray="4 4" marker-end="url(#fl)"/>'
                + bi(es, en, x=f'{(xi+xj)/2:.1f}', y=str(y + 12), text_anchor='middle', font_size='11.5', class_='mu'))
    s.append('<defs><marker id="fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--acc)"/></marker></defs>')
    s.append(arco(4, 5, 'actividades', 'activities', 64))
    s.append(arco(2, 6, 'clima → riesgo', 'climate → risk', 58))
    s.append('</svg>')
    return fig(''.join(s), '<b>Los quince bloques.</b> Los bloques 1 a 5 describen tu viñedo; del 6 al 9 lo evalúas; en el 10 se teje la red, que lees en el 11 y el 12; el 13 mira al futuro, el 14 lo resume todo y el 15 junta muchos viñedos en el atlas nacional. Las flechas punteadas son ejemplos de cómo un bloque alimenta a otro.',
               '<b>The fifteen blocks.</b> Blocks 1–5 describe your vineyard; 6–9 assess it; 10 weaves the network, which you read in 11 and 12; 13 looks to the future, 14 sums everything up and 15 combines many vineyards into the national atlas. Dashed arrows are examples of one block feeding another.')


def fig_perilla():
    W, H = 760, 210
    x0, x1 = 60, 700
    X = lambda v: x0 + v / 4 * (x1 - x0)
    niv = [('0 · Nulo', '0 · None'), ('1 · Bajo', '1 · Low'), ('2 · Medio', '2 · Medium'), ('3 · Alto', '3 · High'), ('4 · Muy alto', '4 · Very high')]
    cols = ['#c43a2f', '#e0803a', '#d9b13a', '#7fb35a', '#2f8f6a']
    s = [f'<svg viewBox="0 0 {W} {H}" role="img">']
    s.append(f'<rect x="{x0}" y="70" width="{x1-x0}" height="10" rx="5" fill="var(--soft)"/>')
    s.append(f'<rect x="{x0}" y="70" width="{X(3)-x0:.1f}" height="10" rx="5" fill="var(--b6)"/>')
    s.append(f'<circle cx="{X(3):.1f}" cy="75" r="14" fill="var(--paper)" stroke="var(--b6)" stroke-width="4"/>')
    for v in range(5):
        s.append(f'<line x1="{X(v):.1f}" x2="{X(v):.1f}" y1="92" y2="100" class="ln"/>')
        s.append(f'<circle cx="{X(v):.1f}" cy="124" r="8" fill="{cols[v]}"/>')
        s.append(bi(niv[v][0], niv[v][1], x=f'{X(v):.1f}', y='154', text_anchor='middle', font_size='13.5', font_weight='700'))
    s.append(bi('Como el volumen de un aparato: mueve la perilla hasta que diga lo que pasa en tu parcela.',
                'Like a volume control: move the knob until it says what happens on your plot.', x=str(x0), y='34', font_size='15', font_weight='700'))
    s.append(bi('La app propone un valor a partir de tus actividades; si lo cambias, la tarjeta se colorea y aparece «volver al sugerido».',
                'The app proposes a value from your activities; if you change it, the card is shaded and “back to suggested” appears.', x=str(x0), y='190', font_size='12.5', class_='mu'))
    s.append('</svg>')
    return fig(''.join(s), '<b>La escala de las perillas.</b> Regeneración y valor usan escalas ordinales: cada punto tiene un significado claro, no un número inventado.',
               '<b>The knob scale.</b> Regeneration and value use ordinal scales: each point has a clear meaning, not a made-up number.')


def fig_matriz():
    W, H = 760, 330
    c, L, T = 48, 120, 20
    s = [f'<svg viewBox="0 0 {W} {H}" role="img">']
    def col(r): return '#3f9b5f' if r <= 4 else '#d9b13a' if r <= 9 else '#e0803a' if r <= 15 else '#c43a2f'
    for p in range(1, 6):
        for i in range(1, 6):
            x, y = L + (i - 1) * c, T + (5 - p) * c
            s.append(f'<rect x="{x}" y="{y}" width="{c-3}" height="{c-3}" rx="6" fill="{col(p*i)}" fill-opacity=".25" stroke="{col(p*i)}" stroke-opacity=".6"/>'
                     f'<text x="{x+(c-3)/2}" y="{y+c/2+3}" text-anchor="middle" font-size="12" class="mu">{p*i}</text>')
    for p in range(1, 6):
        s.append(f'<text x="{L-8}" y="{T+(5-p)*c+c/2+3}" text-anchor="end" font-size="12" class="mu">{p}</text>')
        s.append(f'<text x="{L+(p-1)*c+c/2-1}" y="{T+5*c+14}" text-anchor="middle" font-size="12" class="mu">{p}</text>')
    s.append(bi('Impacto →', 'Impact →', x=str(L + 2.5 * c), y=str(T + 5 * c + 34), text_anchor='middle', font_size='13', font_weight='700'))
    s.append(f'<g transform="translate({L-34} {T+2.5*c}) rotate(-90)">' + bi('Probabilidad →', 'Likelihood →', x='0', y='0', text_anchor='middle', font_size='13', font_weight='700') + '</g>')
    lx = L + 5 * c + 40
    for k, (es, en, r) in enumerate([('Bajo: 1 a 4', 'Low: 1 to 4', 4), ('Medio: 5 a 9', 'Medium: 5 to 9', 9), ('Alto: 10 a 15', 'High: 10 to 15', 15), ('Muy alto: 16 a 25', 'Very high: 16 to 25', 25)]):
        y = T + 20 + k * 30
        s.append(f'<rect x="{lx}" y="{y-12}" width="16" height="16" rx="3" fill="{col(r)}"/>' + bi(es, en, x=str(lx + 24), y=str(y + 1), font_size='13.5'))
    y = T + 160
    s.append(bi('Ejemplo: escasez de agua, probabilidad 4 e impacto 4', 'Example: water scarcity, likelihood 4 and impact 4', x=str(lx), y=str(y), font_size='13.5', font_weight='700'))
    s.append(bi('riesgo bruto = 4 × 4 = 16 (muy alto)', 'raw risk = 4 × 4 = 16 (very high)', x=str(lx), y=str(y + 24), font_size='13.5'))
    s.append(bi('con capacidad adaptativa de 48: 16 × (1 − 0.4 × 0.48) = 12.9', 'with adaptive capacity of 48: 16 × (1 − 0.4 × 0.48) = 12.9', x=str(lx), y=str(y + 48), font_size='13.5'))
    s.append(bi('→ queda en alto', '→ it ends up high', x=str(lx), y=str(y + 72), font_size='13.5', font_weight='700'))
    s.append('</svg>')
    return fig(''.join(s), '<b>Cómo se lee la matriz.</b> Cada celda multiplica probabilidad por impacto. La capacidad adaptativa de tu sistema y los controles que ya tienes bajan el riesgo. El ejemplo es la escasez de agua del caso de Mata de Zarza.',
               '<b>How to read the matrix.</b> Each cell multiplies likelihood by impact. Your system’s adaptive capacity and the controls you already have lower the risk. The example is water scarcity in the Mata de Zarza case.')


RIESGOS_HOJA = [('Sequía o lluvias tardías', 'Drought or late rains'), ('Helada', 'Frost'), ('Granizo', 'Hail'), ('Lluvias intensas o inundación', 'Heavy rain or flooding'),
  ('Ola de calor', 'Heatwave'), ('Ciclones y huracanes', 'Cyclones and hurricanes'), ('Falta de frío invernal', 'Lack of winter chill'), ('Plagas', 'Pests'),
  ('Enfermedades de hongos', 'Fungal diseases'), ('Enfermedad de Pierce', 'Pierce’s disease'), ('Hormiga cortadora', 'Leaf-cutter ants'), ('Daño por animales', 'Animal damage'),
  ('Material vegetal enfermo o mal enraizado', 'Diseased or poorly rooted material'), ('Deriva de herbicidas', 'Herbicide drift'), ('Malezas resistentes o invasoras', 'Resistant or invasive weeds'),
  ('Caída del precio de venta', 'Fall in sale price'), ('Alza de insumos y servicios', 'Rise in input and service costs'), ('Cultivo nuevo sin mercado', 'New crop without a market'),
  ('Intermediarismo o falta de comprador', 'Middlemen or no buyer'), ('Falta de mano de obra y de relevo', 'Labour shortage and no succession'), ('Abandono del cultivo', 'Abandoning the crop'),
  ('Pérdida del saber local', 'Loss of local knowledge'), ('Inseguridad o robo', 'Insecurity or theft'), ('Retiro de programas y apoyos', 'Withdrawal of programmes and support'),
  ('Conflictos de tenencia de la tierra', 'Land tenure conflicts'), ('Erosión y pérdida de fertilidad', 'Erosion and fertility loss'), ('Escasez de agua', 'Water scarcity'),
  ('Suelos arcillosos o mal drenados', 'Clay or poorly drained soils')]


def FIGURAS():
    hoja = ''.join(f'<tr><td lang="es">{es}</td><td lang="en">{en}</td><td></td><td></td><td></td><td>&nbsp;</td></tr>' for es, en in RIESGOS_HOJA)
    return {'FIG_TELAR': fig_telar(), 'FIG_PERILLA': fig_perilla(), 'FIG_MATRIZ': fig_matriz(), 'HOJA_RIESGOS': hoja}
