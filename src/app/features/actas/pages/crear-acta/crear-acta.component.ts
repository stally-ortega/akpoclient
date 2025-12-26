import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LucideAngularModule } from 'lucide-angular';
import { ActasService } from '../../services';
import { TablaEquiposComponent } from '../../components';
import { UserSearchComponent } from '../../../../shared/components/user-search/user-search.component';
import { UsuarioAd } from '../../../../core/models/domain/activo.model';
import { TipoActa, CrearActaRequest } from '../../models';

/**
 * Page component for creating new actas.
 * Includes form for equipment, peripherals, and user validation.
 */
@Component({
  selector: 'app-crear-acta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaEquiposComponent, UserSearchComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 animate-fade-in pb-20">
      
      <!-- Premium Header (Compact) -->
      <div class="relative overflow-hidden bg-gradient-to-r from-slate-900 to-purple-900 rounded-2xl shadow-lg p-5 text-white">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
           <div class="flex items-center gap-4">
              <div class="p-2 bg-white/10 rounded-lg shrink-0">
                 <lucide-icon name="file-text" class="w-6 h-6 text-purple-200"></lucide-icon>
              </div>
              <div>
                 <h1 class="text-2xl font-bold tracking-tight">Crear Nueva Acta</h1>
                 <p class="text-purple-200 text-sm opacity-90">Generación y validación de documentos.</p>
              </div>
           </div>
        </div>
      </div>

      <form [formGroup]="actaForm" (ngSubmit)="onSubmit()" class="space-y-8">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Tipo de Acta -->
          <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md group">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <lucide-icon name="tag" class="w-5 h-5 text-purple-500"></lucide-icon> Tipo de Operación
            </h3>
            <div class="relative">
              <select formControlName="tipoActa" 
                class="block w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-base px-4 appearance-none cursor-pointer transition-colors group-hover:bg-white dark:group-hover:bg-slate-900">
                <option value="ASIGNACION">Asignación de Equipos</option>
                <option value="DEVOLUCION">Devolución de Equipos</option>
              </select>
               <lucide-icon name="chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"></lucide-icon>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 ml-1">Seleccione la naturaleza de este movimiento.</p>
          </div>

          <!-- Usuario Destino -->
          <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md">
             <div class="flex items-center gap-2 mb-4">
                <lucide-icon name="user" class="w-5 h-5 text-blue-500"></lucide-icon>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Usuario Asociado</h3>
             </div>
             
             <div *ngIf="!usuarioValidado()">
                <app-user-search
                  label=""
                  placeholder="Busque por nombre o usuario..."
                  (userSelected)="onUsuarioSelected($event)">
                </app-user-search>
             </div>

             <!-- User Locked State -->
             <div *ngIf="usuarioValidado()" class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl animate-fade-in">
                <div class="flex items-center gap-3">
                   <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200 font-bold">
                      {{ nombreCompletoUsuario().charAt(0) }}
                   </div>
                   <div>
                      <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ nombreCompletoUsuario() }}</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">{{ actaForm.get('usuarioDestino')?.value }}</p>
                   </div>
                </div>
                <button type="button" (click)="onUsuarioSelected(null)" 
                   class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                   title="Cambiar usuario">
                   <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
                </button>
             </div>
             
             <!-- Hidden Control -->
             <input type="hidden" formControlName="usuarioDestino">
          </div>
        </div>

        <!-- Tabla de Equipos - Separated with mt-6 -->
        <app-tabla-equipos 
          class="block mt-6"
          [parentForm]="actaForm"
          (equipoAgregado)="agregarEquipo()"
          (equipoEliminado)="eliminarEquipo($event)">
        </app-tabla-equipos>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <!-- Periféricos -->
          <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700" formGroupName="perifericos">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <lucide-icon name="keyboard" class="w-5 h-5 text-orange-500"></lucide-icon> Accesorios Periféricos
            </h3>
            
            <div class="space-y-4">
              <label class="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all cursor-pointer group">
                <div class="relative flex items-center">
                  <input type="checkbox" formControlName="teclado" 
                    class="peer h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 bg-white dark:bg-slate-900">
                </div>
                <span class="text-base text-slate-700 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-300 font-medium transition-colors">Teclado</span>
              </label>

              <label class="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all cursor-pointer group">
                <div class="relative flex items-center">
                  <input type="checkbox" formControlName="mouse" 
                    class="peer h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 bg-white dark:bg-slate-900">
                </div>
                <span class="text-base text-slate-700 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-300 font-medium transition-colors">Mouse</span>
              </label>

               <label class="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all cursor-pointer group">
                <div class="relative flex items-center">
                  <input type="checkbox" formControlName="basePortatil" 
                    class="peer h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 bg-white dark:bg-slate-900">
                </div>
                <span class="text-base text-slate-700 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-300 font-medium transition-colors">Base Portátil</span>
              </label>

              <div class="p-3 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all">
                <label class="flex items-center gap-4 cursor-pointer group mb-2">
                  <div class="relative flex items-center">
                    <input type="checkbox" formControlName="diademaIncluido" 
                      class="peer h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 bg-white dark:bg-slate-900">
                  </div>
                   <span class="text-base text-slate-700 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-300 font-medium transition-colors">Diadema Telefónica</span>
                </label>
                
                <div *ngIf="actaForm.get('perifericos.diademaIncluido')?.value" class="pl-9 animate-fade-in-up">
                   <input type="text" formControlName="diademaSerial" 
                    class="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm placeholder-slate-400 p-2.5"
                    placeholder="Ingrese serial de la diadema">
                </div>
              </div>
            </div>
          </div>

          <!-- Ticket (Opcional) -->
          <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <lucide-icon name="ticket" class="w-5 h-5 text-green-500"></lucide-icon> Referencia Externa
            </h3>
            <div class="space-y-2">
               <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Número de Ticket o Caso</label>
               <div class="relative">
                 <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-slate-500 font-mono">#</span>
                 </div>
                 <input type="number" formControlName="ticket" 
                  class="block w-full pl-7 rounded-xl border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-base h-12 placeholder-slate-400"
                  placeholder="0000">
               </div>
               <p class="text-xs text-slate-500 dark:text-slate-400 ml-1">Opcional. Vincule esta acta a un ticket de soporte.</p>
            </div>
          </div>
        </div>

        <!-- Botones (Floating or Fixed at bottom) -->
        <div class="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
          <button type="button" (click)="cancelar()" 
            class="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium">
            Cancelar Operación
          </button>
          
          <button type="submit" [disabled]="actaForm.invalid || isSubmitting()" 
            class="relative overflow-hidden group px-8 py-2.5 bg-gradient-to-r from-slate-900 to-purple-900 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none">
             <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
             
            <span *ngIf="!isSubmitting()" class="relative flex items-center gap-2 font-bold tracking-wide">
               <lucide-icon name="check-circle" class="w-5 h-5"></lucide-icon> Generar Acta
            </span>
            <span *ngIf="isSubmitting()" class="relative flex items-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class CrearActaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private actasService = inject(ActasService);
  private router = inject(Router);
  private toast = inject(ToastrService);

  isSubmitting = signal(false);
  usuarioValidado = signal(false);
  nombreCompletoUsuario = signal('');

  actaForm!: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.actaForm = this.fb.group({
      tipoActa: ['ASIGNACION' as TipoActa, Validators.required],
      usuarioDestino: ['', [Validators.required, Validators.pattern(/^[a-z]+\.[a-z]+$/)]],
      equipos: this.fb.array([]),
      perifericos: this.fb.group({
        teclado: [false],
        mouse: [false],
        basePortatil: [false],
        diademaIncluido: [false],
        diademaSerial: ['']
      }),
      ticket: [null]
    });
  }

  get equiposArray(): FormArray {
    return this.actaForm.get('equipos') as FormArray;
  }

  agregarEquipo() {
    const equipoGroup = this.fb.group({
      serial: ['', Validators.required],
      tipo: [''], // [NEW] Campo para validacion de duplicados
      proyecto: [''], // [NEW] Campo proyecto
      descripcion: [''],
      estado: ['PENDIENTE']
    });

    equipoGroup.get('serial')?.valueChanges.subscribe(serial => {
      if (serial && serial.length >= 5) {
        this.validarSerial(serial, equipoGroup);
      }
    });

    this.equiposArray.push(equipoGroup);
  }

  eliminarEquipo(index: number) {
    this.equiposArray.removeAt(index);
  }

  validarSerial(serial: string, equipoGroup: FormGroup) {
    this.actasService.validarSerial(serial).subscribe({
      next: (response) => {
        if (response.valido) {
          equipoGroup.patchValue({
            descripcion: response.descripcion,
            estado: 'VALIDO'
          });
        } else {
          equipoGroup.patchValue({
            descripcion: response.error,
            estado: 'INVALIDO'
          });
        }
      },
      error: () => {
        equipoGroup.patchValue({
          estado: 'INVALIDO'
        });
      }
    });
  }

  onUsuarioSelected(user: UsuarioAd | null) {
    if (user) {
      this.actaForm.patchValue({ usuarioDestino: user.usuarioAd });
      this.usuarioValidado.set(true);
      this.nombreCompletoUsuario.set(user.nombre);
    } else {
      this.actaForm.patchValue({ usuarioDestino: '' });
      this.usuarioValidado.set(false);
    }
  }

  // Legacy method kept empty to avoid breaking template references if any remain
  validarUsuarioDestino() {}

  onSubmit() {
    if (this.actaForm.valid) {
      this.isSubmitting.set(true);

      const formValue = this.actaForm.value;
      const request: CrearActaRequest = {
        tipoActa: formValue.tipoActa,
        usuarioDestino: formValue.usuarioDestino,
        equipos: formValue.equipos.map((e: any) => ({ 
          serial: e.serial,
          proyecto: e.proyecto // [NEW] Mapear proyecto
        })),
        perifericos: {
          teclado: formValue.perifericos.teclado,
          mouse: formValue.perifericos.mouse,
          basePortatil: formValue.perifericos.basePortatil,
          diadema: formValue.perifericos.diademaIncluido ? {
            incluido: true,
            serial: formValue.perifericos.diademaSerial
          } : undefined
        },
        ticket: formValue.ticket || undefined
      };

      this.actasService.crearActa(request).subscribe({
        next: (response) => {
          this.toast.success('Acta generada y enviada para aprobación', 'Éxito');
          this.router.navigate(['/actas']);
          this.isSubmitting.set(false);
        },
        error: () => {
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.actaForm.markAllAsTouched();
    }
  }

  cancelar() {
    this.router.navigate(['/actas']);
  }
}
