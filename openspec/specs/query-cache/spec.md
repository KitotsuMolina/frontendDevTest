# query-cache Specification

## Purpose
Definir el comportamiento observable del hito caché para cumplir la prueba frontend Nunegal/ITX de forma verificable.

## Requirements

### Requirement: Consultas cacheadas una hora
Las respuestas correctas del listado y del detalle por ID SHALL almacenarse en localStorage. Las entradas SHALL usar claves independientes y una caducidad absoluta de 3 600 000 ms desde su obtención. Leer una entrada no SHALL renovar su caducidad.

#### Scenario: Reutilización antes de caducar
- **WHEN** se repite una consulta con una entrada menor de una hora
- **THEN** se devuelve la entrada sin nueva petición HTTP.

#### Scenario: Independencia de productos
- **WHEN** se consulta el listado o dos detalles distintos
- **THEN** cada respuesta usa su propia entrada y caducidad sin sustituir otras claves.

### Requirement: Revalidación al caducar
Al alcanzar una hora o no disponer de entrada válida, la siguiente consulta SHALL recuperar información actualizada desde API; los errores SHALL permitir reintento sin almacenarse como éxito. POST SHALL quedar fuera de la caché.

#### Scenario: Expiración y recuperación
- **WHEN** se solicita una entrada de una hora o más
- **THEN** se realiza nueva petición y solo un resultado correcto renueva datos y timestamp.

### Requirement: Persistencia y tolerancia a fallos
La aplicación SHALL reutilizar entradas válidas tras recarga, sin renovar fechas por lectura. SHALL validar datos almacenados e ignorar entradas corruptas y fallos de lectura/escritura. Un listado vacío válido SHALL poder almacenarse.

#### Scenario: Almacenamiento no disponible
- **WHEN** localStorage está bloqueado, lleno o contiene datos corruptos
- **THEN** se consulta normalmente y el resultado correcto sigue disponible, sin interrumpir la aplicación.

### Requirement: Deduplicación y estados existentes
La capa SHALL compartir consultas simultáneas de una misma clave y liberar fallos para permitir reintento. SHALL conservar carga, error y reintento sin mostrar silenciosamente datos caducados.

#### Scenario: Fallo de renovación
- **WHEN** falla una consulta después de vencer una entrada
- **THEN** se muestra error, no se reemplaza la entrada con el fallo ni se muestran datos viejos, y se permite reintento.

#### Scenario: Solicitudes simultáneas
- **WHEN** dos consumidores solicitan la misma clave sin entrada válida
- **THEN** comparten una única solicitud, mientras otras claves son independientes.
