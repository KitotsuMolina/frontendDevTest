# Spec Delta

## Purpose
Definir el comportamiento observable del hito cesta para cumplir la prueba frontend Nunegal/ITX de forma verificable.

## ADDED Requirements

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
