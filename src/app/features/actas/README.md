# Actas Module

## Overview
The **Actas** module manages the creation, approval, and tracking of "Actas de Entrega" (Handover Records) and "Devolución" (Return Records). It allows generating PDFs, digital signatures, and historical tracking.

## Architecture

### Components
- **DashboardComponent** (`/pages/dashboard`): Smart container serving as the main entry point. Displays Pending/Historical records.
- **CrearActaComponent** (`/pages/crear-acta`): Form-heavy component for creating new records. Integration with `TablaEquipos`.
- **AprobarPdfComponent** (`/pages/aprobar-pdf`): Handles PDF upload for external approval workflows.
- **TablaEquiposComponent**: Smart/Dumb hybrid handling the `FormArray` of equipment items in an act.
- **TablaPendientesComponent**: Dumb component (OnPush) for pending list.
- **TablaHistoricoComponent**: Dumb component (OnPush) for history list.

## flow
1.  **Creation**: User fills `CrearActa` form -> `ActasService.crearActa()` -> Backend generates PDF.
2.  **Approval**: User signs manually or uploads signed PDF via `AprobarPdf`.
3.  **Tracking**: `Dashboard` polls for status changes or shows history.

## Key Services
### `ActasService`
- **`crearActa(request)`**: POST to generate new record.
- **`aprobarPdf(file)`**: Uploads signed PDF.
- **`listarPendientes()`**: GET pending actions.
- **`listarHistorico(filters)`**: GET searchable history.
- **`validarSerial(serial)`**: Helper to check equipment availability.

## Dependencies
- `@core`: `ApiService` for backend communication.
- `@shared`: Common UI elements.
- `ngx-toastr`: Notifications.
