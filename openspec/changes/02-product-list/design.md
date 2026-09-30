# Design

## Context
Base React/Vite/TypeScript con pnpm. Requiere completar 01-navigation; fuente: R05, R06, R09, R13 de requirements.md.

## Goals / Non-Goals
**Goals:** cumplir los escenarios de product-list.
**Non-Goals:** adelantar otros hitos o ampliar las dos vistas del enunciado.

## Decisions
Usar fetch y una capa API tipada independiente de UI. No añadir paginación que oculte productos. Búsqueda cliente insensible a mayúsculas como decisión técnica; CSS Grid limita cuatro columnas.

## Risks / Trade-offs
Contrato remoto o integración con cambios anteriores → inspeccionar sus entregas antes de aplicar y verificar con mocks repetibles. Todas las tareas permanecen pendientes en preparación.
