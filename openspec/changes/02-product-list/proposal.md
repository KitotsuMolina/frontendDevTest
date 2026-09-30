# Proposal

## Why
Entregar el listado real solicitado por la prueba Nunegal/ITX tras navegación, cumpliendo R05, R06, R09 y R13 del inventario del PDF.

## What Changes
- Consumir GET https://itx-frontend-test.onrender.com/api/product mediante capa HTTP separada.
- Mostrar todos los productos en tarjetas con imagen, marca, modelo y precio textual; indicar precio no disponible cuando esté vacío.
- Filtrar inmediatamente por marca/modelo, ignorando mayúsculas y espacios exteriores, sin nuevas consultas.
- Enlazar a /product/:id y representar carga, error con reintento, catálogo vacío, búsqueda sin resultados e imagen fallida.
- Verificar con respuestas simuladas y con Chromium sobre la integración real.

## Capabilities

### New Capabilities
- `product-list`: catálogo remoto, búsqueda local, estados y navegación desde tarjetas.

### Modified Capabilities
Ninguna.

## Impact
Capa API, vista listado, tarjetas, estilos, pruebas y README. El detalle permanece provisional y la cesta sigue en 0. Sin caché ni POST.
