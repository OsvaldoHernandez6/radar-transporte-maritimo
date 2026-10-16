"""Genera data.json del Radar Navieras (estructura del Radar Family Park, adaptada a LinkedIn)."""
import json, math, os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LI = "https://www.linkedin.com/company/"
LIB = "https://www.linkedin.com/ad-library/search?accountOwner="

brands = [
 {"id": "msc", "name": "MSC", "page": "MSC Mediterranean Shipping Company", "handle": "/msc-mediterranean-shipping-co--s-a-",
  "url": LI + "msc-mediterranean-shipping-co--s-a-/", "hq": "Ginebra",
  "followers": 2000000, "followersLabel": "2 M", "associates": 37834, "postsPerMonth": 9, "interPerPost": 510,
  "reac": 471, "com": 9.1, "sh": 30, "fmt": {"Video": 70, "Imagen": 16, "Documento": 12, "Texto": 2},
  "share": 21.5, "spanishPosts": "4 de 50",
  "pos": {"tone": "Institucional y emocional, producido como campaña", "focus": "Ferias de alimentos, rutas, producto digital (eBL, myMSC), RSE",
          "latam": "4 posts en español: Expoalimentaria Lima, visita del CEO a Chile, experiencia digital", "top": "Navidad «Helping Santa deliver since 1970» · 7.089 reacciones"},
  "insight": "Publica la mitad que sus pares, pero logra las mayores interacciones por post.",
  "themes": ["Ferias", "Rutas", "eBL · myMSC", "RSE", "Sponsoring"],
  "ads": {"active": True, "count": 56, "loaded": 54, "langs": {"EN": 44, "ES": 3, "PT": 1, "Otros": 6}, "tla": 0,
          "themes": ["Canadá → Europa", "Africa Intermodal", "Autos usados", "Integration Suite", "Escalas Baltimore y Savannah"],
          "summary": "Pauta de rutas y servicios por mercado de origen, traducida a idiomas europeos. Latam no aparece como objetivo.",
          "alert": "El único anuncio en español revisado en detalle se mostró 100% en España (50–100 mil impresiones, may–jun 2026).",
          "formats": "Imagen, carrusel y video", "library": LIB + "MSC+Mediterranean+Shipping+Company"}},
 {"id": "maersk", "name": "Maersk", "page": "A.P. Moller - Maersk", "handle": "/maersk-group", "url": LI + "maersk-group/", "hq": "Copenhague",
  "followers": 3000000, "followersLabel": "3 M", "associates": 80004, "postsPerMonth": 36, "interPerPost": 268,
  "reac": 244, "com": 7.6, "sh": 16.6, "fmt": {"Video": 30, "Imagen": 48, "Documento": 22},
  "share": 13.8, "spanishPosts": "~8 de 50",
  "pos": {"tone": "Integrador logístico, didáctico, orientado a producto", "focus": "Logística end-to-end, resiliencia, nearshoring, «Guess the port»",
          "latam": "~8 posts en español segmentados (palta, productos frescos, volatilidad), con 12 a 198 reacciones", "top": "Piloto de propulsión a viento 2027 · 1.587 reacciones"},
  "insight": "La mayor base y el mayor ritmo, pero la tasa de interacción más baja del set.",
  "themes": ["Logística E2E", "Resiliencia", "Frío", "Gamificación", "Historia"],
  "ads": {"active": True, "count": 3272, "loaded": 168, "langs": {"EN": 147, "ES": 18, "PT": 3}, "tla": 0,
          "themes": ["Maersk Spot", "Resiliencia (EN y ES)", "Empleo", "Intermodal", "96% on-time"],
          "summary": "Pauta always-on a escala industrial: 58 veces el volumen de MSC. Empuja producto digital (Spot) y employer branding.",
          "alert": None, "formats": "Imagen, carrusel y video", "library": LIB + "Maersk"}},
 {"id": "cmacgm", "name": "CMA CGM", "page": "CMA CGM", "handle": "/cma-cgm", "url": LI + "cma-cgm/", "hq": "Marsella",
  "followers": 2000000, "followersLabel": "2 M", "associates": 33022, "postsPerMonth": 29, "interPerPost": 477,
  "reac": 447, "com": 7.7, "sh": 21.7, "fmt": {"Video": 49, "Imagen": 42, "Documento": 8, "Texto": 1},
  "share": 12.8, "spanishPosts": "0 de 51",
  "pos": {"tone": "Corporativo-emocional, orgullo de familia y flota", "focus": "Herencia, CEVA, IA, origen de la carga, employer branding",
          "latam": "Cuenta orígenes latinos (cacao ecuatoriano, Costa Rica, Brasil), siempre en inglés", "top": "Aniversario del Grupo · 3.233 reacciones"},
  "insight": "El mejor equilibrio entre volumen y resonancia de la categoría.",
  "themes": ["Herencia", "Flota", "CEVA", "Origen Latam", "Employer"],
  "ads": {"active": True, "count": 63, "loaded": 61, "langs": {"EN": 40, "FR": 21}, "tla": 1,
          "themes": ["CMA CGM NOTRE DAME", "Aniversario", "Fundación", "Servicio TVI/IEX2", "Tanya Saadé Zeenny"],
          "summary": "Pauta institucional de flota y familia fundadora, en inglés y francés. Casi sin producto.",
          "alert": "Ningún anuncio en español: el comprador latinoamericano no está en su plan de medios.",
          "formats": "Imagen y video", "library": LIB + "CMA+CGM"}},
 {"id": "hapag", "name": "Hapag-Lloyd", "page": "Hapag-Lloyd AG", "handle": "/hapag-lloyd-ag", "url": LI + "hapag-lloyd-ag/", "hq": "Hamburgo",
  "followers": 1000000, "followersLabel": "1 M", "associates": 15918, "postsPerMonth": 24, "interPerPost": 271,
  "reac": 260, "com": 4.7, "sh": 6.8, "fmt": {"Video": 26, "Imagen": 42, "Documento": 24, "Link": 8},
  "share": 7.0, "spanishPosts": "0 de 50",
  "pos": {"tone": "Humano y lúdico, el más cercano de la categoría", "focus": "Series fotográficas «Express», LOOKOUT, IA «Marina», tripulantes",
          "latam": "Menciona Caucedo, Cartagena y Manzanillo; feed 100% en inglés", "top": "«Big news... trying to stay calm» · 1.760 reacciones"},
  "insight": "La marca visual más reconocible y el único newsletter recurrente.",
  "themes": ["Fotografía", "LOOKOUT", "IA Marina", "Tripulantes", "Caribe"],
  "ads": {"active": True, "count": 411, "loaded": 168, "langs": {"EN": 114, "ES": 47, "PT": 7}, "tla": 2,
          "themes": ["Live Position", "Descarbonización", "Calidad", "Quick Quotes", "Ejecutivos (TLA)"],
          "summary": "El anunciante más localizado a Latam: un tercio de su pauta en español o portugués, con producto digital y voces de ejecutivos.",
          "alert": None, "formats": "Imagen, video y Thought Leader Ads", "library": LIB + "Hapag+Lloyd"}},
 {"id": "cosco", "name": "COSCO Perú", "page": "COSCO Shipping Lines Peru", "handle": "/coscoshipping-lines-peru", "url": LI + "coscoshipping-lines-peru/", "hq": "Lima",
  "followers": 8000, "followersLabel": "8 mil", "associates": 41, "postsPerMonth": 1.7, "interPerPost": 139,
  "reac": 120, "com": 7.8, "sh": 11, "fmt": {"Imagen": 100},
  "share": 10.6, "spanishPosts": "12 de 12",
  "pos": {"tone": "Local, en español, funcional", "focus": "Avisos de empleo (10 de 12), servicios CHX3 Paita–Asia y Matarani",
          "latam": "100% Perú. El About promete Chancay–Shanghái; el feed no lo menciona", "top": "Aviso de empleo · 459 reacciones"},
  "insight": "Funciona como bolsa de trabajo: casi no hay comunicación comercial.",
  "themes": ["Empleo", "Paita–Asia", "Matarani"],
  "ads": {"active": False, "count": 0, "loaded": 0, "langs": {}, "tla": 0, "themes": [],
          "summary": "No pauta en LinkedIn. El espacio pagado que ve el comprador peruano lo ocupan Hapag-Lloyd y Maersk.",
          "alert": None, "formats": "", "library": None}},
]

