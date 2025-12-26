import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AlertasService } from '../services/alertas.service';
import { FormularioAlertaComponent } from '../components/formulario-alerta.component';
import { AlertConfig } from '../models/alertas.models';

@Component({
  selector: 'app-alertas-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormularioAlertaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <!-- Premium Header -->
      <div class="relative overflow-hidden bg-gradient-to-r from-rose-900 to-red-900 rounded-2xl shadow-lg p-5 text-white">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-orange-500/10 rounded-full blur-xl"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-4">
             <div class="p-2 bg-white/10 rounded-lg shrink-0">
                <lucide-icon name="bell-ring" class="w-6 h-6 text-rose-200"></lucide-icon>
             </div>
             <div>
               <h1 class="text-2xl font-bold tracking-tight">Configuración de Alertas</h1>
               <p class="text-rose-100 text-sm opacity-90">Administración de notificaciones automáticas.</p>
             </div>
          </div>
          
          <button (click)="openCreateModal()" class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all border border-white/20 shadow-sm text-sm">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            <span>Nueva Alerta</span>
          </button>
        </div>
      </div>

      <!-- Alerts List -->
      <div class="grid gap-4">
        <div *ngFor="let alerta of alertasService.alertas()" 
             class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
          
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300">
              <lucide-icon name="bell" class="w-6 h-6"></lucide-icon>
            </div>
            <div>
              <div class="flex items-center gap-3 mb-1">
                <h3 class="font-semibold text-slate-900 dark:text-white">{{ alerta.nombre }}</h3>
                <span class="px-2 py-0.5 text-xs font-medium rounded-full"
                      [ngClass]="{
                        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200': alerta.modulo === 'PRESTAMOS',
                        'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200': alerta.modulo === 'INVENTARIO',
                        'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200': alerta.modulo === 'ACTAS',
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': alerta.modulo === 'GENERAL'
                      }">
                  {{ alerta.modulo }}
                </span>
                <span *ngIf="alerta.tipo === 'ESPECIFICA'" class="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                  Específica
                </span>
              </div>
              
              <p class="text-slate-600 dark:text-slate-300 text-sm mb-2">{{ alerta.mensaje }}</p>
              
              <div class="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div class="flex items-center gap-1">
                  <lucide-icon name="clock" class="w-3 h-3"></lucide-icon>
                  <span>Inicia: {{ alerta.horaInicio }}</span>
                </div>
                <div *ngIf="alerta.target" class="flex items-center gap-1">
                  <lucide-icon name="user" class="w-3 h-3"></lucide-icon>
                  <span>Target: {{ alerta.target }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <!-- Toggle Switch -->
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" [checked]="alerta.activo" (change)="toggleAlerta(alerta)" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
            </label>

            <button (click)="deleteAlerta(alerta)" class="p-2 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <lucide-icon name="trash" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <app-formulario-alerta *ngIf="showModal" 
      (close)="closeModal()"
      (save)="saveAlerta($event)">
    </app-formulario-alerta>
  `
})
export class AlertasPageComponent {
  public alertasService = inject(AlertasService);
  
  showModal = false;

  openCreateModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveAlerta(alerta: Omit<AlertConfig, 'id' | 'isGlobal' | 'userId'>) {
    this.alertasService.addAlerta(alerta);
    this.closeModal();
  }

  toggleAlerta(alerta: AlertConfig) {
    this.alertasService.toggleAlerta(alerta.id);
  }

  deleteAlerta(alerta: AlertConfig) {
    if (confirm(`¿Estás seguro de eliminar la alerta "${alerta.nombre}"?`)) {
      this.alertasService.deleteAlerta(alerta.id);
    }
  }
}
