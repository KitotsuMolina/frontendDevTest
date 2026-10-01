# Verificación del detalle

Implementación y comprobaciones Chromium realizadas el 30/09/2026; cierre y verificaciones repetidas el 01/10/2026 tras interrupción.

- Contrato inspeccionado antes de implementar: ZmGrkLRPXOTpxsU4jjAcv y posteriormente cGjFJlmqNPIwU59AOcY8H y 8hKbH2UHPM_944nRHYN1n. Fixtures completas en src/test/productDetail.ts.
- 67 pruebas aprobadas en 7 archivos, con respuestas simuladas: características, ausencia de datos, imagen fallida, opciones únicas/múltiples, reinicio por producto, 404, errores HTTP/red/contrato, reintento, caché por ID y expiración exacta.
- Caso de regreso tras caducar: si falla renovación, no se presentan datos ni breadcrumb del producto anterior.
- pnpm lint, pnpm build y pnpm spec:validate correctos; 7 cambios OpenSpec válidos.
- Chromium real: acceso directo a Iconia Talk S, imagen cargada, Black/1000 seleccionado y almacenamiento sin elegir; Añadir deshabilitado.
- Dos columnas a 1440 px y una a 360 px; sin desbordamiento horizontal. Capturas completas de escritorio y móvil revisadas.
- Navegación a Liquid Z6 Plus: color sin seleccionar y almacenamiento 32 GB/2000 seleccionado. Regreso al primer producto reinicia almacenamiento, reutiliza caché y no hace otra consulta; recarga también reutiliza.
- Durante navegación entre ambos productos: una nueva petición de detalle para el segundo producto, cero POST y claves de caché independientes.

4/4 tareas completadas. POST de cesta y persistencia del contador siguen pendientes. Cambio no archivado automáticamente.
