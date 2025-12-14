import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { EquipoInventario, FiltrosInventario, HistorialAsignacion } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/inventario`;

  // Mock Data
  private mockEquipos: EquipoInventario[] = [
    {
      serial: 'PC-001',
      tipo: 'Portátil',
      marca: 'Dell',
      modelo: 'Latitude 5420',
      proyecto: 'Desarrollo Web',
      usuarioAsignado: 'juan.perez',
      estado: 'ASIGNADO',
      accesorios: { teclado: true, mouse: true, base: true, diadema: 'HS-101' },
      fechaAsignacion: new Date('2023-01-15T09:00:00Z')
    },
    {
      serial: 'PC-002',
      tipo: 'Portátil',
      marca: 'HP',
      modelo: 'EliteBook 840',
      estado: 'DISPONIBLE',
      accesorios: { teclado: false, mouse: true, base: false }
    },
    {
      serial: 'PC-003',
      tipo: 'Monitor',
      marca: 'Samsung',
      modelo: '24 inch',
      proyecto: 'Soporte',
      usuarioAsignado: 'maria.gomez',
      estado: 'ASIGNADO',
      accesorios: { teclado: false, mouse: false, base: false },
      fechaAsignacion: new Date('2023-03-10T14:30:00Z')
    },
    {
      serial: 'PC-004',
      tipo: 'Portátil',
      marca: 'Lenovo',
      modelo: 'ThinkPad T14',
      estado: 'REPARACION',
      accesorios: { teclado: true, mouse: true, base: false }
    },
    {
      serial: 'PC-005',
      tipo: 'Portátil',
      marca: 'Dell',
      modelo: 'Latitude 3420',
      proyecto: 'Desarrollo Web',
      usuarioAsignado: 'carlos.rodriguez',
      estado: 'ASIGNADO',
      accesorios: { teclado: true, mouse: true, base: true },
      fechaAsignacion: new Date('2023-05-20T08:15:00Z')
    }
  ];

  consultarInventario(filtros: FiltrosInventario): Observable<EquipoInventario[]> {
    if (environment.useMocks) {
      return of(this.aplicarFiltrosMock(filtros)).pipe(delay(800));
    }

    let params = new HttpParams();
    if (filtros.proyecto) params = params.set('proyecto', filtros.proyecto);
    if (filtros.estado) params = params.set('estado', filtros.estado);
    if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);

    return this.http.get<EquipoInventario[]>(this.apiUrl, { params });
  }

  obtenerProyectos(): Observable<string[]> {
    if (environment.useMocks) {
      const proyectos = [...new Set(this.mockEquipos.map(e => e.proyecto).filter(p => !!p))] as string[];
      return of(proyectos).pipe(delay(500));
    }
    return this.http.get<string[]>(`${this.apiUrl}/proyectos`);
  }

  obtenerHistorial(serial: string, fechaInicio?: Date, fechaFin?: Date): Observable<HistorialAsignacion[]> {
    if (environment.useMocks) {
      // Mock history
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
    
    let params: any = {};
    if (fechaInicio) params.inicio = fechaInicio.toISOString();
    if (fechaFin) params.fin = fechaFin.toISOString();

    return this.http.get<HistorialAsignacion[]>(`${this.apiUrl}/${serial}/historial`, { params });
  }

  private aplicarFiltrosMock(filtros: FiltrosInventario): EquipoInventario[] {
    return this.mockEquipos.filter(equipo => {
      const matchProyecto = !filtros.proyecto || equipo.proyecto === filtros.proyecto;
      const matchEstado = !filtros.estado || equipo.estado === filtros.estado;
      
      let matchBusqueda = true;
      if (filtros.busqueda) {
        const term = filtros.busqueda.toLowerCase();
        matchBusqueda = 
          equipo.serial.toLowerCase().includes(term) ||
          (equipo.usuarioAsignado?.toLowerCase().includes(term) ?? false) ||
          equipo.modelo.toLowerCase().includes(term);
      }

      return matchProyecto && matchEstado && matchBusqueda;
    });
  }
}
