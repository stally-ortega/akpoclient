import { Component, inject, Input, computed, signal, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { EquipoInventario, HistorialAsignacion } from '../../models';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-detalle-equipo',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" (click)="close()">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <div>
            <h2 class="text-xl font-bold text-slate-800 dark:text-white">Detalle del Equipo</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Serial: <span class="font-mono text-slate-700 dark:text-slate-300">{{ equipo.serial }}</span></p>
          </div>
          <button (click)="close()" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <lucide-icon name="x" class="w-6 h-6 text-slate-500 dark:text-slate-400"></lucide-icon>
          </button>
        </div>

        <!-- content -->
        <div class="flex-1 overflow-auto p-6">
          
          <!-- Tabs -->
          <div class="flex space-x-4 mb-6 border-b border-slate-200 dark:border-slate-700">
            <button 
              (click)="activeTab.set('detalles')"
              class="pb-2 px-1 font-medium text-sm transition-colors border-b-2"
              [ngClass]="activeTab() === 'detalles' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
              Detalles Generales
            </button>
            <button 
              (click)="activeTab.set('historial'); loadHistory()"
              class="pb-2 px-1 font-medium text-sm transition-colors border-b-2"
              [ngClass]="activeTab() === 'historial' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
              Historial de Asignación
            </button>
          </div>

          <!-- Detalles Tab -->
          <div *ngIf="activeTab() === 'detalles'" class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            <!-- Info -->
            <div class="space-y-4">
              <h3 class="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Información del Equipo</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-slate-500 dark:text-slate-400">Tipo</p>
                  <p class="font-medium text-slate-900 dark:text-white">{{ equipo.tipo }}</p>
                </div>
                <div>
                  <p class="text-slate-500 dark:text-slate-400">Marca/Modelo</p>
                  <p class="font-medium text-slate-900 dark:text-white">{{ equipo.marca }} {{ equipo.modelo }}</p>
                </div>
                <div>
                  <p class="text-slate-500 dark:text-slate-400">Estado</p>
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    [ngClass]="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': equipo.estado === 'DISPONIBLE',
                      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200': equipo.estado === 'ALMACEN',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': equipo.estado === 'ASIGNADO',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': equipo.estado === 'REPARACION',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': equipo.estado === 'BAJA'
                    }">{{ equipo.estado }}</span>
                </div>
                <div *ngIf="equipo.proyecto">
                  <p class="text-slate-500 dark:text-slate-400">Proyecto Actual</p>
                  <p class="font-medium text-blue-600 dark:text-blue-400">{{ equipo.proyecto }}</p>
                </div>
              </div>
            </div>

            <!-- Accesorios -->
            <div class="space-y-4">
              <h3 class="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Accesorios</h3>
              <ul class="space-y-3">
                <li class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center" [ngClass]="equipo.accesorios.teclado ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'">
                    <lucide-icon name="keyboard" class="w-5 h-5"></lucide-icon>
                  </div>
                  <span class="text-sm font-medium dark:text-slate-300" [class.text-slate-400]="!equipo.accesorios.teclado">Teclado</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center" [ngClass]="equipo.accesorios.mouse ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'">
                    <lucide-icon name="mouse" class="w-5 h-5"></lucide-icon>
                  </div>
                  <span class="text-sm font-medium dark:text-slate-300" [class.text-slate-400]="!equipo.accesorios.mouse">Mouse</span>
                </li>
                 <li class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center" [ngClass]="equipo.accesorios.base ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'">
                    <lucide-icon name="hard-drive" class="w-5 h-5"></lucide-icon>
                  </div>
                  <span class="text-sm font-medium dark:text-slate-300" [class.text-slate-400]="!equipo.accesorios.base">Base</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center" [ngClass]="equipo.accesorios.diadema ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'">
                    <lucide-icon name="headphones" class="w-5 h-5"></lucide-icon>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-medium dark:text-slate-300" [class.text-slate-400]="!equipo.accesorios.diadema">Diadema</span>
                    <span *ngIf="equipo.accesorios.diadema" class="text-xs text-slate-500 dark:text-slate-400">{{ equipo.accesorios.diadema }}</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div class="col-span-1 md:col-span-2 space-y-2 mt-4" *ngIf="equipo.usuarioAsignado">
              <h3 class="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Asignación Actual</h3>
              <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex items-center justify-between">
                <div>
                   <p class="text-sm text-blue-800 dark:text-blue-300 font-medium">Asignado a: {{ equipo.usuarioAsignado }}</p>
                   <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">Desde: {{ equipo.fechaAsignacion | date:'mediumDate' }}</p>
                </div>
                 <div class="text-right">
                    <p class="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide font-semibold">Proyecto</p>
                    <p class="text-sm font-bold text-blue-900 dark:text-blue-200">{{ equipo.proyecto }}</p>
                 </div>
              </div>
            </div>
          </div>

          <!-- Historial Tab -->
          <div *ngIf="activeTab() === 'historial'" class="space-y-6 animate-fade-in">
             <div class="flex flex-wrap gap-4 items-end bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
               <div>
                  <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Desde</label>
                  <input type="date" [value]="filterStart() | date:'yyyy-MM-dd'" (change)="updateStartDate($event)" class="text-sm border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
               </div>
               <div>
                  <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Hasta</label>
                   <input type="date" [value]="filterEnd() | date:'yyyy-MM-dd'" (change)="updateEndDate($event)" class="text-sm border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
               </div>
               <button (click)="loadHistory()" class="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600">
                 Filtrar
               </button>
             </div>

             <div class="border rounded-lg overflow-hidden border-slate-200 dark:border-slate-700">
               <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                 <thead class="bg-slate-50 dark:bg-slate-900">
                   <tr>
                     <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Usuario</th>
                     <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Proyecto</th>
                     <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Fecha Asignación</th>
                     <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Fecha Devolución</th>
                     <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Generado Por</th>
                   </tr>
                 </thead>
                 <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                   <tr *ngFor="let item of historial()" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                     <td class="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{{ item.usuario }}</td>
                     <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{{ item.proyecto }}</td>
                     <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{{ item.fechaInicio | date:'mediumDate' }}</td>
                     <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                       <span *ngIf="item.fechaFin">{{ item.fechaFin | date:'mediumDate' }}</span>
                       <span *ngIf="!item.fechaFin" class="text-green-600 dark:text-green-400 text-xs font-bold px-2 py-0.5 bg-green-50 dark:bg-green-900/50 rounded-full">ACTUAL</span>
                     </td>
                     <td class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 italic">{{ item.generadoPor }}</td>
                   </tr>
                   <tr *ngIf="historial().length === 0 && !loadingHistory()">
                     <td colspan="5" class="px-6 py-8 text-center text-slate-400 text-sm">
                       No hay historial en este rango de fechas.
                     </td>
                   </tr>
                   <tr *ngIf="loadingHistory()">
                     <td colspan="5" class="px-6 py-8 text-center text-slate-400 text-sm">
                       Cargando historial...
                     </td>
                   </tr>
                 </tbody>
               </table>
             </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DetalleEquipoComponent {
  @Input({ required: true }) equipo!: EquipoInventario;
  @Output() closed = new EventEmitter<void>();

  private inventarioService = inject(InventarioService);
  
  activeTab = signal<'detalles' | 'historial'>('detalles');
  historial = signal<HistorialAsignacion[]>([]);
  loadingHistory = signal(false);

  // Default dates: Last 6 months
  filterStart = signal(new Date(new Date().setMonth(new Date().getMonth() - 6)));
  filterEnd = signal(new Date());

  constructor() {
  }

  // Hook into tab change
  updateStartDate(e: Event) { 
    const val = (e.target as HTMLInputElement).value;
    this.filterStart.set(new Date(val)); 
  }
  updateEndDate(e: Event) { 
    const val = (e.target as HTMLInputElement).value;
    this.filterEnd.set(new Date(val)); 
  }

  close() {
    this.closed.emit();
  }

  loadHistory() {
    this.loadingHistory.set(true);
    this.inventarioService.obtenerHistorial(
      this.equipo.serial, 
      this.filterStart(), 
      this.filterEnd()
    ).subscribe({
      next: (data) => {
        this.historial.set(data);
        this.loadingHistory.set(false);
      },
      error: () => this.loadingHistory.set(false)
    });
  }
}
