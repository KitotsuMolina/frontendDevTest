# cart Specification

## Purpose
Definir el comportamiento observable del hito cesta para cumplir la prueba frontend Nunegal/ITX de forma verificable.

## Requirements

### Requirement: Añadir selección
El botón Añadir SHALL enviar POST /api/cart con id, colorCode y storageCode seleccionados; solo permitirá envío con opciones válidas y evitará duplicados mientras está pendiente.

#### Scenario: Envío correcto
- **WHEN** se seleccionan opciones válidas y se activa Añadir
- **THEN** el POST contiene los tres campos con códigos del producto.

### Requirement: Contador persistente
El contador SHALL tomar el count de la respuesta correcta, mostrarse en cabecera en ambas vistas y persistirse entre recargas. SHALL inicializarse a cero sin un dato persistido válido.

#### Scenario: Recarga y navegación
- **WHEN** API devuelve count y luego se cambia de vista o recarga
- **THEN** la cabecera conserva dicho valor sin incrementos locales inventados.

### Requirement: Fallo al añadir
Un fallo de POST SHALL informar al usuario y conservar el contador anterior, permitiendo reintento.

#### Scenario: Mutación fallida
- **WHEN** el POST falla
- **THEN** se informa del error, no se altera el contador y se habilita reintento.

### Requirement: Contrato y validación estrictos
POST SHALL enviar JSON con exactamente id, colorCode y storageCode, conservando los códigos numéricos recibidos y Content-Type application/json. count SHALL validarse como número entero no negativo y reemplazar el contador sin sumas locales. POST no SHALL cachearse ni reintentarse automáticamente.

#### Scenario: Respuesta inválida
- **WHEN** HTTP, red, JSON o count son inválidos
- **THEN** se conserva el contador previo y se ofrece error accesible y reintento manual.

### Requirement: Petición compartida y confirmación
El estado de la petición SHALL permanecer al navegar entre las dos vistas. SHALL mostrar Añadiendo… durante envío, bloquear duplicados y confirmar éxito accesiblemente, incluso al finalizar en otra ruta.

#### Scenario: Navegación pendiente
- **WHEN** el usuario sale del detalle antes de terminar el POST
- **THEN** la operación continúa una sola vez y actualiza el contador compartido al finalizar, con confirmación o error en la vista activa.

### Requirement: Persistencia tolerante a fallos
El contador SHALL guardarse en localStorage fuera de la caché GET y recuperarse al montar. Ausencia, datos corruptos o inválidos SHALL producir 0; si falla storage SHALL seguir funcionando en memoria.

#### Scenario: Almacenamiento no disponible
- **WHEN** lectura o escritura de localStorage falla
- **THEN** la interfaz conserva su funcionamiento y los éxitos actualizan el contador en memoria.
