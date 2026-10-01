# Spec Delta

## REMOVED Requirements

### Requirement: Caché y cesta pendiente
**Reason**: El hito de cesta ya está integrado; el botón no debe quedar deshabilitado ni presentarse como provisional.
**Migration**: Usar «Caché de detalle y cesta integrada», conservando los escenarios de reutilización y caducidad.

## ADDED Requirements

### Requirement: Caché de detalle y cesta integrada
GET de detalle SHALL usar la caché existente por ID con caducidad absoluta de una hora. Añadir SHALL habilitarse con opciones válidas e integrar el POST definido por la capacidad cart, sin notas provisionales.

#### Scenario: Reutilización de detalle
- **WHEN** se regresa o recarga un detalle con entrada válida
- **THEN** se reutiliza sin nueva consulta y sin renovar la caducidad; al alcanzar una hora se consulta nuevamente.

#### Scenario: Añadir desde detalle
- **WHEN** ambas opciones son válidas y no hay una petición de cesta pendiente
- **THEN** se puede activar Añadir para enviar la selección y recibir confirmación o error accesible.
