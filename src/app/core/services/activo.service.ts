import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Activo, UsuarioAd, Catalogo, Proyecto, Ubicacion, HistorialAsignacion } from '../models/domain/activo.model';
import { MOCK_ACTIVOS, USERS_AD, MARCAS, TIPOS, UBICACIONES, PROYECTOS } from '../mocks/backend-normalizado.mock';

@Injectable({
  providedIn: 'root'
})
export class ActivoService {
  private http = inject(HttpClient);
  // private baseUrl = environment.apiUrl; // Future use

  // --- ACTIVO METHODS ---

  /**
   * Search for assets with server-side filtering simulation.
   */
  getActivos(params?: { search?: string; estado?: string; limit?: number }): Observable<Activo[]> {
    // SIMULATION: In a real app, this would be:
    // return this.http.get<Activo[]>(`${this.baseUrl}/activos`, { params });

    let results = [...MOCK_ACTIVOS];

    if (params?.search) {
      const q = params.search.toLowerCase();
      results = results.filter(a => 
        a.serial.toLowerCase().includes(q) || 
        a.modelo?.nombre.toLowerCase().includes(q) ||
        a.usuarioAsignado?.nombre.toLowerCase().includes(q)
      );
    }

    if (params?.estado) {
      results = results.filter(a => a.estado === params.estado);
    }

    // Simulate network delay
    return of(results).pipe(delay(500));
  }

  getActivoBySerial(serial: string): Observable<Activo | undefined> {
    const asset = MOCK_ACTIVOS.find(a => a.serial === serial);
    return of(asset).pipe(delay(300));
  }

  // --- CATALOG METHODS ---

  // These would usually be cached signals or simple GETs

  getMarcas(): Observable<Catalogo[]> {
    return of(MARCAS).pipe(delay(200));
  }

  getTipos(): Observable<Catalogo[]> {
    return of(TIPOS).pipe(delay(200));
  }

  getUbicaciones(): Observable<Ubicacion[]> {
    return of(UBICACIONES).pipe(delay(200));
  }

  getProyectos(): Observable<Proyecto[]> {
    return of(PROYECTOS).pipe(delay(200));
  }

  // --- AD USER METHODS ---

  /**
   * Semantic search for AD Users.
   * e.g. GET /api/users-ad?q=luis
   */
  searchUsuariosAd(query: string): Observable<UsuarioAd[]> {
    if (!query || query.length < 2) return of([]);

    const q = query.toLowerCase();
    const matches = USERS_AD.filter(u => 
      u.nombre.toLowerCase().includes(q) || 
      u.usuarioAd.toLowerCase().includes(q)
    );
    return of(matches).pipe(delay(400));
  }

  /**
   * Retrieves the partial assignment history for an asset.
   */
  getHistorial(serial: string, fechaInicio?: Date, fechaFin?: Date): Observable<HistorialAsignacion[]> {
     // Mock history simulation
     const users = ['ana.martinez', 'carlos.ruiz', 'elena.gomez', 'david.sanchez', 'sofia.lopez'];
     const projects = ['Banco General', 'Caja de Ahorros', 'Global Bank', 'Desarrollo Interno', 'Soporte'];
      
     const mockHistory: HistorialAsignacion[] = Array.from({ length: 5 }).map((_, i) => {
       const startDate = new Date();
       startDate.setMonth(startDate.getMonth() - (i + 1) * 3);
        
       const endDate = new Date(startDate);
       endDate.setMonth(endDate.getMonth() + 2);

       return {
         id: crypto.randomUUID(),
         serial: serial,
         usuario: users[i % users.length],
         fechaInicio: startDate,
         fechaFin: endDate,
         generadoPor: i % 2 === 0 ? 'Soporte IT' : 'Admin Sistema',
         proyecto: projects[i % projects.length]
       };
     });
      
     // Filter by date if provided
     let filtered = mockHistory;
     if (fechaInicio) {
       filtered = filtered.filter(h => h.fechaInicio >= fechaInicio);
     }
     if (fechaFin) {
       filtered = filtered.filter(h => h.fechaInicio <= fechaFin);
     }

     return of(filtered).pipe(delay(800));
  }
}
