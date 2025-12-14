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
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-slate-900">Resultados del Proceso</h3>
        <button class="text-sm text-accent hover:text-blue-700 font-medium">Descargar PDF</button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Usuario</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mensaje</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr *ngFor="let result of results" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{{ result.usuario }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  [ngClass]="{
                    'bg-green-100 text-green-800': result.estado === 'exito',
                    'bg-red-100 text-red-800': result.estado === 'error'
                  }">
                  {{ result.estado | titlecase }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                <span *ngIf="result.estado === 'error'" class="text-danger">{{ result.mensaje }}</span>
                <span *ngIf="result.estado !== 'error'">{{ result.mensaje }}</span>
              </td>
            </tr>
            <tr *ngIf="results.length === 0">
              <td colspan="3" class="px-6 py-8 text-center text-slate-500 text-sm">
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
