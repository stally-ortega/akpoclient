import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActaPendiente } from '../models';

@Component({
  selector: 'app-tabla-pendientes',
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
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Solicitante</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Seriales</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
          <tr *ngFor="let acta of actas" class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">{{ acta.id }}</td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{{ acta.fecha | date:'short' }}</td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{{ acta.usuarioSolicitante }}</td>
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
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{{ acta.seriales.join(', ') }}</td>
            <td class="px-6 py-4 text-center">
              <div class="flex justify-center gap-2">
                <button (click)="aprobar.emit(acta.id)" 
                  class="px-3 py-1 bg-success text-white rounded text-xs hover:bg-green-600">
                  Aprobar
                </button>
                <button *ngIf="acta.pdfTemporal" (click)="verPdf.emit(acta.pdfTemporal!)" 
                  class="px-3 py-1 bg-accent text-white rounded text-xs hover:bg-blue-600">
                  Ver PDF
                </button>
              </div>
            </td>
          </tr>
          <tr *ngIf="actas.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No hay actas pendientes</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class TablaPendientesComponent {
  @Input() actas: ActaPendiente[] = [];
  @Output() aprobar = new EventEmitter<string>();
  @Output() verPdf = new EventEmitter<string>();
}
