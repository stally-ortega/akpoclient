import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActasService } from '../../services';
import { TablaEquiposComponent } from '../../components';
import { TipoActa, CrearActaRequest } from '../../models';

/**
 * Page component for creating new actas.
 * Includes form for equipment, peripherals, and user validation.
 */
@Component({
  selector: 'app-crear-acta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaEquiposComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Crear Acta</h1>
      </div>

      <form [formGroup]="actaForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Tipo de Acta -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo de Acta</label>
          <select formControlName="tipoActa" 
            class="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm">
            <option value="ASIGNACION">Asignación</option>
            <option value="DEVOLUCION">Devolución</option>
          </select>
        </div>

        <!-- Usuario Destino -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Usuario Destino</label>
          <input type="text" formControlName="usuarioDestino" 
            (blur)="validarUsuarioDestino()"
            class="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm placeholder-slate-400"
            placeholder="nombre.apellido">
          <div *ngIf="usuarioValidado()" class="mt-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm text-success">{{ nombreCompletoUsuario() }}</span>
          </div>
          <div *ngIf="actaForm.get('usuarioDestino')?.touched && actaForm.get('usuarioDestino')?.invalid" 
            class="mt-2 text-sm text-danger dark:text-red-400">
            Usuario no válido o no encontrado
          </div>
        </div>

        <!-- Tabla de Equipos -->
        <app-tabla-equipos 
          [parentForm]="actaForm"
          (equipoAgregado)="agregarEquipo()"
          (equipoEliminado)="eliminarEquipo($event)">
        </app-tabla-equipos>

        <!-- Periféricos -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700" formGroupName="perifericos">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Periféricos</h3>
          <div class="space-y-3">
            <label class="flex items-center gap-3">
              <input type="checkbox" formControlName="teclado" 
                class="rounded border-slate-300 dark:border-slate-600 text-accent focus:ring-accent bg-white dark:bg-slate-900">
              <span class="text-sm text-slate-700 dark:text-slate-300">Teclado</span>
            </label>
            <label class="flex items-center gap-3">
              <input type="checkbox" formControlName="mouse" 
                class="rounded border-slate-300 dark:border-slate-600 text-accent focus:ring-accent bg-white dark:bg-slate-900">
              <span class="text-sm text-slate-700 dark:text-slate-300">Mouse</span>
            </label>
            <label class="flex items-center gap-3">
              <input type="checkbox" formControlName="basePortatil" 
                class="rounded border-slate-300 dark:border-slate-600 text-accent focus:ring-accent bg-white dark:bg-slate-900">
              <span class="text-sm text-slate-700 dark:text-slate-300">Base Portátil</span>
            </label>
            <div class="space-y-2">
              <label class="flex items-center gap-3">
                <input type="checkbox" formControlName="diademaIncluido" 
                  class="rounded border-slate-300 dark:border-slate-600 text-accent focus:ring-accent bg-white dark:bg-slate-900">
                <span class="text-sm text-slate-700 dark:text-slate-300">Diadema</span>
              </label>
              <input *ngIf="actaForm.get('perifericos.diademaIncluido')?.value" 
                type="text" formControlName="diademaSerial" 
                class="ml-8 block w-full max-w-xs rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm placeholder-slate-400"
                placeholder="Serial de diadema">
            </div>
          </div>
        </div>

        <!-- Ticket (Opcional) -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ticket (Opcional)</label>
          <input type="number" formControlName="ticket" 
            class="block w-full max-w-xs rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm placeholder-slate-400"
            placeholder="Número de ticket">
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-4">
          <button type="button" (click)="cancelar()" 
            class="px-6 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button type="submit" [disabled]="actaForm.invalid || isSubmitting()" 
            class="px-6 py-2 bg-primary text-white rounded-md hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!isSubmitting()">Generar Acta</span>
            <span *ngIf="isSubmitting()" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando...
            </span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
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

  validarUsuarioDestino() {
    const username = this.actaForm.get('usuarioDestino')?.value;
    if (username && username.length > 3) {
      this.actasService.validarUsuario(username).subscribe({
        next: (response) => {
          if (response.valido) {
            this.usuarioValidado.set(true);
            this.nombreCompletoUsuario.set(response.nombreCompleto || '');
            this.actaForm.get('usuarioDestino')?.setErrors(null);
          } else {
            this.usuarioValidado.set(false);
            this.actaForm.get('usuarioDestino')?.setErrors({ invalid: true });
          }
        },
        error: () => {
          this.usuarioValidado.set(false);
          this.actaForm.get('usuarioDestino')?.setErrors({ invalid: true });
        }
      });
    }
  }

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