for b in brands:
    b["isClient"] = False
    b["logo"] = None
    b["er"] = round(100 * b["interPerPost"] / b["followers"], 4)
    b["videoPct"] = b["fmt"].get("Video", 0)
    a = b["ads"]
    a["esPt"] = round(100 * (a["langs"].get("ES", 0) + a["langs"].get("PT", 0)) / a["loaded"]) if a["loaded"] else 0

# ---- score ----
DIMS = [("Alcance", 20, "Seguidores vs. líder"), ("Frecuencia", 15, "Posts/mes vs. 20"), ("Interacción/post", 15, "vs. líder"),
        ("Video", 10, "% video vs. 60%"), ("Latam orgánico", 10, "Cualitativo"), ("Consistencia", 5, "Nombre de página = marca"),
        ("Volumen de pauta", 15, "Log. vs. líder"), ("Latam en pauta", 10, "% ES/PT vs. 32%")]
latam_org = {"maersk": 7, "msc": 6, "cmacgm": 5, "hapag": 3, "cosco": 6}
consist = {"msc": 5, "hapag": 5, "cmacgm": 5, "maersk": 3, "cosco": 3}
maxf = max(b["followers"] for b in brands); maxi = max(b["interPerPost"] for b in brands); maxa = max(b["ads"]["count"] for b in brands)
for b in brands:
    v = {
        "Alcance": 20 * b["followers"] / maxf, "Frecuencia": 15 * min(b["postsPerMonth"] / 20, 1),
        "Interacción/post": 15 * b["interPerPost"] / maxi, "Video": 10 * min(b["videoPct"] / 60, 1),
        "Latam orgánico": latam_org[b["id"]], "Consistencia": consist[b["id"]],
        "Volumen de pauta": 15 * math.log10(b["ads"]["count"]) / math.log10(maxa) if b["ads"]["count"] else 0,
        "Latam en pauta": 10 * min(b["ads"]["esPt"] / 32, 1)}
    b["scoreParts"] = {k: round(x, 1) for k, x in v.items()}
    b["score"] = round(sum(v.values()))

