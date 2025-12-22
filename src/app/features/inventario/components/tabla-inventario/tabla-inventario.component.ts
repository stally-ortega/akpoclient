import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { EquipoInventario } from '../../models';

@Component({
  selector: 'app-tabla-inventario',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead class="bg-slate-50 dark:bg-slate-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Serial</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Equipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Proyecto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Usuario</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Estado</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Accesorios</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <tr *ngFor="let equipo of equipos" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors" (click)="rowClick.emit(equipo)">
            <td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary">{{ equipo.serial }}</td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
              <div class="font-medium text-slate-900 dark:text-white">{{ equipo.tipo }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ equipo.marca }} {{ equipo.modelo }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
              <span *ngIf="equipo.proyecto" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {{ equipo.proyecto }}
              </span>
              <span *ngIf="!equipo.proyecto" class="text-slate-400">-</span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
              <div *ngIf="equipo.usuarioAsignado">
                <div class="font-medium text-slate-900 dark:text-white">{{ equipo.usuarioAsignado }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400" *ngIf="equipo.fechaAsignacion">
                  Desde {{ equipo.fechaAsignacion | date:'shortDate' }}
                </div>
              </div>
              <span *ngIf="!equipo.usuarioAsignado" class="text-slate-400">-</span>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 text-xs font-semibold rounded-full"
                [ngClass]="{
                  'bg-green-100 text-green-800': equipo.estado === 'DISPONIBLE',
                  'bg-indigo-100 text-indigo-800': equipo.estado === 'ALMACEN',
                  'bg-blue-100 text-blue-800': equipo.estado === 'ASIGNADO',
                  'bg-yellow-100 text-yellow-800': equipo.estado === 'REPARACION',
                  'bg-red-100 text-red-800': equipo.estado === 'BAJA'
                }">
                {{ equipo.estado }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center gap-2 text-slate-400">
                <!-- Teclado -->
                 <lucide-icon *ngIf="equipo.accesorios.teclado" name="keyboard" class="w-5 h-5 text-slate-600" title="Teclado"></lucide-icon>
                <!-- Mouse -->
                 <lucide-icon *ngIf="equipo.accesorios.mouse" name="mouse" class="w-5 h-5 text-slate-600" title="Mouse"></lucide-icon>
                <!-- Base -->
                 <lucide-icon *ngIf="equipo.accesorios.base" name="hard-drive" class="w-5 h-5 text-slate-600" title="Base"></lucide-icon>
                <!-- Diadema -->
                 <lucide-icon *ngIf="equipo.accesorios.diadema" name="headphones" class="w-5 h-5 text-slate-600" [title]="'Diadema: ' + equipo.accesorios.diadema"></lucide-icon>
              </div>
            </td>
          </tr>
          <tr *ngIf="equipos.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-slate-500">
              No se encontraron equipos con los filtros seleccionados
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class TablaInventarioComponent {
  @Input() equipos: EquipoInventario[] = [];
  @Output() rowClick = new EventEmitter<EquipoInventario>();
}
