import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
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
    hoy: number;
    pendientes: number;
    errores: number;
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
          hoy: 3,
          pendientes: 1,
          errores: 0
        }
      }).pipe(delay(800));
    }
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}
