import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { ActivoSearchComponent } from '../../../shared/components/activo-search/activo-search.component';
import { Activo } from '../../../core/models/domain/activo.model';

@Component({
  selector: 'app-tabla-equipos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ActivoSearchComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
           <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center">
                 <lucide-icon name="monitor" class="w-5 h-5 text-blue-600 dark:text-blue-400"></lucide-icon>
              </div>
              Equipos a Procesar
              <span class="ml-2 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                {{ equiposArray.length }}
              </span>
           </h3>
           <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-10">Agregue los activos involucrados en esta acta.</p>
        </div>
        
        <button type="button" (click)="agregarEquipo()" 
          class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:transform active:scale-95 transition-all shadow-sm hover:shadow-blue-200 dark:hover:shadow-none font-medium text-sm">
          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
          Agregar Equipo
        </button>
      </div>

      <div class="overflow-x-visible"> <!-- Visible to allow dropdowns to overflow -->
        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700 w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[35%]">Activo</th>
              <th class="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[25%]">Proyecto</th>
              <th class="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[30%]">Estado</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[10%]">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50" [formGroup]="parentForm">
            <ng-container formArrayName="equipos">
              <tr *ngFor="let equipo of equiposArray.controls; let i = index" [formGroupName]="i" class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-4 py-4 align-top">
                  <!-- Search State -->
                  <div *ngIf="!equipo.get('serial')?.value" class="relative z-20"> 
                      <app-activo-search
                      placeholder="Escriba serial..."
                      (activoSelected)="onActivoSelected($event, i)">
                    </app-activo-search>
                  </div>

                  <!-- Selected State -->
                  <div *ngIf="equipo.get('serial')?.value" class="animate-fade-in p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 flex items-start gap-3">
                     <div class="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400">
                        <lucide-icon name="box" class="w-5 h-5"></lucide-icon>
                     </div>
                     <div>
                        <div class="font-bold text-slate-900 dark:text-white text-sm">
                           {{ equipo.get('serial')?.value }}
                        </div>
                        <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                           {{ equipo.get('descripcion')?.value }}
                        </div>
                     </div>
                  </div>
                  
                  <!-- Hidden inputs -->
                  <input type="hidden" formControlName="serial">
                  <input type="hidden" formControlName="tipo">
                  <input type="hidden" formControlName="descripcion">
                  <input type="hidden" formControlName="estado">
                </td>
                
                <td class="px-4 py-4 align-top">
                  <input type="text" formControlName="proyecto" 
                    class="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-slate-400 h-[42px]"
                    placeholder="Proyecto asignado">
                </td>
                
                <td class="px-4 py-4 align-top">
                   <div *ngIf="equipo.get('serial')?.value; else noSelection" class="flex flex-col gap-1">
                      <span class="inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                         <lucide-icon name="check-circle" class="w-3 h-3"></lucide-icon> VALIDO
                      </span>
                   </div>
                   <ng-template #noSelection>
                      <span class="inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                        <lucide-icon name="clock" class="w-3 h-3"></lucide-icon> PENDIENTE
                      </span>
                   </ng-template>
                </td>
                
                <td class="px-4 py-4 text-center align-top">
                  <button type="button" (click)="eliminarEquipo(i)" 
                    class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    title="Eliminar equipo">
                    <lucide-icon name="trash" class="w-5 h-5"></lucide-icon>
                  </button>
                </td>
              </tr>
            </ng-container>
            
            <tr *ngIf="equiposArray.length === 0">
              <td colspan="4" class="px-4 py-12 text-center">
                 <div class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <div class="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3">
                       <lucide-icon name="box" class="w-8 h-8 opacity-50"></lucide-icon>
                    </div>
                    <p class="font-medium text-slate-900 dark:text-slate-300">No hay equipos en esta acta</p>
                    <p class="text-sm mt-1 mb-4">Agregue al menos un equipo para continuar</p>
                    <button type="button" (click)="agregarEquipo()" class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Agregar primer equipo</button>
                 </div>
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
  
  private toastr = inject(ToastrService);

  get equiposArray(): FormArray {
    return this.parentForm.get('equipos') as FormArray;
  }

  agregarEquipo() {
    this.equipoAgregado.emit();
  }

  eliminarEquipo(index: number) {
    this.equipoEliminado.emit(index);
  }

  onActivoSelected(activo: Activo | null, index: number) {
    const group = this.equiposArray.at(index);
    
    if (activo) {
      // 1. Check for duplicates (same type in other rows)
      const isDuplicateType = this.equiposArray.controls.some((control, i) => {
        if (i === index) return false; // Skip current row
        const type = control.get('tipo')?.value;
        return type === activo.tipo.nombre;
      });

      if (isDuplicateType) {
        this.toastr.warning(
          `Ya has seleccionado un equipo del tipo "${activo.tipo.nombre}". Elimina el anterior si deseas cambiarlo.`, 
          'Tipo Duplicado'
        );
        // Clear selection implicitly by setting null, or just don't patch value
        // Ideally we should reset the search component too, but patching null values here handles data
        group.patchValue({
          serial: '',
          tipo: '',
          descripcion: '',
          estado: 'PENDIENTE',
          proyecto: ''
        });
        return;
      }

      // 2. If valid, patch value
      group.patchValue({
        serial: activo.serial,
        tipo: activo.tipo.nombre, // Store type for validation
        descripcion: `${activo.tipo.nombre} ${activo.marca.nombre} ${activo.modelo?.nombre || ''}`,
        estado: 'VALIDO',
        proyecto: activo.proyecto?.nombre || ''
      });
    } else {
      // Clear values if user cleared selection
      group.patchValue({
        serial: '',
        tipo: '',
        descripcion: '',
        estado: 'PENDIENTE',
        proyecto: ''
      });
    }
  }
}
