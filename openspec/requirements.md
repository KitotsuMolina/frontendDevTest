# Requisitos del enunciado

Fuente: [Prueba frontend ITX.pdf](Prueba%20frontend%20ITX.pdf), siete páginas. Este inventario describe requisitos futuros, no comportamiento ya implementado. Los cambios de openspec/changes contienen los criterios normativos de cada hito; openspec/specs se reservará para requisitos entregados y sincronizados.

| ID | Página | Requisito | Hito |
| --- | --- | --- | --- |
| R01 | 1 | React/Preact; SPA con rutas cliente, exactamente listado y detalle; sin MPA ni SSR | navegación |
| R02 | 1 | Diseño libre respetando estructuras de capturas | acabado |
| R03 | 1 | Scripts START, BUILD, TEST y LINT; README desde primer commit | preparación |
| R04 | 1 | Repositorio público y evolución por hitos reales | preparación y entrega |
| R05 | 2 | Mostrar todos los productos; máximo cuatro por fila y adaptación a resolución | listado |
| R06 | 2, 4 | Búsqueda en tiempo real por marca y modelo; selección navega al detalle | listado |
| R07 | 3 | Detalle en dos columnas: imagen a la izquierda, descripción y acciones a la derecha; enlace de vuelta | detalle |
| R08 | 4 | Cabecera con título/icono enlazado al listado, breadcrumbs navegables y contador a la derecha | navegación y cesta |
| R09 | 4 | Item con imagen, marca, modelo y precio | listado |
| R10 | 4 | Detalle: marca, modelo, precio, CPU, RAM, SO, resolución, batería, cámaras, dimensiones y peso | detalle |
| R11 | 5 | Selectores de almacenamiento y color siempre visibles; opción única seleccionada por defecto | detalle |
| R12 | 5–7 | Añadir envía id, colorCode y storageCode; respuesta count aparece en ambas vistas y se persiste | cesta |
| R13 | 6 | GET /api/product devuelve array; GET /api/product/:id devuelve objeto | listado y detalle |
| R14 | 7 | Datos recibidos de consultas almacenados en cliente; caducidad de una hora y revalidación al expirar; memoria o storage permitidos | caché |

## Contratos transcritos de las imágenes

Base: https://itx-frontend-test.onrender.com/

- GET /api/product → array de productos.
- GET /api/product/:id → producto.
- POST /api/cart, body { id, colorCode, storageCode } → { count }.

Los ejemplos del PDF son esquemáticos: no fijan el tipo real de id ni el catálogo completo de propiedades. Se comprobará el JSON real en cada hito de integración, sin inventar valores ni asumir que count sea un incremento.

## Decisiones adicionales

TypeScript estricto y pnpm son decisiones de proyecto solicitadas por el usuario. Se propone búsqueda sin distinción de mayúsculas, caché GET con TTL absoluto y localStorage para contador; los cambios describen sus escenarios. Los estados de carga/error/vacío y la accesibilidad son criterios de calidad añadidos para una entrega verificable.

El repositorio local se inicializa en esta fase. La publicación pública y la configuración del proveedor se harán en la entrega, una vez elegido el destino; no se ha publicado nada.
