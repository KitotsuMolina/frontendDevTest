# Revisión final — 1 de octubre de 2026

Fuente contrastada: las siete páginas del [PDF](../openspec/Prueba%20frontend%20ITX.pdf), incluidas las imágenes de estructura PLP/PDP y los contratos. Esta tabla describe la entrega actual; las evidencias de hitos anteriores permanecen en OpenSpec.

| Requisito del PDF | Implementación | Verificación |
| --- | --- | --- |
| R01 · React, SPA, exactamente dos vistas | React Router: `/` y `/product/:id`; sin SSR ni carrito como página | Unitarias de rutas; E2E conserva el documento y usa atrás/adelante |
| R02 · Respetar estructuras propuestas | Cabecera común; búsqueda sobre cuadrícula; imagen izquierda y descripción/acciones derecha en escritorio | PDF renderizado y capturas Chromium a 360/768/1440 px |
| R03 · start/build/test/lint y README inicial | Scripts pnpm y README desde `122c525` | Instalación congelada, comandos correctos e historial existente |
| R04 · Repositorio público, evolución por hitos | GitHub KitotsuMolina/frontendDevTest; commits originales conservados | GitHub API devuelve `visibility: public`; revisión de Git y diff |
| R05 · Todos los productos, máximo cuatro columnas | Sin paginación; cuadrícula de 1/2/3/4 columnas | E2E: 12 fixtures; real: 100 productos; 1/2/4 columnas a 360/768/1440 |
| R06 · Buscar por marca/modelo y abrir detalle | Filtro local inmediato normalizado; enlaces por ID | E2E búsqueda de ambos campos sin nuevos GET y navegación cliente |
| R07 · Dos columnas y enlace de vuelta | Dos columnas desde 900 px; móvil apilado; enlace Listado y Volver | E2E geometría, acceso directo, regreso e historial |
| R08 · Inicio, breadcrumbs y contador derecho | Nombre enlazado; solapa persistente con producto; contador compartido | Unitarias y E2E, teclado, recarga y navegación pendiente |
| R09 · Imagen, marca, modelo y precio | Tarjetas completas; precio vacío permanece con alternativa | Unitarias y E2E; texto alternativo y fallback de imagen |
| R10 · Todos los atributos mínimos | Marca/modelo/precio, CPU/RAM/SO/resolución/batería/cámaras/dimensiones/peso | Fixtures reales y pruebas de detalle; sin inventar unidades ni valores ausentes |
| R11 · Selectores siempre visibles, únicos por defecto | Color/almacenamiento con códigos reales; elección explícita si múltiples | Unitarias; E2E única/múltiple, teclado y reinicio al cambiar de producto |
| R12 · POST exacto, count compartido y persistente | Tres campos, códigos numéricos, count validado y reemplazo exacto | Unitarias y E2E éxito, fallo/manual retry, recarga y petición pendiente |
| R13 · GET listado y detalle | HTTP separado, JSON validado en ejecución | Unitarias con mocks; GET reales HTTP 200 en Chromium |
| R14 · Caché cliente de una hora | localStorage por clave, TTL absoluto de 3 600 000 ms | Unitarias con reloj; E2E recarga y expiración exacta sin espera real |

## Correcciones y revisión visual

Se corrigió el salto de scroll producido por el foco al cambiar de ruta: el contenido empieza arriba y recibe foco sin quedar bajo la navbar. La solapa reserva su altura medida con ResizeObserver, incluso con un nombre largo a 320 px. Se añadió separación entre Volver y breadcrumbs en móvil y un h1 accesible sin recuperar el título visible retirado por el usuario.

Se inspeccionaron capturas de listado, detalle y menú abierto a 360/768/1440 px, y ambas vistas reales a 360/1440 px. Se mantienen navbar fija, curvas de solapas, buscador acoplado, tarjetas animadas y selectores actuales. Sin desbordamiento horizontal ni contenido inicial tapado en la matriz revisada. Los elementos que pasan bajo la cabecera al hacer scroll conservan margen de desplazamiento para el foco. No queda contenido provisional en las vistas.

## Accesibilidad

Tab/Enter permite saltar al contenido, enfocar marca/buscador/tarjetas, abrir detalle, seleccionar opciones y añadir; el foco es visible. Se verifica el foco en main al cambiar de ruta y el buscador acoplado con foco. Encabezados, navegación etiquetada, aria-current, etiquetas de selectores, texto alternativo y fallback acompañan ambas vistas. Esqueletos anuncian carga mediante status/aria-busy; éxito usa status y errores alert. Movimiento reducido desactiva esqueletos, transiciones de página, buscador, solapas, peel y tarjetas.

Axe sobre estados estables de listado, detalle, carga y mensajes no encuentra infracciones de las reglas WCAG 2 A/AA y 2.1 A/AA utilizadas, incluidas las de contraste. Se esperan las animaciones finitas antes de medir los colores renderizados. No se ha realizado una auditoría completa con lectores de pantalla ni se declara certificación WCAG.

## Pruebas reproducibles y producción

- 98 pruebas Vitest en nueve archivos: contratos, validación, caché y almacenamiento, estados, navegación, selecciones y cesta.
- 24 ejecuciones Playwright: ocho escenarios en tres resoluciones, API e imágenes simuladas; sin dependencia del servicio público. Incluyen error y reintento manual, envío pendiente y breadcrumbs largos.
- Las E2E compilan y levantan preview, verifican HTTP 200 al abrir directamente un detalle y recargarlo, historial y navegación sin recarga documental. No usan el servidor de desarrollo.
- `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm test:e2e` y `pnpm spec:validate` completados correctamente. Diff revisado con `git diff --check`.
- El alojamiento futuro debe devolver `index.html` como fallback de las rutas SPA. No se ha desplegado ni enviado la entrega.

## Observaciones reales y límites

En la revisión final Chromium consultó listado y detalle real: ambos HTTP 200, 100 productos, cero GET adicionales al buscar, regresar y recargar con caché válida; cero operaciones POST nuevas. Se revisaron imágenes remotas reales y adaptación de ambas vistas.

La operación real de cesta pertenece a la evidencia del hito 05-cart: `{id:"ZmGrkLRPXOTpxsU4jjAcv",colorCode:1000,storageCode:2000}` devolvió HTTP 200 `{count:1}`. El contador se mantuvo en listado/detalle/recarga. No se deduce acumulación del servidor a partir de esa operación. Los valores 3 y 7 de las E2E son simulados.

La disponibilidad de la API depende del servicio externo. Sin localStorage utilizable la app consulta normalmente y mantiene el contador en memoria, sin persistencia entre recargas. Una recarga documental durante un POST pendiente puede perder la confirmación; no se repite la operación automáticamente. Firefox/Safari y lectores de pantalla reales quedan fuera de la matriz comprobada. No quedan funcionalidades del enunciado pendientes en el alcance revisado.
