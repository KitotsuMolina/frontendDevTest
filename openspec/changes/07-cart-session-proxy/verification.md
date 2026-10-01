# Verificación — 01/10/2026

- `pnpm test`: 98 pruebas aprobadas en 9 archivos.
- `pnpm test:e2e`: 27 ejecuciones aprobadas en Chromium, escritorio, tablet y móvil. API simulada; la nueva prueba atraviesa el proxy de preview hasta un upstream HTTP local. Comprueba count 1 → 2 → 3, recarga, aislamiento de otra sesión (count 1), cuerpo exacto y filtrado de cookies ajenas.
- `pnpm lint`, `pnpm build`, `pnpm spec:validate` y `git diff --check`: correctos; OpenSpec valida el cambio y las siete especificaciones existentes.

## Integración real

Chromium sobre el servicio de desarrollo en `http://127.0.0.1:5173`, con el proxy apuntando a la API HTTPS pública:

| POST | id | colorCode | storageCode | Respuesta |
| --- | --- | --- | --- | --- |
| 1 | ZmGrkLRPXOTpxsU4jjAcv | 1000 | 2001 | HTTP 200, `{count:1}` |
| 2 | cGjFJlmqNPIwU59AOcY8H | 1001 | 2000 | HTTP 200, `{count:2}` |

Ambas operaciones conservaron la misma cookie session_id, de dominio 127.0.0.1, ruta /api/cart y HttpOnly. El contador mostró 2 tras navegar y recargar. No se registran valores privados de cookies. Los códigos de almacenamiento distintos no impiden compartir cesta.

Las consultas GET, la caché, las dos vistas y el diseño no cambian. El POST conserva su cuerpo y actualiza el contador con el valor exacto del servidor; no hay suma local, caché ni reintentos automáticos.

No se automatizó Brave ni Zen. La configuración Nginx de `docs/cart-session-proxy.md` es una referencia para alojamiento, no un despliegue verificado. Producción requiere implementar ese proxy del mismo origen; publicar únicamente dist no basta. El servicio de desarrollo existente sigue disponible.
