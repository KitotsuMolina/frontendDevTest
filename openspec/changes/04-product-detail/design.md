# Design

## Context
Base React/Vite/TypeScript con pnpm. Requiere completar 03-query-cache; fuente: R07, R10, R11, R13 de requirements.md.

## Goals / Non-Goals
**Goals:** cumplir los escenarios de product-detail.
**Non-Goals:** adelantar otros hitos o ampliar las dos vistas del enunciado.

## Decisions
Componer imagen, descripción y selectores; reutilizar cliente GET/cache. No inventar precio cuando falte. El layout se apila en móvil conservando orden. El envío al carrito se implementa en el hito siguiente.

## Risks / Trade-offs
Contrato remoto o integración con cambios anteriores → inspeccionar sus entregas antes de aplicar y verificar con mocks repetibles. Todas las tareas permanecen pendientes en preparación.
