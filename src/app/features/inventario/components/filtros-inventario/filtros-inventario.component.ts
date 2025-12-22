import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoEquipo, FiltrosInventario } from '../../models';

@Component({
  selector: 'app-filtros-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <!-- Busqueda -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Buscar</label>
          <div class="relative">
            <input type="text" [(ngModel)]="filtros.busqueda" (ngModelChange)="emitirFiltros()"
              placeholder="Serial, usuario o modelo..."
              class="block w-full pl-10 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm placeholder-slate-400">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Proyecto -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Proyecto</label>
          <select [(ngModel)]="filtros.proyecto" (ngModelChange)="emitirFiltros()"
            class="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm">
            <option value="">Todos</option>
            <option *ngFor="let p of proyectos" [value]="p">{{ p }}</option>
          </select>
        </div>

        <!-- Estado -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
          <select [(ngModel)]="filtros.estado" (ngModelChange)="emitirFiltros()"
            class="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm">
            <option value="">Todos</option>
            <option value="DISPONIBLE">Disponible</option>
            <option value="ALMACEN">Almacén</option>
            <option value="ASIGNADO">Asignado</option>
            <option value="REPARACION">Reparación</option>
            <option value="BAJA">Baja</option>
          </select>
        </div>
      </div>
    </div>
  `
})
export class FiltrosInventarioComponent {
  @Input() proyectos: string[] = [];
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

  emitirFiltros() {
    this.filtrosChanged.emit(this.filtros);
  }
}
