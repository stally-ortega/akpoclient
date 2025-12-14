import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActaHistorico } from '../models';

@Component({
  selector: 'app-tabla-historico',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fecha</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Usuario</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Seriales</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">PDF</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr *ngFor="let acta of actas" class="hover:bg-slate-50">
            <td class="px-6 py-4 text-sm text-slate-900">{{ acta.id }}</td>
            <td class="px-6 py-4 text-sm text-slate-600">{{ acta.fecha | date:'short' }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 text-xs font-semibold rounded-full"
                [class.bg-blue-100]="acta.tipoActa === 'ASIGNACION'"
                [class.text-blue-800]="acta.tipoActa === 'ASIGNACION'"
                [class.bg-purple-100]="acta.tipoActa === 'DEVOLUCION'"
                [class.text-purple-800]="acta.tipoActa === 'DEVOLUCION'">
                {{ acta.tipoActa }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600">{{ acta.usuarioDestino }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {{ acta.estado }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600">{{ acta.seriales.join(', ') }}</td>
            <td class="px-6 py-4 text-center">
              <button *ngIf="acta.pdfUrl" (click)="descargar.emit(acta.pdfUrl!)" 
                class="text-accent hover:text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </td>
          </tr>
          <tr *ngIf="actas.length === 0">
            <td colspan="7" class="px-6 py-8 text-center text-slate-500">No hay registros históricos</td>
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
