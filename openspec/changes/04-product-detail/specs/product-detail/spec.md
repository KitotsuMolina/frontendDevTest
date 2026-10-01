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

### Requirement: Selección explícita y cambio de producto
Los selectores SHALL usar exclusivamente options.colors/options.storages y sus códigos numéricos reales. Con varias opciones SHALL exigir selección explícita y con ninguna SHALL indicar No disponible. Al cambiar de producto SHALL reiniciarse las selecciones.

#### Scenario: Opciones múltiples
- **WHEN** existen varios colores o almacenamientos
- **THEN** el selector inicia sin opción elegida y permite seleccionar cada código recibido sin enviar POST.

#### Scenario: Cambio de ID
- **WHEN** se navega a otro producto o se regresa a uno anterior
- **THEN** se restablecen opciones únicas y se vacían selecciones múltiples, mostrando el breadcrumb con la nueva marca/modelo.

### Requirement: Valores ausentes y carga accesible
El detalle SHALL mostrar Precio no disponible para precio vacío y No disponible para características ausentes/vacías o marcador '-'. SHALL ofrecer imagen alternativa ante fallo, esqueletos de carga, 404 diferenciado y error recuperable con reintento.

#### Scenario: Fallo recuperable
- **WHEN** falla la red, HTTP distinto de 404 o el contrato
- **THEN** se muestra error con Reintentar, sin ofrecer datos caducados, y se conserva regreso al listado.

### Requirement: Caché y cesta pendiente
GET de detalle SHALL usar la caché existente por ID con caducidad absoluta de una hora. Añadir SHALL permanecer deshabilitado con nota pendiente de integración; no SHALL enviarse POST.

#### Scenario: Reutilización de detalle
- **WHEN** se regresa o recarga un detalle con entrada válida
- **THEN** se reutiliza sin nueva consulta y sin renovar la caducidad; al alcanzar una hora se consulta nuevamente.
