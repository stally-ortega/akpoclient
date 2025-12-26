import { Component, EventEmitter, Input, Output, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ActivoService } from '../../../core/services/activo.service';
import { Activo } from '../../../core/models/domain/activo.model';

@Component({
  selector: 'app-activo-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full">
      <label *ngIf="label" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
        {{ label }}
      </label>
      
      <!-- Search Input -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
           <lucide-icon name="qr-code" class="w-4 h-4"></lucide-icon>
        </div>
        <input 
          [formControl]="searchControl" 
          type="text" 
          class="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          [placeholder]="placeholder"
          [class.rounded-b-none]="showResults()"
          (focus)="onFocus()"
          (blur)="onBlur()"
        />
        <!-- Loading Indicator -->
        <div *ngIf="loading()" class="absolute inset-y-0 right-0 flex items-center pr-3">
           <div class="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>

      <!-- Results Dropdown -->
      <div *ngIf="showResults() && (results().length > 0 || loading())" 
           class="absolute z-50 w-full bg-white dark:bg-slate-800 border border-t-0 border-slate-300 dark:border-slate-600 rounded-b-lg shadow-xl max-h-60 overflow-y-auto">
        
        <div *ngFor="let activo of results()" 
             (mousedown)="selectActivo(activo)"
             class="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-100 dark:border-slate-700/50 last:border-0 flex items-center gap-3">
             
           <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <lucide-icon name="laptop" class="w-4 h-4"></lucide-icon>
           </div>
           <div>
              <div class="text-sm font-medium text-slate-800 dark:text-white flex gap-2">
                 <span>{{ activo.serial }}</span>
                 <span class="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">{{ activo.tipo.nombre }}</span>
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ activo.marca.nombre }} {{ activo.modelo?.nombre }}</div>
           </div>
        </div>
      </div>
      
      <!-- Selected State (Optional display below) -->
      <div *ngIf="selectedActivo()" class="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded flex justify-between items-center group">
         <div class="flex items-center gap-2">
            <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
            <div class="flex flex-col">
               <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">{{ selectedActivo()?.serial }}</span>
               <span class="text-xs text-emerald-600/70">{{ selectedActivo()?.modelo?.nombre }}</span>
            </div>
         </div>
         <button (click)="clearSelection()" class="text-emerald-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
            <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
         </button>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ActivoSearchComponent {
  private activoService = inject(ActivoService);

  @Input() label = 'Buscar Activo';
  @Input() placeholder = 'Serial o modelo...';
  
  // Specific filter for the search context (e.g. only show 'DISPONIBLE')
  @Input() estadoFilter?: string;

  @Output() activoSelected = new EventEmitter<Activo | null>();

  searchControl = new FormControl('');
  
  // Signals
  results = signal<Activo[]>([]);
  loading = signal(false);
  showResults = signal(false);
  selectedActivo = signal<Activo | undefined>(undefined);

  constructor() {
    // Setup Search Logic
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.loading.set(true)),
      switchMap((term: string | null) => {
        if (!term || term.length < 2) {
          this.loading.set(false);
          return of([]); // Fix: Return empty observable
        }
        return this.activoService.getActivos({ search: term, limit: 5 });
      }),
      tap(() => this.loading.set(false))
    ).subscribe((matches: Activo[]) => {
      // Client side post-filter if API doesn't support complex filters
      let filtered = matches;
      if (this.estadoFilter) {
         filtered = matches.filter((a: Activo) => a.estado === this.estadoFilter);
      }
      this.results.set(filtered);
      this.showResults.set(true);
    });
  }

  onFocus() {
    if (this.searchControl.value && this.searchControl.value.length >= 2) {
      this.showResults.set(true);
    }
  }

  onBlur() {
    setTimeout(() => this.showResults.set(false), 200);
  }

  selectActivo(activo: Activo) {
    this.selectedActivo.set(activo);
    this.activoSelected.emit(activo);
    this.showResults.set(false);
    this.searchControl.setValue('', { emitEvent: false }); 
  }

  clearSelection() {
    this.selectedActivo.set(undefined);
    this.activoSelected.emit(null);
  }
}
