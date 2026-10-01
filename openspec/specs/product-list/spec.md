# product-list Specification

## Purpose
Permitir explorar todos los dispositivos del catálogo remoto y buscar por marca o modelo con una interfaz adaptable y estados verificables.

## Requirements

### Requirement: Catálogo completo y contrato HTTP
El listado SHALL consumir GET https://itx-frontend-test.onrender.com/api/product. La respuesta SHALL ser un array con id, brand, model, price e imgUrl como texto. El acceso HTTP SHALL estar separado de los componentes para incorporar caché en otro hito. SHALL mostrar todos los productos con imagen, marca, modelo y precio sin paginar ni excluir productos con precio vacío.

#### Scenario: Visualización del catálogo
- **WHEN** el servicio responde con productos válidos
- **THEN** cada producto aparece en una tarjeta con sus atributos y enlace a /product/:id.

#### Scenario: Precio vacío
- **WHEN** un producto tiene price vacío o solo espacios
- **THEN** su tarjeta muestra «Precio no disponible», mantiene el producto y no convierte su precio a cero.

#### Scenario: Precio sin moneda
- **WHEN** price contiene texto no vacío
- **THEN** se muestra ese texto sin añadir símbolo ni asumir moneda.

### Requirement: Cuadrícula adaptable
El listado SHALL distribuir las tarjetas según el ancho disponible, con máximo cuatro tarjetas por fila y sin desbordamiento horizontal.

#### Scenario: Resoluciones de pantalla
- **WHEN** se visualiza a 360, 768 y 1440 px
- **THEN** las tarjetas se distribuyen en una, dos y cuatro columnas respectivamente, mostrando todos los productos.

### Requirement: Búsqueda inmediata en cliente
El listado SHALL filtrar por coincidencia parcial de marca O modelo ante cada cambio del texto, ignorando mayúsculas y espacios exteriores. Escribir o borrar la búsqueda SHALL usar exclusivamente los productos descargados sin generar peticiones HTTP.

#### Scenario: Buscar por marca
- **WHEN** se introduce una marca con distinta capitalización y espacios exteriores
- **THEN** solo se muestran productos cuya marca o modelo contiene el texto normalizado, sin nueva consulta.

#### Scenario: Buscar por modelo y limpiar
- **WHEN** se introduce parte de un modelo y después se limpia el campo
- **THEN** primero se muestran coincidencias y después todos los productos, sin nueva consulta.

#### Scenario: Transición del filtro
- **WHEN** se modifica la búsqueda
- **THEN** las tarjetas descartadas se desvanecen, dejan de aceptar interacción y las coincidencias se desplazan suavemente para ocupar sus huecos, sin nuevas peticiones ni retrasar el filtro.

#### Scenario: Cambios rápidos y movimiento reducido
- **WHEN** se cambia o limpia rápidamente la búsqueda, o se solicita movimiento reducido
- **THEN** se conserva el resultado del último filtro sin duplicados y la preferencia de movimiento reducido elimina las transiciones.

#### Scenario: Selección de tarjeta
- **WHEN** se activa una tarjeta con ratón o teclado
- **THEN** se navega mediante la SPA a /product/:id con el id correspondiente.

### Requirement: Estados diferenciados y reintento
El listado SHALL mostrar carga mientras se consulta, fallo con control de reintento ante errores HTTP, de red o contrato, catálogo vacío ante un array vacío y búsqueda sin coincidencias cuando un catálogo no vacío no tiene resultados del filtro.

#### Scenario: Carga
- **WHEN** la consulta está pendiente
- **THEN** se muestran esqueletos de tarjetas en la cuadrícula con animación suave, sin texto visible de carga, se anuncia la carga a lectores de pantalla y se elimina la animación si se solicita movimiento reducido.

#### Scenario: Error y recuperación
- **WHEN** falla una consulta y el usuario activa Reintentar
- **THEN** se realiza una nueva consulta, se muestra carga y un éxito posterior presenta el catálogo.

#### Scenario: Catálogo vacío
- **WHEN** el servicio responde con un array vacío
- **THEN** se muestra «No hay productos disponibles» como estado de catálogo, independiente de la búsqueda.

#### Scenario: Búsqueda sin coincidencias
- **WHEN** el catálogo tiene productos pero ninguno coincide con la búsqueda
- **THEN** se muestra «No se encontraron productos» y se permite modificar o limpiar la búsqueda.

### Requirement: Imágenes accesibles y alternativa visual
Cada imagen SHALL tener texto alternativo que identifique marca y modelo. Si la imagen falla o imgUrl está vacío, la tarjeta SHALL mantener sus datos y enlace y mostrar una alternativa visual identificable.

#### Scenario: Imagen fallida
- **WHEN** una imagen emite un error de carga
- **THEN** se muestra «Imagen no disponible» y se conserva la identidad y navegación del producto.

### Requirement: Buscador acoplado al subir
El buscador SHALL integrarse suavemente debajo de la cabecera fija al subir desde el catálogo. SHALL conservar valor y foco, adaptarse al ancho disponible y eliminar transiciones con movimiento reducido.

#### Scenario: Cambio de dirección
- **WHEN** se sube después de dejar atrás la posición original del buscador
- **THEN** el campo aparece bajo el extremo derecho de la cabecera; al bajar se oculta salvo si mantiene el foco y al volver al inicio recupera su posición original.

### Requirement: Presentación suave del listado
El listado SHALL presentar esqueletos y resultados con entrada suave al regresar desde detalle, sin demorar la consulta. Las tarjetas SHALL responder al cursor y foco con ampliación y a la pulsación con contracción y giro. Movimiento reducido SHALL eliminar estas animaciones.

#### Scenario: Vuelta al listado
- **WHEN** se regresa desde detalle y termina la consulta del catálogo
- **THEN** los esqueletos y después los resultados aparecen con fundido suave y los resultados con ligero desplazamiento, manteniendo los estados accesibles existentes.
