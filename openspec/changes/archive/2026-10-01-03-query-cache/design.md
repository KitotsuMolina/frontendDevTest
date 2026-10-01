# Design

## Context
Listado completado. Implementación autorizada con localStorage por petición explícita del usuario, sustituyendo la propuesta inicial en memoria. Fuente R14.

## Decisions
- TTL absoluto de 3 600 000 ms desde la obtención y validación de la respuesta. Sobre {obtainedAt, expiresAt, data}; leer nunca escribe ni renueva.
- Claves versionadas independientes nunegal:query:v1:products y nunegal:query:v1:product:<id codificado>. Se prepara la capa genérica; no se implementa GET de detalle.
- Lectura defensiva: JSON, timestamps finitos, TTL exacto, fecha no futura y contrato validado. Al alcanzar expiresAt se trata como ausencia; no se ofrecen datos viejos.
- Escritura únicamente tras éxito validado. Errores de localStorage se ignoran para permitir el resultado normal de la consulta; no hay caché adicional de resultados en memoria.
- Map solo de solicitudes pendientes por clave. Los consumidores comparten transporte; cada uno puede cancelar su espera. Si no queda ninguno, se aborta en microtarea, permitiendo la resuscripción de StrictMode sin duplicar solicitudes. finally libera las solicitudes incluso tras error.
- Solo getProducts usa la capa. No existe integración con POST ni nueva consulta de detalle.

## Verification
Reloj controlado para antes, en y después de la hora, lectura sin renovación, recreación de capa, claves independientes, vacío válido, corrupción, almacenamiento bloqueado/lleno, deduplicación, cancelación y reintento. Chromium confirma persistencia entre recarga/navegación y renovación tras modificar una caducidad sin esperar una hora real.
