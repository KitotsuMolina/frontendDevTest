# Spec Delta

## Purpose
Definir el comportamiento observable del hito acabado para cumplir la prueba frontend Nunegal/ITX de forma verificable.

## ADDED Requirements

### Requirement: Estructura y accesibilidad
La interfaz SHALL respetar las estructuras del PDF, adaptarse a móvil y escritorio y ofrecer controles etiquetados, navegación por teclado y foco visible.

#### Scenario: Revisión adaptable
- **WHEN** se usa la aplicación a 360, 768 y 1440 px y por teclado
- **THEN** el contenido es legible, el listado no supera cuatro columnas y las acciones son operables.

### Requirement: Entrega verificable
La entrega SHALL mantener README actualizado, scripts funcionales y commits reales por hitos, y presentarse en un repositorio público.

#### Scenario: Evaluación reproducible
- **WHEN** se clona el repositorio público y se siguen las instrucciones
- **THEN** la instalación congelada, build, test y lint funcionan y el historial refleja trabajo real.
