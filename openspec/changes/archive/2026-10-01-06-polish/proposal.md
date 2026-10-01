# Proposal

## Why
Implementar el hito acabado de la prueba tras 05-cart, trazable a R02, R04 y calidad adicional del inventario del PDF.

## What Changes
- Añadir los comportamientos definidos en la especificación de este hito.
- Mantener exactamente dos vistas y verificar los escenarios de aceptación.
- Revisar PDF, accesibilidad, E2E simuladas en preview y documentación; corregir incidencias sin alterar el diseño.
- Sincronizar y archivar hitos completos, conservando sus evidencias y el historial real.

## Capabilities

### New Capabilities
- `delivery-quality`: comportamiento del hito acabado.

### Modified Capabilities
- `navigation`: sustituir el alcance provisional por las dos vistas terminadas y verificar el acceso directo en producción.
- `product-detail`: reflejar el botón Añadir integrado y retirar el requisito de integración pendiente.
- `query-cache`: reflejar la caché entregada para listado y detalles por ID.

## Impact
SPA React, pruebas y documentación. Depende de 05-cart; ver design.md para integración.
