export interface FieldDefinition {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  options?: string[]; // For enums
}

export const PRESTAMOS_FIELDS: FieldDefinition[] = [
  { key: 'usuarioSolicitante', label: 'Usuario Solicitante', type: 'string' },
  { key: 'estado', label: 'Estado', type: 'string', options: ['ACTIVO', 'FINALIZADO'] },
  { key: 'fechaPrestamo', label: 'Fecha Préstamo', type: 'date' },
  { key: 'observaciones', label: 'Observaciones', type: 'string' },
  // Aggregates (calculated) can still be here if we want mixing, 
  // but for "Interface" request, we prioritize row-level fields.
];

export const INVENTARIO_FIELDS: FieldDefinition[] = [
  { key: 'serial', label: 'Serial', type: 'string' },
  { key: 'tipo', label: 'Tipo Equipo', type: 'string' },
  { key: 'marca', label: 'Marca', type: 'string' },
  { key: 'modelo', label: 'Modelo', type: 'string' },
  { key: 'proyecto', label: 'Proyecto', type: 'string' },
  { key: 'usuarioAsignado', label: 'Usuario Asignado', type: 'string' },
  { key: 'estado', label: 'Estado', type: 'string', options: ['DISPONIBLE', 'ASIGNADO', 'REPARACION', 'BAJA'] },
  { key: 'fechaAsignacion', label: 'Fecha Asignación', type: 'date' }
];

export const ACTAS_FIELDS: FieldDefinition[] = [
  { key: 'usuarioSolicitante', label: 'Usuario Solicitante', type: 'string' },
  { key: 'tipoActa', label: 'Tipo Acta', type: 'string', options: ['ASIGNACION', 'DEVOLUCION'] },
  { key: 'estado', label: 'Estado', type: 'string', options: ['PENDIENTE', 'APROBADA'] },
  { key: 'fecha', label: 'Fecha Creación', type: 'date' }
];
