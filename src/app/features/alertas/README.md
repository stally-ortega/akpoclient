# Módulo de Alertas (Motor de Reglas)

## Descripción General
El módulo de Alertas funciona como un motor de reglas dinámico que permite a los usuarios (y al sistema) configurar condiciones lógicas que monitorean el estado de los módulos de la aplicación (Préstamos, Inventario, Actas). Cuando se cumplen las condiciones, el sistema emite notificaciones.

## Arquitectura

### Motor de Reglas (`RuleEvaluatorService`)
El corazón del módulo es el `RuleEvaluatorService`, capaz de evaluar estructuras lógicas anidadas (AND/OR) contra contextos de datos arbitrarios.
- **Soporta**: Operadores de comparación (GT, LT, EQ, NEQ, CONTAINS) y grupos lógicos recursivos.
- **Modos**: Evaluación escalar (objeto individual) y evaluación de colecciones (arrays).

### Servicios
- **AlertasService**: Orquesta el ciclo de vida de las alertas. Mantiene el estado, carga configuraciones y ejecuta el ciclo de monitoreo (actualmente cada 60 segundos).
- **RuleEvaluatorService**: Servicio puro de utilidad para la evaluación lógica.

### Componentes
- **AlertasPageComponent**: Panel de control para visualizar y gestionar alertas activas.
- **FormularioAlertaComponent**: Editor visual para crear y modificar alertas.
- **RuleBuilderComponent**: Componente recursivo que permite construir visualmente el árbol de reglas lógicas.

## Características Clave
- **Alertas Globales vs Privadas**: El sistema soporta alertas para todos los usuarios (system) y alertas personalizadas por usuario.
- **Validación Cuantitativa**: Permite configurar triggers basados en conteo (ej: "Avisar si hay más de 5 préstamos vencidos").
- **Integración Transversal**: Se conecta con los servicios de Préstamos, Inventario y Actas para obtener datos en tiempo real.
- **Optimización**: Componentes configurados con `ChangeDetectionStrategy.OnPush`.

## Flujo de Ejecución (Monitoreo)
1. `AlertasService` inicia un intervalo de monitoreo.
2. Cada minuto, verifica si la hora actual coincide con la `horaInicio` de alguna alerta activa.
3. Si coincide, selecciona el contexto de datos adecuado (ej: lista de préstamos).
4. Invoca a `RuleEvaluatorService` para encontrar coincidencias.
5. Verifica las condiciones de disparo (Trigger Condition).
6. Si aplica, emite una notificación visual (`Toastr`).
