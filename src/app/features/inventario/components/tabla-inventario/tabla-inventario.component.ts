import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Activo } from '../../../../core/models/domain/activo.model';

@Component({
  selector: 'app-tabla-inventario',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          <tr *ngFor="let activo of equipos" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors" (click)="rowClick.emit(activo)">
            <td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary">{{ activo.serial }}</td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
              <div class="font-medium text-slate-900 dark:text-white">{{ activo.tipo.nombre }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ activo.marca.nombre }} {{ activo.modelo?.nombre }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
              <span *ngIf="activo.proyecto" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {{ activo.proyecto.nombre }}
              </span>
              <span *ngIf="!activo.proyecto" class="text-slate-400">-</span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
              <div *ngIf="activo.usuarioAsignado">
                <div class="font-medium text-slate-900 dark:text-white">{{ activo.usuarioAsignado.nombre }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400" *ngIf="activo.usuarioAsignado.usuarioAd">
                  {{ activo.usuarioAsignado.usuarioAd }}
                </div>
              </div>
              <span *ngIf="!activo.usuarioAsignado" class="text-slate-400">-</span>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 text-xs font-semibold rounded-full"
                [ngClass]="{
                  'bg-green-100 text-green-800': activo.estado === 'Activo',
                  'bg-indigo-100 text-indigo-800': activo.estado === 'Funcional inactivo',
                  'bg-red-100 text-red-800': activo.estado === 'Dañado' || activo.estado === 'Robado' || activo.estado === 'Baja'
                }">
                {{ activo.estado }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center gap-2 text-slate-400" *ngIf="activo.accesorios">
                <!-- Teclado -->
                 <lucide-icon *ngIf="activo.accesorios['teclado']" name="keyboard" class="w-5 h-5 text-slate-600" title="Teclado"></lucide-icon>
                <!-- Mouse -->
                 <lucide-icon *ngIf="activo.accesorios['mouse']" name="mouse" class="w-5 h-5 text-slate-600" title="Mouse"></lucide-icon>
                <!-- Base -->
                 <lucide-icon *ngIf="activo.accesorios['base']" name="hard-drive" class="w-5 h-5 text-slate-600" title="Base"></lucide-icon>
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
  @Input() equipos: Activo[] = [];
  @Output() rowClick = new EventEmitter<Activo>();
}
