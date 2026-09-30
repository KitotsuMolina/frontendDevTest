# Design

## Context
Base React/Vite/TypeScript con pnpm. Requiere completar 00-project-setup; fuente: R01, R08 de requirements.md.

## Goals / Non-Goals
**Goals:** cumplir los escenarios de navigation.
**Non-Goals:** adelantar otros hitos o ampliar las dos vistas del enunciado.

## Decisions
Usar React Router en cliente y componentes provisionales de vista, sin consultas de producto. Cabecera compartida; el contador funcional corresponde a cesta. El nombre del producto en breadcrumbs se completará con detalle.

## Risks / Trade-offs
Contrato remoto o integración con cambios anteriores → inspeccionar sus entregas antes de aplicar y verificar con mocks repetibles. Todas las tareas permanecen pendientes en preparación.
