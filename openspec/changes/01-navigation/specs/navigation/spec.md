# Spec Delta

## Purpose
Definir el comportamiento observable del hito navegación para cumplir la prueba frontend Nunegal/ITX de forma verificable.

## ADDED Requirements

### Requirement: Dos vistas cliente
La aplicación SHALL disponer únicamente de listado y detalle con enrutado cliente, sin SSR ni recarga documental al navegar.

#### Scenario: Navegación entre vistas
- **WHEN** se abre / y luego /products/:id y se usa atrás/adelante
- **THEN** se muestran las vistas correspondientes dentro de la misma SPA.

### Requirement: Cabecera navegable
La cabecera SHALL contener título o icono enlazado al listado, breadcrumbs navegables y espacio del contador a la derecha.

#### Scenario: Regreso al listado
- **WHEN** se activa el título o el breadcrumb de listado desde detalle
- **THEN** se vuelve a la ruta principal.
