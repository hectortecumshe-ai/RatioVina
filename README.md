<p align="center"><img src="logo.svg" width="96" alt="Ratio Viña"></p>

# Ratio Viña

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23439305.svg)](https://doi.org/10.5281/zenodo.23439305)

👉 **https://hectortecumshe-ai.github.io/RatioVina/**

**El conocimiento local de la vid en México como sistema complejo adaptativo, con índices de regeneración y riesgo.** Aplicación de **Ratio Complexus**, el ala de la suite [Ratio](https://hectortecumshe-ai.github.io/) dedicada a los sistemas complejos adaptativos. Hermana de [Ratio Milpa](https://hectortecumshe-ai.github.io/RatioMilpa/): hecha para un solo cultivo y para un **estudio nacional**, viñedo por viñedo, con el mismo cuestionario.

Está hecha para productores y para científicos, en español y en inglés.

## Qué contiene (versión 0.3.0)

| Bloque | Contenido |
|---|---|
| 1 · Vid | Destino (mesa, vino, pasa, jugo o varios), variedad, portainjerto, sistema de conducción, densidad; **historial del viñedo**: fecha y material de plantación, edad y registro de podas |
| 2 · Región | Mapa de México; estado, municipio y localidad (INEGI) |
| 3 · Clima vitícola | Con las temperaturas mensuales de la estación más cercana: grados día de Winkler (Amerine y Winkler, 1944), índice de Huglin (1978) e índice de frescor nocturno (Tonietto y Carbonneau, 2004); aviso para climas sin invierno marcado |
| 4 · Requerimientos | Siete requerimientos base del viñedo, uno por etapa, y los innovados en la localidad |
| 5 · Manejo | Cuestionario base de 37 pasos y 67 actividades en siete etapas: **establecimiento** (propagación de esquejes y plantación, de la guía de Mata de Zarza; Mojica-Zárate et al., 2026) y el ciclo anual por etapas fenológicas BBCH (Lorenz et al., 1995): reposo y poda, brotación, floración, desarrollo del fruto, cosecha y poscosecha; labores propias de uva de mesa o de vino; fechas e innovaciones |
| 6 · Regeneración | Ocho perillas 0–4 con valores sugeridos que se confirman |
| 7 · Riesgos | 28 amenazas (de viñedos de todo el país, del establecimiento en clima cálido y generales de otros cultivos) con perillas de probabilidad, impacto y control; matriz 5 × 5 y capacidad adaptativa |
| 8 · Elementos | 75 elementos del viñedo en 10 categorías y los propios |
| 9 · Precio y valor | Precio por hectárea y valor económico, de uso, cultural y ecológico |
| 10–13 | Formulación, tablero de redes (centralidades, Louvain, correlaciones, cladograma, calendario), sostenibilidad (Sarandón, 17 ODS, huella de carbono) y prospectiva |
| 14 · Informe | Resumen, tablas, CSV, PDF y el archivo del viñedo (`.vina.json`) |
| 15 · Atlas nacional | Junta los archivos de muchos viñedos: mapa, comparación por región, viñedos por región de Winkler, frecuencia de cada práctica, variedades, destinos, innovaciones y red nacional |

## Caso publicado de referencia

**Mata de Zarza, Puente Nacional, Veracruz**: establecimiento de uva de mesa (Perlette, Flame Seedless y Summer Royal) en una parcela cooperante de 1 ha, de enero de 2025 a febrero de 2026, según la *Guía práctica para el establecimiento de uva en Mata de Zarza, Veracruz* (Mojica-Zárate et al., 2026; UACh, ISBN 978-607-12-0712-8). Se consulta en un **modo ejemplo** con franja naranja que nunca se guarda ni toca el proyecto del usuario; la app sigue arrancando en blanco. Las temperaturas del caso son del reanálisis ERA5 1991–2020 (Hersbach et al., 2020), porque en la localidad no hay estación. Su red se verificó con NetworkX y SciPy (`pruebas/verificar_matazarza.py`).

## Novedades de la versión 0.3.0

- **Modelo 3D del sistema complejo adaptativo** en el Bloque 10 (Formulación): capas apiladas de abajo arriba (entorno, entradas, agentes y conocimiento, manejo con los 5B y salidas) con el halo de la emergencia encima. Los nodos y vínculos son los de la red real del proyecto, y las líneas punteadas son las retroalimentaciones del ciclo. Se gira arrastrando o con el teclado, se acerca con botones, Ctrl + rueda o pellizco, y al tocar un nodo se resaltan sus vecinos. La perspectiva se calcula en la app, sin bibliotecas. El esquema 2D queda como segunda pestaña.
- **Importancia de cada nodo (0–100)** respecto del máximo de la red, por grado ponderado (por omisión), intermediación, vector propio o valor del elemento, con el ranking de los 10 elementos más importantes. Por omisión se oculta el nodo omnipresente de los productores.
- Código QR de la app en la tarjeta «¿Cómo citarla?».
- Instructivos actualizados con el modelo 3D y la importancia de los nodos, con el caso de Mata de Zarza.

## Novedades de la versión 0.2.0

- Etapa de **establecimiento** en el cuestionario (6 pasos y 15 actividades) y elementos nuevos: viveros y viñedos donantes, estudiantes, esquejes, enraizador, arena de río, acolchado, cámara de enraizamiento, protectores, tutores y hormiga cortadora.
- **Fecha de plantación con perilla** que recorre los 365 días del año, más el año.
- **28 amenazas**, con su fuente junto al nombre: falta de frío invernal, enfermedad de Pierce, hormiga cortadora, daño por animales, material vegetal mal enraizado, deriva de herbicidas, cultivo nuevo sin mercado, abandono del cultivo y suelos arcillosos.
- **Modo ejemplo** con el caso publicado de Mata de Zarza.
- Los proyectos de la 0.1.0 se abren sin perder respuestas (`formato: 3`; los pasos 1–31 pasan a 7–37).
- **Instructivos del Productor y del Científico**, en español e inglés.

## Rigor

Todavía **no existe un Stack de conocimiento local publicado para un viñedo productivo**. La etapa de establecimiento sigue la guía publicada de Mata de Zarza; el resto del cuestionario base, el catálogo de elementos y sus vínculos son una propuesta de la app, marcada como **«Lectura de Ratio Viña»**, que cada viñedo responde y amplía. Los índices de clima siguen fórmulas publicadas y tienen un cálculo de control en Validación. Lo que no está documentado aparece como **«sin dato»**: la aplicación no inventa valores. La app arranca en blanco y distingue lo que llena la persona de lo que solo sugiere.

## Uso

Abre `index.html` en cualquier navegador; funciona sin conexión. No usa cookies, rastreadores ni recursos de terceros.

```bash
python armar.py    # arma index.html a partir de src/
```

## Autores

Héctor Tecumshé Mojica-Zárate ([ORCID 0000-0002-9067-3983](https://orcid.org/0000-0002-9067-3983)) · Oscar Díaz-José · Edgar Arturo Sánchez-Moreno · Sergio Alejo-Bello · Luis Ángel Barrera-Guzmán

## Licencia

MIT. Contornos del mapa: Natural Earth (dominio público).
