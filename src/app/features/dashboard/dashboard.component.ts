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
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <h1 class="text-2xl font-bold text-slate-900">
          Hola, {{ authService.currentUser()?.name}}!
        </h1>
        <p class="text-slate-500 mt-1">
          Aquí tienes un resumen del estado actual de la plataforma.
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6" *ngIf="stats() as s">
        
        <!-- Inventario Card -->
        <div (click)="navigateTo('/inventario')" 
             class="bg-white rounded-xl shadow-sm p-6 border border-slate-100 cursor-pointer hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700 group-hover:text-primary transition-colors">Inventario</h3>
            <div class="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
              <lucide-icon name="monitor" class="w-6 h-6"></lucide-icon>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-2 rounded hover:bg-slate-50">
              <span class="text-slate-500">Total Equipos</span>
              <span class="font-bold text-slate-900">{{ s.inventario.total }}</span>
            </div>
            <div (click)="navigateTo('/inventario', { estado: 'DISPONIBLE' }); $event.stopPropagation()" 
                 class="flex justify-between items-center p-2 rounded hover:bg-green-50 cursor-pointer">
              <span class="text-slate-500">Disponibles</span>
              <span class="font-bold text-green-600">{{ s.inventario.disponibles }}</span>
            </div>
            <div (click)="navigateTo('/inventario', { estado: 'ALMACEN' }); $event.stopPropagation()"
                 class="flex justify-between items-center p-2 rounded hover:bg-indigo-50 cursor-pointer">
              <span class="text-slate-500">En Almacén</span>
              <span class="font-bold text-indigo-600">{{ s.inventario.almacen }}</span>
            </div>
            <div (click)="navigateTo('/inventario', { estado: 'REPARACION' }); $event.stopPropagation()"
                 class="flex justify-between items-center p-2 rounded hover:bg-yellow-50 cursor-pointer">
              <span class="text-slate-500">En Reparación</span>
              <span class="font-bold text-yellow-600">{{ s.inventario.reparacion }}</span>
            </div>
          </div>
        </div>

        <!-- Actas Card -->
        <div (click)="navigateTo('/actas')" 
             class="bg-white rounded-xl shadow-sm p-6 border border-slate-100 cursor-pointer hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700 group-hover:text-primary transition-colors">Actas</h3>
            <div class="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
              <lucide-icon name="file-text" class="w-6 h-6"></lucide-icon>
            </div>
          </div>
          <div class="space-y-4">
            <div class="text-center py-4 bg-purple-50 rounded-lg">
              <span class="block text-4xl font-bold text-purple-600">{{ s.actas.pendientes }}</span>
              <span class="text-sm text-purple-700 font-medium">Pendientes de Aprobación</span>
            </div>
            <div class="flex justify-between items-center text-sm text-slate-500 px-2">
              <span>Generadas hoy</span>
              <span class="font-medium text-slate-900">{{ s.actas.hoy }}</span>
            </div>
            <div class="flex justify-between items-center text-sm text-slate-500 px-2" *ngIf="s.actas.errores > 0">
              <span class="text-red-500">Errores</span>
              <span class="font-medium text-red-600">{{ s.actas.errores }}</span>
            </div>
          </div>
        </div>

        <!-- Correos Card -->
        <div (click)="navigateTo('/correos')" 
             class="bg-white rounded-xl shadow-sm p-6 border border-slate-100 cursor-pointer hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700 group-hover:text-primary transition-colors">Correos</h3>
            <div class="p-2 bg-cyan-50 text-cyan-600 rounded-lg group-hover:bg-cyan-100 transition-colors">
              <lucide-icon name="mail" class="w-6 h-6"></lucide-icon>
            </div>
          </div>
          <div class="space-y-4">
            <div class="text-center py-4 bg-cyan-50 rounded-lg">
              <span class="block text-4xl font-bold text-cyan-600">{{ s.correos.hoy }}</span>
              <span class="text-sm text-cyan-700 font-medium">Enviados hoy</span>
            </div>
             <div class="flex justify-between items-center text-sm text-slate-500 px-2">
              <span>En cola</span>
              <span class="font-medium text-slate-900">{{ s.correos.pendientes }}</span>
            </div>
            <div class="flex justify-between items-center text-sm text-slate-500 px-2" *ngIf="s.correos.errores > 0">
              <span class="text-red-500">Errores</span>
              <span class="font-medium text-red-600">{{ s.correos.errores }}</span>
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
