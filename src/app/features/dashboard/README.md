# Módulo Dashboard

## Descripción General
El Dashboard es el panel principal de control de la aplicación, proporcionando una visión general del estado del sistema en una sola pantalla. Agrega métricas clave de los módulos de Inventario, Actas, Correos y Préstamos.

## Arquitectura

### Servicios
- **DashboardService**: Se encarga de la comunicación con el backend para obtener el objeto `DashboardStats`. Realiza la agregación y transformación de datos necesarios para la vista.

### Componentes
- **DashboardComponent**: Componente de presentación que renderiza las tarjetas de estadísticas. Utiliza una estrategia `OnPush` para minimizar detecciones de cambios innecesarias.

### Modelos
- **DashboardStats**: Interfaz que define la estructura del payload de estadísticas (InventoryStats, ActasStats, CorreosStats, PrestamosStats).

## Características Clave
- **Navegación Rápida**: Las tarjetas funcionan como accesos directos a sus respectivos módulos, soportando deep linking (ej: ir a inventario con filtro "DISPONIBLE" pre-aplicado).
- **Métricas Agregadas**:
    - **Inventario**: Equipos totales, disponibles, en almacén y reparación.
    - **Actas**: Pendientes de aprobación y errores.
    - **Correos**: Envíos del día y errores recientes.
    - **Préstamos**: Activos, vencidos, y movimientos diarios.

## Optimización
- El componente principal actualiza su vista únicamente cuando el signal `stats` recibe nuevos datos del servicio, gracias a la estrategia `OnPush`.
