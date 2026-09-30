# Spec Delta

## Purpose
Definir el comportamiento observable del hito listado para cumplir la prueba frontend Nunegal/ITX de forma verificable.

## ADDED Requirements

### Requirement: Catálogo completo
El listado SHALL consumir GET /api/product y mostrar todos los resultados con imagen, marca, modelo y precio en una cuadrícula adaptable de máximo cuatro elementos por fila.

#### Scenario: Visualización del catálogo
- **WHEN** el servicio devuelve productos
- **THEN** se muestran todas las tarjetas, con sus atributos y como máximo cuatro columnas.

### Requirement: Búsqueda inmediata
El listado SHALL filtrar en cliente por marca o modelo cada vez que cambia el texto, sin distinguir mayúsculas; seleccionar una tarjeta SHALL abrir su detalle.

#### Scenario: Filtro y navegación
- **WHEN** se escribe parte de una marca o modelo y se activa un resultado
- **THEN** solo se muestran coincidencias y se navega a /product/:id.

### Requirement: Estados de consulta
El listado SHALL comunicar carga, error y ausencia de coincidencias sin mostrar datos inventados.

#### Scenario: Consulta fallida o vacía
- **WHEN** la consulta falla o el filtro no produce coincidencias
- **THEN** se muestra el estado correspondiente y se permite reintentar ante error.
