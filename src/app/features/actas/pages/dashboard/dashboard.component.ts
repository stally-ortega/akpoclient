import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActasService } from '../../services';
import { TablaPendientesComponent, TablaHistoricoComponent } from '../../components';
import { ActaPendiente, ActaHistorico } from '../../models';

/**
 * Dashboard page for viewing pending and historical actas.
 * Includes tabs for switching between views and export functionality.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TablaPendientesComponent, TablaHistoricoComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900">Gestión de Actas</h1>
        <div class="flex gap-3">
          <a routerLink="/actas/aprobar" 
            class="px-4 py-2 bg-success text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium">
            Aprobar con PDF
          </a>
          <a routerLink="/actas/crear" 
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-slate-800 transition-colors text-sm font-medium">
            + Nueva Acta
          </a>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-slate-200">
        <nav class="-mb-px flex space-x-8">
          <button (click)="activeTab.set('pendientes')" 
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            [class.border-accent]="activeTab() === 'pendientes'"
            [class.text-accent]="activeTab() === 'pendientes'"
            [class.border-transparent]="activeTab() !== 'pendientes'"
            [class.text-slate-500]="activeTab() !== 'pendientes'">
            Pendientes ({{ pendientes().length }})
          </button>
          <button (click)="activeTab.set('historico')" 
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            [class.border-accent]="activeTab() === 'historico'"
            [class.text-accent]="activeTab() === 'historico'"
            [class.border-transparent]="activeTab() !== 'historico'"
            [class.text-slate-500]="activeTab() !== 'historico'">
            Histórico
          </button>
        </nav>
      </div>

      <!-- Pendientes Tab -->
      <div *ngIf="activeTab() === 'pendientes'" class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-slate-900">Solicitudes Pendientes</h2>
          <button (click)="cargarPendientes()" 
            class="text-sm text-accent hover:text-blue-700 font-medium">
            Actualizar
          </button>
        </div>
        <app-tabla-pendientes 
          [actas]="pendientes()"
          (aprobar)="aprobarManual($event)"
          (verPdf)="verPdf($event)">
        </app-tabla-pendientes>
      </div>

      <!-- Histórico Tab -->
      <div *ngIf="activeTab() === 'historico'" class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-slate-900">Histórico de Actas</h2>
          <div class="flex gap-3">
            <button (click)="exportarExcel()" 
              class="px-4 py-2 bg-success text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium">
              Exportar a Excel
            </button>
            <button (click)="cargarHistorico()" 
              class="text-sm text-accent hover:text-blue-700 font-medium">
              Actualizar
            </button>
          </div>
        </div>
        <app-tabla-historico 
          [actas]="historico()"
          (descargar)="descargarPdf($event)">
        </app-tabla-historico>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  private actasService = inject(ActasService);
  private toast = inject(ToastrService);

  activeTab = signal<'pendientes' | 'historico'>('pendientes');
  pendientes = signal<ActaPendiente[]>([]);
  historico = signal<ActaHistorico[]>([]);

  ngOnInit() {
    this.cargarPendientes();
    this.cargarHistorico();
  }

  cargarPendientes() {
    this.actasService.listarPendientes().subscribe({
      next: (data) => {
        this.pendientes.set(data);
      },
      error: () => {
        this.toast.error('Error al cargar pendientes', 'Error');
      }
    });
  }

  cargarHistorico() {
    this.actasService.listarHistorico().subscribe({
      next: (data) => {
        this.historico.set(data);
      },
      error: () => {
        this.toast.error('Error al cargar histórico', 'Error');
      }
    });
  }

  aprobarManual(id: string) {
    if (confirm('¿Está seguro de aprobar manualmente esta acta?')) {
      this.actasService.aprobarManual(id).subscribe({
        next: (response) => {
          this.toast.success(response.message, 'Aprobada');
          this.cargarPendientes();
          this.cargarHistorico();
        },
        error: () => {
          this.toast.error('Error al aprobar acta', 'Error');
        }
      });
    }
  }

  verPdf(url: string) {
    window.open(url, '_blank');
  }

  descargarPdf(url: string) {
    window.open(url, '_blank');
  }

  exportarExcel() {
    // Implementación básica de exportación
    const data = this.historico();
    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `actas-historico-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    this.toast.success('Archivo exportado correctamente', 'Éxito');
  }

  private convertToCSV(data: ActaHistorico[]): string {
    const headers = ['ID', 'Fecha', 'Tipo', 'Usuario', 'Estado', 'Seriales'];
    const rows = data.map(acta => [
      acta.id,
      new Date(acta.fecha).toLocaleString(),
      acta.tipoActa,
      acta.usuarioDestino,
      acta.estado,
      acta.seriales.join('; ')
    ]);
    
    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }
}
