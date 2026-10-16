# Radar Navieras

Benchmark de LinkedIn orgánico y LinkedIn Ads de MSC, Maersk, CMA CGM, Hapag-Lloyd y COSCO Shipping Lines Perú, leído desde Latinoamérica. Extracción: 16 de octubre de 2026.

Mismo formato que el Radar Family Park: rail de módulos, búsqueda ⌘K, lente de marca (teclas 1–5), tema claro/oscuro y tamaño de texto.

## Publicar
`index.html` lee `data.json` con `fetch`, igual que el Radar Family Park. Sube la carpeta a Vercel, Netlify o GitHub Pages tal cual. En local: `python3 -m http.server 8080`.

## Módulos
RES Resumen · CAT Panorama · LI LinkedIn orgánico · ADS LinkedIn Ads · OPP Oportunidades · DX Diagnóstico (ranking 0–100) · SRC Fuentes

## Logos
Las tarjetas muestran un wordmark con el color de cada marca. Para usar logos reales, deja el archivo en la raíz (ej. `logo-msc.svg`) y completa el campo `logo` de la marca en `src/build_data.py`.

## Actualizar
Edita cifras y textos en `src/build_data.py`, el diseño en `src/head.html` y la lógica en `src/script.js`, y corre `python3 src/build.py`.
