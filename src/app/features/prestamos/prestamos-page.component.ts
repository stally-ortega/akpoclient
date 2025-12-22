import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PrestamosService } from './services/prestamos.service';
import { FormularioPrestamoComponent } from './components/formulario-prestamo.component';
import { DetallePrestamoComponent } from './components/detalle-prestamo.component';
import { Prestamo } from './models/prestamo.models';

@Component({
  selector: 'app-prestamos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, FormularioPrestamoComponent, DetallePrestamoComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Control de Préstamos</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Gestiona préstamos diarios de equipos y periféricos.</p>
        </div>
        <div class="flex gap-3">
          <button (click)="prestamosService.exportarExcel()" class="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-blue-500 text-slate-700 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm">
            <lucide-icon name="download" class="w-5 h-5"></lucide-icon>
            Exportar Excel
          </button>
          <button (click)="showForm = true" class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-sm">
            <lucide-icon name="plus" class="w-5 h-5"></lucide-icon>
            Nuevo Préstamo
          </button>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col xl:flex-row gap-4 xl:items-center">
        <!-- Search -->
        <div class="flex-1 w-full relative">
          <lucide-icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></lucide-icon>
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="updateSearch($event)"
            placeholder="Buscar por usuario, ítem o serial..." 
            class="w-full pl-12 pr-4 py-2 rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary text-sm placeholder-slate-400">
        </div>
        
        <!-- Date Range -->
        <div class="flex flex-col sm:flex-row gap-3 xl:w-auto w-full">
           <div class="flex items-center gap-2 flex-1">
             <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap w-12">Desde:</span>
             <div class="relative w-full">
               <lucide-icon name="calendar" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></lucide-icon>
               <input 
                 type="datetime-local" 
                 [value]="prestamosService.filterStartDate()" 
                 (change)="updateStartDate($event)"
                 class="w-full pl-10 py-2 rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary text-sm">
             </div>
           </div>

           <div class="flex items-center gap-2 flex-1">
             <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap w-12">Hasta:</span>
             <div class="relative w-full">
                <lucide-icon name="calendar" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></lucide-icon>
                <input 
                  type="datetime-local" 
                  [value]="prestamosService.filterEndDate()" 
                  (change)="updateEndDate($event)"
                  class="w-full pl-10 py-2 rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary text-sm">
             </div>
           </div>
        </div>
      </div>

      <!-- Active Loans List (Compact) -->
      <div class="grid gap-4">
        <div *ngIf="prestamosService.prestamos().length === 0" class="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
           <lucide-icon name="search" class="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" *ngIf="searchTerm || prestamosService.filterStartDate()"></lucide-icon>
           <lucide-icon name="clock" class="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" *ngIf="!searchTerm && !prestamosService.filterStartDate()"></lucide-icon>
           <p class="text-slate-500 dark:text-slate-400">No se encontraron préstamos con los filtros actuales.</p>
        </div>

        <!-- Column Headers -->
        <div *ngIf="prestamosService.prestamos().length > 0" class="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <div class="col-span-4">Usuario</div>
          <div class="col-span-3">Fecha</div>
          <div class="col-span-2 text-center">Ítems</div>
          <div class="col-span-3 text-right">Estado</div>
        </div>

        <!-- Compact Card / Row -->
        <div *ngFor="let prestamo of prestamosService.prestamos()" 
             (click)="selectedPrestamo.set(prestamo)"
             class="group bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer">
          
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
             <!-- User -->
             <div class="col-span-1 md:col-span-4 flex items-center gap-3">
               <div class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-sm">
                 {{ prestamo.usuarioSolicitante.charAt(0).toUpperCase() }}
               </div>
               <span class="font-medium text-slate-900 dark:text-white truncate">{{ prestamo.usuarioSolicitante }}</span>
             </div>

             <!-- Date -->
             <div class="col-span-1 md:col-span-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <lucide-icon name="calendar" class="w-4 h-4 text-slate-400 dark:text-slate-500"></lucide-icon>
                <span class="truncate">{{ prestamo.fechaPrestamo | date:'medium' }}</span>
             </div>

             <!-- Items Summary -->
             <div class="col-span-1 md:col-span-2 flex justify-start md:justify-center">
               <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">
                 <lucide-icon name="package" class="w-3 h-3"></lucide-icon>
                 {{ prestamo.items.length }} ítems
               </span>
             </div>

             <!-- Status & Badge -->
             <div class="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center gap-3">
               <div class="md:text-right">
                  <span *ngIf="prestamo.estado === 'ACTIVO'" class="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-semibold rounded-full border border-yellow-100 dark:border-yellow-800">
                    <span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                    EN CURSO
                  </span>
                  <span *ngIf="prestamo.estado === 'FINALIZADO'" class="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full border border-green-100 dark:border-green-800">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    DEVUELTO
                  </span>
               </div>
               <lucide-icon name="chevron-right" class="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors"></lucide-icon>
             </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modals -->
    <app-formulario-prestamo *ngIf="showForm" (close)="showForm = false"></app-formulario-prestamo>
    
    <app-detalle-prestamo 
      *ngIf="selectedPrestamo()" 
      [prestamo]="selectedPrestamo()!" 
      (closeEvent)="selectedPrestamo.set(null)">
    </app-detalle-prestamo>
  `
})
export class PrestamosPageComponent {
  prestamosService = inject(PrestamosService);
  showForm = false;
  selectedPrestamo = signal<Prestamo | null>(null);
  searchTerm = '';

  updateSearch(term: string) {
    this.prestamosService.searchTerm.set(term);
  }

  updateStartDate(e: any) {
    this.prestamosService.filterStartDate.set(e.target.value);
  }

  updateEndDate(e: any) {
    this.prestamosService.filterEndDate.set(e.target.value);
  }
}
