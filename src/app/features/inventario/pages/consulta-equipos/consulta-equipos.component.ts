import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActivoService } from '../../../../core/services/activo.service'; // NEW Service
import { Activo, Proyecto } from '../../../../core/models/domain/activo.model'; // NEW Models
import { FiltrosInventario } from '../../models'; // Keep legacy interface for filters state, or redefine
import { FiltrosInventarioComponent, TablaInventarioComponent } from '../../components';
import { DetalleEquipoComponent } from '../../components/detalle-equipo/detalle-equipo.component';

@Component({
  selector: 'app-consulta-equipos',
  standalone: true,
  imports: [CommonModule, FiltrosInventarioComponent, TablaInventarioComponent, DetalleEquipoComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Premium Header -->
      <div class="relative overflow-hidden bg-gradient-to-r from-cyan-900 to-blue-900 rounded-2xl shadow-lg p-5 text-white mb-8">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-4">
             <div class="p-2 bg-white/10 rounded-lg shrink-0">
                <lucide-icon name="package-search" class="w-6 h-6 text-cyan-200"></lucide-icon>
             </div>
             <div>
               <h1 class="text-2xl font-bold tracking-tight">Consulta de Equipos</h1>
               <p class="text-cyan-100 text-sm opacity-90">Gestión centralizada del inventario tecnológico.</p>
             </div>
          </div>
          
          <button (click)="exportarExcel()" 
            class="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all border border-white/20 shadow-sm text-sm">
            <lucide-icon name="download" class="w-4 h-4"></lucide-icon>
            Exportar Excel
          </button>
        </div>
      </div>

      <app-filtros-inventario 
        [proyectos]="proyectos()"
        [initialFiltros]="currentFiltros"
        (filtrosChanged)="onFiltrosChanged($event)">
      </app-filtros-inventario>

      <div class="relative">
        <div *ngIf="loading()" class="absolute inset-0 bg-white/50 dark:bg-slate-900/50 z-10 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        
        <app-tabla-inventario 
          [equipos]="equipos()"
          (rowClick)="openModal($event)">
        </app-tabla-inventario>
      </div>
      
      <div class="text-right text-sm text-slate-500 mt-2">
        Total resultados: {{ equipos().length }}
      </div>

      <!-- Detail Modal (To be refactored later for full object support) -->
       <!-- Logic temporarily disabled for modal deep integration, passing any to avoid type errors in legacy component -->
      <app-detalle-equipo
        *ngIf="selectedEquipo()"
        [equipo]="selectedEquipoAny" 
        (closed)="closeModal()">
      </app-detalle-equipo>
    </div>
  `
})
export class ConsultaEquiposComponent implements OnInit {
  private activoService = inject(ActivoService); // Injected new service
  private toast = inject(ToastrService);

  equipos = signal<Activo[]>([]);
  proyectos = signal<Proyecto[]>([]);
  loading = signal(false);
  selectedEquipo = signal<Activo | null>(null);
  
  // Getter for legacy modal compatibility
  get selectedEquipoAny(): any {
    return this.selectedEquipo();
  }

  // Mantener filtros actuales para exportación
  currentFiltros: FiltrosInventario = {};

  private route = inject(ActivatedRoute);

  openModal(equipo: Activo) {
    this.selectedEquipo.set(equipo);
  }

  closeModal() {
    this.selectedEquipo.set(null);
  }

  ngOnInit() {
    this.cargarProyectos();
    
    // Deep linking: Leer filtros de la URL
    this.route.queryParams.subscribe(params => {
      if (params['estado'] || params['proyecto'] || params['busqueda']) {
         const initialFiltros = {
          estado: params['estado'] || '',
          proyecto: params['proyecto'] || '',
          busqueda: params['busqueda'] || ''
        };
        this.currentFiltros = initialFiltros;
        this.onFiltrosChanged(initialFiltros);
      } else {
        this.busquedaInicial();
      }
    });
  }

  cargarProyectos() {
    this.activoService.getProyectos().subscribe({
      next: (proyectos) => this.proyectos.set(proyectos),
      error: () => this.toast.error('Error al cargar proyectos')
    });
  }

  busquedaInicial() {
    this.onFiltrosChanged({});
  }

  onFiltrosChanged(filtros: FiltrosInventario) {
    this.currentFiltros = filtros;
    this.loading.set(true);
    
    this.activoService.getActivos({
      search: filtros.busqueda,
      estado: filtros.estado || undefined
    }).subscribe({
      next: (data) => {
        // Client-side filtering for project since ActivoService mock might not handle it fully yet
        let filtered = data;
        if (filtros.proyecto) {
           filtered = data.filter(a => a.proyecto?.nombre === filtros.proyecto);
        }
        
        this.equipos.set(filtered);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Error al consultar inventario');
        this.loading.set(false);
      }
    });
  }

  exportarExcel() {
    const data = this.equipos();
    if (data.length === 0) {
      this.toast.warning('No hay datos para exportar');
      return;
    }

    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventario-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    this.toast.success('Descarga iniciada');
  }

  private convertToCSV(data: Activo[]): string {
    const headers = ['Serial', 'Tipo', 'Marca', 'Modelo', 'Proyecto', 'Usuario', 'Estado'];
    const rows = data.map(e => [
      e.serial,
      e.tipo.nombre,
      e.marca.nombre,
      e.modelo?.nombre || '',
      e.proyecto?.nombre || '',
      e.usuarioAsignado?.nombre || '',
      e.estado
    ]);

    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  }
}
