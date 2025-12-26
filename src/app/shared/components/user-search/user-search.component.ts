import { Component, EventEmitter, Input, Output, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ActivoService } from '../../../core/services/activo.service';
import { UsuarioAd } from '../../../core/models/domain/activo.model';

@Component({
  selector: 'app-user-search',
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
           <lucide-icon name="search" class="w-4 h-4"></lucide-icon>
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
        
        <div *ngFor="let user of results()" 
             (mousedown)="selectUser(user)"
             class="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-100 dark:border-slate-700/50 last:border-0 flex items-center gap-3">
             
           <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
              {{ user.nombre.charAt(0) }}
           </div>
           <div>
              <div class="text-sm font-medium text-slate-800 dark:text-white">{{ user.nombre }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ user.usuarioAd }}</div>
           </div>
        </div>
      </div>
      
      <!-- Selected State (Optional display below) -->
      <div *ngIf="selectedUser()" class="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded flex justify-between items-center group">
         <div class="flex items-center gap-2">
            <lucide-icon name="user-check" class="w-4 h-4 text-blue-500"></lucide-icon>
            <span class="text-sm font-medium text-blue-700 dark:text-blue-300">{{ selectedUser()?.nombre }}</span>
         </div>
         <button (click)="clearSelection()" class="text-blue-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
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
export class UserSearchComponent {
  private activoService = inject(ActivoService);

  @Input() label = 'Usuario Asignado';
  @Input() placeholder = 'Buscar en Directorio Activo...';
  @Input() initialValue: UsuarioAd | undefined;

  @Output() userSelected = new EventEmitter<UsuarioAd | null>();

  searchControl = new FormControl('');
  
  // Signals
  results = signal<UsuarioAd[]>([]);
  loading = signal(false);
  showResults = signal(false);
  selectedUser = signal<UsuarioAd | undefined>(undefined);

  constructor() {
    // Setup Search Logic
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.loading.set(true)),
      switchMap(term => {
        if (!term || term.length < 2) {
          this.loading.set(false);
          return [];
        }
        return this.activoService.searchUsuariosAd(term);
      }),
      tap(() => this.loading.set(false))
    ).subscribe(matches => {
      this.results.set(matches as UsuarioAd[]);
      this.showResults.set(true);
    });

    // Initialize if input provided
    if (this.initialValue) {
      this.selectedUser.set(this.initialValue);
    }
  }

  onFocus() {
    if (this.searchControl.value && this.searchControl.value.length >= 2) {
      this.showResults.set(true);
    }
  }

  onBlur() {
    // Delay hiding to allow click event to register
    setTimeout(() => this.showResults.set(false), 200);
  }

  selectUser(user: UsuarioAd) {
    this.selectedUser.set(user);
    this.userSelected.emit(user);
    this.showResults.set(false);
    this.searchControl.setValue('', { emitEvent: false }); // Clear search
  }

  clearSelection() {
    this.selectedUser.set(undefined);
    this.userSelected.emit(null);
  }
}
