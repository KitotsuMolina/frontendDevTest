# delivery-quality Specification

## Purpose
Definir el comportamiento observable del hito acabado para cumplir la prueba frontend Nunegal/ITX de forma verificable.

## Requirements

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

### Requirement: Verificación de producción reproducible
La entrega SHALL incluir pruebas E2E sobre la compilación servida por preview, con API simulada y sin dependencia del servicio público. SHALL documentar el fallback index.html para rutas SPA y distinguir evidencia real de simulada.

#### Scenario: Recorrido completo y persistencia
- **WHEN** se abre listado, se busca, se navega a detalle, se seleccionan opciones y se añade un producto
- **THEN** se envía el cuerpo exacto, el contador toma count y permanece al navegar y recargar.

#### Scenario: Error y reintento manual
- **WHEN** falla el POST de cesta
- **THEN** se conserva el contador y un nuevo envío solo se inicia mediante acción explícita del usuario.

#### Scenario: Ruta directa de producción
- **WHEN** se abre y recarga directamente una URL válida de detalle en preview
- **THEN** se devuelve la SPA y se muestra el detalle integrado.
