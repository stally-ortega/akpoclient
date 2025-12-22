import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService, DashboardStats } from './services';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
          Hola, {{ authService.currentUser()?.name}}!
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">
          Aquí tienes un resumen del estado actual de la plataforma.
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" *ngIf="stats() as s">
        
        <!-- Prestamos Card -->
        <div *ngIf="s.prestamos" (click)="navigateTo('/prestamos')" 
             class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-white transition-colors">Préstamos</h3>
            <div class="p-2 bg-orange-50 dark:bg-slate-700 text-orange-600 dark:text-orange-400 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-slate-600 transition-colors">
              <lucide-icon name="briefcase" class="w-6 h-6"></lucide-icon>
            </div>
          </div>
          <div class="space-y-4">
             <div class="text-center py-4 bg-orange-50 dark:bg-slate-900/50 rounded-lg">
              <span class="block text-4xl font-bold text-orange-600 dark:text-orange-400">{{ s.prestamos.totalActivos }}</span>
              <span class="text-sm text-orange-700 dark:text-orange-300 font-medium">Total Activos</span>
            </div>
            
            <div class="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 px-2">
              <span>Realizados Hoy</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ s.prestamos.realizadosHoy }}</span>
            </div>

            <div class="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 px-2">
              <span>Devoluciones Hoy</span>
              <span class="font-bold text-green-600 dark:text-green-400">{{ s.prestamos.devolucionesHoy }}</span>
            </div>

            <div class="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 px-2">
              <span>Vencidos</span>
              <span class="font-bold text-red-600 dark:text-red-400">{{ s.prestamos.vencidos }}</span>
            </div>
          </div>
        </div>

        <!-- Inventario Card -->
        <div (click)="navigateTo('/inventario')" 
             class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-white transition-colors">Inventario</h3>
            <div class="p-2 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-slate-600 transition-colors">
              <lucide-icon name="monitor" class="w-6 h-6"></lucide-icon>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <span class="text-slate-500 dark:text-slate-400">Total Equipos</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ s.inventario.total }}</span>
            </div>
            <div (click)="navigateTo('/inventario', { estado: 'DISPONIBLE' }); $event.stopPropagation()" 
                 class="flex justify-between items-center p-2 rounded hover:bg-green-50 dark:hover:bg-slate-700/50 cursor-pointer">
              <span class="text-slate-500 dark:text-slate-400">Disponibles</span>
              <span class="font-bold text-green-600 dark:text-green-400">{{ s.inventario.disponibles }}</span>
            </div>
            <div (click)="navigateTo('/inventario', { estado: 'ALMACEN' }); $event.stopPropagation()"
                 class="flex justify-between items-center p-2 rounded hover:bg-indigo-50 dark:hover:bg-slate-700/50 cursor-pointer">
              <span class="text-slate-500 dark:text-slate-400">En Almacén</span>
              <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ s.inventario.almacen }}</span>
            </div>
            <div (click)="navigateTo('/inventario', { estado: 'REPARACION' }); $event.stopPropagation()"
                 class="flex justify-between items-center p-2 rounded hover:bg-yellow-50 dark:hover:bg-slate-700/50 cursor-pointer">
              <span class="text-slate-500 dark:text-slate-400">En Reparación</span>
              <span class="font-bold text-yellow-600 dark:text-yellow-400">{{ s.inventario.reparacion }}</span>
            </div>
          </div>
        </div>

        <!-- Actas Card -->
        <div (click)="navigateTo('/actas')" 
             class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-white transition-colors">Actas</h3>
            <div class="p-2 bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-slate-600 transition-colors">
              <lucide-icon name="file-text" class="w-6 h-6"></lucide-icon>
            </div>
          </div>
          <div class="space-y-4">
            <div class="text-center py-4 bg-purple-50 dark:bg-slate-900/50 rounded-lg">
              <span class="block text-4xl font-bold text-purple-600 dark:text-purple-400">{{ s.actas.pendientes }}</span>
              <span class="text-sm text-purple-700 dark:text-purple-300 font-medium">Pendientes de Aprobación</span>
            </div>
            <div class="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 px-2">
              <span>Generadas hoy</span>
              <span class="font-medium text-slate-900 dark:text-white">{{ s.actas.hoy }}</span>
            </div>
            <div class="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 px-2" *ngIf="s.actas.errores > 0">
              <span class="text-red-500">Errores</span>
              <span class="font-medium text-red-600 dark:text-red-400">{{ s.actas.errores }}</span>
            </div>
          </div>
        </div>

        <!-- Correos Card -->
        <div (click)="navigateTo('/correos')" 
             class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-white transition-colors">Correos</h3>
            <div class="p-2 bg-cyan-50 dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 rounded-lg group-hover:bg-cyan-100 dark:group-hover:bg-slate-600 transition-colors">
              <lucide-icon name="mail" class="w-6 h-6"></lucide-icon>
            </div>
          </div>
          <div class="space-y-4">
            <div class="text-center py-4 bg-cyan-50 dark:bg-slate-900/50 rounded-lg">
              <span class="block text-4xl font-bold text-cyan-600 dark:text-cyan-400">{{ s.correos.enviadosHoy }}</span>
              <span class="text-sm text-cyan-700 dark:text-cyan-300 font-medium">Enviados Hoy</span>
            </div>
             <div class="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 px-2">
              <span>Errores Hoy</span>
              <span class="font-medium text-red-600 dark:text-red-400">{{ s.correos.erroresHoy }}</span>
            </div>
            <div class="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 px-2">
              <span>Total Histórico</span>
              <span class="font-medium text-slate-900 dark:text-white">{{ s.correos.totalEnviados }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  
  stats = signal<DashboardStats | null>(null);

  ngOnInit() {
    this.dashboardService.getStats().subscribe(data => this.stats.set(data));
  }

  navigateTo(path: string, queryParams: any = {}) {
    this.router.navigate([path], { queryParams });
  }
}
