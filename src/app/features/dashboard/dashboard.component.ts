import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService, DashboardStats } from './services';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 animate-fade-in">
      
      <!-- Welcome Section -->
      <!-- Welcome Section (Compact) -->
      <div class="relative overflow-hidden bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl shadow-lg p-5 text-white">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-4">
             <div class="p-2 bg-white/10 rounded-lg shrink-0">
                <lucide-icon name="layout-dashboard" class="w-6 h-6 text-blue-200"></lucide-icon>
             </div>
             <div>
               <h1 class="text-2xl font-bold tracking-tight">
                 Hola, <span class="text-blue-200">{{ authService.currentUser()?.name }}</span>
               </h1>
               <p class="text-blue-100 text-sm opacity-90">
                 Resumen general de operaciones.
               </p>
             </div>
          </div>

          <div class="hidden md:block opacity-80">
            <span class="text-xs font-mono bg-white/10 px-3 py-1 rounded-lg border border-white/10 flex items-center gap-2">
              <lucide-icon name="calendar" class="w-3.5 h-3.5"></lucide-icon>
              {{ today | date:'fullDate' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" *ngIf="stats() as s">
        
        <!-- Prestamos Card -->
        <div (click)="navigateTo('/prestamos')" 
             class="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 cursor-pointer hover:-translate-y-1">
          <div class="absolute top-0 right-0 w-24 h-24 bg-orange-100/50 dark:bg-orange-500/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-orange-50 dark:bg-slate-700/50 text-orange-600 dark:text-orange-400 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <lucide-icon name="briefcase" class="w-6 h-6"></lucide-icon>
              </div>
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Préstamos</span>
            </div>
            
            <div class="mb-4">
              <span class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ s.prestamos.totalActivos }}</span>
              <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">Activos en curso</p>
            </div>

            <div class="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
               <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Hoy</span>
                <span class="font-bold text-slate-700 dark:text-indigo-300">{{ s.prestamos.realizadosHoy }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-green-500"></div> Devoluciones</span>
                <span class="font-bold text-green-600 dark:text-green-400">{{ s.prestamos.devolucionesHoy }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-red-500"></div> Vencidos</span>
                <span class="font-bold text-red-600 dark:text-red-400">{{ s.prestamos.vencidos }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventario Card -->
        <div (click)="navigateTo('/inventario')" 
             class="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 cursor-pointer hover:-translate-y-1"
             style="animation-delay: 100ms">
           <div class="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 dark:bg-blue-500/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>

           <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-blue-50 dark:bg-slate-700/50 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <lucide-icon name="monitor" class="w-6 h-6"></lucide-icon>
              </div>
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Inventario</span>
            </div>

            <div class="mb-4">
              <span class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ s.inventario.total }}</span>
              <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">Equipos Totales</p>
            </div>

            <div class="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
               <div (click)="navigateTo('/inventario', { estado: 'Activo' }); $event.stopPropagation()" class="flex justify-between items-center text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded cursor-pointer -mx-1 transition-colors">
                <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-green-500"></div> Activos</span>
                <span class="font-bold text-green-600 dark:text-green-400">{{ s.inventario.asignados }}</span>
              </div>
               <div (click)="navigateTo('/inventario', { estado: 'Funcional inactivo' }); $event.stopPropagation()" class="flex justify-between items-center text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded cursor-pointer -mx-1 transition-colors">
                <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> En Stock</span>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ s.inventario.almacen }}</span>
              </div>
              <div (click)="navigateTo('/inventario', { estado: 'Dañado' }); $event.stopPropagation()" class="flex justify-between items-center text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded cursor-pointer -mx-1 transition-colors">
                <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Dañados</span>
                <span class="font-bold text-yellow-600 dark:text-yellow-400">{{ s.inventario.reparacion }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actas Card -->
        <div (click)="navigateTo('/actas')" 
             class="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 cursor-pointer hover:-translate-y-1"
             style="animation-delay: 200ms">
           <div class="absolute top-0 right-0 w-24 h-24 bg-purple-100/50 dark:bg-purple-500/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>

           <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-purple-50 dark:bg-slate-700/50 text-purple-600 dark:text-purple-400 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <lucide-icon name="file-text" class="w-6 h-6"></lucide-icon>
              </div>
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Actas</span>
            </div>

            <div class="mb-4">
              <span class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ s.actas.pendientes }}</span>
              <p class="text-sm text-purple-600 dark:text-purple-300 font-medium">Pendientes de firma</p>
            </div>

            <div class="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
               <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Hoy</span>
                <span class="font-bold text-slate-700 dark:text-white">{{ s.actas.hoy }}</span>
              </div>
              <div class="flex justify-between items-center text-sm" *ngIf="s.actas.errores > 0">
                <span class="text-red-500 flex items-center gap-1.5"><lucide-icon name="alert-circle" class="w-3 h-3"></lucide-icon> Errores</span>
                <span class="font-bold text-red-600 dark:text-red-400">{{ s.actas.errores }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Correos Card -->
         <div (click)="navigateTo('/correos')" 
             class="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 cursor-pointer hover:-translate-y-1"
             style="animation-delay: 300ms">
           <div class="absolute top-0 right-0 w-24 h-24 bg-cyan-100/50 dark:bg-cyan-500/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>

           <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-cyan-50 dark:bg-slate-700/50 text-cyan-600 dark:text-cyan-400 rounded-xl group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <lucide-icon name="mail" class="w-6 h-6"></lucide-icon>
              </div>
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Correos</span>
            </div>

            <div class="mb-4">
              <span class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ s.correos.enviadosHoy }}</span>
              <p class="text-sm text-cyan-600 dark:text-cyan-400 font-medium">Enviados Hoy</p>
            </div>

            <div class="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
               <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Histórico</span>
                <span class="font-bold text-slate-700 dark:text-white">{{ s.correos.totalEnviados }}</span>
              </div>
              <div class="flex justify-between items-center text-sm" *ngIf="s.correos.erroresHoy > 0">
                 <span class="text-red-500 flex items-center gap-1.5"><lucide-icon name="alert-circle" class="w-3 h-3"></lucide-icon> Errores Hoy</span>
                <span class="font-bold text-red-600 dark:text-red-400">{{ s.correos.erroresHoy }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  
  stats = signal<DashboardStats | null>(null);
  today = new Date(); // Added for date display

  ngOnInit() {
    this.dashboardService.getStats().subscribe(data => this.stats.set(data));
  }

  navigateTo(path: string, queryParams: any = {}) {
    this.router.navigate([path], { queryParams });
  }
}
