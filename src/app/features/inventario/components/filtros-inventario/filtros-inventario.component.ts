import { Component, EventEmitter, Input, Output, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltrosInventario } from '../../models';
import { CatalogSelectComponent } from '../../../../shared/components/catalog-select/catalog-select.component';
import { Proyecto, Catalogo } from '../../../../core/models/domain/activo.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-filtros-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, CatalogSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <!-- Busqueda -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Buscar</label>
          <div class="relative">
            <input type="text" [(ngModel)]="filtros.busqueda" (ngModelChange)="emitirFiltros()"
              placeholder="Serial, usuario o modelo..."
              class="block w-full pl-10 h-[38px] rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm placeholder-slate-400">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Proyecto -->
        <div>
          <app-catalog-select
            label="Proyecto"
            placeholder="Todos los proyectos"
            [itemsSource]="proyectos$"
            (selectionChange)="onProyectoChange($event)">
          </app-catalog-select>
        </div>

        <!-- Estado -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
          <select [(ngModel)]="filtros.estado" (ngModelChange)="emitirFiltros()"
            class="block w-full h-[38px] rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm">
            <option value="">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Funcional inactivo">Stock</option>
            <option value="Dañado">Dañado</option>
            <option value="Robado">Robado</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
      </div>
    </div>
  `
})
export class FiltrosInventarioComponent {
  // Use observable for the smart component
  @Input() set proyectos(value: Proyecto[]) {
     this.proyectos$ = of(value);
  }
  proyectos$ = of<Proyecto[]>([]);

  @Input() set initialFiltros(value: FiltrosInventario) {
    if (value) {
      this.filtros = { ...value };
    }
  }
  @Output() filtrosChanged = new EventEmitter<FiltrosInventario>();

  filtros: FiltrosInventario = {
    busqueda: '',
    proyecto: '',
    estado: ''
  };

  onProyectoChange(proyecto: Catalogo | undefined) {
    this.filtros.proyecto = proyecto ? proyecto.nombre : '';
    this.emitirFiltros();
  }

  emitirFiltros() {
    this.filtrosChanged.emit(this.filtros);
  }
}
