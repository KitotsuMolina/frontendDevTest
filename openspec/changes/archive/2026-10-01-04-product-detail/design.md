# Design

## Contrato observado
GET del ID ZmGrkLRPXOTpxsU4jjAcv consultado antes de implementar, seguido de cGjFJlmqNPIwU59AOcY8H y 8hKbH2UHPM_944nRHYN1n. Fixtures completas guardadas en src/test/productDetail.ts.
- Identidad, precio e imagen: id, brand, model, price, imgUrl como texto.
- Atributos conservan nombres API: cpu, ram, os, displaySize (píxeles), displayResolution (pulgadas), battery, primaryCamera, secondaryCmera, dimentions, weight. No se corrigen nombres al consultar ni se añaden moneda o unidades inferidas.
- Arrays observados: internalMemory, primaryCamera, sensors, colors. sim, secondaryCmera, wlan y bluetooth varían entre texto y array según producto. Otros campos observados de texto se modelan sin añadir campos nuevos.
- Características opcionales/null/vacías y marcador '-' se presentan como No disponible. Precio vacío -> Precio no disponible.
- options.colors y options.storages son arrays de {code: number, name: string}. Los códigos son propios del producto: 2000 significa 16 GB en Iconia Talk S y 32 GB en Liquid Z6 Plus. No se deducen desde nombres ni posiciones.

## Implementación
Cliente productDetail separado, valida contrato e identidad y reutiliza queryCache con clave por ID y TTL de 3 600 000 ms. 404 -> ProductNotFoundError; otros fallos recuperables. App comparte una única consulta entre breadcrumb y página; useProductDetail impide presentar respuestas de otro ID o de una visita cancelada. No se muestran datos caducados al regresar.

Detalle con imagen izquierda y descripción/acciones derecha desde 900 px; en móvil se apila. Esqueletos accesibles, error con Reintentar, inexistente y alternativa de imagen fallida. Breadcrumb muestra marca/modelo tras éxito; nombre genérico durante carga/error. Solapa de regreso y enlace Listado conservados.

DetailContent se monta con clave de producto, reiniciando imagen y opciones. Una opción -> selección inicial con selector visible; varias -> opción vacía que exige elección; ninguna -> selector deshabilitado y No disponible. Values HTML son representaciones textuales de códigos numéricos reales, sin modificar el contrato. Añadir siempre disabled con nota pendiente de integración, sin POST.

## Riesgos y alcance
API variable -> comprobados tres detalles reales, validación y pruebas simuladas. Caché nunca guarda 404 ni contratos inválidos. No se implementa carrito ni persistencia de contador. No se añaden vistas.
