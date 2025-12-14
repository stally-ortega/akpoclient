export interface ItemPrestamo {
  id: string; // Serial for equipment, or unique ID for generic
  nombre: string;
  esActivo: boolean; // Si es un activo fijo (serializado)
  serial?: string;
  categoria: 'EQUIPO' | 'PERIFERICO' | 'OTRO';
}

export interface Prestamo {
  id: string;
  usuarioSolicitante: string;
  items: ItemPrestamo[];
  fechaPrestamo: Date;
  fechaDevolucionEstimada?: Date;
  fechaDevolucionReal?: Date;
  estado: 'ACTIVO' | 'FINALIZADO';
  observaciones?: string;
}
