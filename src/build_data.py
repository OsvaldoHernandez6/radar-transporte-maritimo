import json, math, os
HERE = os.path.dirname(os.path.abspath(__file__))

org = json.load(open(os.path.join(HERE, 'raw', 'organic.json'), encoding='utf-8'))
order = ["MSC", "Maersk", "CMA CGM", "Hapag-Lloyd", "COSCO Perú"]
colors = {"MSC": "#B8902B", "Maersk": "#2E9CC4", "CMA CGM": "#C8102E", "Hapag-Lloyd": "#E2661A", "COSCO Perú": "#1D4F9C"}
share = {"MSC": 21.5, "Maersk": 13.8, "CMA CGM": 12.8, "Hapag-Lloyd": 7.0, "COSCO Perú": 10.6}

ads = {
    "MSC": {"total": 56, "loaded": 54, "langs": {"EN": 44, "ES": 3, "PT": 1, "FR/IT/DE": 6}, "tla": 0,
            "themes": ["Rutas: Canadá→Europa (12 anuncios)", "Africa Intermodal (serie de video)", "Autos usados: importar y exportar", "MSC Integration Suite (API) en 5 idiomas", "Nuevas escalas Baltimore y Savannah"],
            "reading": "Pauta de rutas y servicios dirigida por mercado de origen, localizada a idiomas europeos. El único anuncio en español revisado en detalle se mostró 100% en España (50–100 mil impresiones, may–jun 2026). Latam no aparece como objetivo."},
    "Maersk": {"total": 3272, "loaded": 168, "langs": {"EN": 147, "ES": 18, "PT": 3}, "tla": 0,
               "themes": ["Maersk Spot: reserva spot con precio fijo", "Resiliencia de la cadena de suministro (EN y ES)", "Empleo: aduanas, recién egresados, tecnología", "Transporte terrestre e intermodal", "Cumplimiento de conexiones (96% on-time)"],
               "reading": "Pauta always-on a escala industrial: 52 veces el volumen de MSC. Empuja producto digital (Spot) y employer branding, con una capa de thought leadership sobre resiliencia que sí traduce al español."},
    "Hapag-Lloyd": {"total": 411, "loaded": 168, "langs": {"EN": 114, "ES": 47, "PT": 7}, "tla": 2,
                    "themes": ["Live Position: monitoreo de carga 24/7", "Descarbonización (EN, ES, FR)", "Calidad de servicio", "Quick Quotes Spot: cotización inmediata", "Thought Leader Ads de 2 ejecutivos"],
                    "reading": "El anunciante más localizado a Latam: 32% de sus anuncios cargados están en español o portugués. Combina producto digital, sostenibilidad y voces de ejecutivos pagadas como Thought Leader Ads."},
    "CMA CGM": {"total": 63, "loaded": 61, "langs": {"EN": 40, "FR": 21, "ES": 0}, "tla": 1,
                "themes": ["Flota: CMA CGM NOTRE DAME y buques a GNL", "Aniversario y herencia de Marsella", "Fundación CMA CGM (RSE)", "Servicio TVI / IEX2", "Thought Leader Ad de Tanya Saadé Zeenny"],
                "reading": "Pauta institucional de orgullo de flota y familia fundadora, en inglés y francés. Prácticamente sin producto y sin ningún anuncio en español."},
    "COSCO Perú": {"total": 0, "loaded": 0, "langs": {}, "tla": 0,
                   "themes": ["Sin biblioteca de anuncios"],
                   "reading": "No pauta en LinkedIn. El espacio pagado que ve el comprador peruano lo ocupan las globales, sobre todo Hapag-Lloyd y Maersk."},
}

