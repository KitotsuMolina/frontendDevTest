# Design

## Context
Base React/Vite/TypeScript con pnpm. Requiere completar 04-product-detail; fuente: R08, R12 de requirements.md.

## Goals / Non-Goals
**Goals:** cumplir los escenarios de cart.
**Non-Goals:** adelantar otros hitos o ampliar las dos vistas del enunciado.

## Decisions
Estado compartido en provider React, localStorage para count. Solo actualizar tras éxito y validar count numérico no negativo. No crear vista de carrito. Mantener el contador en memoria si falla storage y probar esa degradación.

## Risks / Trade-offs
Contrato remoto o integración con cambios anteriores → inspeccionar sus entregas antes de aplicar y verificar con mocks repetibles. Todas las tareas permanecen pendientes en preparación.
