import { Component, EventEmitter, Output, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AlertConfig, ModuloAlerta, TipoAlerta, RuleGroup } from '../models/alertas.models';
import { RuleBuilderComponent } from './rule-builder.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { PRESTAMOS_FIELDS, INVENTARIO_FIELDS, ACTAS_FIELDS } from '../models/alertas.dictionary';

@Component({
  selector: 'app-formulario-alerta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RuleBuilderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" (click)="closeModal()">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <h2 class="text-lg font-bold text-slate-800 dark:text-white">Nueva Alerta</h2>
          <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-6">
          <form [formGroup]="alertaForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Basic Info -->
              <div class="space-y-4">
                 <h3 class="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Información Básica</h3>
                 
                 <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
                  <input type="text" formControlName="nombre" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder-slate-400" placeholder="Ej: Préstamos Vencidos">
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mensaje</label>
                  <input type="text" formControlName="mensaje" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder-slate-400" placeholder="Mensaje a mostrar...">
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Módulo</label>
                      <select formControlName="modulo" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
                        <option value="PRESTAMOS">Préstamos</option>
                        <option value="INVENTARIO">Inventario</option>
                        <option value="ACTAS">Actas</option>
                        <option value="GENERAL">General</option>
                      </select>
                  </div>
                  <div>
                      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hora Inicio</label>
                      <input type="time" formControlName="horaInicio" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
                  </div>
                </div>
              </div>

              <!-- Rule Builder Area -->
              <div class="space-y-4">
                <h3 class="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Condiciones (Lógica)</h3>
                
                <div class="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-700 min-h-[300px]">
                   <app-rule-builder 
                      [group]="rootRule()" 
                      [availableFields]="currentFields()"
                      [isRoot]="true">
                   </app-rule-builder>
                </div>

               <!-- Trigger Logic -->
               <div class="space-y-4">
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Lógica de Disparo (Cuantitativa)</h3>
                  <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                     <div class="flex items-center gap-2">
                        <input type="checkbox" id="useTrigger" [formControl]="useTriggerControl" class="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary bg-white dark:bg-slate-900">
                        <label for="useTrigger" class="text-sm font-medium text-slate-700 dark:text-slate-300">Validar Cantidad de Resultados</label>
                     </div>

                     <div class="flex items-center gap-2" *ngIf="useTriggerControl.value">
                        <span class="text-sm text-slate-600 dark:text-slate-400">Disparar si conteo es</span>
                        <select formControlName="triggerOperator" class="rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                           <option value="GT">Mayor que (>)</option>
                           <option value="GTE">Mayor o igual (>=)</option>
                           <option value="LT">Menor que (<)</option>
                           <option value="LTE">Menor o igual (<=)</option>
                           <option value="EQ">Igual a (=)</option>
                        </select>
                        <input type="number" formControlName="triggerValue" class="w-20 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="0">
                     </div>
                     <div *ngIf="!useTriggerControl.value" class="text-xs text-slate-400 italic">
                        (Por defecto: Dispara si existe al menos 1 resultado)
                     </div>
                  </div>
               </div>
              </div>
            </div>

            <div class="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" (click)="closeModal()" class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">Cancelar</button>
              <button type="submit" [disabled]="alertaForm.invalid" class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-slate-800 dark:bg-blue-500 dark:hover:bg-blue-400 rounded-lg disabled:opacity-50">Guardar Alerta</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})


export class FormularioAlertaComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<AlertConfig, 'id' | 'isGlobal' | 'userId'>>();

  private fb = inject(FormBuilder);

  // Default Root Rule
  rootRule = signal<RuleGroup>({
    operator: 'AND',
    rules: []
  });

  alertaForm = this.fb.group({
    nombre: ['', Validators.required],
    mensaje: ['', Validators.required],
    modulo: ['PRESTAMOS' as ModuloAlerta, Validators.required],
    tipo: ['GENERAL' as TipoAlerta, Validators.required],
    target: [''], 
    horaInicio: ['16:00', Validators.required],
    // Trigger Logic
    triggerOperator: ['GT'],
    triggerValue: [0]
  });

  useTriggerControl = this.fb.control(false);

  // Signal for module value changes (Safe + Reactive)
  selectedModulo = toSignal(
    this.alertaForm.controls.modulo.valueChanges, 
    { initialValue: 'PRESTAMOS' as ModuloAlerta }
  );

  // Dynamic fields
  currentFields = computed(() => {
    const mod = this.selectedModulo();
    return this.getFieldsForModule(mod as ModuloAlerta);
  });

  getFieldsForModule(modulo: ModuloAlerta) {
    switch (modulo) {
      case 'PRESTAMOS': return PRESTAMOS_FIELDS;
      case 'INVENTARIO': return INVENTARIO_FIELDS;
      case 'ACTAS': return ACTAS_FIELDS;
      default: return [];
    }
  }

  // ... rest of class ...

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.alertaForm.valid) {
      const formVal = this.alertaForm.value;
      
      const triggerCondition = this.useTriggerControl.value ? {
         operator: formVal.triggerOperator as any,
         value: formVal.triggerValue || 0
      } : undefined;

      this.save.emit({
        nombre: formVal.nombre!,
        mensaje: formVal.mensaje!,
        modulo: formVal.modulo as ModuloAlerta,
        tipo: 'GENERAL', 
        target: formVal.target || undefined,
        horaInicio: formVal.horaInicio!,
        activo: true,
        rootRule: this.rootRule(),
        triggerCondition
      });
    }
  }
}

