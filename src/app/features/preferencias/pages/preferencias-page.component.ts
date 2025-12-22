import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LucideAngularModule, Sun, Moon, Monitor, Variable, Database, CheckCircle, Trash, Upload, Download } from 'lucide-angular';
import { PreferenciasService } from '../services/preferencias.service';
import { AlertasService } from '../../alertas/services/alertas.service';
import { UserVariable } from '../models/preferencias.models';
import { AlertConfig } from '../../alertas/models/alertas.models';

@Component({
  selector: 'app-preferencias-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    LucideAngularModule
  ],
  providers: [],
  template: `
    <div class="space-y-8 max-w-5xl mx-auto pb-20">
      
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Preferencias</h1>
        <p class="text-slate-500 dark:text-slate-400">Personaliza tu experiencia y configura variables globales.</p>
      </div>

      <!-- 1. Theme Configuration -->
      <section class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
           <lucide-icon name="monitor" class="w-5 h-5 text-purple-500"></lucide-icon> Apariencia
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <!-- Light Mode Card -->
           <button (click)="prefs.setTheme('light')" 
              [class.ring-2]="prefs.theme() === 'light'"
              class="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all ring-offset-2 ring-primary relative overflow-hidden group">
              <div class="p-3 bg-orange-100 text-orange-600 rounded-full">
                 <lucide-icon name="sun" class="w-6 h-6"></lucide-icon>
              </div>
              <div class="text-left">
                 <h3 class="font-bold text-slate-900">Modo Claro</h3>
                 <p class="text-xs text-slate-500">Diseño limpio y luminoso</p>
              </div>
              <!-- Checkmark -->
              <div *ngIf="prefs.theme() === 'light'" class="absolute top-2 right-2 text-primary">
                 <lucide-icon name="check-circle" class="w-4 h-4"></lucide-icon>
              </div>
           </button>

           <!-- Dark Mode Card -->
           <button (click)="prefs.setTheme('dark')" 
              [class.ring-2]="prefs.theme() === 'dark'"
              class="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ring-offset-2 ring-primary relative overflow-hidden group"
              [ngClass]="{'bg-slate-50 dark:bg-slate-800': prefs.theme() !== 'dark', 'bg-slate-900 text-white': prefs.theme() === 'dark'}">
              <div class="p-3 rounded-full" [ngClass]="{'bg-slate-200 text-slate-600': prefs.theme() !== 'dark', 'bg-slate-800 text-purple-400': prefs.theme() === 'dark'}">
                 <lucide-icon name="moon" class="w-6 h-6"></lucide-icon>
              </div>
              <div class="text-left">
                 <h3 class="font-bold" [ngClass]="{'text-slate-900 dark:text-white': prefs.theme() !== 'dark', 'text-white': prefs.theme() === 'dark'}">Modo Oscuro</h3>
                 <p class="text-xs" [ngClass]="{'text-slate-500': prefs.theme() !== 'dark', 'text-slate-400': prefs.theme() === 'dark'}">Alto contraste, menos fatiga</p>
              </div>
              <div *ngIf="prefs.theme() === 'dark'" class="absolute top-2 right-2 text-primary">
                 <lucide-icon name="check-circle" class="w-4 h-4"></lucide-icon>
              </div>
           </button>
        </div>
      </section>

      <!-- 2. Variables Management -->
      <section class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
         <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
               <lucide-icon name="variable" class="w-5 h-5 text-blue-500"></lucide-icon> Variables de Entorno
            </h2>
            <button (click)="toggleVarForm()" class="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium">
               {{ showVarForm() ? 'Cancelar' : '+ Nueva Variable' }}
            </button>
         </div>

         <!-- Add Variable Form -->
         <div *ngIf="showVarForm()" class="mb-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
            <form [formGroup]="varForm" (ngSubmit)="onSubmitVar()" class="flex flex-col md:flex-row gap-4 items-end">
               <div class="flex-1 w-full">
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">CLAVE</label>
                  <input formControlName="key" type="text" class="w-full text-sm rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white uppercase font-mono" placeholder="Ej: MAX_LOANS">
               </div>
               <div class="flex-1 w-full">
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">TIPO</label>
                  <select formControlName="type" class="w-full text-sm rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                     <option value="NUMBER">Número</option>
                     <option value="STRING">Texto</option>
                     <option value="BOOLEAN">Booleano</option>
                  </select>
               </div>
               <div class="flex-1 w-full">
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">VALOR</label>
                  <input formControlName="value" type="text" class="w-full text-sm rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="Valor...">
               </div>
               <button type="submit" [disabled]="varForm.invalid" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50">
                  Guardar
               </button>
            </form>
         </div>

         <!-- Variables Table -->
         <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
               <thead class="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                     <th class="px-4 py-3 rounded-l-lg">Clave</th>
                     <th class="px-4 py-3">Valor</th>
                     <th class="px-4 py-3">Tipo</th>
                     <th class="px-4 py-3 rounded-r-lg text-right">Acciones</th>
                  </tr>
               </thead>
               <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr *ngFor="let v of prefs.userVariables()" class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                     <td class="px-4 py-3 font-mono font-medium text-slate-700 dark:text-slate-200">{{ v.key }}</td>
                     <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ v.value }}</td>
                     <td class="px-4 py-3">
                        <span class="px-2 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{{ v.type }}</span>
                     </td>
                     <td class="px-4 py-3 text-right">
                        <button (click)="prefs.deleteVariable(v.id)" class="text-slate-400 hover:text-red-500 transition-colors">
                           <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                        </button>
                     </td>
                  </tr>
                  <tr *ngIf="prefs.userVariables().length === 0">
                     <td colspan="4" class="px-4 py-8 text-center text-slate-400">
                        No has creado variables personalizadas.
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </section>

      <!-- 3. Data Export/Import -->
      <section class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
         <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <lucide-icon name="database" class="w-5 h-5 text-green-500"></lucide-icon> Gestión de Datos (Portabilidad)
         </h2>
         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            
            <!-- Vertical Divider for Desktop -->
            <div class="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700 -translate-x-1/2"></div>

            <!-- Variables -->
            <div class="space-y-4">
               <h3 class="text-sm font-bold uppercase text-slate-500 tracking-wider">Variables de Entorno</h3>
               <div class="flex flex-col gap-3">
                  <button (click)="exportVariables()" class="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-400 transition-colors group">
                     <span class="text-sm font-medium text-slate-700 dark:text-slate-200">Exportar Variables (JSON)</span>
                     <lucide-icon name="download" class="w-4 h-4 text-slate-400 group-hover:text-blue-500"></lucide-icon>
                  </button>
                  
                  <label class="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-green-400 transition-colors group cursor-pointer">
                     <span class="text-sm font-medium text-slate-700 dark:text-slate-200">Importar Variables</span>
                     <lucide-icon name="upload" class="w-4 h-4 text-slate-400 group-hover:text-green-500"></lucide-icon>
                     <input type="file" (change)="importVariables($event)" class="hidden" accept=".json">
                  </label>
               </div>
            </div>

            <!-- Mobile Divider -->
            <div class="md:hidden w-full h-px bg-slate-200 dark:bg-slate-700"></div>

            <!-- Alerts -->
            <div class="space-y-4">
               <h3 class="text-sm font-bold uppercase text-slate-500 tracking-wider">Reglas de Alerta</h3>
               <div class="flex flex-col gap-3">
                  <button (click)="exportAlerts()" class="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-400 transition-colors group">
                     <span class="text-sm font-medium text-slate-700 dark:text-slate-200">Exportar Mis Alertas (JSON)</span>
                     <lucide-icon name="download" class="w-4 h-4 text-slate-400 group-hover:text-blue-500"></lucide-icon>
                  </button>
                  
                  <label class="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-green-400 transition-colors group cursor-pointer">
                     <span class="text-sm font-medium text-slate-700 dark:text-slate-200">Importar Alertas</span>
                     <lucide-icon name="upload" class="w-4 h-4 text-slate-400 group-hover:text-green-500"></lucide-icon>
                     <input type="file" (change)="importAlerts($event)" class="hidden" accept=".json">
                  </label>
               </div>
            </div>
         </div>
      </section>

    </div>
  `
})
export class PreferenciasPageComponent {
  public prefs = inject(PreferenciasService);
  public alertasService = inject(AlertasService);
  private fb = inject(FormBuilder);

