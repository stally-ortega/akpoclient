import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActaHistorico } from '../models';

@Component({
  selector: 'app-tabla-historico',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-x-auto bg-white dark:bg-slate-800">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead class="bg-slate-50 dark:bg-slate-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Fecha</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Usuario</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Seriales</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">PDF</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
          <tr *ngFor="let acta of actas" class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">{{ acta.id }}</td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{{ acta.fecha | date:'short' }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 text-xs font-semibold rounded-full"
                [class.bg-blue-100]="acta.tipoActa === 'ASIGNACION'"
                [class.text-blue-800]="acta.tipoActa === 'ASIGNACION'"
                [class.bg-purple-100]="acta.tipoActa === 'DEVOLUCION'"
                [class.text-purple-800]="acta.tipoActa === 'DEVOLUCION'"
                [class.dark:bg-blue-900]="acta.tipoActa === 'ASIGNACION'"
                [class.dark:text-blue-200]="acta.tipoActa === 'ASIGNACION'"
                [class.dark:bg-purple-900]="acta.tipoActa === 'DEVOLUCION'"
                [class.dark:text-purple-200]="acta.tipoActa === 'DEVOLUCION'">
                {{ acta.tipoActa }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{{ acta.usuarioDestino }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {{ acta.estado }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{{ acta.seriales.join(', ') }}</td>
            <td class="px-6 py-4 text-center">
              <button *ngIf="acta.pdfUrl" (click)="descargar.emit(acta.pdfUrl!)" 
                class="text-accent hover:text-blue-700 dark:hover:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </td>
          </tr>
          <tr *ngIf="actas.length === 0">
            <td colspan="7" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No hay registros históricos</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class TablaHistoricoComponent {
  @Input() actas: ActaHistorico[] = [];
  @Output() descargar = new EventEmitter<string>();
}
