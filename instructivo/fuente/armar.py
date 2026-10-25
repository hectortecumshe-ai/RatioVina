"""Arma los instructivos de Ratio Viña (productor y científico, español e inglés en un mismo HTML).
Uso:  python armar.py          → ../../instructivo-productor.html y ../../instructivo-cientifico.html
Las capturas se toman con capturar.py (Edge sin interfaz) y se guardan en ../img/<id>-<idioma>.jpg.
Los PDF se imprimen con pdf.py."""
import json, os, re, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, '..', '..'))
sys.path.insert(0, AQUI)
VERSION_APP = '0.3.0'
EDICION = ('1.ª edición, actualizada', '1st edition, updated')
FECHA = ('octubre de 2026', 'October 2026')
DOI_APP = '10.5281/zenodo.23439305'
DOI_GUIA = {'productor': '10.5281/zenodo.23642447', 'cientifico': '10.5281/zenodo.23642448'}        # ← DOI propio de cada instructivo cuando Zenodo lo asigne
ISBN = {'productor': ('', ''), 'cientifico': ('', '')}  # ← (ISBN impreso o PDF ES, ISBN PDF EN) cuando el INDAUTOR los asigne
CITA_AUT = ('Mojica-Zárate, H. T., Díaz-José, O., Sánchez-Moreno, E. A., Alejo-Bello, S., y Barrera-Guzmán, L. Á.', 'Mojica-Zárate, H. T., Díaz-José, O., Sánchez-Moreno, E. A., Alejo-Bello, S., &amp; Barrera-Guzmán, L. Á.')
AUTORES = 'Héctor Tecumshé Mojica-Zárate · Oscar Díaz-José · Edgar Arturo Sánchez-Moreno · Sergio Alejo-Bello · Luis Ángel Barrera-Guzmán'
APP = 'https://hectortecumshe-ai.github.io/RatioVina/'
AFILIACION = ('Centro Académico Regional Sede Huatusco, Universidad Autónoma Chapingo, México (Héctor Tecumshé Mojica-Zárate, Oscar Díaz-José, Luis Ángel Barrera-Guzmán).',
              'Huatusco Regional Academic Centre, Chapingo Autonomous University, Mexico (Héctor Tecumshé Mojica-Zárate, Oscar Díaz-José, Luis Ángel Barrera-Guzmán).')
leer = lambda n: open(os.path.join(AQUI, n), encoding='utf-8').read()

