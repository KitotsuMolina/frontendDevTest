# Design

## Context
Base React/Vite/TypeScript con pnpm. Requiere completar 02-product-list; fuente: R14 de requirements.md.

## Goals / Non-Goals
**Goals:** cumplir los escenarios de query-cache.
**Non-Goals:** adelantar otros hitos o ampliar las dos vistas del enunciado.

## Decisions
Propuesta: Map en memoria para GET, permitido por el PDF; el TTL no se renueva por lectura. Separar función de consulta de su almacenamiento y controlar el reloj en pruebas. Persistencia del contador pertenece a cesta y no caduca con esta caché.

## Risks / Trade-offs
Contrato remoto o integración con cambios anteriores → inspeccionar sus entregas antes de aplicar y verificar con mocks repetibles. Todas las tareas permanecen pendientes en preparación.
