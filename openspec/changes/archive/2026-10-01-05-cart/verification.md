# Verificación de cesta

1 de octubre de 2026.

- 98 pruebas simuladas en 9 archivos: cuerpo exacto y tipos numéricos, selección incompleta/única, pending y doble envío antes de render, actualización exacta incluso a cero/inferior, persistencia y remonte, valores corruptos, fallos de storage, HTTP/red/JSON/count inválido, reintento manual y navegación pendiente hacia listado y otro detalle.
- pnpm test, lint, build y validación OpenSpec correctos. No dependencia de API pública en pruebas automatizadas.
- Chromium: una única operación POST real desde detalle Iconia Talk S, color Black/1000 y almacenamiento 16 GB/2000.
- Payload exacto: {"id":"ZmGrkLRPXOTpxsU4jjAcv","colorCode":1000,"storageCode":2000}; Content-Type application/json.
- Respuesta observada: HTTP 200, {"count":1}. Confirmación accesible visible; cabecera pasa de Cesta 0 a Cesta 1.
- Al navegar al listado y recargar: Cesta 1, almacenamiento "1" en nunegal:cart:v1:count; un solo POST total.
- count se usa literalmente. Una única operación no demuestra cómo acumula el servidor futuras peticiones; no se incrementa localmente ni se reintenta automáticamente.

4/4 tareas completadas. Acabado y revisión final siguen pendientes; sin nuevas vistas ni checkout. Cambio no archivado automáticamente.