# ---------------------------------------------------------------- bloques de la app
BLOQUES = [  # id, es, en, minutos, resumen es, resumen en, frase rápida es, frase rápida en
 ('b1', 'Vid', 'Vine', '5 min', 'Tu viñedo y su historia', 'Your vineyard and its history', 'Destino, variedad, pie, conducción, plantación y podas.', 'Use, variety, rootstock, training, planting and pruning.'),
 ('b2', 'Región', 'Region', '2 min', 'Estado, municipio, localidad', 'State, municipality, locality', 'Ubica tu viñedo hasta la localidad del INEGI.', 'Locate your vineyard down to the INEGI locality.'),
 ('b3', 'Clima vitícola', 'Viticultural climate', '5 min', 'Winkler, Huglin y noches', 'Winkler, Huglin and nights', 'Captura las temperaturas mensuales y lee los tres índices.', 'Enter monthly temperatures and read the three indices.'),
 ('b4', 'Requerimientos', 'Requirements', '3 min', 'Lo que la vid necesita', 'What the vine needs', 'Marca si se cumple cada requerimiento y agrega los tuyos.', 'Mark whether each requirement is met and add your own.'),
 ('b5', 'Manejo', 'Management', '12 min', 'Del esqueje a la cosecha', 'From cutting to harvest', 'Responde sí o no a cada actividad, agrega innovaciones y fechas.', 'Answer yes or no to each activity, add innovations and dates.'),
 ('b6', 'Regeneración', 'Regeneration', '4 min', '¿Se regenera o se desgasta?', 'Regenerating or wearing out?', 'Confirma las ocho perillas y guarda una línea base.', 'Confirm the eight knobs and save a baseline.'),
 ('b7', 'Riesgos', 'Risks', '6 min', 'Probabilidad × impacto', 'Likelihood × impact', 'Desmarca lo que no aplica y mueve probabilidad, impacto y control.', 'Untick what does not apply and move likelihood, impact and control.'),
 ('b8', 'Elementos', 'Elements', '4 min', 'Quiénes y qué participan', 'Who and what takes part', 'Revisa actores, insumos y recursos; agrega los que falten.', 'Review actors, inputs and resources; add the missing ones.'),
 ('b9', 'Precio y valor', 'Price and value', '6 min', 'Lo que cuesta y lo que vale', 'What it costs and what it is worth', 'Anota precios por hectárea y califica el valor de 0 a 5.', 'Enter prices per hectare and rate value from 0 to 5.'),
 ('b10', 'Formulación', 'Formulation', '1 min', 'Tejer el sistema', 'Weave the system', '⚙ Tejer: la app arma la red del viñedo.', '⚙ Weave: the app builds the vineyard network.'),
 ('b11', 'Tablero', 'Dashboard', '5 min', 'Red, cladograma, calendario', 'Network, cladogram, calendar', 'Lee quién sostiene el sistema y quién está cerca de quién.', 'Read who holds the system together and who is close to whom.'),
 ('b12', 'Sostenibilidad', 'Sustainability', '4 min', 'Suelo, agua, ODS, huella', 'Soil, water, SDGs, footprint', 'Revisa qué suma, qué resta y el índice de Sarandón.', 'See what adds, what subtracts and Sarandón’s index.'),
 ('b13', 'Prospectiva', 'Outlook', '5 min', 'A 2, 5 y 10 años', 'At 2, 5 and 10 years', 'Compara los tres futuros y ajusta los supuestos.', 'Compare the three futures and adjust the assumptions.'),
 ('b14', 'Informe', 'Report', '2 min', 'PDF, CSV y proyecto', 'PDF, CSV and project', 'Imprime, exporta y guarda el archivo de tu viñedo.', 'Print, export and save your vineyard’s file.'),
 ('b15', 'Atlas', 'Atlas', '5 min', 'Muchos viñedos, un atlas', 'Many vineyards, one atlas', 'Junta los archivos de los viñedos y lee el país.', 'Combine vineyard files and read the country.'),
]
CLARO = ['#6b3fa0', '#4f7d3a', '#b0703e', '#a7801c', '#3f7a6a', '#2f8f6a', '#b8562e', '#39718a', '#8a6d1f', '#4a5d6b', '#3f6fb0', '#2f7d4a', '#8a3f5a', '#5a4a3a', '#2f5d50']
OSCURO = ['#c4a6ea', '#a9cf7e', '#e0a878', '#e3c063', '#8fd1bf', '#86d1a2', '#ec9a72', '#86c3dc', '#e0c06e', '#9fb4c2', '#9dbbe8', '#86d1a2', '#e08aa8', '#c9b6a3', '#8fc2ad']