profiles = {
    "MSC": {"tone": "Institucional y emocional, con fuerte uso de video",
            "themes": ["Ferias de alimentos y project cargo", "Anuncios de servicios y rutas", "Producto digital: eBL, myMSC", "RSE: Mercy Ships, ballenas", "Saludos culturales y sponsoring"],
            "top": "Navidad «Helping Santa deliver since 1970»: 7.089 reacciones y 654 compartidos",
            "latam": "4 posts en español: Expoalimentaria Lima, visita del CEO a Chile y experiencia digital. Servicio Ipanema hacia Sudamérica.",
            "insight": "Publica la mitad que sus pares pero logra las mayores interacciones por post. Cada pieza está producida como campaña."},
    "Maersk": {"tone": "Integrador logístico, didáctico, orientado a producto",
               "themes": ["Logística end-to-end: aéreo, frío, almacenaje", "Thought leadership: nearshoring, clima, resiliencia", "Ferias: Fruit Attraction, Expoalimentaria", "Gamificación: «Guess the port»", "Historia de marca desde 1904"],
               "top": "Piloto de propulsión asistida por viento 2027: 1.587 reacciones",
               "latam": "Cerca de 8 posts en español segmentados por idioma (palta, productos frescos, volatilidad de demanda) con 12 a 198 reacciones.",
               "insight": "La mayor base y la mayor frecuencia (unas 9 piezas por semana), pero la tasa de interacción más baja: el volumen diluye la atención."},
    "CMA CGM": {"tone": "Corporativo-emocional, orgullo de familia y flota",
                "themes": ["Herencia: Marsella, aniversario, bautizos de buques", "Logística CEVA", "Opinión sobre IA y Climate Week", "Origen de la carga: palta, cacao ecuatoriano, Costa Rica, Brasil", "Employer branding y RSE"],
                "top": "Aniversario del Grupo: 3.233 reacciones",
                "latam": "Cuenta orígenes latinoamericanos (cacao ecuatoriano, sol de Costa Rica, primera vez en Brasil), pero siempre en inglés.",
                "insight": "La combinación más equilibrada de volumen y resonancia: 29 posts al mes con 477 interacciones por post."},
    "Hapag-Lloyd": {"tone": "Humano y lúdico, el más cercano de la categoría",
                    "themes": ["Fotografía de buques «Express» como serie", "Newsletter mensual LOOKOUT", "Asistente IA «Marina» y podcast", "Historias de tripulantes", "Rutas Caribe: Caucedo, Cartagena, Manzanillo"],
                    "top": "«Big news... But we're trying to stay calm»: 1.760 reacciones",
                    "latam": "Menciona puertos del Caribe y Centroamérica; feed 100% en inglés.",
                    "insight": "Tiene la marca visual más reconocible (series fotográficas) y el único formato editorial recurrente (LOOKOUT)."},
    "COSCO Perú": {"tone": "Local, en español, funcional",
                   "themes": ["Avisos de empleo (10 de 12 posts)", "Lanzamiento servicio CHX3 Paita–Asia", "Servicio quincenal Matarani"],
                   "top": "Aviso de empleo (Asistente): 459 reacciones",
                   "latam": "100% en español y 100% Perú. El About promete Chancay–Shanghái, pero ningún post habla de Chancay.",
                   "insight": "La página funciona como bolsa de trabajo. Tiene la tasa de interacción más alta por su base chica, pero casi no hace comunicación comercial."},
}

latam_org = {"Maersk": 7, "MSC": 6, "CMA CGM": 5, "Hapag-Lloyd": 3, "COSCO Perú": 6}
consist = {"MSC": 5, "Hapag-Lloyd": 5, "CMA CGM": 5, "Maersk": 3, "COSCO Perú": 3}

def video(b):
    return org[b]["fmt"].get("Video", 0)

brands = []
maxf = max(org[b]["followers"] for b in order)
maxi = max(org[b]["interPerPost"] for b in order)
for b in order:
    o = org[b]; a = ads[b]
    es_pt = sum(v for k, v in a["langs"].items() if k in ("ES", "PT"))
    loc_pct = round(100 * es_pt / a["loaded"]) if a["loaded"] else 0
    s = {
        "Alcance": round(20 * o["followers"] / maxf, 1),
        "Frecuencia": round(15 * min(o["postsPerMonth"] / 20, 1), 1),
        "Interacción/post": round(15 * o["interPerPost"] / maxi, 1),
        "Video": round(10 * min(video(b) / 60, 1), 1),
        "Latam orgánico": latam_org[b],
        "Consistencia": consist[b],
        "Volumen pauta": round(15 * math.log10(a["total"]) / math.log10(3272), 1) if a["total"] else 0,
        "Latam en pauta": round(min(loc_pct / 32, 1) * 10, 1),
    }
    er = round(100 * o["interPerPost"] / o["followers"], 3)
    brands.append({**o, "key": b, "color": colors[b], "share": share[b], "er": er, "video": video(b),
                   "ads": {**a, "locPct": loc_pct}, "profile": profiles[b],
                   "score": round(sum(s.values())), "scoreParts": s})

data = {"brands": brands}
json.dump(data, open(os.path.join(HERE, 'scores.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for x in sorted(brands, key=lambda x: -x["score"]):
    print(x["key"], x["score"], x["er"], x["ads"]["locPct"], x["scoreParts"])
