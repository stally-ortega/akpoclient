import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PrestamosService } from '../services/prestamos.service';
import { ItemPrestamo } from '../models/prestamo.models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-formulario-prestamo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" (click)="closeModal()">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden" (click)="$event.stopPropagation()">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 class="text-lg font-bold text-slate-800">Registrar Nuevo Préstamo</h2>
          <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
            <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
          </button>
        </div>
        
        <form [formGroup]="prestamoForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Usuario Solicitante</label>
            <input type="text" formControlName="usuario" class="w-full rounded-lg border-slate-300 focus:ring-primary focus:border-primary" placeholder="Ej: pepito.juares">
          </div>

          <div>
             <div class="flex justify-between items-center mb-2">
               <label class="block text-sm font-medium text-slate-700">Ítems</label>
               <button type="button" (click)="addItem()" class="text-xs text-primary font-medium hover:underline">+ Agregar Ítem</button>
             </div>
             
             <div formArrayName="items" class="space-y-3 max-h-60 overflow-y-auto pr-2">
               <div *ngFor="let item of items.controls; let i=index" [formGroupName]="i" class="flex gap-2 items-start p-2 bg-slate-50 rounded-lg border border-slate-200">
                 <div class="flex-1 space-y-2">
                   <select formControlName="categoria" class="w-full text-xs rounded border-slate-200 bg-white">
                     <option value="PERIFERICO">Periférico</option>
                     <option value="EQUIPO">Equipo (Activo)</option>
                     <option value="OTRO">Otro</option>
                   </select>
                   <input type="text" formControlName="nombre" placeholder="Nombre (Ej: Mouse)" class="w-full text-sm rounded border-slate-200">
                   <input *ngIf="item.get('categoria')?.value === 'EQUIPO'" type="text" formControlName="serial" placeholder="Serial (Ej: PC-123)" class="w-full text-xs rounded border-slate-200 font-mono">
                 </div>
                 <button type="button" (click)="removeItem(i)" class="p-1 text-red-400 hover:text-red-600">
                   <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                 </button>
               </div>
             </div>
          </div>
          
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" (click)="closeModal()" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200">Cancelar</button>
            <button type="submit" [disabled]="prestamoForm.invalid" class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-slate-800 rounded-lg disabled:opacity-50">Registrar Préstamo</button>
          </div>
        </form>
      </div>
    </div>
  `
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
      nombre: ['', Validators.required],
      serial: ['']
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.prestamoForm.valid) {
      const { usuario, items } = this.prestamoForm.value;
      
      const itemsMapped: ItemPrestamo[] = (items as any[]).map(val => ({
        id: val.serial || crypto.randomUUID(),
        nombre: val.nombre,
        categoria: val.categoria,
        esActivo: val.categoria === 'EQUIPO',
        serial: val.serial
      }));

      // Basic validation
      if (itemsMapped.length === 0) {
        this.toast.error('Debe agregar al menos un ítem');
        return;
      }

      this.prestamosService.registrarPrestamo(usuario!, itemsMapped);
      this.closeModal();
    }
  }
}
