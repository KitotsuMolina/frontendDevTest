# Prueba frontend Nunegal / ITX

SPA React con Vite y TypeScript. Preparación y navegación completadas. Las rutas `/` y `/product/:id` muestran vistas provisionales; catálogo, consultas API, caché, detalle funcional y acciones de cesta siguen pendientes.

## Requisitos

- Node.js 24 o superior; versión comprobada: 24.21.0. `.nvmrc` indica 24.
- pnpm 12.8.1, fijado en `packageManager`. Instalación: `npm install -g pnpm@12.8.1` si todavía no está disponible. npm solo se necesita para instalar pnpm; el proyecto se gestiona con pnpm.
- Navegador moderno y acceso al registro de paquetes durante la instalación.

## Ejecución

```bash
pnpm install --frozen-lockfile
pnpm start
```

Abrir la URL que imprime Vite (normalmente http://localhost:5173). No se necesitan variables de entorno ni backend local para esta fase.

| Comando | Finalidad |
| --- | --- |
| `pnpm start` | Servidor de desarrollo con recarga automática |
| `pnpm build` | Comprobación TypeScript y compilación estática en dist/ |
| `pnpm test` | Vitest sin modo interactivo, con jsdom y Testing Library |
| `pnpm test:watch` | Pruebas en modo observación |
| `pnpm lint` | ESLint para TypeScript y React, sin advertencias |
| `pnpm preview` | Servir localmente el resultado de build |
| `pnpm spec:validate` | Validar los artefactos OpenSpec en modo estricto |

`pnpm-lock.yaml` es el único archivo de bloqueo del proyecto. `pnpm-workspace.yaml` registra la política de scripts de dependencias. Las siete pruebas verifican rutas, enlaces de regreso, breadcrumbs, contador estático y navegación por teclado e historial.

## Decisiones técnicas

TypeScript estricto es una decisión solicitada para comprobar modelos, propiedades de componentes y códigos de opciones al compilar. El PDF permite JavaScript ES6; TypeScript añade comprobaciones estáticas sin alterar el requisito de SPA. Los datos remotos necesitarán comprobación de contrato durante su integración.

React y Vite permiten montaje y rutas en cliente, sin SSR. ESLint comprueba código y reglas de React; Vitest comparte la transformación de Vite y Testing Library verifica el DOM. pnpm se adopta por petición del usuario para instalación reproducible con versión y lockfile fijados. Las decisiones se amplían en `openspec/changes/00-project-setup/design.md`.

## Alcance del enunciado

Fuente: [PDF original](openspec/Prueba%20frontend%20ITX.pdf). Inventario trazable por página: [requisitos](openspec/requirements.md).

La aplicación final tendrá exactamente dos vistas: listado de todos los productos con filtro inmediato por marca/modelo y cuadrícula de máximo cuatro columnas; detalle con imagen, atributos, selectores de color y almacenamiento y botón Añadir. Compartirán cabecera con enlace principal, breadcrumbs y contador persistente.

API base: `https://itx-frontend-test.onrender.com/`.

| Método | Ruta | Contrato resumido |
| --- | --- | --- |
| GET | /api/product | Array de productos |
| GET | /api/product/:id | Detalle del producto |
| POST | /api/cart | Body: id, colorCode, storageCode; respuesta: count |

Las consultas GET tendrán caché cliente con expiración de una hora y revalidación al caducar. El contador tomará el count de API y persistirá entre recargas, independientemente de la caché. No se añade una vista de carrito.

## OpenSpec y desarrollo por hitos

OpenSpec 1.13.1 inicializado con el esquema `spec-driven` y habilidades locales de Codex. CLI fijada como dependencia de desarrollo: `pnpm exec openspec list`, `pnpm exec openspec status --change 01-navigation`.

[Plan de hitos](openspec/roadmap.md): preparación → navegación → listado → caché → detalle → cesta → acabado. Cada cambio contiene propuesta, diseño, escenarios de aceptación y tareas concretas; navegación está completada y los restantes hitos funcionales permanecen pendientes. `openspec/specs` se reserva para especificaciones entregadas y sincronizadas, sin atribuir comportamiento futuro al código actual.

La preparación se entrega en un único primer commit real. Navegación se entrega en un segundo commit real; el siguiente hito será listado, previa revisión con el usuario. La publicación en repositorio público forma parte de la entrega futura; todavía no se ha elegido destino ni publicado el proyecto.

## Criterios de aceptación de preparación

- Instalación reproducible con `pnpm install --frozen-lockfile`.
- `start` entrega la pantalla provisional y la prueba DOM confirma su montaje.
- `build`, `test`, `lint` y validación estricta OpenSpec terminan correctamente.
- README, requisitos del PDF, decisiones técnicas y seis cambios futuros están presentes.
- Sin llamadas API ni implementación funcional de listado, detalle o cesta.
- Primer commit de preparación, sin avances simulados; detenerse para revisar el siguiente hito.

Las evidencias de ejecución quedan en [verificación](openspec/changes/00-project-setup/verification.md).

## Documentación oficial consultada

- [Vite: guía y plantilla react-ts](https://vite.dev/guide/)
- [OpenSpec: instalación](https://openspec.dev/docs/installation) y [configuración de proyecto](https://openspec.dev/docs/setup)
- [pnpm: instalación](https://pnpm.io/installation)

## Navegación implementada

- `/`: listado provisional con enlace explícito de demostración a `/product/demo`.
- `/product/:id`: detalle provisional que identifica el parámetro de ruta y permite volver al listado.
- Cabecera compartida, título enlazado al inicio, breadcrumbs con `aria-current` y cesta estática en 0 en ambas vistas.
- Enlaces de React Router, salto al contenido, foco visible y traslado de foco al contenido al cambiar de ruta. Diseño adaptable con breadcrumbs en una segunda fila en móvil.
- Las URL no reconocidas redirigen al listado sin añadir otra vista. En producción el hosting deberá ofrecer fallback a `index.html`; el acceso directo se ha verificado con Vite en desarrollo.

Las consultas y el nombre real del producto en breadcrumbs, así como persistencia y actualización de cesta, se implementarán en sus hitos. No se realizan llamadas API.

[Verificación de navegación](openspec/changes/01-navigation/verification.md): siete pruebas, test/lint/build/validación correctos y comprobación en Chromium de acceso directo, historial, navegación sin recarga, teclado y tamaños 360/768/1440 px.

Enrutado declarativo conforme a la [documentación oficial de React Router](https://reactrouter.com/start/declarative/routing).
