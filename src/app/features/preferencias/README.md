# Módulo de Preferencias

## Descripción General
Este módulo centraliza la configuración personal del usuario y la gestión de variables globales del sistema (para uso en el motor de alertas y reglas). Permite a cada usuario adaptar la interfaz (tema) y definir constantes reutilizables.

## Arquitectura

### Servicios
- **PreferenciasService**: Gestiona el estado de las preferencias (tema claro/oscuro) y las variables de usuario.
    - **Persistencia Híbrida**: 
        - **Producción**: Se conecta a una API REST (`/preferences`) para guardar y cargar configuraciones en base de datos.
        - **Desarrollo/Offline**: Soporta un modo Mock (configurable en `environment.useMocks`) que usa `localStorage` para simular la persistencia.
    - Expone señales reactivas (`userVariables`, `theme`) para que la UI se actualice automáticamente.

### Componentes
- **PreferenciasPageComponent**: Interfaz de usuario para:
    - Cambiar el tema de la aplicación (Claro/Oscuro).
    - Crear, editar y eliminar variables personalizadas (Clave/Valor/Tipo).
    - Exportar e importar configuraciones (JSON) para portabilidad entre dispositivos.

### Modelos
- **UserVariable**: Define la estructura de una variable personalizada (`key`, `value`, `type`, `userId`).

## Características Clave
- **Variables Dinámicas**: Las variables creadas aquí (ej: `LIMITE_PRESTAMOS`) pueden ser referenciadas por el módulo de Alertas para crear reglas flexibles.
- **Persistencia Local**: El tema y las variables se guardan localmente, restaurándose al iniciar sesión.
- **Portabilidad**: Funcionalidad de exportación/importación JSON para compartir configuraciones o realizar copias de seguridad.
- **Reactividad**: Utiliza Angular Signals para un manejo de estado eficiente y libre de efectos secundarios indeseados.

## Uso Técnico
- **Resolución de Valores**: `PreferenciasService.resolveValue()` es utilizado por `RuleEvaluatorService` para inyectar valores dinámicos en las condiciones de las alertas en tiempo de ejecución.
