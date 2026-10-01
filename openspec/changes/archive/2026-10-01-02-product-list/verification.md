# Verificación del listado

Comprobaciones realizadas el 30 de septiembre de 2026. Se leyeron y completaron propuesta, diseño, requisitos y tareas antes de modificar código. Los ajustes previos de navbar/easter egg se registraron por separado en 2f22e52 para mantener el commit de listado centrado en este hito.

| Comprobación | Resultado |
| --- | --- |
| Contrato real GET /api/product | 100 productos; id, brand, model, price e imgUrl son texto; 6 precios vacíos |
| pnpm test | 25 pruebas aprobadas en 3 archivos; todas usan respuestas simuladas |
| pnpm lint | Correcto, sin advertencias |
| pnpm build | Correcto, tipado estricto y salida de producción |
| pnpm spec:validate | 7 cambios aprobados en modo estricto |
| Chromium: integración real | 100 tarjetas y 6 textos Precio no disponible; enlace del primer producto abre detalle provisional con su id |
| Chromium: búsqueda | Marca ACER y modelo ICONIA TALK con espacios exteriores, término sin coincidencias y limpieza correctos; cero consultas adicionales |
| Chromium: distribución | 360 px: 1 columna; 768 px: 2; 1440 y 1920 px: 4; sin desbordamiento horizontal |
| Chromium: imágenes | Carga real confirmada; altura de 190 px, sin solapamiento con marca/modelo; capturas móvil y escritorio revisadas |
| Consola de integración | Sin errores ni advertencias durante las comprobaciones iniciales |
| Alcance de red | Solo GET del listado e imágenes; sin consulta de detalle ni POST de cesta |

Pruebas simuladas: validación de contrato y fallos HTTP/red; catálogo completo, precios vacíos y de solo espacios sin moneda; filtro por ambos campos normalizando mayúsculas/espacios y limpieza sin peticiones; carga, catálogo vacío, búsqueda sin coincidencias, reintento tras HTTP/red/contrato inválido; alternativa de imagen fallida o URL vacía; cancelación al desmontar; navegación por tarjetas, teclado, regreso e historial.

StrictMode en desarrollo inicia dos intentos GET al montar, cancelando el primero. La comprobación real registra esa base de dos y cero nuevas peticiones al buscar. No se ha implementado caché ni deduplicación. Volver al listado vuelve a consultar, como corresponde a este hito.

La revisión visual detectó imágenes que podían exceder la altura de su contenedor por dimensionado porcentual en CSS Grid. Se fijó su altura a 190 px y se repitieron las comprobaciones de columnas, imágenes cargadas y ausencia de solapamientos antes de la entrega.

Las cuatro tareas están completadas. Se detiene el desarrollo: caché, consulta de detalle y acciones de cesta quedan pendientes.

## Ajuste posterior: esqueletos de carga

Se sustituye el mensaje visible por ocho esqueletos animados de tarjetas, reutilizando las columnas del catálogo. Chromium con una respuesta retenida confirmó una columna a 360 px, cuatro a 1440 px, brillo activo, ausencia de animación con movimiento reducido y retirada de esqueletos al responder. Capturas móvil y escritorio revisadas. La prueba de carga verifica aviso accesible, ausencia de enlaces durante espera y sustitución por productos. Las 25 pruebas, lint, build y validación OpenSpec pasan.

## Ajuste posterior: animación de búsqueda

Chromium con el catálogo real confirmó opacidades intermedias de las tarjetas descartadas y transformaciones durante la recolocación de las coincidencias. Las salientes son inert. Cambiar rápidamente entre Acer, Galaxy y búsqueda vacía recupera los 100 productos sin nuevas consultas. Se comprobó la preferencia de movimiento reducido y la distribución a 360 y 1440 px sin desbordamiento. La nueva prueba simulada cubre cambios rápidos y limpieza sin nuevas peticiones; 25 pruebas pasan. Lint, build y validación estricta de los siete cambios OpenSpec correctos.

## Ajuste posterior: buscador bajo la cabecera

26 pruebas pasan, incluida dirección de scroll, conservación del mismo input y valor, foco y vuelta al inicio. Lint, build y validación de los siete cambios pasan. Chromium confirma el panel visible al subir, alineado exactamente bajo la cabecera (73 px en escritorio de 1440 px y 65 px en móvil de 360 px), sin desbordamiento horizontal. Movimiento reducido da transición de 0 s. Captura móvil revisada. Servidor Vite disponible en http://127.0.0.1:5173/.

## Cierre de los ajustes visuales

28 pruebas aprobadas: incluye solapa de regreso con historial y acceso directo, buscador acoplado y cambios rápidos de filtro. Test, lint completo, build y validación estricta OpenSpec correctos. ESLint excluye directorios de herramientas locales (.aws, .codex y .agents) para evitar recorrer entradas virtuales del entorno; el código de aplicación y configuraciones siguen comprobándose. Se incluyen entrada suave del listado, hover/foco y pulsación de tarjetas adaptados de SteveBloX con aviso MIT, navbar fija, scrollbar, esqueletos, ancho completo y eliminación solicitada de breadcrumbs/título visible. Caché, API de detalle y POST de cesta siguen pendientes.
