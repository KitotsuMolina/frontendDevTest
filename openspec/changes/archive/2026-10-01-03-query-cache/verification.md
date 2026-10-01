# Verificación de caché

30 de septiembre de 2026.

- 44 pruebas pasan en 5 archivos, sin depender de API pública.
- Reloj controlado: justo antes, exactamente a 3 600 000 ms y después; TTL desde respuesta, sin renovación al leer.
- Recreación de la capa conserva las respuestas mediante localStorage; listado vacío válido se reutiliza.
- Claves de listado y dos IDs independientes. JSON/timestamps/contratos corruptos se ignoran.
- Lectura bloqueada y escritura con fallo no impiden consultas normales.
- Consultas simultáneas comparten resultado/error; el fallo libera la clave y permite reintento.
- Una renovación fallida conserva físicamente la entrada antigua pero nunca la muestra; éxito posterior la reemplaza.
- Cancelar un consumidor no interrumpe a otro; abandonar el listado cancela transporte si no quedan consumidores.
- Chromium con API real: 100 productos y una petición inicial; recarga y retorno desde detalle mantienen una petición total y almacenamiento idéntico. Caducidad forzada de una hora con TTL válido provoca segunda petición y renovación.
- pnpm test, pnpm lint, pnpm build y pnpm spec:validate correctos; 7 cambios OpenSpec válidos.

No se añade GET de detalle ni POST de carrito. No se archiva el cambio automáticamente.
