import { Component, inject, Input, computed, signal, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Activo, HistorialAsignacion } from '../../../../core/models/domain/activo.model';
import { ActivoService } from '../../../../core/services/activo.service';

@Component({
  selector: 'app-detalle-equipo',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" (click)="close()">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <div>
            <h2 class="text-xl font-bold text-slate-800 dark:text-white">Detalle del Equipo</h2>
            <p class="text-sm text-slate-500 dark:text-slate-300">Serial: <span class="font-mono font-medium text-slate-700 dark:text-white">{{ equipo.serial }}</span></p>
          </div>
          <button (click)="close()" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white">
            <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <!-- content -->
        <div class="flex-1 overflow-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
          
          <!-- Tabs -->
          <div class="flex space-x-6 mb-8 border-b border-slate-200 dark:border-slate-700">
            <button 
              (click)="activeTab.set('detalles')"
              class="pb-3 px-1 font-medium text-sm transition-all border-b-2 outline-none focus:outline-none"
              [ngClass]="activeTab() === 'detalles' 
                ? 'border-primary text-primary dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'">
              Detalles Generales
            </button>
            <button 
              (click)="activeTab.set('historial'); loadHistory()"
              class="pb-3 px-1 font-medium text-sm transition-all border-b-2 outline-none focus:outline-none"
              [ngClass]="activeTab() === 'historial' 
                ? 'border-primary text-primary dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'">
              Historial de Asignación
            </button>
          </div>

          <!-- Detalles Tab -->
          <div *ngIf="activeTab() === 'detalles'" class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            <!-- Info -->
            <div class="space-y-6">
              <h3 class="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
                <lucide-icon name="info" class="w-4 h-4 text-primary dark:text-blue-400"></lucide-icon> Información del Equipo
              </h3>
              
              <div class="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
                <div>
                  <p class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Tipo</p>
                  <p class="font-medium text-slate-900 dark:text-white text-base">{{ equipo.tipo.nombre }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Marca/Modelo</p>
                  <p class="font-medium text-slate-900 dark:text-white text-base">{{ equipo.marca.nombre }} <span class="text-slate-500 dark:text-slate-400">{{ equipo.modelo?.nombre }}</span></p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Estado</p>
                  <span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border"
                    [ngClass]="{
                      'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800': equipo.estado === 'Activo',
                      'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800': equipo.estado === 'Funcional inactivo',
                      'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800': equipo.estado === 'Dañado',
                      'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800': equipo.estado === 'Robado' || equipo.estado === 'Baja'
                    }">{{ equipo.estado }}</span>
                </div>
                <div *ngIf="equipo.proyecto">
                  <p class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Proyecto</p>
                  <p class="font-medium text-blue-600 dark:text-blue-400 text-base">{{ equipo.proyecto.nombre }}</p>
                </div>
              </div>
            </div>

            <!-- Accesorios -->
            <div class="space-y-6" *ngIf="equipo.accesorios">
              <h3 class="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
                 <lucide-icon name="keyboard" class="w-4 h-4 text-primary dark:text-blue-400"></lucide-icon> Accesorios
              </h3>
              <ul class="space-y-3">
                 <li class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center transition-colors" 
                       [ngClass]="equipo.accesorios.teclado ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'">
                    <lucide-icon name="keyboard" class="w-4 h-4"></lucide-icon>
                  </div>
                  <span class="text-sm font-medium transition-colors" 
                        [class.text-slate-900]="equipo.accesorios.teclado"
                        [class.dark:text-white]="equipo.accesorios.teclado"
                        [class.text-slate-400]="!equipo.accesorios.teclado"
                        [class.dark:text-slate-600]="!equipo.accesorios.teclado">Teclado</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center transition-colors" 
                       [ngClass]="equipo.accesorios.mouse ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'">
                    <lucide-icon name="mouse" class="w-4 h-4"></lucide-icon>
                  </div>
                  <span class="text-sm font-medium transition-colors" 
                        [class.text-slate-900]="equipo.accesorios.mouse"
                        [class.dark:text-white]="equipo.accesorios.mouse"
                        [class.text-slate-400]="!equipo.accesorios.mouse"
                        [class.dark:text-slate-600]="!equipo.accesorios.mouse">Mouse</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center transition-colors" 
                       [ngClass]="equipo.accesorios.base ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'">
                    <lucide-icon name="hard-drive" class="w-4 h-4"></lucide-icon>
                  </div>
                  <span class="text-sm font-medium transition-colors" 
                        [class.text-slate-900]="equipo.accesorios.base"
                        [class.dark:text-white]="equipo.accesorios.base"
                        [class.text-slate-400]="!equipo.accesorios.base"
                        [class.dark:text-slate-600]="!equipo.accesorios.base">Base</span>
                </li>
              </ul>
            </div>
            
            <div class="col-span-1 md:col-span-2 space-y-2 mt-4" *ngIf="equipo.usuarioAsignado">
              <h3 class="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
                <lucide-icon name="user" class="w-4 h-4 text-primary dark:text-blue-400"></lucide-icon> Asignación Actual
              </h3>
              <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-lg flex items-center justify-between">
                <div>
                   <p class="text-sm text-slate-500 dark:text-slate-400 mb-1">Usuario</p>
                   <p class="text-base font-bold text-slate-800 dark:text-white">{{ equipo.usuarioAsignado.nombre }}</p>
                   <p class="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">{{ equipo.usuarioAsignado.usuarioAd }}</p>
                </div>
                 <!-- If we had assignment date in Activo model we would show it here -->
              </div>
            </div>
          </div>

          <!-- Historial Tab -->
          <div *ngIf="activeTab() === 'historial'" class="space-y-6 animate-fade-in">
             <div class="flex flex-wrap gap-4 items-end bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
               <div>
                  <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Desde</label>
                  <input type="date" [value]="filterStart() | date:'yyyy-MM-dd'" (change)="updateStartDate($event)" class="text-sm border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
               </div>
               <div>
                  <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Hasta</label>
                   <input type="date" [value]="filterEnd() | date:'yyyy-MM-dd'" (change)="updateEndDate($event)" class="text-sm border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
               </div>
               <button (click)="loadHistory()" class="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
                 Filtrar
               </button>
             </div>

             <div class="border rounded-lg overflow-hidden border-slate-200 dark:border-slate-700 shadow-sm">
               <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                 <thead class="bg-slate-50 dark:bg-slate-900/80">
                   <tr>
                     <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usuario</th>
                     <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Proyecto</th>
                     <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Asignado</th>
                     <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Devuelto</th>
                   </tr>
                 </thead>
                 <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                   <tr *ngFor="let item of historial()" class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                     <td class="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{{ item.usuario }}</td>
                     <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                          {{ item.proyecto }}
                        </span>
                     </td>
                     <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{{ item.fechaInicio | date:'mediumDate' }}</td>
                     <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                       <span *ngIf="item.fechaFin">{{ item.fechaFin | date:'mediumDate' }}</span>
                       <span *ngIf="!item.fechaFin" class="text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 bg-green-50 dark:bg-green-900/30 rounded-full border border-green-100 dark:border-green-800">ACTUAL</span>
                     </td>
                   </tr>
                   <tr *ngIf="historial().length === 0 && !loadingHistory()">
                     <td colspan="4" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                       <lucide-icon name="clock" class="w-8 h-8 mx-auto mb-2 opacity-50"></lucide-icon>
                       No hay historial en este rango de fechas.
                     </td>
                   </tr>
                   <tr *ngIf="loadingHistory()">
                     <td colspan="4" class="px-6 py-12 text-center text-slate-400 text-sm">
                       <div class="flex items-center justify-center gap-2">
                          <div class="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          Cargando historial...
                       </div>
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
      animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DetalleEquipoComponent {
  // Use Activo instead of EquipoInventario
  @Input({ required: true }) equipo!: Activo;
  @Output() closed = new EventEmitter<void>();

  private activoService = inject(ActivoService);
  
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
    // Note: Activo serial in normalized model is at top level
    this.activoService.getHistorial(
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
