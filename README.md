# Prueba frontend Nunegal / ITX

SPA con React, Vite y TypeScript: exactamente dos vistas, listado (`/`) y detalle (`/product/:id`). Consume las APIs del enunciado, permite búsqueda local y selección de opciones, conserva las consultas durante una hora y persiste el contador de cesta. Todos los hitos están implementados.

Repositorio: [KitotsuMolina/frontendDevTest](https://github.com/KitotsuMolina/frontendDevTest). Fuente: [PDF original](openspec/Prueba%20frontend%20ITX.pdf). [Revisión final y tabla de requisitos](docs/final-review.md).

## Instalación reproducible

- Node.js **24 o superior**; comprobado con **24.21.0**. `.nvmrc` fija la familia 24.
- **pnpm 12.8.1**, fijado en `packageManager` y `engines`. Si falta: `npm install -g pnpm@12.8.1`.
- Navegador moderno. La instalación necesita acceso al registro de paquetes; la ejecución real necesita acceso al origen de la API y sus imágenes.
- Dependencias exactas en `pnpm-lock.yaml`: React 19, React Router 8, Vite 8, TypeScript 6, Vitest 5 y OpenSpec 1.13.1.

```bash
git clone https://github.com/KitotsuMolina/frontendDevTest.git
cd frontendDevTest
pnpm install --frozen-lockfile
pnpm start
```

Abrir la URL que imprime Vite, normalmente `http://localhost:5173`. No se necesita backend local ni variables de entorno; Vite ya incorpora el proxy de cesta. pnpm es el gestor del proyecto; `pnpm-workspace.yaml` registra la política de scripts de dependencias.

## Scripts y producción local

| Comando | Resultado |
| --- | --- |
| `pnpm start` | Desarrollo con Vite y recarga automática |
| `pnpm build` | TypeScript estricto, incluidas las E2E, y compilación en `dist/` |
| `pnpm test` | Pruebas Vitest, jsdom y Testing Library, sin modo interactivo |
| `pnpm test:watch` | Vitest en observación |
| `pnpm test:e2e` | Compila y ejecuta Playwright en Chromium contra `preview` con API simulada |
| `pnpm test:e2e:ui` | Compila y abre la interfaz de Playwright |
| `pnpm lint` | ESLint TypeScript/React, sin advertencias |
| `pnpm preview` | Sirve la compilación localmente |
| `pnpm spec:validate` | Validación estricta OpenSpec, cambios y especificaciones |

```bash
pnpm build
pnpm preview --host 127.0.0.1 --port 4173
```

**Requisito de alojamiento:** servir `dist/` y devolver `index.html` para rutas SPA que no correspondan a archivos, por ejemplo `/product/ZmGrkLRPXOTpxsU4jjAcv`. React Router resuelve la vista en cliente. El acceso directo y la recarga del detalle están comprobados con `preview`; esto no configura el fallback de un proveedor externo. Además, el alojamiento debe reenviar `/api/cart` mediante un proxy del mismo origen; `dist/` por sí solo no implementa esa ruta. `preview` permite comprobar el build, no es el servidor de alojamiento definitivo. No se ha desplegado la aplicación.

## API y contratos

Origen fijado por el enunciado: `https://itx-frontend-test.onrender.com`. `src/api/products.ts` define `PRODUCTS_URL`; el detalle deriva su ruta de esa constante. `src/api/cart.ts` usa `/api/cart` del mismo origen. El proxy de `vite.config.ts` reenvía únicamente la cesta al servicio HTTPS del enunciado y conserva session_id por navegador. `CART_PROXY_TARGET` permite cambiar ese destino en el proceso servidor (las pruebas lo usan para un upstream local); no es una variable del cliente. Para cambiar las consultas GET se ajusta PRODUCTS_URL. No existen variables `VITE_*` configuradas.

[Diagnóstico, implementación y configuración equivalente de producción](docs/cart-session-proxy.md). La aplicación no usa credentials: include contra la API externa ni suma count localmente para compensar una sesión perdida.

| Método | Ruta | Contrato validado |
| --- | --- | --- |
| GET | `/api/product` | Array con `id`, `brand`, `model`, `price`, `imgUrl` de texto |
| GET | `/api/product/:id` | Producto y `options.colors` / `options.storages` |
| POST | `/api/cart` | JSON con exactamente `id`, `colorCode`, `storageCode`; respuesta `{count}` |

`options.colors` y `options.storages` son arrays de `{code: number, name: string}`. Los códigos enviados son los números recibidos del producto actual, sin deducir equivalencias entre productos. Una opción única permanece visible y seleccionada; varias requieren selección explícita. Cambiar de producto reinicia selecciones. Añadir se habilita solo cuando ambas son válidas.

El detalle conserva los nombres reales `dimentions` y `secondaryCmera`. `displaySize` contiene píxeles; `displayResolution`, pulgadas. Algunas características alternan texto y array. Se valida el JSON en ejecución, además del tipado estático. Características vacías o `-` muestran «No disponible»; precios vacíos, «Precio no disponible». Por decisión visual solicitada, los precios disponibles muestran el prefijo `$`; la API no informa de una moneda y no se realiza conversión. No se inventa unidad de peso.

## Caché y contador

Las consultas GET válidas se guardan en `localStorage` con `obtainedAt`, `expiresAt` y `data`. El TTL es exactamente **3 600 000 ms desde la obtención**. Leer no prolonga la caducidad; al alcanzarla o superarla se consulta de nuevo. Solo respuestas válidas reemplazan entradas, incluido un listado vacío. No se muestran datos caducados silenciosamente ni se almacenan errores. Consultas simultáneas de la misma clave comparten transporte y un fallo permite reintentar.

- Listado: `nunegal:query:v1:products`.
- Detalle: `nunegal:query:v1:product:<id codificado>`; independiente por producto.
- Contador: `nunegal:cart:v1:count`; independiente de la caché, sin TTL.

La respuesta de cesta exige un `count` entero no negativo y **reemplaza** el contador con ese valor exacto, incluso si es cero o menor que el anterior. No se suma manualmente. El contador y el estado de envío viven en `App`, por lo que navegar durante una petición conserva su actualización. Hay bloqueo de envíos duplicados, «Añadiendo…», confirmación accesible y error con reintento manual. El POST no se cachea ni se reintenta automáticamente.

Al recargar se recupera el contador válido; datos corruptos o inválidos producen 0. Si el almacenamiento falla, las consultas funcionan normalmente y el contador sigue funcionando en memoria. La cookie session_id identifica la cesta remota: borrarla o iniciar una sesión nueva puede hacer que el siguiente count vuelva a 1. Recargar completamente durante un POST no puede garantizar su resultado: no se repite automáticamente la operación.

## Problema de sesión de cesta y solución aplicada

Se detectó que, al añadir productos distintos mediante peticiones directas desde el navegador a la API externa, cada respuesta podía devolver `{count:1}`. **No era un problema de HTTP frente a HTTPS:** la API ya recibía las peticiones por HTTPS y respondía HTTP 200. Tampoco se debe reutilizar el mismo `storageCode` para compartir cesta: ese código identifica una opción del producto, mientras que la cookie `session_id` identifica la sesión de cesta.

En la comprobación con Chromium, las peticiones directas no conservaron esa cookie. Intentar `credentials: 'include'` produjo un bloqueo CORS porque la API respondía con `Access-Control-Allow-Origin: *`, incompatible con peticiones con credenciales. Con curl y una cookie conservada, el servidor sí devolvió contadores 1 y 2. El síntoma fue comunicado también en Brave y Zen; estos dos navegadores no se automatizaron directamente.

La solución aplicada cambia únicamente el envío de cesta:

1. El navegador envía `POST /api/cart` al mismo origen que sirve la SPA.
2. `server.proxy` y `preview.proxy` de Vite reenvían la petición a `https://itx-frontend-test.onrender.com/api/cart`, manteniendo HTTPS hacia la API.
3. El proxy devuelve la cookie de sesión asociada al origen de la aplicación, conserva `HttpOnly`, limita su ruta a `/api/cart` y reenvía únicamente la cookie `session_id` de cada navegador. No hay una sesión global compartida entre usuarios.
4. El cuerpo conserva exactamente `id`, `colorCode` y `storageCode`. El contador usa el `count` exacto del servidor; el POST no se cachea ni se reintenta automáticamente.

**Resultado real verificado:** en Chromium, Iconia Talk S con almacenamiento 2001 devolvió `{count:1}` y Liquid Z6 Plus con almacenamiento 2000 devolvió `{count:2}` en la misma sesión. El contador permaneció en 2 al navegar y recargar. Las pruebas simuladas verifican además una sesión independiente y la continuidad de la sesión al recargar.

Para desarrollo y preview basta ejecutar los comandos habituales; no hace falta configurar variables adicionales. **En producción, publicar `dist/` no basta:** el alojamiento debe implementar el proxy de `/api/cart` en el mismo origen, antes del fallback de las rutas SPA, y servir la aplicación por HTTPS. La configuración equivalente y sus límites están documentados en [sesión de cesta mediante proxy](docs/cart-session-proxy.md). No se ha realizado ningún despliegue.

## Diseño, accesibilidad y decisiones

El listado muestra todos los productos y filtra inmediatamente por marca **o** modelo, ignorando mayúsculas y espacios exteriores, sin nuevas consultas al escribir. Usa una columna en móvil, dos desde 600 px, tres desde 900 px y cuatro desde 1200 px. El detalle utiliza dos columnas desde 900 px, imagen a la izquierda y descripción/acciones a la derecha; una columna por debajo.

Se conservan la navbar fija, las solapas de breadcrumbs/regreso y buscador, el easter egg, scrollbar y animaciones de tarjetas. La altura real de los breadcrumbs reserva espacio para nombres largos. Saltar al contenido, encabezados accesibles, etiquetas, texto alternativo, alternativas para imágenes fallidas, foco visible y anuncios de carga/éxito/error acompañan el diseño. Al cambiar de ruta se muestra el inicio y se enfoca el contenido sin ocultarlo bajo la cabecera. Movimiento reducido elimina las animaciones de interfaz.

TypeScript estricto es una decisión técnica solicitada: detecta errores en modelos, propiedades y códigos, complementado por validación de JSON remoto. React Router mantiene navegación cliente sin SSR. La capa HTTP está separada de los componentes y de `queryCache`; los hooks gestionan estados, cancelación de GET y cesta compartida. Vitest cubre contratos y comportamientos; Playwright verifica el navegador y el build real; axe comprueba reglas automatizables de accesibilidad.

Los selectores conservan su comportamiento nativo. El menú utiliza `appearance: base-select` cuando el navegador lo admite y presentación nativa en otros navegadores. [Atribuciones de terceros](THIRD_PARTY_NOTICES.md).

## Pruebas y evidencias

```bash
pnpm exec playwright install chromium
pnpm test
pnpm lint
pnpm test:e2e
pnpm spec:validate
```

En Linux puede ser necesario instalar las dependencias del navegador indicadas por Playwright; en un entorno compatible se puede usar `pnpm exec playwright install --with-deps chromium`. Las E2E levantan y cierran su propio preview en `127.0.0.1:4173` y un upstream de cesta simulado en `127.0.0.1:4181`; ambos puertos deben estar libres. `pnpm test:e2e` ya ejecuta build. Usa dos workers y no reintenta pruebas automáticamente.

**Pruebas simuladas:** 98 pruebas unitarias/de integración y 27 ejecuciones E2E (nueve escenarios en 360, 768 y 1440 px, con una comprobación adicional a 320 px). Todas sustituyen la API pública; las E2E interceptan también sus imágenes y la prueba de sesión atraviesa el proxy de preview hasta un servidor HTTP local simulado. Cubren búsqueda, rutas e historial sin recarga, selección, POST exacto, contador, recarga, expiración con reloj controlado, error/reintento manual, navegación pendiente, teclado, contraste y movimiento reducido. Vitest cubre además almacenamiento bloqueado/corrupto, respuestas inválidas, deduplicación, opciones y alternativas de imagen.

Playwright genera `playwright-report/` y `test-results/` (ignorados en Git), con capturas de listado, detalle, menú y breadcrumbs largos; las trazas se conservan al fallar. Abrir el informe: `pnpm exec playwright show-report`.

[Diagramas de los nueve escenarios E2E](docs/e2e-diagrams.md): recorridos, comprobaciones y flujo de sesión mediante proxy, con imágenes SVG/PNG, fuentes PlantUML editables y distinción entre respuestas simuladas y resultados reales. La documentación incluye el comando para regenerar las imágenes localmente.

**Integración real:** revisión final del 01/10/2026 en Chromium sobre preview: GET listado y detalle HTTP 200, 100 productos, búsqueda y regreso/recarga sin consultas GET adicionales con caché válida; cero POST nuevos. En el hito de cesta se observó un POST real HTTP 200 con `{count:1}` para Iconia Talk S, Black/1000 y 16 GB/2000. Es una observación concreta, no una garantía de acumulación remota. El `count:3`/`count:7` de las E2E es simulado.

**Corrección posterior de sesión:** tras incorporar el proxy, dos POST reales en Chromium devolvieron `{count:1}` y `{count:2}` con la misma cookie. Se comprobó contador 2 tras navegación y recarga, usando storageCode 2001 y 2000 de productos diferentes. Evidencias y límites en [sesión de cesta](docs/cart-session-proxy.md).

Axe no detectó infracciones en las comprobaciones WCAG A/AA incluidas. Esto se complementa con teclado y revisión visual; no constituye certificación integral ni prueba con lectores de pantalla reales. Navegadores Firefox/Safari no forman parte de la matriz E2E actual. La API pública puede fallar o cambiar; hay estados y reintentos manuales. No se incorporan checkout ni una tercera vista.

## OpenSpec e historial

[Hitos](openspec/roadmap.md): preparación → navegación → listado → caché → detalle → cesta → acabado. Los siete cambios están completos y archivados en `openspec/changes/archive/`; los requisitos entregados están sincronizados en `openspec/specs/`. Propuestas, decisiones, tareas y evidencias se conservan en cada archivo histórico. La corrección posterior `07-cart-session-proxy` está registrada como un cambio independiente en `openspec/changes/`, con tareas y verificación. `pnpm exec openspec list --json` muestra su estado.

Los commits de cada hito y los ajustes visuales son reales; se añaden commits de revisión sin reescribir ni reconstruir retrospectivamente el historial. Esta fase no despliega ni envía la entrega a Nunegal.

Referencias oficiales: [Vite](https://vite.dev/guide/), [React Router](https://reactrouter.com/start/declarative/routing), [OpenSpec](https://openspec.dev/docs/), [pnpm](https://pnpm.io/installation), [Playwright y accesibilidad](https://playwright.dev/docs/accessibility-testing).
