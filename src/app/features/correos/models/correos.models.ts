export interface CorreosRequest {
  file: File;
  mode: 'completo' | 'parcial';
  credentialsType: 'todas' | 'solo_correo';
}

export interface CorreosResult {
  id: string;
  usuario: string;
  estado: 'exito' | 'error';
  mensaje: string;
  timestamp: Date;
}

export interface CorreosResponse {
  processId: string;
  message: string;
}