verdicts = {
 "maersk": ("Dominio por volumen", ["Mayor base (3 M) y mayor pauta (3.272 anuncios)", "Thought leadership de cadena de suministro", "Versiones en español en orgánico y pauta"],
            ["Tasa de interacción más baja (0,009%)", "Página con nombre corporativo «A.P. Moller - Maersk»", "Español traducido, sin tracción"]),
 "cmacgm": ("Volumen con emoción", ["29 posts al mes con 477 interacciones por post", "Storytelling de origen de la carga", "Thought Leader Ads de la familia fundadora"],
            ["Cero pauta en español", "Pauta institucional sin producto", "Latam contado en inglés"]),
 "msc": ("Pocas piezas, máxima resonancia", ["Mayores interacciones por post (510)", "70% video, el mix más fuerte", "Picos de marca de hasta 7.089 reacciones"],
         ["Frecuencia baja: 9 posts al mes", "Pauta mínima (56 anuncios)", "Su español pagado apunta a España"]),
 "hapag": ("El más cercano a Latam en pauta", ["32% de su pauta en español o portugués", "Serie visual reconocible y newsletter LOOKOUT", "Thought Leader Ads de ejecutivos"],
           ["Menor base entre las globales (1 M)", "Orgánico 100% en inglés", "Bajo uso de video (26%)"]),
 "cosco": ("Presencia local sin uso comercial", ["100% en español y foco Perú", "Interacción alta sobre su base", "Activo diferencial: Chancay–Shanghái"],
           ["83% del feed son avisos de empleo", "Sin pauta en LinkedIn", "Chancay ausente del contenido"]),
}
for b in brands:
    l, s, w = verdicts[b["id"]]
    b["verdict"] = {"label": l, "strengths": s, "weaknesses": w}

