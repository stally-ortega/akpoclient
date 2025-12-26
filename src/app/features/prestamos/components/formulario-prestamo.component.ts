import { Component, EventEmitter, Output, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PrestamosService } from '../services/prestamos.service';
import { ItemPrestamo } from '../models/prestamo.models';
import { ToastrService } from 'ngx-toastr';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { ActivoSearchComponent } from '../../../shared/components/activo-search/activo-search.component';
import { UsuarioAd, Activo } from '../../../core/models/domain/activo.model';

@Component({
  selector: 'app-formulario-prestamo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, UserSearchComponent, ActivoSearchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-fade-in" (click)="closeModal()">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden h-auto max-h-[90vh] flex flex-col border border-slate-100 dark:border-slate-700 animate-scale-in" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <lucide-icon name="clipboard-list" class="w-5 h-5 text-emerald-500"></lucide-icon>
              Registrar Préstamo
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Asigna equipos o periféricos a un usuario</p>
          </div>
          <button (click)="closeModal()" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>
        
        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <form [formGroup]="prestamoForm" class="space-y-6">
            <!-- Usuario Selector -->
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">Usuario Solicitante</label>
              <app-user-search
                label=""
                placeholder="Buscar usuario en Directorio Activo..."
                (userSelected)="onUserSelected($event)">
              </app-user-search>
              <input type="hidden" formControlName="usuario">
            </div>

            <!-- Items Section -->
            <div class="space-y-3">
               <div class="flex justify-between items-end border-b border-slate-100 dark:border-slate-700 pb-2">
                 <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    Ítems a prestar <span class="text-emerald-500 ml-1">({{ items.length }})</span>
                 </label>
                 <button type="button" (click)="addItem()" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg transition-colors">
                   <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon> Agregar Ítem
                 </button>
               </div>
               
               <div formArrayName="items" class="space-y-3">
                 <div *ngFor="let item of items.controls; let i=index" [formGroupName]="i" class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 relative group transition-all hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm">
                   
                   <div class="flex gap-3">
                      <!-- Badge Number -->
                      <div class="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 shadow-sm mt-1">
                        {{ i + 1 }}
                      </div>

                      <div class="flex-1 space-y-3">
                         <!-- Selector Type -->
                         <div>
                            <select formControlName="categoria" class="w-full text-xs rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 py-2 shadow-sm">
                              <option value="PERIFERICO">Periférico / Accesorio</option>
                              <option value="EQUIPO">Equipo (Activo Fijo)</option>
                              <option value="OTRO">Otro</option>
                            </select>
                         </div>

                         <!-- Dynamic Input -->
                         <ng-container [ngSwitch]="item.get('categoria')?.value">
                            
                            <!-- Case: EQUIPO -> Smart Search -->
                            <div *ngSwitchCase="'EQUIPO'">
                               <app-activo-search
                                 placeholder="Escanear serial o buscar..."
                                 [estadoFilter]="'Activo'" 
                                 (activoSelected)="onActivoSelected($event, i)">
                               </app-activo-search>
                               <input type="hidden" formControlName="serial">
                               <input type="hidden" formControlName="nombre">
                            </div>

                            <!-- Case: Other -> Manual Input -->
                            <div *ngSwitchDefault>
                               <div class="relative">
                                  <input type="text" formControlName="nombre" placeholder="Ej: Mouse Logitech Inalámbrico" 
                                    class="w-full pl-3 pr-3 py-2 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs shadow-sm transition-all">
                               </div>
                            </div>

                         </ng-container>
                      </div>

                      <!-- Remove Button -->
                      <button type="button" (click)="removeItem(i)" class="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all self-start">
                        <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                      </button>
                   </div>
                 </div>
               </div>

               <div *ngIf="items.length === 0" class="text-center py-6 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                  <p class="text-xs text-slate-500">No hay ítems agregados.</p>
                  <button type="button" (click)="addItem()" class="mt-1 text-emerald-600 font-semibold text-xs hover:underline">Agregar el primero</button>
               </div>
            </div>
            
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shrink-0 flex justify-between items-center">
          <div class="text-[10px] text-slate-500">
            <span class="font-bold text-slate-700 dark:text-slate-300">Vigencia:</span> 24 horas.
          </div>
          <div class="flex gap-3">
             <button type="button" (click)="closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
               Cancelar
             </button>
             <button type="button" (click)="onSubmit()" [disabled]="prestamoForm.invalid" 
               class="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all flex items-center gap-2 transform active:scale-95">
               <lucide-icon name="check-circle" class="w-3.5 h-3.5"></lucide-icon>
               Confirmar
             </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  `]
})
export class FormularioPrestamoComponent {
  @Output() close = new EventEmitter<void>();
  
  private fb = inject(FormBuilder);
  private prestamosService = inject(PrestamosService);
  private toast = inject(ToastrService);

  prestamoForm = this.fb.group({
    usuario: ['', Validators.required],
    items: this.fb.array([])
  });

  constructor() {
    this.addItem(); // Start with one item
  }

  get items() {
    return this.prestamoForm.get('items') as FormArray;
  }

  addItem() {
    const itemGroup = this.fb.group({
      categoria: ['PERIFERICO', Validators.required],
      nombre: ['', Validators.required], // Will be auto-filled for Activos
      serial: ['']
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onUserSelected(user: UsuarioAd | null) {
    if (user) {
      this.prestamoForm.patchValue({ usuario: user.usuarioAd }); // Save ID/Email
    } else {
      this.prestamoForm.patchValue({ usuario: '' });
    }
  }

  onActivoSelected(activo: Activo | null, index: number) {
    const control = this.items.at(index);
    if (activo) {
      control.patchValue({
         nombre: `${activo.tipo.nombre} ${activo.marca.nombre} ${activo.modelo?.nombre || ''}`,
         serial: activo.serial
      });
    } else {
      control.patchValue({ nombre: '', serial: '' });
    }
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.prestamoForm.valid) {
      const { usuario, items } = this.prestamoForm.value;
      
      const itemsMapped: ItemPrestamo[] = (items as any[]).map(val => ({
        id: val.serial || crypto.randomUUID(), // Use serial as ID if available, else random
        nombre: val.nombre,
        categoria: val.categoria,
        esActivo: val.categoria === 'EQUIPO',
        serial: val.serial
      }));

      if (itemsMapped.length === 0) {
        this.toast.error('Debe agregar al menos un ítem');
        return;
      }

      this.prestamosService.registrarPrestamo(usuario!, itemsMapped);
      this.closeModal();
    }
  }
}
