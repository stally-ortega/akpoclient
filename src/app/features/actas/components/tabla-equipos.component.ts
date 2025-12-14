import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EquipoActa } from '../models';

/**
 * Component for managing a dynamic table of equipment items.
 * Allows adding, removing, and validating equipment serials.
 */
@Component({
  selector: 'app-tabla-equipos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white p-4 rounded-lg border border-slate-200">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-slate-900">Equipos</h3>
        <button type="button" (click)="agregarEquipo()" 
          class="px-4 py-2 bg-accent text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium">
          + Agregar Equipo
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Serial</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Proyecto</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Descripción</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Estado</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200" [formGroup]="parentForm">
            <tr *ngFor="let equipo of equiposArray.controls; let i = index" [formGroupName]="i">
              <td class="px-4 py-3">
                <input type="text" formControlName="serial" 
                  class="block w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                  placeholder="SN123456">
              </td>
              <td class="px-4 py-3">
                <input type="text" formControlName="proyecto" 
                  class="block w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                  placeholder="Proyecto X">
              </td>
              <td class="px-4 py-3">
                <span class="text-sm text-slate-600">{{ equipo.get('descripcion')?.value || '-' }}</span>
              </td>
              <td class="px-4 py-3">
                <span *ngIf="equipo.get('estado')?.value === 'VALIDO'" 
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Válido
                </span>
                <span *ngIf="equipo.get('estado')?.value === 'INVALIDO'" 
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  Inválido
                </span>
                <span *ngIf="!equipo.get('estado')?.value || equipo.get('estado')?.value === 'PENDIENTE'" 
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Pendiente
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <button type="button" (click)="eliminarEquipo(i)" 
                  class="text-danger hover:text-red-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="equiposArray.length === 0">
              <td colspan="4" class="px-4 py-8 text-center text-slate-500 text-sm">
                No hay equipos agregados. Haz clic en "Agregar Equipo" para comenzar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class TablaEquiposComponent {
  @Input() parentForm!: FormGroup;
  @Output() equipoAgregado = new EventEmitter<void>();
  @Output() equipoEliminado = new EventEmitter<number>();

  get equiposArray(): FormArray {
    return this.parentForm.get('equipos') as FormArray;
  }

  agregarEquipo() {
    this.equipoAgregado.emit();
  }

  eliminarEquipo(index: number) {
    this.equipoEliminado.emit(index);
  }
}
