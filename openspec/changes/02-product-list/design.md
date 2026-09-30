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
