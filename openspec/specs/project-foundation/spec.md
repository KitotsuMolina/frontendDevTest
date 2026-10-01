# project-foundation Specification

## Purpose
Permitir que cualquier evaluador instale, ejecute y verifique la base de la prueba frontend de forma reproducible antes de implementar funcionalidades.

## Requirements

### Requirement: Scripts de proyecto
El proyecto SHALL ofrecer start para desarrollo, build para producción, test para pruebas sin modo interactivo y lint para comprobar código.

#### Scenario: Instalación y verificaciones
- **WHEN** se instala con pnpm install --frozen-lockfile y se ejecutan build, test y lint
- **THEN** los comandos terminan con código cero y build genera dist.

#### Scenario: Arranque de desarrollo
- **WHEN** se ejecuta pnpm start
- **THEN** el servidor entrega la SPA y la pantalla provisional puede montarse en el navegador.

### Requirement: Preparación documentada y limitada
El proyecto SHALL incluir README con requisitos, comandos, decisión de TypeScript y alcance; requisitos trazables al PDF y seis hitos pendientes en OpenSpec. La fase SHALL terminar con un único commit real y sin funcionalidades de listado, detalle ni cesta.

#### Scenario: Revisión de entrega
- **WHEN** se revisa la preparación
- **THEN** README y OpenSpec describen la fase, sus criterios y los hitos; el código muestra únicamente la pantalla provisional y el historial contiene el commit de preparación.