def css(cien=False):
    c = leer('base.css')
    c = c.replace('RatioAvis · Instructivo del Productor', 'Ratio Viña · Instructivos')
    c = c.replace('--acc:#c0772b; --acc-d:#8a5214; --acc-s:rgba(192,119,43,.12);', '--acc:#b05434; --acc-d:#8a3a1f; --acc-s:rgba(176,84,52,.12);')
    c = c.replace('--acc:#e2a15c; --acc-d:#f0c08a; --acc-s:rgba(226,161,92,.14);', '--acc:#ea926b; --acc-d:#f4b596; --acc-s:rgba(234,146,107,.14);')
    viejo_c = '--b1:#2f5d50; --b2:#5c8538; --b3:#2f6f8f; --b4:#b0841f; --b5:#c0772b; --b6:#a0502e; --b7:#755a8c; --b8:#4a5d6b;'
    viejo_o = '--b1:#8fc2ad; --b2:#a9cf7e; --b3:#7fbddb; --b4:#e3c063; --b5:#e2a15c; --b6:#e39272; --b7:#bba3d6; --b8:#9fb4c2;'
    assert viejo_c in c and viejo_o in c
    c = c.replace(viejo_c, ' '.join(f'--b{i+1}:{x};' for i, x in enumerate(CLARO)))
    c = c.replace(viejo_o, ' '.join(f'--b{i+1}:{x};' for i, x in enumerate(OSCURO)))
    c = c.replace('.cover .steps{display:grid;grid-template-columns:repeat(8,1fr);', '.cover .steps{display:grid;grid-template-columns:repeat(15,minmax(0,1fr));')
    c += '\n@media print{html .cover{height:297mm;overflow:hidden}html .cover .in{flex:1 1 auto;min-height:0;overflow:hidden}html .cover .steps{flex:none}html .cover .steps div{padding:3mm .7mm 3.5mm 1.4mm}html .cover .steps div span{font-size:6pt;letter-spacing:-.01em}html .cover .steps b{font-size:13pt}}\n'
    c = c.replace('.cover .steps div{padding:14px 12px 16px;', '.cover .steps div{padding:10px 6px 12px;')
    c = c.replace('  .cover .steps div:nth-child(4){border-right:0}', '  .cover .steps div:nth-child(5n){border-right:0}')
    c = c.replace('  .cover .steps div:nth-child(-n+4){border-bottom:1px solid var(--line)}', '  .cover .steps div:nth-child(-n+10){border-bottom:1px solid var(--line)}')
    c += '''
/* ---------- Ratio Viña: figuras propias, ecuaciones, ficha legal ---------- */
figure.svgfig{padding:18px 18px 4px}
figure.svgfig svg{display:block;width:100%;height:auto;font-family:var(--sans)}
figure.svgfig svg text:not([fill]):not(.mu){fill:var(--text)}
figure.svgfig svg .mu{fill:var(--muted)}
figure.svgfig svg .ln{stroke:var(--line2)}
.chap-head .big{min-width:1.2ch}
.cover .steps div span{font-size:12.5px}
.eq{position:relative;display:flex;align-items:center;justify-content:center;gap:20px;margin:22px 0 24px;padding:18px 64px 18px 24px;background:var(--paper);border:1px solid var(--line);border-left:3px solid var(--c,var(--pri));border-radius:12px;font-size:19px;overflow-x:auto}
.eq .no{position:absolute;right:18px;top:50%;transform:translateY(-50%);font:600 14px var(--sans);color:var(--faint)}
.eq i{font-style:italic}.eq sub,.eq sup{font-size:.7em}
.where{font-size:16.5px;color:var(--muted);margin:-8px 0 22px}
.spec{display:grid;grid-template-columns:repeat(2,1fr);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;background:var(--paper);margin:20px 0 26px}
.spec div{padding:12px 18px;border-bottom:1px solid var(--line);display:grid;grid-template-columns:150px 1fr;gap:12px;font-size:16px}
.spec div:nth-child(odd){border-right:1px solid var(--line)}
.spec span{font:600 11.5px/1.5 var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--faint);padding-top:3px}
.code{position:relative;margin:20px 0 26px;border-radius:12px;background:#17201c;color:#e4ebe6;overflow:hidden;border:1px solid #26302b}
.code .bar{display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#1e2924;font:600 12px var(--sans);color:#9fb0a6;letter-spacing:.06em}
.code pre{margin:0;padding:16px 18px;overflow-x:auto;font-size:13.5px;line-height:1.6;white-space:pre-wrap}
.legal{font-size:14.5px;line-height:1.6;color:var(--muted)}
.legal b{color:var(--text)}
.legal .isbn{font:700 15px var(--sans);letter-spacing:.04em;color:var(--text)}
.qrbox{display:flex;gap:22px;align-items:center;margin:18px 0}
.qrbox svg{width:150px;height:150px;flex:0 0 auto;background:#fff;padding:8px;border-radius:10px;border:1px solid var(--line)}
@media print{.eq{break-inside:avoid}.spec{break-inside:avoid}.code{break-inside:avoid}}
'''
    return c


