import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserVariable } from '../models/preferencias.models';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

/**
 * Service for managing user preferences and global variables.
 * Handles theme persistence and custom environment variables.
 */
@Injectable({
  providedIn: 'root'
})
export class PreferenciasService {
  private authService = inject(AuthService);
  private toast = inject(ToastrService);
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.baseUrl}/preferences`;

  // --- VARIABLES STATE ---
  private _variables = signal<UserVariable[]>([]);

  // Public Signal: Variables for current user
  public userVariables = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    return this._variables().filter(v => v.userId === user.id);
  });

  // --- THEME STATE ---
  private _theme = signal<'light' | 'dark'>('light');
  public theme = computed(() => this._theme());

  constructor() {
    // Effect to apply theme whenever it changes
    effect(() => {
      const theme = this._theme();
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    // Effect to reload state when user changes (Login/Logout)
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadUserPreferences(user.id);
      } else {
        // Reset defaults if no user
        this._theme.set('light');
        this._variables.set([]);
      }
    }, { allowSignalWrites: true });
  }

  // --- PERSISTENCE & LOAD ---

  private loadUserPreferences(userId: string) {
    if (environment.useMocks) {
      this.loadMockPreferences(userId);
      return;
    }

    this.http.get<{ theme: 'light' | 'dark', variables: UserVariable[] }>(`${this.API_URL}/${userId}`)
      .pipe(
        catchError(err => {
          console.error('Error loading preferences', err);
          return of<{ theme: 'light' | 'dark', variables: UserVariable[] }>({ theme: 'light', variables: [] });
        })
      )
      .subscribe((data: { theme: 'light' | 'dark', variables: UserVariable[] }) => {
        this._theme.set(data.theme || 'light');
        this._variables.set(data.variables || []);
      });
  }

  private loadMockPreferences(userId: string) {
    // Mock simulation keeping localStorage as "DB" for mocks
    const savedTheme = localStorage.getItem(this.getThemeKey(userId));
    if (savedTheme === 'dark' || savedTheme === 'light') {
      this._theme.set(savedTheme);
    }

    const savedVars = localStorage.getItem(this.getVarsKey(userId));
    if (savedVars) {
      try {
        const parsed = JSON.parse(savedVars);
        this._variables.set(parsed);
      } catch (e) {
        console.error('Error loading variables', e);
      }
    }
  }

  // --- THEME METHODS ---

  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: 'light' | 'dark') {
    // Optimistic Update
    this._theme.set(theme);
    const user = this.authService.currentUser();
    
    if (user) {
      if (environment.useMocks) {
         localStorage.setItem(this.getThemeKey(user.id), theme);
      } else {
         this.http.put(`${this.API_URL}/${user.id}/theme`, { theme }).subscribe();
      }
    }
  }

  // --- VARIABLES CRUD ---

  /**
   * Adds a new custom variable for the current user.
   */
  addVariable(variable: Omit<UserVariable, 'id' | 'userId'>) {
    const user = this.authService.currentUser();
    if (!user) return;

    const newVar: UserVariable = {
      ...variable,
      id: crypto.randomUUID(),
      userId: user.id
    };

    // Optimistic UI
    this._variables.update(current => [...current, newVar]);
    this.toast.success('Variable creada');

    if (environment.useMocks) {
      this.saveMockVariables(user.id);
    } else {
      this.http.post(`${this.API_URL}/${user.id}/variables`, newVar)
        .pipe(catchError(() => {
          // Rollback on error
          this._variables.update(current => current.filter(v => v.id !== newVar.id));
          this.toast.error('Error al guardar variable');
          return of(null);
        }))
        .subscribe();
    }
  }

  deleteVariable(id: string) {
    const user = this.authService.currentUser();
    if (!user) return;

    // Snapshot for rollback
    const previousVars = this._variables();

    // Optimistic UI
    this._variables.update(current => current.filter(v => v.id !== id));
    this.toast.info('Variable eliminada');

    if (environment.useMocks) {
      this.saveMockVariables(user.id);
    } else {
      this.http.delete(`${this.API_URL}/${user.id}/variables/${id}`)
        .pipe(catchError(() => {
           // Rollback
           this._variables.set(previousVars);
           this.toast.error('Error al eliminar variable');
           return of(null);
        }))
        .subscribe();
    }
  }

  updateVariable(id: string, value: any) {
    const user = this.authService.currentUser();
    if (!user) return;

    // Snapshot
    const previousVars = this._variables();

    // Optimistic UI
    this._variables.update(current => 
      current.map(v => v.id === id ? { ...v, value } : v)
    );
    this.toast.success('Variable actualizada');

    if (environment.useMocks) {
       this.saveMockVariables(user.id);
    } else {
       this.http.put(`${this.API_URL}/${user.id}/variables/${id}`, { value })
       .pipe(catchError(() => {
          // Rollback
          this._variables.set(previousVars);
          this.toast.error('Error al actualizar variable');
          return of(null);
       }))
       .subscribe();
    }
  }

  private saveMockVariables(userId: string) {
    const vars = this._variables().filter(v => v.userId === userId);
    localStorage.setItem(this.getVarsKey(userId), JSON.stringify(vars));
  }

  // --- EXPORT / IMPORT SUPPORT ---
  
  /**
   * Exports user preferences (theme and variables) to a JSON string.
   */
  exportData() {
     const user = this.authService.currentUser();
     if (!user) return null;

     const data = {
        theme: this.theme(),
        variables: this.userVariables()
     };
     return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string) {
    const user = this.authService.currentUser();
    if (!user) return;

    try {
      const data = JSON.parse(jsonString);
      
      // Import Theme (Sync with Backend)
      if (data.theme) this.setTheme(data.theme);

      // Import Variables
      if (Array.isArray(data.variables)) {
        const currentVars = this.userVariables();
        const newVars: UserVariable[] = [];

        data.variables.forEach((importedVar: any) => {
           if (!currentVars.some(v => v.key === importedVar.key)) {
              newVars.push({
                ...importedVar,
                id: crypto.randomUUID(), 
                userId: user.id          
              });
           }
        });

        if (newVars.length > 0) {
           // Batch add locally
           this._variables.update(current => [...current, ...newVars]);
           
           // Persist
           if (environment.useMocks) {
              this.saveMockVariables(user.id);
           } else {
              // Usually backend handles batch import, or we loop calls. 
              // For simplicity, let's assume a batch endpoint or loop.
              // Looping for now to ensure consistency with CRUD Ops
              newVars.forEach(v => {
                 this.http.post(`${this.API_URL}/${user.id}/variables`, v).subscribe();
              });
           }
           
           this.toast.success(`Importadas ${newVars.length} variables.`);
        } else {
           this.toast.info('No se encontraron nuevas variables para importar.');
        }
      }
    } catch (e) {
      this.toast.error('Error al importar datos. Formato inválido.');
    }
  }

  // --- HELPERS ---

  private getThemeKey(userId: string): string {
    return `prefs_${userId}_theme`;
  }

  private getVarsKey(userId: string): string {
    return `prefs_${userId}_vars`;
  }

  // Helper for Rules Engine
  /**
   * Resolves a value for the Rule Engine.
   * If valueType is VARIABLE, it looks up the value in the user's variables.
   */
  resolveValue(value: unknown, valueType?: 'LITERAL' | 'VARIABLE'): unknown {
    if (valueType === 'VARIABLE') {
      // Value is the KEY of the variable
      const found = this.userVariables().find(v => v.key === value);
      return found ? found.value : null; // Return value or null if not found
    }
    return value;
  }
}
