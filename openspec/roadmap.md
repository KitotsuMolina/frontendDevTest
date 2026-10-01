# Hitos de desarrollo

Los siete hitos originales están implementados, verificados y archivados el 1 de octubre de 2026. Los requisitos actuales viven en `openspec/specs`; las propuestas, decisiones, tareas y evidencias históricas se conservan en el archivo.

| Orden | Cambio y evidencias | Estado | Dependencia |
| --- | --- | --- | --- |
| 0 | [00-project-setup](changes/archive/2026-10-01-00-project-setup/verification.md) | Completo y archivado | Ninguna |
| 1 | [01-navigation](changes/archive/2026-10-01-01-navigation/verification.md) | Completo y archivado | Preparación |
| 2 | [02-product-list](changes/archive/2026-10-01-02-product-list/verification.md) | Completo y archivado | Navegación |
| 3 | [03-query-cache](changes/archive/2026-10-01-03-query-cache/verification.md) | Completo y archivado | Listado |
| 4 | [04-product-detail](changes/archive/2026-10-01-04-product-detail/verification.md) | Completo y archivado | Caché |
| 5 | [05-cart](changes/archive/2026-10-01-05-cart/verification.md) | Completo y archivado | Detalle |
| 6 | [06-polish](changes/archive/2026-10-01-06-polish/verification.md) | Completo y archivado | Cesta |

[Revisión final y tabla del PDF](../docs/final-review.md). El historial conserva los commits originales y los ajustes visuales separados; no se han fabricado ni reescrito avances. Exactamente dos vistas. Revisión terminada, sin despliegue ni envío a Nunegal.

Corrección posterior autorizada: [07-cart-session-proxy](changes/07-cart-session-proxy/tasks.md), sesión por navegador mediante proxy de cesta en desarrollo y preview. [Diagnóstico y evidencias](../docs/cart-session-proxy.md). El alojamiento de producción necesita un proxy equivalente; no se ha desplegado.