def js(titulo_es, titulo_en, pdf_es, pdf_en, grupos, glos):
    j = leer('base.js')
    def rp(a, b):
        nonlocal j
        assert a in j, 'no está en base.js: ' + a[:60]
        j = j.replace(a, b)
    rp("'ratioavis_lang'", "'ratiovina_guia_lang'")
    rp("'ratioavis_tema'", "'ratiovina_guia_tema'")
    rp("'RatioAvis · Instructivo del Productor' : 'RatioAvis · Producer Guide'", f"'{titulo_es}' : '{titulo_en}'")
    rp("'instructivo/RatioAvis-Instructivo-Productor.pdf' : 'instructivo/RatioAvis-Producer-Guide.pdf'", f"'instructivo/{pdf_es}' : 'instructivo/{pdf_en}'")
    rp("$$('figure[data-fig] .fn', sec).forEach(fn => { i++; fn.textContent = (LANG === 'es' ? 'Figura ' : 'Figure ') + (/^\\d$/.test(n) ? n + '.' + i : i); });",
       "$$('figure .fn', sec).forEach(fn => { i++; fn.textContent = (LANG === 'es' ? 'Figura ' : 'Figure ') + n + '.' + i; });")
    rp("if (subs.length && /^\\d$/.test(sec.dataset.toc))", "if (subs.length && /^[\\dA-Z]+$/.test(sec.dataset.toc) && sec.dataset.toc !== 'P')")
    rp("const GRUPOS = { leer: ['Para empezar', 'Getting started'], b1: ['Los ocho bloques', 'The eight blocks'], mezclar: ['Consulta', 'Reference'] };",
       'const GRUPOS = ' + json.dumps(grupos, ensure_ascii=False) + ';')
    i = j.index('const GLOS = ['); k = j.index('];', i) + 2
    j = j[:i] + 'const GLOS = ' + json.dumps(glos, ensure_ascii=False, indent=0) + ';' + j[k:]
    assert 'ratioavis' not in j.lower(), 'quedó una referencia a RatioAvis'
    return j


# ---------------------------------------------------------------- piezas repetidas
def bi(es, en, **kw):
    a = ' '.join(f'{"class" if k == "class_" else k.replace("_", "-")}="{v}"' for k, v in kw.items())
    return f'<text lang="es" {a}>{es}</text><text lang="en" {a}>{en}</text>'

def fig(svg, es, en):
    return (f'<figure class="svgfig">{svg}<figcaption><span class="fn"></span><span lang="es">{es}</span>'
            f'<span lang="en">{en}</span></figcaption></figure>')

def pasos():
    return ''.join(f'<div style="--c:var(--b{i+1})"><b>{i+1}</b><span lang="es">{b[1]}</span><span lang="en">{b[2]}</span></div>' for i, b in enumerate(BLOQUES))

def flujo():
    return ''.join(f'<a href="#{b[0]}" style="--c:var(--b{i+1})"><span class="k" lang="es">Bloque {i+1}</span><span class="k" lang="en">Block {i+1}</span><span class="t">{b[3]}</span>'
                   f'<b lang="es">{b[1]}</b><b lang="en">{b[2]}</b><small lang="es">{b[4]}</small><small lang="en">{b[5]}</small></a>' for i, b in enumerate(BLOQUES))

def rapido():
    return ''.join(f'<li style="--c:var(--b{i+1})"><i>{i+1}</i><div><b lang="es">{b[1]}</b><b lang="en">{b[2]}</b><span lang="es">{b[6]}</span><span lang="en">{b[7]}</span></div></li>' for i, b in enumerate(BLOQUES))

def banda():
    return ''.join(f'<i style="background:var(--b{i+1})"></i>' for i in range(len(BLOQUES)))

def doi_txt(guia):
    d = DOI_GUIA.get(guia)
    return f'DOI <a href="https://doi.org/{d}">{d}</a> · ' if d else ''

def qr_svg():
    import qr
    out = os.path.join(AQUI, '..', 'qr-app.svg')
    subprocess.run([sys.executable, os.path.join(AQUI, 'qr.py'), APP, out, 'M'], check=True, stdout=subprocess.DEVNULL)
    s = open(out, encoding='utf-8').read()
    return s[s.index('<svg'):]

