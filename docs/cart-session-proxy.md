# Sesión de cesta mediante proxy

Corrección posterior a la revisión final, 1 de octubre de 2026. El diseño y el contrato de cesta se mantienen.

## Diagnóstico

La API responde por HTTPS y valida los códigos de cada producto. En Chromium, dos POST directos correctos devolvieron `{count:1}` cada uno, sin cookie guardada. Con `credentials: include`, la petición quedó bloqueada por `Access-Control-Allow-Origin: *`. curl conservando `session_id` sí obtuvo 1/2. El campo storageCode describe almacenamiento, no la cesta: 32 GB tiene código 2001 en Iconia Talk S y 2000 en Liquid Z6 Plus.

## Implementación local

El cliente usa `POST /api/cart` en el mismo origen. Vite configura esa ruta exacta en `server.proxy` y `preview.proxy` y reenvía al destino `https://itx-frontend-test.onrender.com`. La comunicación hacia la API sigue siendo HTTPS, con validación TLS normal.

El proxy reenvía únicamente la cookie `session_id` del navegador que hizo la petición; no conserva una cookie global ni comparte cestas. Devuelve Set-Cookie como cookie del origen de la SPA, conserva HttpOnly y limita Path a `/api/cart`. fetch usa las credenciales same-origin por defecto. El cuerpo mantiene exactamente id/colorCode/storageCode numéricos y el contador sigue tomando count de la API, sin sumas locales. No hay caché ni reintento automático de POST.

Los GET y la caché continúan usando el servicio externo directamente. No hay una tercera vista ni un backend de cesta propio.

`CART_PROXY_TARGET` es una variable del proceso de Vite, exclusiva del servidor. Por defecto apunta al servicio del enunciado; las E2E la sustituyen por `http://127.0.0.1:4181`. No es una variable VITE_* ni se incorpora al JavaScript de cliente. No se necesita configurarla para usar la aplicación normalmente.

```bash
pnpm start
# O bien, para comprobar producción local:
pnpm build
pnpm preview
```

La sesión se mantiene al navegar y recargar. Si se elimina la cookie o el servidor invalida la sesión, la siguiente respuesta puede volver a 1 aunque hubiese un contador local anterior: count continúa siendo la fuente de verdad. No puede recuperarse la antigua cesta únicamente desde localStorage.

## Producción: requisito de alojamiento

`dist/` por sí solo no ejecuta el proxy de Vite. El alojamiento debe servir la SPA y reenviar **en el mismo dominio** `/api/cart` a la API, pasando el cuerpo, Content-Type, Cookie y Set-Cookie por usuario. Esa ruta se resuelve antes del fallback index.html y nunca se cachea o reintenta automáticamente.

Ejemplo orientativo para un servidor Nginx que sirve dist. El map pertenece al contexto `http`; las ubicaciones pertenecen al `server` del dominio de la aplicación. La ruta del bundle de certificados debe adaptarse al sistema del alojamiento. Este ejemplo no se ha desplegado ni ejecutado en este cambio.

```nginx
# Dentro de http:
map $cookie_session_id $cart_session_cookie {
    ""      "";
    default "session_id=$cookie_session_id";
}

# Dentro del server que sirve dist:
location = /api/cart {
    proxy_pass https://itx-frontend-test.onrender.com/api/cart;
    proxy_set_header Host itx-frontend-test.onrender.com;
    proxy_set_header Cookie $cart_session_cookie;
    proxy_ssl_server_name on;
    proxy_ssl_verify on;
    proxy_ssl_trusted_certificate /etc/ssl/certs/ca-certificates.crt;
    proxy_ssl_verify_depth 3;
    proxy_cookie_path / /api/cart;
    proxy_cache off;
    proxy_next_upstream off;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

La respuesta remota actual no añade Domain a session_id, por lo que el navegador la asocia al dominio del proxy. Si ese contrato de cookie cambia, debe adaptarse la reescritura del alojamiento. En producción se debe servir el dominio de la SPA por HTTPS. No hay que desactivar CORS ni restricciones del navegador.

Referencias: [proxy de desarrollo Vite](https://vite.dev/config/server-options.html#server-proxy), [proxy de preview](https://vite.dev/config/preview-options.html#preview-proxy), [Nginx proxy](https://nginx.org/en/docs/http/ngx_http_proxy_module.html), [cookies de Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials).

## Verificaciones

**Simuladas:** 98 pruebas Vitest y 27 ejecuciones E2E, sin dependencia de API pública. La nueva prueba atraviesa el proxy real de preview y un upstream HTTP local con cookies de sesión: comprueba 1/2/3, cuerpo y códigos por producto, recarga, cookie ajena filtrada y segundo navegador independiente con 1. Los estados de error y reintento manual siguen cubiertos por las E2E anteriores.

**Reales:** Chromium sobre el servicio local en `127.0.0.1:5173`, exactamente dos altas:

| Producto | colorCode | storageCode | Respuesta |
| --- | --- | --- | --- |
| Iconia Talk S | 1000 | 2001 | HTTP 200 `{count:1}` |
| Liquid Z6 Plus | 1001 | 2000 | HTTP 200 `{count:2}` |

Las peticiones del navegador se enviaron a `/api/cart` local y el proxy las trasladó a la API real. Se conservó la misma sesión; cookie HttpOnly, Path `/api/cart`; navegación y recarga conservaron contador 2, almacenado como `"2"` en localStorage. No se imprimen los valores de cookie.

La revisión original de [acabado](final-review.md) permanece como evidencia histórica; esta comprobación posterior resuelve la limitación detectada de sesión entre sitios. Brave y Zen no se han automatizado directamente; la sesión del mismo origen se ha comprobado en Chromium.
