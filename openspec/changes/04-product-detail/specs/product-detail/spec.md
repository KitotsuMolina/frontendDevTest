# Spec Delta

## Purpose
Definir el comportamiento observable del hito detalle para cumplir la prueba frontend Nunegal/ITX de forma verificable.

## ADDED Requirements

### Requirement: Descripción completa
El detalle SHALL consumir GET /api/product/:id usando la caché y mostrar imagen a la izquierda y descripción/acciones a la derecha, con enlace de regreso. SHALL incluir marca, modelo, precio, CPU, RAM, SO, resolución, batería, cámaras, dimensiones y peso.

#### Scenario: Carga del detalle
- **WHEN** se abre un id válido
- **THEN** se muestra su información en la estructura de dos columnas y se puede volver al listado.

### Requirement: Opciones de producto
El detalle SHALL mostrar selectores de color y almacenamiento incluso con una sola opción, seleccionando por defecto dicha opción única y conservando los códigos de API.

#### Scenario: Opción única
- **WHEN** solo existe un color o almacenamiento
- **THEN** su selector sigue visible y la opción queda seleccionada.

### Requirement: Errores de detalle
El detalle SHALL representar carga, producto inexistente y errores recuperables sin romper la navegación.

#### Scenario: Id no encontrado
- **WHEN** el servicio devuelve que no existe el producto
- **THEN** se informa al usuario y el enlace al listado sigue disponible.
