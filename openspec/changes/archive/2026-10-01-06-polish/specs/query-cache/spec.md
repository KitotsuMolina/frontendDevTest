# Spec Delta

## MODIFIED Requirements

### Requirement: Consultas cacheadas una hora
Las respuestas correctas del listado y del detalle por ID SHALL almacenarse en localStorage. Las entradas SHALL usar claves independientes y una caducidad absoluta de 3 600 000 ms desde su obtención. Leer una entrada no SHALL renovar su caducidad.

#### Scenario: Reutilización antes de caducar
- **WHEN** se repite una consulta con una entrada menor de una hora
- **THEN** se devuelve la entrada sin nueva petición HTTP.

#### Scenario: Independencia de productos
- **WHEN** se consulta el listado o dos detalles distintos
- **THEN** cada respuesta usa su propia entrada y caducidad sin sustituir otras claves.
