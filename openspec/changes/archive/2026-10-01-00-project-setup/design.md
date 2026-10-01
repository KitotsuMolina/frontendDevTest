# Design

## Context
Proyecto vacío con OpenSpec 1.13.1 inicializado por el usuario. Fuente contractual: PDF de siete páginas, incluidas capturas de layouts y contratos API. Ver proposal.md para la motivación.

## Goals / Non-Goals
**Goals:** instalación reproducible, tipado estricto, herramientas ejecutables y planificación trazable.
**Non-Goals:** componentes de producto, rutas, consultas, almacenamiento o mutaciones en esta fase.

## Decisions
- React y Vite: plantilla oficial react-ts, compilación estática y montaje cliente. Alternativa SSR descartada por el enunciado.
- TypeScript estricto: decisión técnica del usuario; detecta incompatibilidades de modelos, props y códigos de opciones al compilar. JS ES6 está permitido por el PDF, pero ofrece menos comprobación estática. El tipado no valida JSON remoto: se comprobará el contrato en los hitos API.
- pnpm por petición del usuario: fijar packageManager, versionar pnpm-lock.yaml y verificar instalación congelada. Sustituye npm antes del primer commit.
- ESLint con TypeScript y reglas React; Vitest, jsdom y Testing Library para verificar montaje DOM. Se sustituye Oxlint de la plantilla por una única herramienta de lint.
- OpenSpec local con schema spec-driven; cambios futuros separados y pendientes, sin presentar requisitos futuros como funcionalidades implementadas.
- Caché futura propuesta: almacenamiento cliente con TTL absoluto de 3 600 000 ms para GET, claves por listado e id. Contador independiente y persistido desde count, sin cachear POST.

## Risks / Trade-offs
- API remota no verificada en preparación → comprobar contratos GET en listado/detalle; usar mocks para tests repetibles.
- El contador puede tener semántica remota propia → siempre tomar count de la respuesta, sin incremento local inventado.
- Dependencias evolucionan → versión de pnpm fijada y lockfile congelado.
- Hosting de rutas cliente → configurar fallback a index.html en la entrega futura.
