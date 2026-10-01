# Verificación de acabado y revisión final

1 de octubre de 2026. Informe y tabla R01–R14: [docs/final-review.md](../../../../docs/final-review.md).

- PDF completo contrastado, incluidas capturas renderizadas del listado/detalle.
- Correcciones: foco y scroll al cambiar de ruta, reserva dinámica de la solapa, espacio móvil entre Volver/breadcrumbs y h1 accesible del catálogo sin título visible.
- 98 pruebas Vitest en nueve archivos, 24 ejecuciones E2E en Chromium a 360/768/1440 px (ocho escenarios), con comprobación de nombre largo a 320 px. API e imágenes simuladas; cero dependencia del servicio público.
- E2E del recorrido listado/búsqueda/detalle/selección/POST/contador/recarga, error y reintento manual, navegación pendiente, historial, URL directa y recarga en preview, caducidad exacta con reloj, teclado, movimiento reducido y axe.
- Revisión visual de ambas vistas y selectores abiertos; geometría de cuatro columnas máximo, dos columnas de detalle en escritorio, sin contenido inicial tapado ni desbordamiento horizontal.
- Axe sin infracciones en las reglas WCAG A/AA incluidas. Revisión de teclado/foco, etiquetas, alt y anuncios; no certificación integral ni prueba con lectores de pantalla reales.
- Integración real en preview: 100 productos, GET listado/detalle HTTP 200, búsqueda y recarga/regreso sin GET adicionales con caché válida; cero POST nuevos. La respuesta real de cesta `{count:1}` pertenece a la evidencia de 05-cart, separada de los counts simulados 3/7.
- pnpm install --frozen-lockfile, test, lint, build y test:e2e correctos. OpenSpec validado en modo estricto antes y después de sincronizar.
- GitHub API verificó repositorio público y rama main. Historial conservado; revisión del diff sin errores de espacios.
- Commits separados: ead0bf7 corrige foco/solapas; ee25138 incorpora E2E/herramientas. La documentación y el archivo se registran en un commit final propio.
- README documenta versiones, scripts, contratos, API configurada, caché, contador, decisiones, limitaciones, pruebas y fallback index.html de las rutas SPA.
- Los siete hitos quedan cerrados y archivados; requisitos entregados sincronizados en openspec/specs. No se despliega ni se envía a Nunegal.