  showVarForm = signal(false);

  varForm = this.fb.group({
    key: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_]+$/)]], // Uppercase only
    value: ['', Validators.required],
    type: ['NUMBER', Validators.required]
  });

  toggleVarForm() {
    this.showVarForm.update(v => !v);
  }

  onSubmitVar() {
    if (this.varForm.valid) {
      this.prefs.addVariable({
        key: this.varForm.value.key!,
        value: this.varForm.value.value,
        type: this.varForm.value.type as any
      });
      this.varForm.reset({ type: 'NUMBER' });
      this.showVarForm.set(false);
    }
  }

  // --- Export / Import Handlers ---

  exportVariables() {
    const json = this.prefs.exportData();
    if (json) this.downloadJson(json, 'akpo_variables.json');
  }

  exportAlerts() {
    // Export only alerts visible to user (which includes Global but we probably only want to export Custom ones? Or all?)
    // User requested "Export the alert rules created in their user".
    // So filter by ownership.
    const all = this.alertasService.alertas();
    // Assuming we can check ownership via properties we added.
    // Ideally we'd filter strictly by owner, but user might want to backup everything they see.
    // Let's filter by ownership if they are marked as non-global.
    
    // We cannot access 'userId' easily if it's not exposed in the signal?
    // Wait, 'alertas()' signal returns 'AlertConfig[]' which NOW has 'userId'.
    // We can filter by !isGlobal.
    const myAlerts = all.filter(a => !a.isGlobal);
    
    const json = JSON.stringify(myAlerts, null, 2);
    this.downloadJson(json, 'akpo_my_alerts.json');
  }

  importVariables(event: Event) {
    this.readFile(event, (content) => this.prefs.importData(content));
  }

  importAlerts(event: Event) {
    this.readFile(event, (content) => this.alertasService.importAlerts(content));
  }

  // --- Utils ---

  private downloadJson(content: string, filename: string) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private readFile(event: Event, callback: (content: string) => void) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => callback(e.target?.result as string);
      reader.readAsText(input.files[0]);
      input.value = ''; // Reset
    }
  }
}
