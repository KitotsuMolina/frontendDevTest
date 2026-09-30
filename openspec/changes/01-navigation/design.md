# Design

## Context
Base React/Vite/TypeScript con pnpm. Requiere completar 00-project-setup; fuente: R01, R08 de requirements.md.

## Goals / Non-Goals
**Goals:** cumplir los escenarios de navigation.
**Non-Goals:** adelantar otros hitos o ampliar las dos vistas del enunciado.

## Decisions
Usar React Router en cliente y componentes provisionales de vista, sin consultas de producto. Cabecera compartida con contador estático en 0; su actualización y persistencia corresponden a cesta. El nombre del producto en breadcrumbs se completará con detalle.

Rutas: / y /product/:id. Enlace de demostración claramente provisional en el inicio. Enlaces nativos mediante Link, breadcrumb actual con aria-current, salto al contenido y foco en main al cambiar de ruta; título del documento según vista.

## Risks / Trade-offs
Contrato remoto o integración con cambios anteriores → inspeccionar sus entregas antes de aplicar y verificar con mocks repetibles. Comprobar montaje directo, historial y ausencia de recarga en navegador real.
