# Módulo de Préstamos

## Descripción General
El módulo de Préstamos gestiona el ciclo de vida de los préstamos de equipos y periféricos dentro de la aplicación. Permite registrar nuevos préstamos, visualizar el detalle de los préstamos activos e históricos, y exportar reportes.

## Arquitectura

### Componentes Principales
- **PrestamosPageComponent**: Página principal que orquesta la vista de los préstamos.
- **FormularioPrestamoComponent**: Modal para el registro de nuevos préstamos.
- **DetallePrestamoComponent**: Modal para visualizar los detalles de un préstamo y permitir su finalización.

### Servicios
- **PrestamosService**: Gestiona la lógica de negocio, incluyendo la comunicación con la API (o Mocks), el manejo del estado mediante Signals, y la generación de reportes en Excel.

### Modelos
- **Prestamo**: Interface que define la estructura de un préstamo.
- **ItemPrestamo**: Interface que define los ítems individuales dentro de un préstamo.

## Características Clave
- **Registro de Préstamos**: Validación de usuarios y items (activos vs periféricos).
- **Gestión de Estado**: Uso de Angular Signals para un manejo reactivo del estado de la lista de préstamos.
- **Exportación**: Capacidad de exportar el listado de préstamos a Excel.
- **Optimización**: Uso de `ChangeDetectionStrategy.OnPush` para mejorar el rendimiento.

## Flujo de Datos
1. La página principal (`PrestamosPageComponent`) se suscribe a los signals del servicio.
2. Al registrar un préstamo, `FormularioPrestamoComponent` invoca `PrestamosService.registrarPrestamo`.
3. Al finalizar un préstamo, `DetallePrestamoComponent` invoca `PrestamosService.finalizarPrestamo`.
4. El servicio actualiza su signal interno, propagando los cambios automáticamente a la vista.
