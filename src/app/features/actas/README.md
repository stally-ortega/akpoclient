# Módulo de Actas

Módulo completo para la gestión de actas de asignación y devolución de equipos.

## Estructura

```
src/app/features/actas/
├── models/
│   └── actas.models.ts          # Interfaces y tipos
├── services/
│   └── actas.service.ts         # Servicio con integración API
├── pages/
│   ├── crear-acta/              # Formulario de creación
│   ├── aprobar-pdf/             # Subida de PDF
│   └── dashboard/               # Vista principal
├── components/
│   ├── tabla-equipos.component.ts
│   ├── tabla-pendientes.component.ts
│   └── tabla-historico.component.ts
└── actas.routes.ts
```

## Rutas

- `/actas` - Dashboard principal
- `/actas/crear` - Crear nueva acta
- `/actas/aprobar` - Aprobar con PDF

## Funcionalidades

### 1. Crear Acta
- Formulario con validación en tiempo real
- Tabla dinámica de equipos
- Validación de seriales contra API
- Validación de usuarios en AD
- Selección de periféricos
- Campo opcional de ticket

### 2. Aprobar PDF
- Drag & drop de archivos PDF
- Validación de tipo de archivo
- Aprobación automática o manual

### 3. Dashboard
- Tab de solicitudes pendientes
- Tab de histórico
- Exportación a Excel
- Aprobación manual desde tabla

## Modo Mock

El módulo respeta la configuración `environment.useMocks`:
- `true`: Usa datos simulados
- `false`: Conecta con n8n API

## API Endpoints (n8n)

- `POST /webhook/form-solicitud` - Crear acta
- `POST /webhook/aprobar-acta` - Aprobar PDF
- `GET /webhook/listar-pendientes` - Listar pendientes
- `POST /webhook/aprobar-manual` - Aprobar manual
- `GET /webhook/listar-historico` - Histórico
- `POST /webhook/validar-serial` - Validar equipo
- `POST /webhook/validar-usuario` - Validar usuario AD
