import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorreosResult } from '../models/correos.models';

/**
 * Component to display the results of the sending process.
 */
@Component({
  selector: 'app-results-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Resultados del Proceso</h3>
        <button class="text-sm text-accent hover:text-blue-700 dark:hover:text-blue-300 font-medium">Descargar PDF</button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead class="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usuario</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estado</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mensaje</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            <tr *ngFor="let result of results" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{{ result.usuario }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  [ngClass]="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': result.estado === 'exito',
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': result.estado === 'error'
                  }">
                  {{ result.estado | titlecase }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                <span *ngIf="result.estado === 'error'" class="text-danger dark:text-red-400">{{ result.mensaje }}</span>
                <span *ngIf="result.estado !== 'error'">{{ result.mensaje }}</span>
              </td>
            </tr>
            <tr *ngIf="results.length === 0">
              <td colspan="3" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                No hay resultados para mostrar aún.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class ResultsTableComponent {
  @Input() results: CorreosResult[] = [];
}
