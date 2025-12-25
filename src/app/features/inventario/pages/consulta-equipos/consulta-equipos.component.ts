import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InventarioService } from '../../services';
import { FiltrosInventarioComponent, TablaInventarioComponent } from '../../components';
import { DetalleEquipoComponent } from '../../components/detalle-equipo/detalle-equipo.component';
import { EquipoInventario, FiltrosInventario } from '../../models';

@Component({
  selector: 'app-consulta-equipos',
  standalone: true,
  imports: [CommonModule, FiltrosInventarioComponent, TablaInventarioComponent, DetalleEquipoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Consulta de Equipos</h1>
        <button (click)="exportarExcel()" 
          class="px-4 py-2 bg-success text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          Exportar Excel
        </button>
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

      <!-- Detail Modal -->
      <app-detalle-equipo
        *ngIf="selectedEquipo()"
        [equipo]="selectedEquipo()!"
        (closed)="closeModal()">
      </app-detalle-equipo>
    </div>
  `
})
export class ConsultaEquiposComponent implements OnInit {
  private inventarioService = inject(InventarioService);
  private toast = inject(ToastrService);

  equipos = signal<EquipoInventario[]>([]);
  proyectos = signal<string[]>([]);
  loading = signal(false);
  selectedEquipo = signal<EquipoInventario | null>(null);

  // Mantener filtros actuales para exportación
  currentFiltros: FiltrosInventario = {};

  private route = inject(ActivatedRoute);

  openModal(equipo: EquipoInventario) {
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
         this.onFiltrosChanged({
          estado: params['estado'] || '',
          proyecto: params['proyecto'] || '',
          busqueda: params['busqueda'] || ''
        });
        
        // Actualizar componente hijo (filtros) si es necesario
        // Nota: En una implementacion real, pasariamos estos valores al componente de filtros
        // para que se reflejen en los inputs. Por ahora, solo filtramos la tabla.
        this.currentFiltros = {
          estado: params['estado'] || '',
          proyecto: params['proyecto'] || '',
          busqueda: params['busqueda'] || ''
        };
      } else {
        this.busquedaInicial();
      }
    });
  }

  cargarProyectos() {
    this.inventarioService.obtenerProyectos().subscribe({
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
    
    this.inventarioService.consultarInventario(filtros).subscribe({
      next: (data) => {
        this.equipos.set(data);
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

  private convertToCSV(data: EquipoInventario[]): string {
    const headers = ['Serial', 'Tipo', 'Marca', 'Modelo', 'Proyecto', 'Usuario', 'Estado', 'Fecha Asignación'];
    const rows = data.map(e => [
      e.serial,
      e.tipo,
      e.marca,
      e.modelo,
      e.proyecto || '',
      e.usuarioAsignado || '',
      e.estado,
      e.fechaAsignacion ? new Date(e.fechaAsignacion).toLocaleDateString() : ''
    ]);

    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  }
}