def legal(guia, titulo_es, titulo_en):
    ie, ien = ISBN[guia]
    isbn_es = f'ISBN {ie}' if ie else 'ISBN: en trámite ante el INDAUTOR'
    isbn_en = f'ISBN {ien or ie}' if (ien or ie) else 'ISBN: application in progress (INDAUTOR, Mexico)'
    d = DOI_GUIA.get(guia)
    doi_es = f'DOI de este instructivo: <a href="https://doi.org/{d}">{d}</a>' if d else 'DOI de este instructivo: se asigna al publicarlo en Zenodo'
    doi_en = f'DOI of this guide: <a href="https://doi.org/{d}">{d}</a>' if d else 'DOI of this guide: assigned on publication in Zenodo'
    return f'''<div class="legal">
  <p lang="es"><b>{titulo_es}</b> · {EDICION[0]}, {FECHA[0]} · describe Ratio Viña {VERSION_APP}.</p>
  <p lang="en"><b>{titulo_en}</b> · {EDICION[1]}, {FECHA[1]} · covers Ratio Viña {VERSION_APP}.</p>
  <p>{AUTORES}</p>
  <p lang="es">ORCID del autor de correspondencia (Héctor Tecumshé Mojica-Zárate): 0000-0002-9067-3983.</p>
  <p lang="en">Corresponding author ORCID (Héctor Tecumshé Mojica-Zárate): 0000-0002-9067-3983.</p>
  <p><span class="isbn" lang="es">{isbn_es}</span><span class="isbn" lang="en">{isbn_en}</span><br>
     <span lang="es">{doi_es} · DOI de la aplicación: <a href="https://doi.org/{DOI_APP}">{DOI_APP}</a></span><span lang="en">{doi_en} · DOI of the app: <a href="https://doi.org/{DOI_APP}">{DOI_APP}</a></span></p>
  <p lang="es">Texto y figuras bajo licencia Creative Commons Atribución 4.0 Internacional (CC BY 4.0); la aplicación, bajo licencia MIT. Puedes copiar, adaptar y compartir este instructivo citando a sus autores. Las capturas de pantalla son de la aplicación Ratio Viña {VERSION_APP}. Composición tipográfica en Palatino Linotype.</p>
  <p lang="en">Text and figures under the Creative Commons Attribution 4.0 International licence (CC BY 4.0); the app under the MIT licence. You may copy, adapt and share this guide crediting its authors. Screenshots are from the Ratio Viña {VERSION_APP} app. Typeset in Palatino Linotype.</p>
</div>'''


def pagina(guia, cuerpo, t_es, t_en, sub_es, sub_en, pdf_es, pdf_en, grupos, glos, desc):
    falta = re.findall(r'\{\{\w+\}\}', cuerpo)
    assert not falta, falta
    return f'''<!doctype html>
<html lang="es" data-lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t_es}</title>
<meta name="description" content="{desc}">
<link rel="icon" href="logo.svg" type="image/svg+xml">
<style>
{css(guia == 'cientifico')}
</style>
</head>
<body>

<header class="top">
  <button class="ib" id="menuBtn" aria-label="Índice / Contents">☰</button>
  <a class="brand" href="./" title="Ratio Viña">
    <img src="logo.svg" alt="">
    <span>Ratio<i>Viña</i> <small lang="es">· {sub_es}</small><small lang="en">· {sub_en}</small></span>
  </a>
  <span class="sp"></span>
  <a class="btn ghost no-print" href="./" target="_blank" rel="noopener"><span lang="es">Abrir la app</span><span lang="en">Open the app</span> ↗</a>
  <div class="seg" role="group" aria-label="Idioma / Language"><button data-lang="es">ES</button><button data-lang="en">EN</button></div>
  <a class="btn pdf" id="pdfBtn" title="PDF" href="instructivo/{pdf_es}" download><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14"/></svg><span>PDF</span></a>
  <button class="ib" id="temaBtn" aria-label="Tema / Theme">☾</button>
  <div id="leido"></div>
</header>

<div class="layout">
<aside class="toc" id="toc">
  <div class="search">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg>
    <input id="q" type="search" autocomplete="off" placeholder="Buscar en el instructivo…" aria-label="Buscar / Search">
    <div class="hits" id="hits"></div>
  </div>
  <ol id="tocList"></ol>
</aside>

<main>
{cuerpo}
</main>
</div>

<a class="ib totop" href="#portada" aria-label="Arriba / Top">↑</a>
<div id="zoom" role="dialog" aria-label="Imagen ampliada / Enlarged image"><div class="zi"></div></div>

<script>{js(t_es, t_en, pdf_es, pdf_en, grupos, glos)}</script>
</body>
</html>
'''



