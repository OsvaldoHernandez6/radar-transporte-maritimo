# Radar Navieras

Benchmark de LinkedIn (orgánico y LinkedIn Ads) de cinco navieras, leído desde Latinoamérica:
**MSC, Maersk, CMA CGM, Hapag-Lloyd y COSCO Shipping Lines Perú**.

Extracción: **16 de octubre de 2026**.

## Ver el dashboard

`index.html` es autocontenido (los datos van incrustados). Se abre directo en el navegador
o se publica tal cual en GitHub Pages, Netlify o Vercel. Solo depende de Google Fonts.

**GitHub Pages:** Settings → Pages → Deploy from a branch → `main` / `root`.

## Contenido

| Sección | Qué incluye |
|---|---|
| Industria | Cuota de flota, puertos Latam, comportamiento del comprador B2B |
| LinkedIn orgánico | Seguidores, posts/mes, interacciones por post, tasa de interacción, mix de formatos |
| Perfil por marca | Tono, temas, post más fuerte, presencia de Latam en el feed |
| LinkedIn Ads | Volumen en la Biblioteca de Anuncios, idiomas, mensajes |
| Oportunidades | 7 caminos de comunicación no explotados por la categoría |
| Diagnóstico | Score 0–100 en 8 dimensiones, fortalezas/debilidades y brechas |

## Estructura

```
index.html          Dashboard publicado (generado)
data.json           Datos completos (generado, referencia)
src/
  build.py          Regenera index.html y data.json
  build_data.py     Calcula métricas y score por marca
  content.json      Textos: conclusiones, recomendaciones, oportunidades, veredictos
  template.html     Diseño y lógica de render
  raw/              Notas de verificación por marca, anuncios e industria
    organic.json    Métricas orgánicas base
```

## Actualizar

1. Edita las cifras en `src/raw/organic.json` y en el diccionario `ads` de `src/build_data.py`.
2. Edita los textos en `src/content.json`.
3. Regenera: `python3 src/build.py` (Python 3, sin dependencias).

## Método

- Páginas y Biblioteca de Anuncios de LinkedIn revisadas en navegador el 16-oct-2026.
- Muestra de ~50 publicaciones por marca (12 en COSCO Perú).
- Interacciones = reacciones + comentarios + compartidos visibles, promedio últimos 30 días (90 en COSCO Perú).
- Tasa de interacción calculada sobre seguidores (sin impresiones): **estimado**.
- Seguidores redondeados por LinkedIn ("2 mills.").
- Anuncios: total según la biblioteca; idiomas y mensajes sobre hasta 168 anuncios cargados por marca.

### Score (100 pts)

| Dimensión | Peso | Cálculo |
|---|---|---|
| Alcance | 20 | Seguidores vs. líder |
| Frecuencia | 15 | Posts/mes vs. 20 |
| Interacción/post | 15 | vs. líder |
| Video | 10 | % video vs. 60% |
| Latam orgánico | 10 | Cualitativo |
| Consistencia de marca | 5 | Cualitativo |
| Volumen de pauta | 15 | Escala logarítmica vs. líder |
| Latam en pauta | 10 | % anuncios ES/PT vs. 32% |

## Fuentes de industria

Alphaliner (vía Logistics Management y SupplyChain247), CEPAL Boletín FAL 414, APN/ComexPerú,
Gestión, MundoMarítimo, LinkedIn/Factors.ai.
