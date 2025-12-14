import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Prestamo } from '../models/prestamo.models';
import { PrestamosService } from '../services/prestamos.service';

@Component({
  selector: 'app-detalle-prestamo',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" (click)="close()">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 class="text-lg font-bold text-slate-800">Detalle del Préstamo</h2>
            <p class="text-xs text-slate-500 font-mono">{{ prestamo.id.slice(0, 8) }}...</p>
          </div>
          <button (click)="close()" class="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <lucide-icon name="x" class="w-5 h-5 text-slate-500"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-6">
          
          <!-- User Info -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {{ prestamo.usuarioSolicitante.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm text-slate-500">Solicitante</p>
              <h3 class="font-semibold text-slate-900 text-lg">{{ prestamo.usuarioSolicitante }}</h3>
            </div>
          </div>

          <!-- Time & Status -->
          <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <div>
               <p class="text-xs text-slate-500 mb-1">Fecha Préstamo</p>
               <div class="flex items-center gap-2 text-sm font-medium text-slate-700">
                 <lucide-icon name="calendar" class="w-4 h-4"></lucide-icon>
                 {{ prestamo.fechaPrestamo | date:'medium' }}
               </div>
               
               <ng-container *ngIf="prestamo.fechaDevolucionReal">
                 <p class="text-xs text-slate-500 mt-3 mb-1">Fecha Devolución</p>
                 <div class="flex items-center gap-2 text-sm font-medium text-slate-700">
                   <lucide-icon name="clock" class="w-4 h-4 text-green-600"></lucide-icon>
                   {{ prestamo.fechaDevolucionReal | date:'medium' }}
                 </div>
               </ng-container>
            </div>
            <div class="text-right">
              <span *ngIf="prestamo.estado === 'ACTIVO'" class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">EN CURSO</span>
              <span *ngIf="prestamo.estado === 'FINALIZADO'" class="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">DEVUELTO</span>
            </div>
          </div>

          <!-- Items List -->
          <div>
            <h4 class="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <lucide-icon name="package" class="w-4 h-4"></lucide-icon>
              Ítems Prestados ({{ prestamo.items.length }})
            </h4>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div *ngFor="let item of prestamo.items" class="flex items-center justify-between p-2 border border-slate-100 rounded-md hover:bg-slate-50">
                <div class="flex items-center gap-3">
                   <div class="p-1.5 bg-white border border-slate-200 rounded text-slate-500">
                     <lucide-icon [name]="item.categoria === 'EQUIPO' ? 'monitor' : 'mouse'" class="w-4 h-4"></lucide-icon>
                   </div>
                   <div class="flex flex-col">
                     <span class="text-sm font-medium text-slate-800">{{ item.nombre }}</span>
                     <span *ngIf="item.serial" class="text-xs text-slate-500 font-mono">{{ item.serial }}</span>
                   </div>
                </div>
                <span class="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{{ item.categoria }}</span>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div *ngIf="prestamo.estado === 'ACTIVO'" class="pt-2">
            <button (click)="finalizar()" class="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <lucide-icon name="check-circle" class="w-5 h-5"></lucide-icon>
              Marcar como Devuelto y Finalizar
            </button>
          </div>
           <div *ngIf="prestamo.estado === 'FINALIZADO'" class="pt-2">
             <div class="w-full py-3 bg-green-50 text-green-700 font-medium rounded-lg flex items-center justify-center gap-2 border border-green-200">
               <lucide-icon name="check" class="w-5 h-5"></lucide-icon>
               Préstamo Finalizado
             </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class DetallePrestamoComponent {
  @Input({ required: true }) prestamo!: Prestamo;
  @Output() closeEvent = new EventEmitter<void>();
  
  private prestamosService = inject(PrestamosService);

  close() {
    this.closeEvent.emit();
  }

  finalizar() {
    this.prestamosService.finalizarPrestamo(this.prestamo.id);
    this.close();
  }
}
