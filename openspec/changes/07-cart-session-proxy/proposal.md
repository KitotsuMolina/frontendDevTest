# Proposal

## Why
La API remota conserva la cesta mediante session_id, pero las llamadas directas desde el navegador pierden esa sesión. Añadir credentials: include queda bloqueado por el CORS remoto; varias altas válidas devuelven count 1.

## What Changes
- Enviar la cesta a /api/cart en el mismo origen y reenviarla a la API del enunciado mediante proxy en desarrollo y preview.
- Conservar la cookie de cada navegador, sin una sesión global en el servidor ni reintentos de POST.
- Verificar dos productos con códigos distintos, navegación/recarga e independencia entre navegadores mediante upstream simulado y revisión real.
- Documentar el proxy equivalente necesario en producción; sin despliegue.

## Capabilities

### New Capabilities
- `cart-session-proxy`: conservar la sesión de cesta mediante un endpoint del mismo origen.

### Modified Capabilities
Ninguna: cart conserva el contrato exacto, validación de count y persistencia.

## Impact
Cliente HTTP de cesta, configuración Vite, pruebas unitarias/E2E, README y OpenSpec. No modifica las consultas GET, la caché, el diseño ni las dos vistas. No añade dependencias de ejecución.
