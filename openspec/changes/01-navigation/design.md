# Design

## Context
Base React/Vite/TypeScript con pnpm. Requiere completar 00-project-setup; fuente: R01, R08 de requirements.md.

## Goals / Non-Goals
**Goals:** cumplir los escenarios de navigation.
**Non-Goals:** adelantar otros hitos o ampliar las dos vistas del enunciado.

## Decisions
Usar React Router en cliente y componentes provisionales de vista, sin consultas de producto. Cabecera compartida solo con nombre enlazado al inicio y contador estático en 0; breadcrumbs en un componente independiente debajo de la cabecera, según ajuste visual solicitado por el usuario; su actualización y persistencia corresponden a cesta. El nombre del producto en breadcrumbs se completará con detalle.

Rutas: / y /product/:id. Enlace de demostración claramente provisional en el inicio. Enlaces nativos mediante Link, breadcrumb actual con aria-current, salto al contenido y foco en main al cambiar de ruta; título del documento según vista.

## Risks / Trade-offs
Contrato remoto o integración con cambios anteriores → inspeccionar sus entregas antes de aplicar y verificar con mocks repetibles. Comprobar montaje directo, historial y ausencia de recarga en navegador real.

## Ajuste visual posterior solicitado

Breadcrumbs fuera de la barra superior. Easter egg autorizado: esquina izquierda con imagen Kitotsu fija debajo, superficie de papel recortada progresivamente y pliegue con gradiente y sombra. Hover/foco revela; pulsación alterna apertura; prefers-reduced-motion elimina transiciones. No incorpora consultas ni acciones de cesta.

## Ajuste posterior: simplificar el contenido

Por instrucción explícita del usuario se eliminan los breadcrumbs en ambas vistas y el título visible del listado, aunque el PDF original propusiera breadcrumbs. El listado mantiene una región accesible con nombre, el buscador alineado a la derecha y los enlaces de empresa y regreso al listado. No incorporar breadcrumbs ni nombres de producto en ellos en hitos posteriores sin una nueva instrucción.

## Recuperación de breadcrumbs solicitada

Breadcrumbs vuelve al contenido de ambas páginas. En detalle comparte una fila adaptable con el enlace explícito de regreso; el listado identifica su vista actual antes del buscador. La cabecera conserva empresa, cesta y solapa. El nombre del producto queda pendiente de la consulta de detalle.

## Solapa persistente solicitada

Breadcrumbs se traslada a Header. La solapa conserva su DOM entre rutas, anima su ancho de 160 a 440 px y reserva de 0 a 112 px para el control Volver, desplazando el breadcrumb. En móvil queda limitada al ancho disponible y el buscador acoplado se coloca debajo para evitar colisiones. Movimiento reducido elimina las transiciones.
