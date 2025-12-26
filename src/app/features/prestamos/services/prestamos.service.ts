import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Prestamo, ItemPrestamo } from '../models/prestamo.models';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import * as XLSX from 'xlsx';
import { environment } from '../../../../environments/environment';

/**
 * Service for managing loans (prestamos) of equipment and peripherals.
 * Handles state management, API interactions, and export functionality.
 */
@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
  private http = inject(HttpClient);
  private toast = inject(ToastrService);

  // State
  private _prestamos = signal<Prestamo[]>([]);
  public searchTerm = signal('');
  
  // Helpers for local datetime-local format (YYYY-MM-DDTHH:mm)
  private getLocalStartOfDay(): string {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  }

  private getLocalEndOfDay(): string {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  }

  public filterStartDate = signal(this.getLocalStartOfDay());
  public filterEndDate = signal(this.getLocalEndOfDay());
  
  // Public signals
  public prestamos = computed(() => {
    const all = this._prestamos();
    const term = this.searchTerm().toLowerCase();
    const startStr = this.filterStartDate();
    const endStr = this.filterEndDate();

    return all.filter(p => {
      // Filter by Date Range
      const pTime = new Date(p.fechaPrestamo).getTime();
      const startTime = new Date(startStr).getTime();
      const endTime = new Date(endStr).getTime();
      
      const matchDate = (!startStr || pTime >= startTime) && (!endStr || pTime <= endTime);

      // Filter by Search Term
      const matchSearch = !term || 
        p.usuarioSolicitante.toLowerCase().includes(term) ||
        p.items.some(i => i.nombre.toLowerCase().includes(term) || i.serial?.toLowerCase().includes(term));

      return matchDate && matchSearch;
    });
  });

  public prestamosActivos = computed(() => this._prestamos().filter(p => p.estado === 'ACTIVO'));

  constructor() {
  }

  /**
   * Registers a new loan.
   * @param usuario The username requesting the loan.
   * @param items List of items being borrowed.
   * @param observaciones Optional notes.
   */
  registrarPrestamo(usuario: string, items: ItemPrestamo[], observaciones?: string) {
    const nuevoPrestamo: Prestamo = {
      id: crypto.randomUUID(),
      usuarioSolicitante: usuario,
      items: items,
      fechaPrestamo: new Date(),
      estado: 'ACTIVO',
      observaciones
    };

    // Actualizar estado local
    this._prestamos.update(current => [nuevoPrestamo, ...current]);

    // Actualizar inventario si hay activos
    items.forEach(item => {
      if (item.esActivo && item.serial) {
        console.log(`Marcando equipo ${item.serial} como PRESTAMO`);
      }
    });

    this.toast.success('Préstamo registrado correctamente');
  }

  /**
   * Finalizes a loan, marking it as returned.
   * @param id The ID of the loan to finalize.
   */
  finalizarPrestamo(id: string) {
    this._prestamos.update(current => 
      current.map(p => {
        if (p.id === id) {
          // Restaurar ítems activos
           p.items.forEach(item => {
            if (item.esActivo && item.serial) {
              console.log(`Restaurando equipo ${item.serial} a DISPONIBLE`);
            }
          });
          return { ...p, estado: 'FINALIZADO', fechaDevolucionReal: new Date() };
        }
        return p;
      })
    );
    this.toast.info('Préstamo finalizado');
  }

  /**
   * Exports the filtered list of loans to an Excel file.
   * Uses client-side generation for mocks and server-side otherwise.
   */
  exportarExcel() {
    // Logic for Mocks (Client-side generation)
    if (environment.useMocks) {
      const data = this.prestamos().map(p => ({
        ID: p.id,
        Usuario: p.usuarioSolicitante,
        'Fecha Préstamo': new Date(p.fechaPrestamo).toLocaleString(),
        'Fecha Devolución': p.fechaDevolucionReal ? new Date(p.fechaDevolucionReal).toLocaleString() : '',
        Estado: p.estado,
        'Ítems': p.items.map(i => `${i.nombre} ${i.serial ? '('+i.serial+')' : ''}`).join(', ')
      }));

      if (data.length === 0) {
        this.toast.warning('No hay datos para exportar');
        return;
      }

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Préstamos');
      
      const fileName = `Prestamos_MOCK_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      return;
    }

    // Logic for Real Interface (Backend Download)
    const params = new HttpParams()
      .set('startDate', this.filterStartDate())
      .set('endDate', this.filterEndDate())
      .set('search', this.searchTerm());

    this.http.get(`${environment.baseUrl}/prestamos/export`, { 
      params,
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileName = `Prestamos_${new Date().toISOString().split('T')[0]}.xlsx`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toast.success('Archivo descargado correctamente');
      },
      error: (err) => {
        console.error('Error downloading file', err);
        this.toast.error('Error al descargar el archivo del servidor');
      }
    });
  }


}
