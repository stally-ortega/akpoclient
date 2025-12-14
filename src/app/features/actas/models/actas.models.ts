/**
 * Type of acta (minute/record)
 */
export type TipoActa = 'ASIGNACION' | 'DEVOLUCION';

/**
 * Status of an acta
 */
export type EstadoActa = 'PENDIENTE' | 'APROBADA' | 'APROBADA_AUTOMATICO' | 'APROBADA_MANUAL' | 'RECHAZADA';

/**
 * Equipment item for acta
 */
export interface EquipoActa {
  serial: string;
  proyecto?: string;
  descripcion?: string;
  estado?: 'VALIDO' | 'INVALIDO' | 'PENDIENTE';
  error?: string;
}

/**
 * Peripherals configuration
 */
export interface Perifericos {
  teclado: boolean;
  mouse: boolean;
  basePortatil: boolean;
  diadema?: {
    incluido: boolean;
    serial?: string;
  };
}

/**
 * Request to create a new acta
 */
export interface CrearActaRequest {
  tipoActa: TipoActa;
  usuarioDestino: string;
  equipos: EquipoActa[];
  perifericos: Perifericos;
  ticket?: number;
}

/**
 * Response from creating an acta
 */
export interface CrearActaResponse {
  id: string;
  message: string;
  pdfUrl?: string;
}

/**
 * Request to approve an acta via PDF upload
 */
export interface AprobarPdfResponse {
  status: 'APROBADA_AUTO' | 'REQUIERE_MANUAL' | 'NO_ENCONTRADA';
  message: string;
  actaId?: string;
}

/**
 * Pending acta item
 */
export interface ActaPendiente {
  id: string;
  fecha: string;
  usuarioSolicitante: string;
  tipoActa: TipoActa;
  seriales: string[];
  estado: 'PENDIENTE';
  pdfTemporal?: string;
}

/**
 * Historical acta item
 */
export interface ActaHistorico {
  id: string;
  fecha: string;
  tipoActa: TipoActa;
  usuarioDestino: string;
  estado: EstadoActa;
  seriales: string[];
  pdfUrl?: string;
  usuarioSolicitante?: string;
}

/**
 * Filters for historical actas
 */
export interface FiltrosHistorico {
  desde?: string;
  hasta?: string;
  tipo?: TipoActa;
  estado?: EstadoActa;
  usuario?: string;
}

/**
 * Response from manual approval
 */
export interface AprobarManualResponse {
  success: boolean;
  message: string;
  pdfUrl?: string;
}
