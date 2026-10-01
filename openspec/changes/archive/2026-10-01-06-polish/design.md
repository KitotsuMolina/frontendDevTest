# Design

## Context
SPA React/Vite/TypeScript con pnpm. Hitos 00–05 completos. Fuente: las siete páginas del PDF y requirements.md. El usuario autoriza acabado, pruebas, commits y cierre; conserva las dos vistas y el diseño, sin despliegue ni envío a Nunegal.

## Goals / Non-Goals
**Goals:** contraste trazable del PDF, revisión adaptable y accesible, E2E simuladas reproducibles sobre producción, documentación actual y cierre OpenSpec.
**Non-Goals:** nuevas vistas, checkout, despliegue o envío de entrega.

## Decisions
Playwright utiliza el build servido por preview y ocho escenarios en Chromium a 360/768/1440 px, con comprobación a 320 px. API e imágenes interceptadas; dos workers y sin reintentos automáticos. Vitest cubre contratos y almacenamiento con reloj controlado. Axe comprueba reglas WCAG A/AA en estados estables y se complementa con teclado y revisión visual.

La altura real de breadcrumbs reserva espacio en main. La navegación reinicia scroll y enfoca contenido sin desplazamiento automático. El h1 del catálogo permanece accesible sin título visible. Las dos vistas y el diseño actual se conservan.

GitHub ya fue elegido y autorizado: KitotsuMolina/frontendDevTest, verificado público. Se registran correcciones y pruebas en commits nuevos sin alterar los anteriores. El cierre sincroniza las especificaciones de los hitos completos antes de archivarlos. README distingue integración real de fixtures y documenta index.html como fallback obligatorio del alojamiento SPA.

## Risks / Trade-offs
El servicio remoto puede fallar; las pruebas no dependen de él. La operación POST real del hito de cesta se conserva como evidencia histórica sin repetir compras en esta revisión. Axe y Chromium no constituyen certificación completa de accesibilidad ni cobertura de Firefox/Safari. No se reintenta un POST pendiente tras una recarga documental.
