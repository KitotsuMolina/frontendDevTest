# Spec Delta

## Purpose
Definir el comportamiento observable del hito navegación para cumplir la prueba frontend Nunegal/ITX de forma verificable.

## ADDED Requirements

### Requirement: Dos vistas cliente
La aplicación SHALL disponer únicamente de listado y detalle con enrutado cliente, sin SSR ni recarga documental al navegar. Las rutas SHALL ser / y /product/:id con contenido claramente provisional, y el detalle SHALL ofrecer un enlace explícito al listado.

#### Scenario: Navegación entre vistas
- **WHEN** se abre / y luego /product/:id y se usa atrás/adelante
- **THEN** se muestran las vistas correspondientes dentro de la misma SPA.

### Requirement: Cabecera navegable
La cabecera SHALL contener únicamente título o icono enlazado al listado y contador de cesta inicialmente en 0 a la derecha, visible en ambas vistas. Los breadcrumbs navegables SHALL mostrarse debajo de la cabecera.

#### Scenario: Regreso al listado
- **WHEN** se activa el título o el breadcrumb de listado desde detalle
- **THEN** se vuelve a la ruta principal.

### Requirement: Navegación accesible y adaptable
La interfaz SHALL adaptarse a móvil y escritorio y ofrecer enlaces operables mediante teclado, foco visible y breadcrumbs con la vista actual identificada. El nombre real del producto se incorporará tras implementar su consulta.

#### Scenario: Teclado y cambio de vista
- **WHEN** se recorren y activan los enlaces mediante Tab y Enter
- **THEN** se navega a la ruta correspondiente, se identifica la vista actual y el foco permite continuar en el contenido.

#### Scenario: Acceso directo
- **WHEN** se abre directamente /product/demo en desarrollo
- **THEN** se monta el detalle provisional con cabecera y contador en 0.
