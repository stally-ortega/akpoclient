import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
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
  imports: [CommonModule, RouterLink, TablaPendientesComponent, TablaHistoricoComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Premium Header -->
      <div class="relative overflow-hidden bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl shadow-lg p-5 text-white">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-4">
             <div class="p-2 bg-white/10 rounded-lg shrink-0">
                <lucide-icon name="file-text" class="w-6 h-6 text-purple-200"></lucide-icon>
             </div>
             <div>
               <h1 class="text-2xl font-bold tracking-tight">Gestión de Actas</h1>
               <p class="text-purple-100 text-sm opacity-90">Control de documentos y aprobaciones.</p>
             </div>
          </div>
          
          <div class="flex gap-3">
             <a routerLink="/actas/aprobar" 
               class="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all border border-white/20 shadow-sm text-sm no-underline">
               <lucide-icon name="check-square" class="w-4 h-4"></lucide-icon>
               Aprobar PDF
             </a>
             <a routerLink="/actas/crear" 
               class="flex items-center gap-2 bg-white text-indigo-900 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all shadow-md font-semibold text-sm relative overflow-hidden no-underline">
               <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
               Nueva Acta
             </a>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-slate-200 dark:border-slate-700">
        <nav class="-mb-px flex space-x-8">
          <button (click)="activeTab.set('pendientes')" 
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            [class.border-accent]="activeTab() === 'pendientes'"
            [class.text-accent]="activeTab() === 'pendientes'"
            [class.border-transparent]="activeTab() !== 'pendientes'"
            [class.text-slate-500]="activeTab() !== 'pendientes'"
            [class.dark:text-slate-400]="activeTab() !== 'pendientes'">
            Pendientes ({{ pendientes().length }})
          </button>
          <button (click)="activeTab.set('historico')" 
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            [class.border-accent]="activeTab() === 'historico'"
            [class.text-accent]="activeTab() === 'historico'"
            [class.border-transparent]="activeTab() !== 'historico'"
            [class.text-slate-500]="activeTab() !== 'historico'"
            [class.dark:text-slate-400]="activeTab() !== 'historico'">
            Histórico
          </button>
        </nav>
      </div>

      <!-- Pendientes Tab -->
      <div *ngIf="activeTab() === 'pendientes'" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-900">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Solicitudes Pendientes</h2>
          <button (click)="cargarPendientes()" 
            class="text-sm text-accent hover:text-blue-700 dark:hover:text-blue-400 font-medium">
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
      <div *ngIf="activeTab() === 'historico'" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-900">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Histórico de Actas</h2>
          <div class="flex gap-3">
            <button (click)="exportarExcel()" 
              class="px-4 py-2 bg-success text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium">
              Exportar a Excel
            </button>
            <button (click)="cargarHistorico()" 
              class="text-sm text-accent hover:text-blue-700 dark:hover:text-blue-400 font-medium">
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