def cita_guia(guia, t_es, t_en):
    """Referencia del instructivo en APA (7.ª ed.): Autores (año). Título (edición). Zenodo. DOI."""
    d = DOI_GUIA.get(guia)
    ed_es = EDICION[0].replace('edición', 'ed.'); ed_en = EDICION[1].replace('edition', 'ed.')
    url = f'https://doi.org/{d}' if d else APP + ('instructivo-productor.html' if guia == 'productor' else 'instructivo-cientifico.html')
    edit = 'Zenodo. ' if d else ''
    return (f'<p lang="es">{CITA_AUT[0]} (2026). <i>{t_es.replace(" · ", ": ")}</i> ({ed_es}). {edit}{url}</p>'
            f'<p lang="en">{CITA_AUT[1]} (2026). <i>{t_en.replace(" · ", ": ")}</i> ({ed_en}). {edit}{url}</p>')

def comunes(guia, t_es, t_en):
    return {'BANDA': banda(), 'VERSION': VERSION_APP, 'DOI': doi_txt(guia), 'AUTORES': AUTORES, 'PASOS': pasos(), 'FLUJO': flujo(),
            'RAPIDO': rapido(), 'QR': qr_svg(), 'LEGAL': legal(guia, t_es, t_en), 'CITA_GUIA': cita_guia(guia, t_es, t_en), 'DOIAPP': DOI_APP, 'APP': APP}


def productor():
    import textos_productor as tp
    t_es, t_en = 'Ratio Viña · Instructivo del Productor', 'Ratio Viña · Producer Guide'
    cuerpo = leer('productor.html')
    rep = comunes('productor', t_es, t_en); rep.update(tp.FIGURAS())
    for k, v in rep.items():
        cuerpo = cuerpo.replace('{{' + k + '}}', v)
    html = pagina('productor', cuerpo, t_es, t_en, 'Instructivo del Productor', 'Producer Guide', 'RatioVina-Instructivo-Productor.pdf', 'RatioVina-Producer-Guide.pdf',
                  {'leer': ['Para empezar', 'Getting started'], 'b1': ['Los quince bloques', 'The fifteen blocks'], 'documentar': ['Consulta', 'Reference']}, tp.GLOS,
                  'Instructivo del Productor de Ratio Viña: documenta el conocimiento local de la vid de tu viñedo, con el caso de Mata de Zarza, Veracruz. · Ratio Viña Producer Guide.')
    open(os.path.join(RAIZ, 'instructivo-productor.html'), 'w', encoding='utf-8', newline='\n').write(html)
    print('instructivo-productor.html', round(len(html.encode('utf-8')) / 1024), 'KB')


def cientifico():
    import textos_cientifico as tc
    t_es, t_en = 'Ratio Viña · Instructivo del Científico', 'Ratio Viña · Scientist Guide'
    cuerpo = leer('cientifico.html')
    rep = comunes('cientifico', t_es, t_en); rep.update(tc.FIGURAS())
    for k, v in rep.items():
        cuerpo = cuerpo.replace('{{' + k + '}}', v)
    html = pagina('cientifico', cuerpo, t_es, t_en, 'Instructivo del Científico', 'Scientist Guide', 'RatioVina-Instructivo-Cientifico.pdf', 'RatioVina-Scientist-Guide.pdf',
                  {'leer': ['Preliminares', 'Front matter'], 'datos': ['Método', 'Method'], 'validacion': ['Evidencia y uso', 'Evidence and use']}, tc.GLOS,
                  'Instructivo del Científico de Ratio Viña: modelo, ecuaciones, validación y reproducibilidad. · Ratio Viña Scientist Guide.')
    open(os.path.join(RAIZ, 'instructivo-cientifico.html'), 'w', encoding='utf-8', newline='\n').write(html)
    print('instructivo-cientifico.html', round(len(html.encode('utf-8')) / 1024), 'KB')


if __name__ == '__main__':
    quien = sys.argv[1:] or ['productor', 'cientifico']
    if 'productor' in quien: productor()
    if 'cientifico' in quien: cientifico()
