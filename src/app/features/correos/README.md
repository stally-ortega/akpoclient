# Módulo de Envío de Correos

## Descripción General
El módulo de Correos permite la carga masiva de archivos (Excel/CSV) para procesar el envío de correos electrónicos corporativos, como credenciales o notificaciones de bienvenida. Proporciona retroalimentación visual del progreso y un reporte detallado de los resultados.

## Arquitectura

### Servicios
- **CorreosService**: Gestiona la carga de archivos, monitorea el progreso mediante polling y mantiene el estado del proceso (progreso, resultados, errores).

### Componentes
- **CorreosPageComponent**: Orquestador principal que coordina los subcomponentes.
- **UploadFormComponent**: Formulario para la carga de archivos con soporte "drag & drop". Permite configurar el modo de envío (Completo vs Parcial).
- **ProcessingStatusComponent**: Visualiza el progreso del envío en tiempo real.
- **ResultsTableComponent**: Muestra los resultados detallados (éxito/error) por usuario y permite la descarga de reportes.

## Características Clave
- **Carga Masiva**: Soporte para archivos `.xlsx` y `.csv`.
- **Feedback en Tiempo Real**: Barra de progreso y mensajes de estado dinámicos.
- **Manejo de Errores**: Identificación visual de envíos fallidos en la tabla de resultados.
- **Optimización**: Renderizado optimizado utilizando `ChangeDetectionStrategy.OnPush`.

## Flujo de Uso
1. El usuario arrastra un archivo al `UploadFormComponent`.
2. Selecciona las opciones de configuración (Modo, Tipo de Credenciales).
3. `CorreosService` inicia la carga (`startProcess`).
4. La interfaz muestra `ProcessingStatusComponent` y comienza el polling de resultados (`pollResults`).
5. Al finalizar, se despliega la tabla de resultados en `ResultsTableComponent`.
