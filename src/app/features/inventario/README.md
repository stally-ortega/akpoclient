# Inventario Module

## Overview
The **Inventario** module manages the lifecycle of equipment (Laptops, Desktops, Peripherals) within the organization. It handles registration, assignment, and historical tracking of assets.

## Architecture

### Components
- **ConsultaEquiposComponent** (`/pages/consulta-equipos`): Smart container acting as the main dashboard. Orchestrates filtering and data fetching.
- **TablaInventarioComponent**: Dumb component for rendering the equipment grid. Uses `OnPush` strategy.
- **FiltrosInventarioComponent**: Dumb component handling search and filter inputs. Use two-way binding with `ngModel`.
- **DetalleEquipoComponent**: Modal component displaying deep details and assignment history.

### state Management
- Uses **RxJS** for search debouncing and API calls.
- Uses **Angular Signals** in the Service layer for reactive state updates where applicable.
- All components use `ChangeDetectionStrategy.OnPush` for performance.

## Key Services
### `InventarioService`
- **`getEquipos(filtros)`**: Fetches paginated/filtered list.
- **`getHistorial(serial)`**: Retrieves assignment history.
- **`getDetalle(serial)`**: Retrieves full asset details.

## Dependencies
- `@core`: Uses `ApiService` for HTTP requests.
- `@shared`: Uses `Sidebar`, `Header` and UI tokens.
