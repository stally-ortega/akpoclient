export interface AccesoriosEquipo {
  teclado: boolean;
  mouse: boolean;
  base: boolean;
  diadema?: string; // Serial si existe
}

export type EstadoEquipo = 'DISPONIBLE' | 'ALMACEN' | 'ASIGNADO' | 'REPARACION' | 'BAJA';

export interface EquipoInventario {
  serial: string;
  tipo: string;
  marca: string;
  modelo: string;
  proyecto?: string;
  usuarioAsignado?: string;
  estado: EstadoEquipo;
  accesorios: AccesoriosEquipo;
  fechaAsignacion?: Date; // Changed to Date for consistency
  ubicacion?: string;
}

export interface FiltrosInventario {
  proyecto?: string;
  estado?: EstadoEquipo | '';
  busqueda?: string;
}

export interface HistorialAsignacion {
  id: string;
  serial: string;
  usuario: string;
  fechaInicio: Date;
  fechaFin?: Date;
  generadoPor: string;
  proyecto: string;
}
