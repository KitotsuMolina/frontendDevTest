# Proposal

## Why
Implementar el hito caché de la prueba tras 02-product-list, trazable a R14 del inventario del PDF.

## What Changes
- Añadir los comportamientos definidos en la especificación de este hito.
- Mantener exactamente dos vistas y verificar los escenarios de aceptación.
- Implementación autorizada: persistencia localStorage, TTL exacto y deduplicación; detalle y POST siguen pendientes.

## Capabilities

### New Capabilities
- `query-cache`: comportamiento del hito caché.

### Modified Capabilities
Ninguna.

## Impact
SPA React, pruebas y documentación. Depende de 02-product-list; ver design.md para integración.
