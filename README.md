# Prueba frontend Nunegal / ITX

SPA React con Vite y TypeScript. Preparación, navegación, listado, caché, detalle y cesta completados. `/` consulta el catálogo real y permite búsqueda local; `/product/:id` consulta el detalle real y muestra sus opciones. Añadir integra el POST y el contador persistente.

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

`pnpm-lock.yaml` es el único archivo de bloqueo del proyecto. `pnpm-workspace.yaml` registra la política de scripts de dependencias. Las 98 pruebas verifican cliente HTTP, contrato, listado, búsqueda, precios vacíos, estados, imágenes fallidas y navegación. `fetch` se sustituye por respuestas simuladas; ninguna prueba depende de la API pública.

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

[Plan de hitos](openspec/roadmap.md): preparación → navegación → listado → caché → detalle → cesta → acabado. Cada cambio contiene propuesta, diseño, escenarios de aceptación y tareas concretas; navegación, listado, caché, detalle y cesta están completados y los restantes hitos funcionales permanecen pendientes. `openspec/specs` se reserva para especificaciones entregadas y sincronizadas, sin atribuir comportamiento futuro al código actual.

La preparación se entrega en un único primer commit real. Navegación se entrega en un segundo commit real; los ajustes posteriores de navbar y easter egg se registran en un commit propio y listado en otro. El siguiente hito es acabado y revisión final, previa revisión con el usuario. La publicación en repositorio público forma parte de la entrega futura; todavía no se ha elegido destino ni publicado el proyecto.

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
- `/product/:id`: detalle real con características y selectores; permite volver al listado.
- Cabecera compartida con título enlazado al inicio y contador de cesta persistente en ambas vistas. Los breadcrumbs se muestran en una solapa persistente bajo la navbar; en detalle aparece Volver y la solapa se amplía suavemente.
- Enlaces de React Router, salto al contenido, foco visible y traslado de foco al contenido al cambiar de ruta. Diseño adaptable; el título visible del listado también se ha retirado, conservando su identificación accesible.
- Las URL no reconocidas redirigen al listado sin añadir otra vista. En producción el hosting deberá ofrecer fallback a `index.html`; el acceso directo se ha verificado con Vite en desarrollo.

Se consumen GET de listado y detalle. Cesta se integra mediante POST con actualización exacta de count.

[Verificación de navegación](openspec/changes/01-navigation/verification.md): siete pruebas, test/lint/build/validación correctos y comprobación en Chromium de acceso directo, historial, navegación sin recarga, teclado y tamaños 360/768/1440 px.

