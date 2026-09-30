# Spec Delta

## Purpose
Definir el comportamiento observable del hito caché para cumplir la prueba frontend Nunegal/ITX de forma verificable.

## ADDED Requirements

### Requirement: Consultas cacheadas una hora
Las respuestas GET de listado y detalle SHALL almacenarse en cliente con claves independientes y una caducidad absoluta de 3 600 000 ms desde su obtención.

#### Scenario: Reutilización antes de caducar
- **WHEN** se repite una consulta con una entrada menor de una hora
- **THEN** se devuelve la entrada sin nueva petición HTTP.

### Requirement: Revalidación al caducar
Al alcanzar una hora o no disponer de entrada válida, la siguiente consulta SHALL recuperar información actualizada desde API; los errores SHALL permitir reintento sin almacenarse como éxito. POST SHALL quedar fuera de la caché.

#### Scenario: Expiración y recuperación
- **WHEN** se solicita una entrada de una hora o más
- **THEN** se realiza nueva petición y solo un resultado correcto renueva datos y timestamp.
