# Design

## Context
React/Vite/TypeScript estricto con pnpm; navegación completada y ajustes de navbar/easter egg conservados. Contrato proporcionado por el usuario: array con id, brand, model, price e imgUrl de texto. Fuente: R05, R06, R09 y R13.

## Goals / Non-Goals
**Goals:** catálogo completo, búsqueda local inmediata, navegación y estados accesibles y verificables.
**Non-Goals:** caché, persistencia de consultas, petición de detalle, acciones de cesta, paginación o asumir moneda.

## Decisions
- getProducts(signal) en src/api/products.ts usa fetch GET, comprueba HTTP y valida el contrato de los campos de texto. Devuelve Product[] sin coerciones; no realiza almacenamiento. Esta frontera permitirá incorporar caché después.
- Hook de listado con estados discriminados loading/success/error y AbortController al desmontar; reintento explícito. StrictMode puede iniciar y abortar una primera solicitud adicional en desarrollo; no se añade caché ni deduplicación para ocultarlo.
- Filtrado por brand OR model usando trim().toLowerCase(), calculado desde estado local. El efecto de consulta no depende de búsqueda.
- Precio no vacío se muestra literalmente; vacío o solo espacios → Precio no disponible. No se añade símbolo de moneda porque el contrato no la especifica.
- ProductCard con Link al id codificado; imagen object-fit contain, alt marca/modelo y alternativa accesible si falla o no hay URL.
- Cuadrícula CSS explícita de una, dos, tres y cuatro columnas; máximo cuatro incluso en pantallas grandes. Cabecera del listado con búsqueda alineada a la derecha en escritorio.
- Pruebas con fetch simulado, incluida la integración completa de rutas; ninguna prueba automatizada usa el servicio público. Chromium real comprueba número de productos, búsqueda sin nuevas peticiones y distribución.

## Risks / Trade-offs
- API remota puede fallar → estado recuperable con reintento y tests deterministas.
- Algunas imágenes o precios no están disponibles → alternativas visuales y textuales sin excluir productos.
- Sin caché aún → volver al listado vuelve a consultar; permitido en este hito y resuelto en el siguiente.

## Ajuste de carga solicitado

Ocho tarjetas de esqueleto reutilizan la cuadrícula adaptable durante consulta inicial y reintento. El texto de carga solo se anuncia a lectores de pantalla; los esqueletos son decorativos y no contienen enlaces. Un brillo recorre sus bloques hasta que la consulta termina. prefers-reduced-motion elimina la animación.

## Ajuste de ancho solicitado

Cabecera, breadcrumbs y contenido ocupan el ancho disponible sin contenedor centrado limitado a 1120 px. Se conserva únicamente padding lateral de 24 px en escritorio y 16 px en móvil, respetando la estructura del PDF y el máximo de cuatro tarjetas por fila. La cabecera reserva el espacio de su esquina desplegable.

## Animación del filtro solicitada

Motion usa AnimatePresence con popLayout para retirar del flujo las tarjetas que salen mientras se desvanecen durante 180 ms. ProductCard transmite su referencia al elemento li; layout="position" anima la recolocación con resorte sin escalar el contenido. La cuadrícula tiene posición relativa. Las tarjetas salientes se marcan inert y aria-hidden para impedir interacción y lectura de resultados descartados. useReducedMotion elimina las transiciones. Las claves siguen siendo los ids y el efecto HTTP no cambia.

## Acoplamiento del buscador solicitado

CatalogSearch mantiene un único input dentro de un espacio reservado. El scroll pasivo se procesa en requestAnimationFrame para detectar dirección y paso de su posición original. El panel fijo aparece al subir con transición de transform y opacity, curva y sombra. ResizeObserver mide la cabecera compartida y actualiza su altura CSS; el detalle no incorpora buscador. El foco mantiene visible el panel y movimiento reducido elimina transiciones.
