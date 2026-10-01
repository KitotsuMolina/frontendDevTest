# Spec Delta

## MODIFIED Requirements

### Requirement: Dos vistas cliente
La aplicación SHALL disponer únicamente de listado y detalle con enrutado cliente, sin SSR ni recarga documental al navegar. Las rutas SHALL ser / y /product/:id con catálogo y detalle integrados, sin contenido provisional, y el detalle SHALL ofrecer un enlace explícito al listado.

#### Scenario: Navegación entre vistas
- **WHEN** se abre / y luego /product/:id y se usa atrás/adelante
- **THEN** se muestran las vistas correspondientes dentro de la misma SPA.

### Requirement: Navegación accesible y adaptable
La interfaz SHALL adaptarse a móvil y escritorio y ofrecer enlaces operables mediante teclado, foco visible y contenido de la vista identificado de forma accesible. El listado SHALL omitir su título visible, manteniendo una región accesible con nombre y un encabezado accesible. La cabecera y solapas SHALL reservar espacio para no cubrir el inicio del contenido.

#### Scenario: Teclado y cambio de vista
- **WHEN** se recorren y activan los enlaces mediante Tab y Enter
- **THEN** se navega a la ruta correspondiente, se identifica la vista actual y el foco permite continuar en el contenido, sin desplazarlo bajo la cabecera fija.

#### Scenario: Acceso directo
- **WHEN** se abre directamente una URL /product/:id válida en desarrollo o preview y se recarga
- **THEN** se monta el detalle integrado con cabecera y contador recuperado; el alojamiento SPA debe servir index.html como fallback.

#### Scenario: Breadcrumb largo
- **WHEN** el nombre de un producto necesita varias líneas en una pantalla de 320 px
- **THEN** la altura real de la solapa reserva espacio suficiente y no hay desbordamiento horizontal.

### Requirement: Breadcrumbs de página
Los breadcrumbs SHALL identificar la vista actual mediante aria-current y navegación etiquetada. El detalle SHALL enlazar al listado y mostrar marca y modelo tras cargar; mientras se consulta SHALL identificar la vista como «Detalle del producto».

#### Scenario: Ruta actual y regreso
- **WHEN** se abre listado o detalle
- **THEN** se identifica la vista actual y, en detalle, el enlace Listado permite regresar mediante navegación cliente; los breadcrumbs quedan en la solapa persistente de la navbar junto al botón de volver cuando corresponde.

#### Scenario: Solapa persistente
- **WHEN** se navega de listado a detalle y se regresa
- **THEN** se conserva la solapa y los breadcrumbs, se anima su ampliación y desplazamiento al añadir Volver y su contracción al retirarlo; movimiento reducido elimina las transiciones.
