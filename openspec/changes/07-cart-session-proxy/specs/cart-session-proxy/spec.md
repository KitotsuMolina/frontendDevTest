# Spec Delta

## Purpose
Conservar la sesión remota de cesta por navegador mediante un endpoint del mismo origen, evitando el bloqueo de cookies entre sitios y manteniendo el contrato del enunciado.

## ADDED Requirements

### Requirement: Sesión de cesta del mismo origen
La aplicación SHALL enviar POST /api/cart a su propio origen. En desarrollo y preview, esa ruta SHALL reenviarse al servicio del enunciado, conservar la cookie de sesión por navegador y mantener exactamente el cuerpo y respuesta del POST. El proxy no SHALL compartir una cookie global ni cachear o repetir automáticamente las mutaciones.

#### Scenario: Dos productos en la misma cesta
- **WHEN** un navegador añade dos productos válidos con los códigos de almacenamiento de cada producto
- **THEN** ambas peticiones usan la misma sesión y el contador muestra los valores acumulados devueltos por el servidor.

#### Scenario: Navegadores independientes
- **WHEN** dos contextos de navegador añaden productos
- **THEN** cada uno mantiene su propia sesión y ninguna cesta acumula operaciones del otro.

#### Scenario: Recarga y error
- **WHEN** se navega o recarga entre altas, o falla una petición
- **THEN** la sesión válida se conserva, el contador usa count exacto y un fallo requiere reintento manual sin modificar el valor previo.

### Requirement: Alojamiento con proxy equivalente
La documentación SHALL distinguir el proxy de desarrollo/preview del alojamiento de producción y describir un proxy del mismo origen para /api/cart que reenvíe cookies individuales, Set-Cookie, cuerpo y respuesta al destino fijo de la API. Los archivos estáticos por sí solos no SHALL presentarse como solución de sesión en producción.

#### Scenario: Preparación de alojamiento
- **WHEN** se consulta cómo servir dist en producción
- **THEN** se documenta el fallback SPA y el proxy de cesta necesario, sin realizar un despliegue en este cambio.
