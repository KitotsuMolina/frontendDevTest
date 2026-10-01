# Design

## Context
Ver proposal.md. El cliente envía GET y POST a la API externa; fetch usa same-origin por defecto. Chromium reproduce count 1 en dos POST válidos y ninguna cookie remota guardada. credentials: include falla por Access-Control-Allow-Origin: *. curl con cookie jar obtiene count 1/2. Los códigos 32 GB son 2001 en Iconia Talk S y 2000 en Liquid Z6 Plus; se conservan por producto.

## Goals / Non-Goals
**Goals:** sesión individual con cookies del mismo origen en desarrollo y preview, prueba del proxy real con upstream simulado y revisión real con dos productos.
**Non-Goals:** cambiar GET/caché, implementar backend de cesta propio, sumar count localmente, añadir rutas de UI, compartir sesiones entre usuarios o desplegar.

## Decisions
CART_URL pasa a /api/cart. Configuración común de proxy para server y preview con destino HTTPS fijo por defecto. CART_PROXY_TARGET es una variable exclusiva del proceso servidor para apuntar las pruebas a un upstream local; no se expone en JavaScript de cliente. La cookie session_id se reenvía por navegador y su Path se limita a /api/cart. No se almacena una cookie global en Node.

Se mantienen los GET externos porque no necesitan sesión de cesta. El proxy evita el CORS y las cookies de terceros para el POST. Solo se configura la ruta de cesta, sin proxy abierto de destinos.

Las E2E existentes siguen simulando peticiones en el navegador; una prueba adicional atraviesa preview y un servidor HTTP local que emite cookies y count por sesión. Verifica 1/2/3, recarga y un segundo contexto con count 1. Los errores y reintentos existentes siguen cubiertos.

## Risks / Trade-offs
Alojamiento estático → documentar proxy de producción equivalente y ejemplo de configuración, sin desplegar. Cookie eliminada o nueva sesión → count remoto puede reiniciarse y sigue siendo la fuente del contador. API externa no disponible → mantener error/reintento manual. No habilitar credentials: include hacia el origen remoto ni desactivar seguridad del navegador.

## Migration Plan
Reiniciar Vite al cambiar configuración. Usar /api/cart también en preview. El alojamiento futuro debe configurar esa ruta antes del fallback index.html. La revisión final original permanece como evidencia histórica; se añade una verificación posterior sin alterar sus commits.
