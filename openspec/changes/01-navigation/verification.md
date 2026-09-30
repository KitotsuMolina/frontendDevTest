# Verificación de navegación

Comprobaciones realizadas el 30 de septiembre de 2026. Se leyeron propuesta, diseño, delta spec y tareas antes de implementar; se adaptó la ruta previa /products/:id a /product/:id según instrucción del usuario. La referencia futura del hito listado se actualizó para mantener coherencia.

| Comprobación | Resultado |
| --- | --- |
| pnpm test | 7 pruebas aprobadas: inicio, detalle directo, tres enlaces de regreso, teclado e historial |
| pnpm lint | Correcto, sin advertencias |
| pnpm build | Correcto, TypeScript estricto y compilación de producción |
| pnpm spec:validate | 7 cambios válidos en modo estricto |
| Acceso directo con Vite | /product/direct-123 muestra detalle provisional, id, breadcrumbs y cesta en 0 |
| Navegación sin recarga | Marcador de window conservado y cero peticiones de documento durante enlaces e historial |
| Atrás / adelante en Chromium | Listado y detalle restaurados correctamente |
| Teclado | Tab/Enter activan enlaces; foco pasa al main y permite regresar al listado |
| Adaptación | Listado y detalle sin desbordamiento a 360, 768 y 1440 px; capturas de detalle móvil y escritorio revisadas |
| Alcance | Cero peticiones API; contador estático, sin caché ni acciones de cesta |

Se usa BrowserRouter en la entrada cliente y Link para los enlaces internos. El nombre real del producto queda pendiente de consulta. Las rutas desconocidas redirigen al inicio. Las pruebas DOM simulan historial del navegador; las comprobaciones Chromium confirman el comportamiento real en desarrollo. El fallback del hosting de producción no forma parte de este hito.

Durante la primera compilación se detectó una opción no admitida por el tipo de getByRole en una prueba; se corrigió antes de repetir satisfactoriamente test, lint, build y validación. Las tres tareas de navegación están completadas; los hitos posteriores siguen pendientes.
