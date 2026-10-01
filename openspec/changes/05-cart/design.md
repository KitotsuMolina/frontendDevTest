# Design

## Context
Detalle y códigos reales numéricos verificados. Se mantienen dos vistas y la caché GET existente.

## Decisions
- Cliente src/api/cart.ts separado de la caché. POST con Content-Type application/json y exactamente id, colorCode, storageCode. Sin señal de cancelación ligada a rutas, sin caché ni reintentos automáticos.
- DetailContent resuelve los valores textuales del select contra sus opciones y envía los códigos numéricos originales. Añadir habilitado solo con ambas opciones válidas y sin petición pendiente.
- useCart alojado en App actúa como estado compartido por ambas rutas; no necesita otro provider porque App permanece montada. Header recibe count y detalle recibe pending/add. La confirmación y el error quedan en App para permanecer accesibles si cambia la vista.
- Ref síncrona bloquea duplicados incluso antes de render; estado pending muestra Añadiendo… y bloquea acciones en cualquier detalle. Navegar no cancela la operación.
- count debe ser un número entero no negativo. Tras éxito se reemplaza el valor exacto, también cuando es cero o inferior al anterior. HTTP/red/JSON/count inválido mantienen contador previo y permiten reintento únicamente por acción del usuario.
- Persistencia separada en nunegal:cart:v1:count como número JSON. Ausencia, corrupción o valor inválido -> 0; fallos de lectura/escritura -> funcionamiento en memoria. No se aplica TTL al contador.

## Verification
Pruebas simuladas de contrato, tipos, selección, bloqueo, persistencia/remonte, fallos y navegación durante petición. Una operación Chromium real devuelve HTTP 200 y {count:1}, conservado al navegar y recargar. No se infiere acumulación remota a partir de esta única operación.

## Non-Goals
Sin checkout, vista de carrito, acciones de borrado, reintentos automáticos ni acabado final.