Enrutado declarativo conforme a la [documentación oficial de React Router](https://reactrouter.com/start/declarative/routing).

## Easter egg de la cabecera

Al pasar el cursor por el extremo izquierdo, la esquina de la cabecera se despega con un pliegue y sombra y descubre parte del logo Kitotsu situado debajo. Al salir vuelve a pegarse. También se revela al enfocar el control con teclado; una pulsación permite mantenerlo abierto o cerrarlo. Con movimiento reducido se elimina la transición. La imagen original suministrada está en `src/assets/kitotsu-logo-background.png`.

## Listado implementado

`GET https://itx-frontend-test.onrender.com/api/product` devuelve un array con `id`, `brand`, `model`, `price` e `imgUrl` como texto. Se muestran todos los productos sin paginación, con marca, modelo, imagen y precio. Si `price` está vacío o solo tiene espacios se muestra **Precio no disponible**; el producto permanece en el catálogo. No se convierte el precio a número ni se añade moneda porque el contrato no la especifica.

La búsqueda filtra inmediatamente por marca **o** modelo, ignorando mayúsculas y espacios exteriores. Escribir, borrar o limpiar el campo no genera consultas. El contenido aprovecha el ancho disponible con márgenes laterales pequeños, sin un máximo de ancho centrado. La cuadrícula usa una columna en móvil, dos desde 600 px, tres desde 900 px y cuatro desde 1200 px; nunca más de cuatro. Todas las tarjetas enlazan a `/product/:id` y tienen texto alternativo de imagen y una alternativa visual si falla la carga.

Al filtrar, las tarjetas descartadas se desvanecen y las restantes se desplazan para ocupar sus huecos. Motion anima la posición sin deformar las tarjetas; las tarjetas que salen dejan de ser interactivas inmediatamente. La preferencia de movimiento reducido elimina las transiciones. El filtro sigue siendo inmediato y no genera consultas. Implementación basada en la documentación oficial de [animaciones de disposición](https://motion.dev/docs/react-layout-animations) y [AnimatePresence](https://motion.dev/docs/react-animate-presence).

La carga muestra esqueletos de tarjetas con brillo animado, sin texto visible de carga, y con aviso para lectores de pantalla; el movimiento reducido desactiva la animación. Hay estados de fallo recuperable con Reintentar, catálogo vacío y búsqueda sin coincidencias. El contador es compartido y persistente; el detalle real se describe más abajo.

- `src/api/products.ts`: tipos, petición HTTP y validación del contrato, sin almacenamiento.
- `src/hooks/useProducts.ts`: carga, error, reintento y cancelación al desmontar; no depende de la búsqueda.
- `src/pages/ProductListPage.tsx`: filtro local y estados de presentación.
- `src/components/ProductCard.tsx`: datos, imagen y enlace de cada producto.

El listado reutiliza la caché válida al regresar o recargar. StrictMode comparte una única solicitud pendiente mediante la capa de deduplicación; buscar no genera peticiones.

[Verificación del listado](openspec/changes/02-product-list/verification.md): 25 pruebas simuladas, integración real de 100 productos (6 precios vacíos) y revisión visual a 360, 768, 1440 y 1920 px.

## Buscador integrado al subir

La cabecera permanece fija. Al subir desde el catálogo, el buscador se desliza bajo su extremo derecho con un panel curvo. Al bajar se oculta, excepto mientras conserva el foco; al volver al inicio recupera su posición original. Se mantiene un único campo, su valor y la búsqueda local sin nuevas consultas. La altura de la cabecera se mide para adaptar el acoplamiento a móvil y escritorio. Movimiento reducido elimina la transición.

Las tarjetas incorporan la animación de [SteveBloX en Uiverse](https://uiverse.io/SteveBloX/dangerous-warthog-85): ampliación al pasar el cursor o enfocar con teclado y contracción con giro al pulsar. Se aplica al enlace interior para coexistir con la recolocación del filtro. Movimiento reducido desactiva transformaciones. Atribución y licencia en [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

En detalle, una solapa curva bajo el lado izquierdo de la cabecera muestra flecha y «Volver». Retrocede dentro del historial de la SPA; si se accede directamente sin historial interno, vuelve al listado. El enlace Listado de los breadcrumbs permite regresar directamente al catálogo.

Al regresar al listado, la página y los esqueletos entran con un fundido breve; al responder la consulta, los resultados aparecen con un fundido y desplazamiento de 8 px. Las tarjetas aparecen dentro de la transición del conjunto. Las transiciones no retrasan la consulta y se eliminan con movimiento reducido.

Breadcrumbs recuperados por petición del usuario para cumplir el enunciado: Listado como vista actual en `/`, y Listado / Detalle del producto en detalle, con enlace de regreso y aria-current. El nombre real del producto se incorporará al implementar su consulta.

Ajuste posterior: breadcrumbs dentro de la solapa izquierda de la cabecera en ambas vistas. Al abrir detalle, aparece Volver y los breadcrumbs se desplazan a la derecha mientras se amplía el panel; al regresar solo se retira Volver. En pantallas estrechas el buscador acoplado queda debajo de esta solapa para evitar solapamientos. Movimiento reducido desactiva la transición.

Se retira el enlace duplicado «Volver al listado» sobre el texto provisional del detalle. El regreso queda en la solapa: botón Volver y enlace Listado de los breadcrumbs.

## Caché de consultas implementada

El listado conserva respuestas válidas en localStorage durante exactamente 3 600 000 ms desde su obtención. Leer una entrada no renueva su caducidad. Al alcanzar el límite se consulta de nuevo y solo un éxito validado reemplaza la entrada; no se ofrecen datos caducados. Los listados vacíos también se almacenan.

Claves: `nunegal:query:v1:products` para listado y `nunegal:query:v1:product:<id codificado>` reservada para futuros detalles. `src/api/queryCache.ts` separa almacenamiento, validación y deduplicación. No se implementa consulta de detalle ni se aplica caché a POST.

Datos corruptos, localStorage bloqueado o lleno se tratan como ausencia de caché: la aplicación continúa mediante consultas normales. Las solicitudes simultáneas de una clave comparten transporte; los errores permiten reintento y una cancelación individual no interrumpe a otros consumidores. Si todos cancelan, se aborta el transporte después de una microtarea, evitando duplicaciones durante el montaje de StrictMode.

[Verificación de caché](openspec/changes/03-query-cache/verification.md): 44 pruebas simuladas, reloj controlado y Chromium con API real. Una petición inicial, cero adicionales al recargar o regresar al listado; una nueva petición tras forzar la expiración, sin esperar una hora real. Caché completada; detalle y cesta siguen pendientes.

El buscador acoplado espera 600 ms antes de ocultarse al bajar; al primer acoplamiento reserva además 400 ms para su entrada. La salida se desliza y desvanece durante 380 ms. Subir o mantener el foco cancela la ocultación; movimiento reducido elimina las animaciones.

## Detalle implementado

GET /api/product/:id validado y cacheado por ID una hora. Imagen izquierda, características y opciones derecha a partir de 900 px; una columna en móvil. Marca/modelo, precio, CPU, RAM, sistema operativo, resolución, pantalla, batería, cámaras, dimensiones y peso. Sin asumir moneda o unidades; los valores ausentes/vacíos o '-' muestran No disponible. Imagen fallida tiene alternativa.

Contrato real inspeccionado: `dimentions` y `secondaryCmera` mantienen los nombres de API; `displaySize` contiene píxeles y `displayResolution` pulgadas. Algunas características alternan texto/array entre productos (sim, secondaryCmera, wlan, bluetooth). Fixtures completas en src/test/productDetail.ts y validación en src/api/productDetail.ts.

`options.colors` y `options.storages`: arrays de `{ code: number, name: string }`. Iconia Talk S: Black/1000; 16 GB/2000 y 32 GB/2001. Liquid Z6 Plus: Black/1000 y White/1001; 32 GB/2000. Un código de almacenamiento no tiene significado global: se toma siempre del producto actual. Selectores únicos visibles y seleccionados; múltiples requieren elección explícita; sin opciones se indica No disponible. Cambiar de producto reinicia selecciones.

El breadcrumb incorpora marca/modelo tras cargar. Esqueletos, producto inexistente (404), error con reintento y caché reutilizada al volver/recargar. Añadir se habilita al elegir opciones válidas y usa el POST descrito más abajo.

[Verificación de detalle](openspec/changes/04-product-detail/verification.md): pruebas simuladas con características, opciones, cambios de producto, fallos y caché; Chromium real con acceso directo y navegación entre dos productos, 360/1440 px y cero POST.

## Cesta implementada

POST https://itx-frontend-test.onrender.com/api/cart con Content-Type application/json y exactamente `{id, colorCode, storageCode}`. Los códigos numéricos se toman de la opción del producto actual; las cadenas de los selectores no se envían como códigos. Selección incompleta mantiene Añadir deshabilitado. Durante envío se muestra Añadiendo… y un bloqueo síncrono evita duplicados incluso si se navega a otro detalle.

La respuesta exige count entero no negativo y sustituye exactamente el contador compartido, sin incrementos ni acumulación local. Persistencia en `nunegal:cart:v1:count`, independiente de la caché de una hora. Al recargar se recupera; dato ausente/corrupto/inválido produce 0, y fallos de storage conservan funcionamiento en memoria.

Confirmación accesible de éxito y error con conservación del contador anterior y reintento manual. El estado vive en App y permanece durante navegación. El POST no usa la caché GET ni reintentos automáticos y no se cancela al cambiar de ruta. Solo existen listado y detalle; sin checkout ni página de cesta.

[Verificación de cesta](openspec/changes/05-cart/verification.md): 98 pruebas simuladas y una operación Chromium real. Payload `{id:"ZmGrkLRPXOTpxsU4jjAcv",colorCode:1000,storageCode:2000}`, respuesta HTTP 200 `{count:1}`; contador 1 en detalle, listado y recarga. Este resultado corresponde a una única operación y no permite afirmar acumulación remota. Acabado y revisión final siguen pendientes.
