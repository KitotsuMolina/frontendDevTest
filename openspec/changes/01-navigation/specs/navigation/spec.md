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
La franja principal de la cabecera SHALL contener únicamente título o icono enlazado al listado y contador de cesta inicialmente en 0 a la derecha, visible en ambas vistas. Los breadcrumbs SHALL aparecer en una solapa izquierda persistente de la cabecera en ambas vistas; en detalle SHALL colocarse junto al botón Volver.

#### Scenario: Regreso al listado
- **WHEN** se activa el nombre de empresa o el enlace de regreso desde detalle
- **THEN** se vuelve a la ruta principal.

### Requirement: Navegación accesible y adaptable
La interfaz SHALL adaptarse a móvil y escritorio y ofrecer enlaces operables mediante teclado, foco visible y contenido de la vista identificado de forma accesible. El listado SHALL omitir su título visible, manteniendo una región accesible con nombre.

#### Scenario: Teclado y cambio de vista
- **WHEN** se recorren y activan los enlaces mediante Tab y Enter
- **THEN** se navega a la ruta correspondiente, se identifica la vista actual y el foco permite continuar en el contenido.

#### Scenario: Acceso directo
- **WHEN** se abre directamente /product/demo en desarrollo
- **THEN** se monta el detalle provisional con cabecera y contador en 0.

### Requirement: Solapa de regreso en detalle
La cabecera SHALL mostrar una solapa izquierda persistente con breadcrumbs. Únicamente en detalle SHALL añadir flecha y control accesible de regreso, desplazando los breadcrumbs a la derecha y ampliando suavemente la solapa.

#### Scenario: Regreso y acceso directo
- **WHEN** se activa la solapa en detalle
- **THEN** se retrocede en el historial interno de la SPA o se vuelve al listado si no hay una entrada interna anterior, manteniendo el enlace Listado de los breadcrumbs como regreso explícito; el contenido no duplica el botón de volver.

### Requirement: Breadcrumbs de página
Los breadcrumbs SHALL identificar la vista actual mediante aria-current y navegación etiquetada. El detalle SHALL enlazar al listado y mostrar provisionalmente «Detalle del producto» hasta incorporar la consulta de su nombre.

#### Scenario: Ruta actual y regreso
- **WHEN** se abre listado o detalle
- **THEN** se identifica la vista actual y, en detalle, el enlace Listado permite regresar mediante navegación cliente; los breadcrumbs quedan en la solapa persistente de la navbar junto al botón de volver cuando corresponde.

#### Scenario: Solapa persistente
- **WHEN** se navega de listado a detalle y se regresa
- **THEN** se conserva la solapa y los breadcrumbs, se anima su ampliación y desplazamiento al añadir Volver y su contracción al retirarlo; movimiento reducido elimina las transiciones.
