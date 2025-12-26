export interface Catalogo {
  id: number;
  nombre: string;
}

export interface Ubicacion extends Catalogo {
  tipo: 'oficina' | 'bodega' | 'home_office' | 'cliente';
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

export interface Proyecto extends Catalogo {
  cliente?: string;
  codigo?: string;
}

export interface UsuarioAd {
  id?: string; // Optional backend ID
  usuarioAd: string; // email/UPN: luis.zarate@akpo.co
  nombre: string;
  cargo?: string;
  departamento?: string;
}

export interface Activo {
  serial: string;           // PK, único (e.g. "PW0DSVNB")
  
  // Normalized References
  tipo: Catalogo;           // { id: 1, nombre: 'Portátil' }
  marca: Catalogo;          // { id: 2, nombre: 'LENOVO' }
  modelo?: Catalogo;        // { id: 15, nombre: 'THINKBOOK 14 Gen 6' }
  
  // Location & Assignment
  ubicacion: Ubicacion;
  proyecto?: Proyecto;      // Can be null if in warehouse
  usuarioAsignado?: UsuarioAd;
  
  // State
  estado: 'Activo' | 'Funcional inactivo' | 'Dañado' | 'Robado' | 'Baja';
  
  // Metadata
  fechaCompra?: string; // ISO Date
  garantiaExpiracion?: string; // ISO Date
  
  // Flexible attributes (legacy support or extras)
  accesorios?: {
    teclado?: boolean;
    mouse?: boolean;
    base?: boolean;
    [key: string]: any;
  };
}
