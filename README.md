# Prueba frontend Nunegal / ITX

SPA React con Vite y TypeScript. Preparación, navegación y listado completados. `/` consulta el catálogo real y permite búsqueda local; `/product/:id` sigue mostrando detalle provisional. Caché, consulta de detalle y acciones de cesta siguen pendientes.

## Requisitos

- Node.js 24 o superior; versión comprobada: 24.21.0. `.nvmrc` indica 24.
- pnpm 12.8.1, fijado en `packageManager`. Instalación: `npm install -g pnpm@12.8.1` si todavía no está disponible. npm solo se necesita para instalar pnpm; el proyecto se gestiona con pnpm.
- Navegador moderno y acceso al registro de paquetes durante la instalación.
- Acceso a https://itx-frontend-test.onrender.com para el listado y sus imágenes durante la ejecución real; las pruebas automatizadas usan respuestas simuladas.

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

`pnpm-lock.yaml` es el único archivo de bloqueo del proyecto. `pnpm-workspace.yaml` registra la política de scripts de dependencias. Las 25 pruebas verifican cliente HTTP, contrato, listado, búsqueda, precios vacíos, estados, imágenes fallidas y navegación. `fetch` se sustituye por respuestas simuladas; ninguna prueba depende de la API pública.

## Decisiones técnicas

TypeScript estricto es una decisión solicitada para comprobar modelos, propiedades de componentes y códigos de opciones al compilar. El PDF permite JavaScript ES6; TypeScript añade comprobaciones estáticas sin alterar el requisito de SPA. La capa de listado valida en ejecución que el JSON sea un array con los cinco campos de texto antes de presentarlo.

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

[Plan de hitos](openspec/roadmap.md): preparación → navegación → listado → caché → detalle → cesta → acabado. Cada cambio contiene propuesta, diseño, escenarios de aceptación y tareas concretas; navegación y listado están completados y los restantes hitos funcionales permanecen pendientes. `openspec/specs` se reserva para especificaciones entregadas y sincronizadas, sin atribuir comportamiento futuro al código actual.

La preparación se entrega en un único primer commit real. Navegación se entrega en un segundo commit real; los ajustes posteriores de navbar y easter egg se registran en un commit propio y listado en otro. El siguiente hito es caché, previa revisión con el usuario. La publicación en repositorio público forma parte de la entrega futura; todavía no se ha elegido destino ni publicado el proyecto.

## Criterios de aceptación de preparación (hito completado)

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

- `/`: listado real; cada tarjeta enlaza a `/product/:id`.
- `/product/:id`: detalle provisional que identifica el parámetro de ruta y permite volver al listado.
- Cabecera compartida con título enlazado al inicio y cesta estática en 0 en ambas vistas. Breadcrumbs con `aria-current` debajo de la cabecera.
- Enlaces de React Router, salto al contenido, foco visible y traslado de foco al contenido al cambiar de ruta. Diseño adaptable con breadcrumbs fuera de la barra superior.
- Las URL no reconocidas redirigen al listado sin añadir otra vista. En producción el hosting deberá ofrecer fallback a `index.html`; el acceso directo se ha verificado con Vite en desarrollo.

La consulta de detalle y el nombre real del producto en breadcrumbs, así como persistencia y actualización de cesta, se implementarán en sus hitos. Solo se consume GET del listado.

[Verificación de navegación](openspec/changes/01-navigation/verification.md): siete pruebas, test/lint/build/validación correctos y comprobación en Chromium de acceso directo, historial, navegación sin recarga, teclado y tamaños 360/768/1440 px.

Enrutado declarativo conforme a la [documentación oficial de React Router](https://reactrouter.com/start/declarative/routing).

## Easter egg de la cabecera

Al pasar el cursor por el extremo izquierdo, la esquina de la cabecera se despega con un pliegue y sombra y descubre parte del logo Kitotsu situado debajo. Al salir vuelve a pegarse. También se revela al enfocar el control con teclado; una pulsación permite mantenerlo abierto o cerrarlo. Con movimiento reducido se elimina la transición. La imagen original suministrada está en `src/assets/kitotsu-logo-background.png`.

## Listado implementado

`GET https://itx-frontend-test.onrender.com/api/product` devuelve un array con `id`, `brand`, `model`, `price` e `imgUrl` como texto. Se muestran todos los productos sin paginación, con marca, modelo, imagen y precio. Si `price` está vacío o solo tiene espacios se muestra **Precio no disponible**; el producto permanece en el catálogo. No se convierte el precio a número ni se añade moneda porque el contrato no la especifica.

La búsqueda filtra inmediatamente por marca **o** modelo, ignorando mayúsculas y espacios exteriores. Escribir, borrar o limpiar el campo no genera consultas. La cuadrícula usa una columna en móvil, dos desde 600 px, tres desde 900 px y cuatro desde 1200 px; nunca más de cuatro. Todas las tarjetas enlazan a `/product/:id` y tienen texto alternativo de imagen y una alternativa visual si falla la carga.

Hay estados de carga, fallo recuperable con Reintentar, catálogo vacío y búsqueda sin coincidencias. El contador sigue estático en 0 y el detalle sigue provisional.

- `src/api/products.ts`: tipos, petición HTTP y validación del contrato, sin almacenamiento.
- `src/hooks/useProducts.ts`: carga, error, reintento y cancelación al desmontar; no depende de la búsqueda.
- `src/pages/ProductListPage.tsx`: filtro local y estados de presentación.
- `src/components/ProductCard.tsx`: datos, imagen y enlace de cada producto.

Todavía no hay caché: volver al listado realiza una nueva consulta. En desarrollo, React StrictMode inicia y cancela una primera solicitud al comprobar el montaje; Chromium registra dos intentos GET iniciales, y **cero adicionales al buscar**. No se ha añadido deduplicación ni caché para ocultar este comportamiento.

[Verificación del listado](openspec/changes/02-product-list/verification.md): 25 pruebas simuladas, integración real de 100 productos (6 precios vacíos) y revisión visual a 360, 768, 1440 y 1920 px.
