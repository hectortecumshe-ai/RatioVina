<p align="center"><img src="logo.svg" width="96" alt="Ratio Viña"></p>

# Ratio Viña

👉 **https://hectortecumshe-ai.github.io/RatioVina/**

**El conocimiento local de la vid en México como sistema complejo adaptativo, con índices de regeneración y riesgo.** Aplicación de **Ratio Complexus**, el ala de la suite [Ratio](https://hectortecumshe-ai.github.io/) dedicada a los sistemas complejos adaptativos. Hermana de [Ratio Milpa](https://hectortecumshe-ai.github.io/RatioMilpa/): hecha para un solo cultivo y para un **estudio nacional**, viñedo por viñedo, con el mismo cuestionario.

Está hecha para productores y para científicos, en español y en inglés.

## Qué contiene (versión 0.1.0)

| Bloque | Contenido |
|---|---|
| 1 · Vid | Destino (mesa, vino, pasa, jugo o varios), variedad, portainjerto, sistema de conducción, densidad; **historial del viñedo**: fecha y material de plantación, edad y registro de podas |
| 2 · Región | Mapa de México; estado, municipio y localidad (INEGI) |
| 3 · Clima vitícola | Con las temperaturas mensuales de la estación más cercana: grados día de Winkler (Amerine y Winkler, 1944), índice de Huglin (1978) e índice de frescor nocturno (Tonietto y Carbonneau, 2004); aviso para climas sin invierno marcado |
| 4 · Requerimientos | Seis requerimientos base del viñedo y los innovados en la localidad |
| 5 · Manejo | Cuestionario base de 31 pasos y 52 actividades ordenado por etapas fenológicas BBCH (Lorenz et al., 1995): reposo y poda, brotación, floración, desarrollo del fruto, cosecha y poscosecha; labores propias de uva de mesa o de vino; fechas e innovaciones |
| 6 · Regeneración | Ocho perillas 0–4 con valores sugeridos que se confirman |
| 7 · Riesgos | Amenazas con perillas de probabilidad, impacto y control; matriz 5 × 5 y capacidad adaptativa |
| 8 · Elementos | 65 elementos del viñedo en 10 categorías y los propios |
| 9 · Precio y valor | Precio por hectárea y valor económico, de uso, cultural y ecológico |
| 10–13 | Formulación, tablero de redes (centralidades, Louvain, correlaciones, cladograma, calendario), sostenibilidad (Sarandón, 17 ODS, huella de carbono) y prospectiva |
| 14 · Informe | Resumen, tablas, CSV, PDF y el archivo del viñedo (`.vina.json`) |
| 15 · Atlas nacional | Junta los archivos de muchos viñedos: mapa, comparación por región, viñedos por región de Winkler, frecuencia de cada práctica, variedades, destinos, innovaciones y red nacional |

## Rigor

Todavía **no existe un Stack de conocimiento local publicado para la vid**. El cuestionario base, el catálogo de elementos y sus vínculos son una propuesta de la app, marcada como **«Lectura de Ratio Viña»**, que cada viñedo responde y amplía. Los índices de clima siguen fórmulas publicadas y tienen un cálculo de control en Validación. Lo que no está documentado aparece como **«sin dato»**: la aplicación no inventa valores. La app arranca en blanco y distingue lo que llena la persona de lo que solo sugiere.

## Uso

Abre `index.html` en cualquier navegador; funciona sin conexión. No usa cookies, rastreadores ni recursos de terceros.

```bash
python armar.py    # arma index.html a partir de src/
```

## Autores

Héctor Tecumshé Mojica-Zárate ([ORCID 0000-0002-9067-3983](https://orcid.org/0000-0002-9067-3983)) · Oscar Díaz-José · Edgar Arturo Sánchez-Moreno · Sergio Alejo-Bello

## Licencia

MIT. Contornos del mapa: Natural Earth (dominio público).
