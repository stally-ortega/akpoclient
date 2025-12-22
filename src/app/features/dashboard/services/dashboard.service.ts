import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface DashboardStats {
  inventario: {
    total: number;
    disponibles: number;
    asignados: number;
    almacen: number;
    reparacion: number;
  };
  actas: {
    pendientes: number;
    hoy: number;
    errores: number;
  };
  correos: {
    enviadosHoy: number;
    erroresHoy: number;
    totalEnviados: number;
  };
  prestamos: {
    realizadosHoy: number;
    vencidos: number;
    totalActivos: number;
    devolucionesHoy: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/dashboard/stats`;

  getStats(): Observable<DashboardStats> {
    if (environment.useMocks) {
      return of({
        inventario: {
          total: 156,
          disponibles: 24,
          asignados: 120,
          almacen: 8,
          reparacion: 4
        },
        actas: {
          pendientes: 5,
          hoy: 12,
          errores: 2
        },
        correos: {
          enviadosHoy: 15,
          erroresHoy: 1,
          totalEnviados: 1250
        },
        prestamos: {
          realizadosHoy: 8,
          vencidos: 2,
          totalActivos: 15,
          devolucionesHoy: 3
        }
      }).pipe(delay(800));
    }
    return this.http.get<any>(this.apiUrl).pipe(
      // Map potential legacy backend response to new interface
      // Use 'any' to avoid strict type mismatch during mapping
        // @ts-ignore
      map(data => ({
        ...data,
        correos: {
           enviadosHoy: data.correos?.enviadosHoy ?? data.correos?.hoy ?? 0,
           erroresHoy: data.correos?.erroresHoy ?? data.correos?.errores ?? 0,
           totalEnviados: data.correos?.totalEnviados ?? 0
        },
        prestamos: {
          realizadosHoy: data.prestamos?.realizadosHoy ?? 0,
          vencidos: data.prestamos?.vencidos ?? 0,
          totalActivos: data.prestamos?.totalActivos ?? data.prestamos?.activos ?? 0,
          devolucionesHoy: data.prestamos?.devolucionesHoy ?? 0
        }
      }))
    );
  }
}
