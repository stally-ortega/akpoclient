import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile, map, catchError, of, delay } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CorreosRequest, CorreosResponse, CorreosResult } from '../models/correos.models';

/**
 * Service for managing bulk email processes.
 * Handles file uploads, progress polling, and result tracking.
 */
@Injectable({
  providedIn: 'root'
})
export class CorreosService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.baseUrl;

  // Signals
  private _results = signal<CorreosResult[]>([]);
  private _isProcessing = signal<boolean>(false);
  private _currentStatus = signal<string>(''); // Description of current status
  private _progress = signal<number>(0);

  public results = this._results.asReadonly();
  public isProcessing = this._isProcessing.asReadonly();
  public currentStatus = this._currentStatus.asReadonly();
  public progress = this._progress.asReadonly();

  /**
   * Starts a new bulk email process by uploading a file.
   * @param request The upload request containing the file and configuration.
   * @returns Observable of the server response including the process ID.
   */
  startProcess(request: CorreosRequest): Observable<CorreosResponse> {
    this._isProcessing.set(true);
    this._progress.set(0);
    this._results.set([]);
    this._currentStatus.set('Iniciando carga de archivo...');

    if (environment.useMocks) {
      return of({
        processId: 'mock-process-' + Date.now(),
        message: 'Mock upload successful'
      }).pipe(delay(1500));
    }

    const formData = new FormData();
    formData.append('archivo', request.file);
    // Add other fields if needed

    return this.http.post<CorreosResponse>(`${this.API_URL}/correos/upload`, formData);
  }

  /**
   * Polls the server for processing results.
   * Updates progress signals automatically.
   * @param processId The ID of the process to monitor.
   * @returns Observable of the current results list.
   */
  pollResults(processId: string): Observable<CorreosResult[]> {
    return interval(2000).pipe(
      map(i => {
        const prog = Math.min((i + 1) * 20, 100);
        this._progress.set(prog);
        this._currentStatus.set(`Procesando envíos... ${prog}%`);
        
        // Mock results
        const newResults: CorreosResult[] = [
          {
            id: crypto.randomUUID(),
            usuario: `Usuario ${i + 1}`,
            estado: Math.random() > 0.8 ? 'error' : 'exito',
            mensaje: Math.random() > 0.8 ? 'Error al enviar' : 'Enviado correctamente',
            timestamp: new Date()
          }
        ];
        
        this._results.update(current => [...current, ...newResults]);
        
        if (prog >= 100) {
          this._isProcessing.set(false);
          this._currentStatus.set('Proceso completado');
        }
        
        return this._results();
      }),
      takeWhile(() => this._isProcessing())
    );
  }
}
