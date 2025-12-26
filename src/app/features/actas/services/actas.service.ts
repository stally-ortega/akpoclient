import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, tap } from 'rxjs';
import { environment } from '@environments/environment';
import {
  CrearActaRequest,
  CrearActaResponse,
  AprobarPdfResponse,
  ActaPendiente,
  ActaHistorico,
  FiltrosHistorico,
  AprobarManualResponse
} from '../models';

/**
 * Service for managing actas (minutes/records).
 * Handles all API communication with n8n backend.
 */
@Injectable({
  providedIn: 'root'
})
export class ActasService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.baseUrl;

  // Signals for state management
  private _isProcessing = signal<boolean>(false);
  public isProcessing = this._isProcessing.asReadonly();

  /**
   * Creates a new acta request.
   * @param request The acta creation request data.
   * @returns Observable of the server response.
   */
  crearActa(request: CrearActaRequest): Observable<CrearActaResponse> {
    this._isProcessing.set(true);

    if (environment.useMocks) {
      const mockResponse: CrearActaResponse = {
        id: 'acta-' + Date.now(),
        message: 'Acta creada exitosamente (MOCK)',
        pdfUrl: '/assets/mock-acta.pdf'
      };
      return of(mockResponse).pipe(delay(1500));
    }

    return this.http.post<CrearActaResponse>(`${this.API_URL}/form-solicitud`, request);
  }

  /**
   * Uploads a PDF for acta approval.
   * @param file The PDF file to upload.
   * @returns Observable of the approval response.
   */
  aprobarPdf(file: File): Observable<AprobarPdfResponse> {
    if (environment.useMocks) {
      const mockResponse: AprobarPdfResponse = {
        status: 'APROBADA_AUTO',
        message: 'Acta aprobada automáticamente (MOCK)',
        actaId: 'acta-' + Date.now()
      };
      return of(mockResponse).pipe(delay(2000));
    }

    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<AprobarPdfResponse>(`${this.API_URL}/aprobar-acta`, formData);
  }

  /**
   * Retrieves list of pending actas.
   * @returns Observable of pending actas array.
   */
  listarPendientes(): Observable<ActaPendiente[]> {
    if (environment.useMocks) {
      const mockData: ActaPendiente[] = [
        {
          id: 'pend-1',
          fecha: new Date().toISOString(),
          usuarioSolicitante: 'admin@akpo.com',
          tipoActa: 'ASIGNACION',
          seriales: ['SN12345', 'SN67890'],
          estado: 'PENDIENTE',
          pdfTemporal: '/assets/mock-temp.pdf'
        },
        {
          id: 'pend-2',
          fecha: new Date(Date.now() - 86400000).toISOString(),
          usuarioSolicitante: 'user@akpo.com',
          tipoActa: 'DEVOLUCION',
          seriales: ['SN11111'],
          estado: 'PENDIENTE'
        }
      ];
      return of(mockData).pipe(delay(800));
    }

    return this.http.get<ActaPendiente[]>(`${this.API_URL}/listar-pendientes`);
  }

  /**
   * Manually approves a pending acta.
   * @param id The acta ID to approve.
   * @returns Observable of the approval response.
   */
  aprobarManual(id: string): Observable<AprobarManualResponse> {
    if (environment.useMocks) {
      const mockResponse: AprobarManualResponse = {
        success: true,
        message: 'Acta aprobada manualmente (MOCK)',
        pdfUrl: '/assets/mock-approved.pdf'
      };
      return of(mockResponse).pipe(delay(1000));
    }

    return this.http.post<AprobarManualResponse>(`${this.API_URL}/aprobar-manual`, { id });
  }

  /**
   * Retrieves historical actas with optional filters.
   * @param filtros Optional filters for the query.
   * @returns Observable of historical actas array.
   */
  listarHistorico(filtros?: FiltrosHistorico): Observable<ActaHistorico[]> {
    if (environment.useMocks) {
      const mockData: ActaHistorico[] = [
        {
          id: 'hist-1',
          fecha: new Date(Date.now() - 172800000).toISOString(),
          tipoActa: 'ASIGNACION',
          usuarioDestino: 'juan.perez',
          estado: 'APROBADA_AUTOMATICO',
          seriales: ['SN99999'],
          pdfUrl: '/assets/mock-hist1.pdf'
        },
        {
          id: 'hist-2',
          fecha: new Date(Date.now() - 259200000).toISOString(),
          tipoActa: 'DEVOLUCION',
          usuarioDestino: 'maria.garcia',
          estado: 'APROBADA_MANUAL',
          seriales: ['SN88888', 'SN77777'],
          pdfUrl: '/assets/mock-hist2.pdf'
        }
      ];
      return of(mockData).pipe(delay(800));
    }

    let params = new HttpParams();
    if (filtros) {
      if (filtros.desde) params = params.set('desde', filtros.desde);
      if (filtros.hasta) params = params.set('hasta', filtros.hasta);
      if (filtros.tipo) params = params.set('tipo', filtros.tipo);
      if (filtros.estado) params = params.set('estado', filtros.estado);
      if (filtros.usuario) params = params.set('usuario', filtros.usuario);
    }

    return this.http.get<ActaHistorico[]>(`${this.API_URL}/listar-historico`, { params });
  }

  /**
   * Validates a serial number against the backend.
   * @param serial The serial number to validate.
   * @returns Observable indicating if the serial is valid.
   */
  validarSerial(serial: string): Observable<{ valido: boolean; descripcion?: string; error?: string }> {
    if (environment.useMocks) {
      const isValid = serial.length >= 5;
      return of({
        valido: isValid,
        descripcion: isValid ? 'Laptop Dell Latitude 5420' : undefined,
        error: isValid ? undefined : 'Serial no encontrado'
      }).pipe(delay(500));
    }

    return this.http.post<{ valido: boolean; descripcion?: string; error?: string }>(
      `${this.API_URL}/validar-serial`,
      { serial }
    );
  }

  /**
   * Validates a domain username against Active Directory.
   * @param username The username to validate.
   * @returns Observable indicating if the user exists.
   */
  validarUsuario(username: string): Observable<{ valido: boolean; nombreCompleto?: string; error?: string }> {
    if (environment.useMocks) {
      const isValid = username.includes('.');
      return of({
        valido: isValid,
        nombreCompleto: isValid ? 'Usuario de Prueba' : undefined,
        error: isValid ? undefined : 'Usuario no encontrado en AD'
      }).pipe(delay(500));
    }

    return this.http.post<{ valido: boolean; nombreCompleto?: string; error?: string }>(
      `${this.API_URL}/validar-usuario`,
      { username }
    );
  }
}