data = {
 "meta": {"title": "Radar Navieras", "market": "Latam", "extractionDate": "16 de octubre de 2026",
          "method": "Páginas de empresa y Biblioteca de Anuncios de LinkedIn revisadas en navegador el 16-oct-2026. Muestra de ~50 publicaciones por marca (12 en COSCO Perú). Interacciones = reacciones + comentarios + compartidos visibles, promedio de los últimos 30 días (90 en COSCO Perú). La tasa de interacción se calcula sobre seguidores porque las impresiones no son públicas. LinkedIn muestra los seguidores redondeados. Idiomas y mensajes de pauta se leyeron sobre hasta 168 anuncios por marca."},
 "brands": brands,
 "linkedin": {
  "conclusions": [
   {"title": "Publicar más no es resonar más", "text": "Maersk publica cuatro veces más que MSC (36 vs 9 posts al mes), pero MSC obtiene 1,9 veces más interacciones por post (510 vs 268). En la categoría pesa más la producción por pieza que la cadencia."},
   {"title": "El video separa a los líderes de interacción", "text": "MSC (70% video) y CMA CGM (49%) encabezan las interacciones por post. Hapag-Lloyd y Maersk, más cargados a imagen y documento, se quedan cerca de 270."},
   {"title": "Los picos vienen de la marca, no del producto", "text": "Navidad de MSC (7.089 reacciones), aniversario de CMA CGM (3.233), «Big news» de Hapag-Lloyd (1.760). Los anuncios de servicio rara vez pasan de 700."},
   {"title": "Latam es contenido de segunda en las globales", "text": "Las versiones en español de Maersk reciben entre 12 y 198 reacciones. CMA CGM cuenta el origen latinoamericano de la carga, pero en inglés. Ninguna tiene una línea editorial para el comprador de la región."},
   {"title": "COSCO Perú usa LinkedIn como bolsa de trabajo", "text": "10 de sus 12 posts visibles son avisos de empleo. Chancay, su mayor diferenciador en Perú, no aparece en el feed."}],
  "recommendations": [
   {"priority": "alta", "title": "Menos piezas, mejor producidas", "text": "Para una cuenta regional, 8 a 12 piezas al mes con video propio rinden más que el ritmo de Maersk, que la categoría ya demostró que diluye la atención."},
   {"priority": "alta", "title": "Video como formato base", "text": "Los dos líderes de interacción superan el 49% de video. Clips cortos de puerto, operación y personas son el estándar mínimo."},
   {"priority": "alta", "title": "Escribir para Latam desde Latam", "text": "Traducir posts globales no funciona: el español de Maersk tiene las peores cifras de su página. Hace falta contenido nativo sobre temporadas, puertos y exportadores."},
   {"priority": "media", "title": "Separar empleo de comunicación comercial", "text": "Los avisos de trabajo van en la pestaña Empleos o en una página de talento. El feed de marca le habla al comprador de carga."},
   {"priority": "media", "title": "Una serie visual reconocible", "text": "Hapag-Lloyd demuestra que una serie fotográfica constante construye recordación. Un formato propio repetido vale más que piezas sueltas."}]},
 "linkedinAds": {
  "conclusions": [
   {"title": "Asimetría total en la pauta", "text": "Maersk acumula 3.272 anuncios; Hapag-Lloyd 411; CMA CGM 63; MSC 56; COSCO Perú ninguno. Maersk concentra el 86% de los anuncios del set."},
   {"title": "Solo Hapag-Lloyd pauta pensando en Latam", "text": "El 32% de sus anuncios cargados está en español o portugués. Maersk llega al 12%; CMA CGM a 0%; y el español de MSC apunta a España."},
   {"title": "En la pauta manda el producto digital", "text": "Maersk Spot, Live Position, Quick Quotes e Integration Suite concentran la inversión. El orgánico vende marca; la pauta vende herramientas."},
   {"title": "Los ejecutivos ya son medio pagado", "text": "Hapag-Lloyd promociona posts de dos ejecutivos y CMA CGM los de Tanya Saadé Zeenny como Thought Leader Ads. Es el formato emergente de la categoría."},
   {"title": "El espacio pagado en Perú lo ocupan las globales", "text": "Sin pauta propia, COSCO Perú deja que Hapag-Lloyd y Maersk sean las marcas que el comprador peruano ve en su feed pagado."}],
  "recommendations": [
   {"priority": "alta", "title": "Pauta en español nativo, no traducida", "text": "Hapag-Lloyd ya ocupa ese terreno; la diferencia está en casos, puertos y cifras locales."},
   {"priority": "alta", "title": "Herramientas con demostración", "text": "La pauta ganadora muestra producto digital. Un video de 30 segundos cotizando o rastreando un contenedor vale más que una pieza institucional."},
   {"priority": "media", "title": "Thought Leader Ads con voces regionales", "text": "Nadie promociona a sus gerentes de Latam salvo un testimonio de Hapag-Lloyd. Es un espacio libre y creíble."},
   {"priority": "media", "title": "Pauta de temporada agroexportadora", "text": "Campañas acotadas a arándano, palta, uva y cereza, segmentadas por cargo (comercio exterior, logística) en Perú, Chile, Ecuador y Colombia."}],
  "territories": {
   "labels": ["Producto digital", "Rutas y servicios", "Sostenibilidad", "Empleo", "Marca y flota", "Ejecutivos (TLA)", "Resiliencia", "Ferias y agro"],
   "values": {"msc": [1, 1, 0, 1, 0.5, 0, 0, 0], "maersk": [1, 0.5, 0, 1, 0.5, 0, 1, 0], "cmacgm": [0, 0.5, 0.5, 1, 1, 1, 0, 0.5],
              "hapag": [1, 0, 1, 0.5, 0.5, 1, 0, 0], "cosco": [0, 0, 0, 0, 0, 0, 0, 0]},
   "notes": {"msc": {0: "Integration Suite en 5 idiomas", 1: "Canadá→Europa, Baltimore/Savannah"}, "maersk": {0: "Maersk Spot", 6: "También en español"},
             "cmacgm": {4: "NOTRE DAME, buques a GNL", 5: "Tanya Saadé Zeenny", 7: "Asia Fruit Logistica"},
             "hapag": {0: "Live Position, Quick Quotes", 2: "EN, ES y FR", 5: "André Wilke, Arne Zass"}, "cosco": {}}}},
 "strategicOpportunities": {
  "title": "Oportunidades de la categoría",
  "subtitle": "Caminos de comunicación que ninguna de las cinco está tomando en LinkedIn para el comprador latinoamericano",
  "industryStats": [
   {"value": "21,5%", "label": "de la capacidad mundial de contenedores es de MSC, récord de la industria", "source": "Alphaliner, sept-2026"},
   {"value": "3,07 M", "label": "TEU movió el Callao: cuarto puerto de América Latina", "source": "CEPAL, Boletín FAL 414"},
   {"value": "~10%", "label": "de los contenedores de Perú pasó por Chancay en ene–may 2026", "source": "APN / ComexPerú"},
   {"value": "30%", "label": "del volumen mundial de exportaciones refrigeradas sale de Sudamérica", "source": "CEPAL vía MundoMarítimo"},
   {"value": "124 días", "label": "investiga un comprador B2B antes de hablar con ventas", "source": "LinkedIn / Factors.ai"}],
  "opportunities": [
   {"title": "Chancay como relato propio", "platforms": ["Orgánico", "Ads"], "description": "El puerto que ya mueve cerca del 10% de los contenedores de Perú no tiene narrador en LinkedIn. Ni siquiera COSCO Perú lo cuenta.", "hook": "«23 días a Shanghái»: serie que sigue un contenedor de arándanos desde Chancay hasta destino."},
   {"title": "La temporada agroexportadora en español", "platforms": ["Orgánico"], "description": "Sudamérica despacha el 30% del volumen refrigerado mundial. CMA CGM cuenta esas historias en inglés y Maersk las traduce sin tracción.", "hook": "Calendario de cosechas con el exportador como protagonista: palta, uva, arándano, cereza, banano."},
   {"title": "Un LOOKOUT para el Pacífico sur", "platforms": ["Orgánico"], "description": "Hapag-Lloyd tiene el único newsletter recurrente de la categoría, y es en inglés. El comprador investiga 124 días antes de llamar.", "hook": "Newsletter mensual en español: itinerarios, congestión portuaria, tarifas y temporadas."},
   {"title": "Gerentes regionales como voces", "platforms": ["Orgánico", "Ads"], "description": "La categoría paga posts de ejecutivos globales. Nadie promociona a quienes negocian a diario con exportadores de la región.", "hook": "«Lo que vi esta semana en el puerto»: post quincenal del gerente comercial, promocionado como Thought Leader Ad."},
   {"title": "Herramientas digitales en español", "platforms": ["Ads"], "description": "eBL, Spot, Quick Quotes e Integration Suite se pautan casi solo en inglés. Hapag-Lloyd es la excepción.", "hook": "Tutoriales de 30 segundos: emitir un BL electrónico o cotizar en línea desde Lima o Santiago."},
   {"title": "Empleo convertido en marca", "platforms": ["Orgánico"], "description": "COSCO Perú logra interacción alta con avisos de trabajo: hay comunidad, pero no hay relato.", "hook": "Historias del equipo en Lima, Paita y Matarani en lugar de afiches de «Proceso cerrado»."}]},
 "diagnostic": {
  "dims": [{"dim": d, "weight": w, "note": n} for d, w, n in DIMS],
  "verdict": {"label": "Nadie le habla a Latam en su idioma",
              "description": "Las globales dominan alcance y pauta, pero solo Hapag-Lloyd invierte en español y portugués, y nadie cuenta Chancay. El promedio de la categoría queda en 58 de 100.",
              "strengths": ["Producción de video y marca de nivel global (MSC, CMA CGM)", "Pauta always-on de producto digital (Maersk, Hapag-Lloyd)", "Thought Leader Ads ya en uso"],
              "weaknesses": ["Contenido para Latam traducido o inexistente", "Chancay sin narrador pese a su peso en Perú", "La única página local no hace comunicación comercial"],
              "priority": ["Línea editorial nativa en español para el comprador regional", "Chancay y la temporada agro como territorios propios", "Voces comerciales regionales promocionadas como TLA"]},
  "gaps": [
   {"dimension": "Seguidores", "key": "followersLabel", "gapText": "Maersk triplica a Hapag-Lloyd y casi 400 veces a COSCO Perú. La base define el techo de impresiones orgánicas.", "severity": "alta"},
   {"dimension": "Posts por mes", "key": "postsPerMonth", "gapText": "Tres marcas publican entre 24 y 36 piezas. MSC compite con 9 y COSCO Perú con menos de 2.", "severity": "alta"},
   {"dimension": "Interacciones/post", "key": "interPerPost", "gapText": "MSC y CMA CGM duplican a Maersk y Hapag-Lloyd. Lo explican el video y la producción emocional.", "severity": "media"},
   {"dimension": "Video", "key": "videoPct", "gapText": "La brecha entre MSC (70%) y COSCO Perú (0%) se correlaciona con la interacción.", "severity": "media"},
   {"dimension": "Anuncios", "key": "adsCount", "gapText": "Maersk concentra el 86% de los anuncios del set. El resto pauta de forma táctica o no pauta.", "severity": "alta"},
   {"dimension": "Pauta ES/PT", "key": "esPt", "gapText": "Solo Hapag-Lloyd invierte de forma sistemática en el idioma del comprador latinoamericano.", "severity": "alta"}]},
 "sources": [
  {"t": "LinkedIn · MSC Mediterranean Shipping Company", "u": LI + "msc-mediterranean-shipping-co--s-a-/"},
  {"t": "LinkedIn · A.P. Moller - Maersk", "u": LI + "maersk-group/"},
  {"t": "LinkedIn · CMA CGM", "u": LI + "cma-cgm/"},
  {"t": "LinkedIn · Hapag-Lloyd AG", "u": LI + "hapag-lloyd-ag/"},
  {"t": "LinkedIn · COSCO Shipping Lines Peru", "u": LI + "coscoshipping-lines-peru/"},
  {"t": "Biblioteca de Anuncios de LinkedIn", "u": "https://www.linkedin.com/ad-library/"},
  {"t": "Logistics Management · Top 30 Ocean Carriers 2026 (Alphaliner)", "u": "https://www.logisticsmgmt.com/article/top_30_ocean_carriers_2026_walking_a_capacity_tightrope/Global_Trade"},
  {"t": "SupplyChain247 · Ranking the Top 30 Ocean Carriers of 2026", "u": "https://www.supplychain247.com/article/top-30-ocean-carriers-2026"},
  {"t": "Energiminas · Callao entre los cuatro puertos más importantes (CEPAL FAL 414)", "u": "https://energiminas.com/2026/06/02/puerto-del-callao-se-consolida-entre-los-cuatro-mas-importantes-de-america-latina/"},
  {"t": "Perú Retail · Chancay supera a Paita y alcanza el 10% del movimiento nacional", "u": "https://www.peru-retail.com/puerto-de-chancay-supera-a-paita-y-concentra-el-10-del-movimiento-nacional-de-contenedores/"},
  {"t": "Gestión · Chancay en su primer año de operación", "u": "https://gestion.pe/economia/puerto-de-chancay-agroexportacion-destaco-en-su-primer-ano-de-operacion-que-productos-agricolas-lideraron-noticia/"},
  {"t": "MundoMarítimo · Sudamérica alcanza el 30% del volumen refrigerado mundial", "u": "https://mundomaritimo.cl/noticias/editor/23492"},
  {"t": "Relevant Audience · LinkedIn/Factors.ai: compradores investigan 124 días", "u": "https://www.relevantaudience.com/social-media-marketing/linkedin-factors-b2b-buying-study/"}]
}

json.dump(data, open(os.path.join(HERE, "data.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for b in sorted(brands, key=lambda x: -x["score"]):
    print(b["name"], b["score"], b["er"], b["ads"]["esPt"])
print("avg", round(sum(b["score"] for b in brands) / len(brands)))
