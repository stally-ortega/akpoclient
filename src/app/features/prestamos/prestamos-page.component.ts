import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 animate-fade-in pb-20">
      
      <!-- Premium Header (Compact) -->
      <div class="relative overflow-hidden bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl shadow-lg p-5 text-white">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-teal-500/10 rounded-full blur-xl"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="p-2 bg-white/10 rounded-lg shrink-0">
                <lucide-icon name="clock" class="w-6 h-6 text-emerald-200"></lucide-icon>
            </div>
            <div>
              <h1 class="text-2xl font-bold tracking-tight">
                 Control de Préstamos
              </h1>
              <p class="text-emerald-100 text-sm opacity-90">
                Gestione préstamos temporales de activos y periféricos.
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <button (click)="prestamosService.exportarExcel()" class="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all border border-white/20 shadow-sm text-sm">
              <lucide-icon name="download" class="w-4 h-4"></lucide-icon>
              Exportar
            </button>
            <button (click)="showForm = true" class="group flex items-center gap-2 bg-white text-emerald-900 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-all shadow-md font-semibold text-sm relative overflow-hidden">
              <div class="absolute inset-0 bg-emerald-200/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <lucide-icon name="plus" class="w-4 h-4 relative z-10"></lucide-icon>
              <span class="relative z-10">Nuevo Préstamo</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col xl:flex-row gap-6 xl:items-center">
        <!-- Search -->
        <div class="flex-1 w-full relative">
          <lucide-icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></lucide-icon>
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="updateSearch($event)"
            placeholder="Buscar por usuario, ítem o serial..." 
            class="w-full pl-12 pr-4 h-12 rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-teal-500 focus:ring-teal-500 text-sm placeholder-slate-400 transition-all">
        </div>
        
        <!-- Date Range -->
        <div class="flex flex-col sm:flex-row gap-4 xl:w-auto w-full">
           <div class="flex items-center gap-3 flex-1 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
             <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-2">Desde</span>
             <div class="relative w-full">
               <input 
                 type="datetime-local" 
                 [value]="prestamosService.filterStartDate()" 
                 (change)="updateStartDate($event)"
                 class="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white focus:ring-0 p-0">
             </div>
           </div>

           <div class="flex items-center gap-3 flex-1 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
             <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-2">Hasta</span>
             <div class="relative w-full">
                <input 
                  type="datetime-local" 
                  [value]="prestamosService.filterEndDate()" 
                  (change)="updateEndDate($event)"
                  class="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white focus:ring-0 p-0">
             </div>
           </div>
        </div>
      </div>

      <!-- Active Loans List (Compact) -->
      <div class="grid gap-4">
        <div *ngIf="prestamosService.prestamos().length === 0" class="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
           <div class="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <lucide-icon name="clock" class="w-10 h-10 text-slate-300 dark:text-slate-600"></lucide-icon>
           </div>
           <p class="text-lg font-medium text-slate-900 dark:text-white">Sin préstamos recientes</p>
           <p class="text-slate-500 dark:text-slate-400">No se encontraron registros con los filtros actuales.</p>
        </div>

        <!-- Column Headers -->
        <div *ngIf="prestamosService.prestamos().length > 0" class="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-8">
          <div class="col-span-4">Usuario</div>
          <div class="col-span-3">Fecha</div>
          <div class="col-span-2 text-center">Ítems</div>
          <div class="col-span-3 text-right">Estado</div>
        </div>

        <!-- Compact Card / Row -->
        <div *ngFor="let prestamo of prestamosService.prestamos()" 
             (click)="selectedPrestamo.set(prestamo)"
             class="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 hover:shadow-lg hover:border-teal-500/30 dark:hover:border-teal-500/30 transition-all cursor-pointer relative overflow-hidden">
          
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
             <!-- User -->
             <div class="col-span-1 md:col-span-4 flex items-center gap-4 pl-2">
               <div class="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm shadow-inner">
                 {{ prestamo.usuarioSolicitante.charAt(0).toUpperCase() }}
               </div>
               <div>
                  <span class="block font-semibold text-slate-900 dark:text-white truncate">{{ prestamo.usuarioSolicitante }}</span>
                  <span class="text-xs text-slate-500 flex items-center gap-1">
                     <lucide-icon name="user" class="w-3 h-3"></lucide-icon> Solicitante
                  </span>
               </div>
             </div>

             <!-- Date -->
             <div class="col-span-1 md:col-span-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <div class="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-400">
                   <lucide-icon name="calendar" class="w-4 h-4"></lucide-icon>
                </div>
                <span class="truncate font-medium">{{ prestamo.fechaPrestamo | date:'medium' }}</span>
             </div>

             <!-- Items Summary -->
             <div class="col-span-1 md:col-span-2 flex justify-start md:justify-center">
               <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                 <lucide-icon name="package" class="w-3.5 h-3.5"></lucide-icon>
                 {{ prestamo.items.length }}
               </span>
             </div>

             <!-- Status & Badge -->
             <div class="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center gap-4">
               <div class="md:text-right">
                  <span *ngIf="prestamo.estado === 'ACTIVO'" class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-800">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    EN CURSO
                  </span>
                  <span *ngIf="prestamo.estado === 'FINALIZADO'" class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                    <lucide-icon name="check-circle" class="w-3 h-3"></lucide-icon>
                    DEVUELTO
                  </span>
               </div>
               <div class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <lucide-icon name="chevron-right" class="w-5 h-5 text-slate-400"></lucide-icon>
               </div>
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
  `,
})
export class PrestamosPageComponent {
  prestamosService = inject(PrestamosService);
  showForm = false;
  selectedPrestamo = signal<Prestamo | null>(null);
  searchTerm = '';

  updateSearch(term: string) {
    this.prestamosService.searchTerm.set(term);
  }

  updateStartDate(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.prestamosService.filterStartDate.set(val);
  }

  updateEndDate(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.prestamosService.filterEndDate.set(val);
  }
}
