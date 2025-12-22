import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { UserVariable } from '../models/preferencias.models';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PreferenciasService {
  private authService = inject(AuthService);
  private toast = inject(ToastrService);

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
    // Load initial state
    this.loadState();

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
      }
    }, { allowSignalWrites: true });
  }

  // --- PERSISTENCE & LOAD ---

  private loadState() {
    // Load "Global" storage if needed, but really we rely on the effect triggered by Auth
    const savedGlobalVariables = localStorage.getItem('akpo_global_vars'); 
    if (savedGlobalVariables) {
      // Logic for global variables could go here if implemented
    }
  }

  private loadUserPreferences(userId: string) {
    // Theme
    const savedTheme = localStorage.getItem(`prefs_${userId}_theme`) as 'light' | 'dark';
    if (savedTheme) {
      this._theme.set(savedTheme);
    }

    // Variables
    const savedVars = localStorage.getItem(`prefs_${userId}_vars`);
    if (savedVars) {
      try {
        const parsed = JSON.parse(savedVars);
        // Merge with existing state (avoiding duplicates if logic requires)
        // For now, we will replace the slice for this user in the signal
        // BUT since the signal holds ALL users' vars (simulated backend), we need to be careful.
        // SIMULATION: We just load from localStorage "DB" into the main array
        // Since we don't have a real DB, let's treat localStorage key as the source of truth for THIS user.
        
        // Remove old vars for this user from current state to avoid dups
        const currentWithoutUser = this._variables().filter(v => v.userId !== userId);
        this._variables.set([...currentWithoutUser, ...parsed]);
        
      } catch (e) {
        console.error('Error loading variables', e);
      }
    }
  }

  private saveUserVariables(userId: string) {
    const vars = this._variables().filter(v => v.userId === userId);
    localStorage.setItem(`prefs_${userId}_vars`, JSON.stringify(vars));
  }

  // --- THEME METHODS ---

  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: 'light' | 'dark') {
    this._theme.set(theme);
    const user = this.authService.currentUser();
    if (user) {
      localStorage.setItem(`prefs_${user.id}_theme`, theme);
    }
  }

  // --- VARIABLES CRUD ---

  addVariable(variable: Omit<UserVariable, 'id' | 'userId'>) {
    const user = this.authService.currentUser();
    if (!user) return;

    const newVar: UserVariable = {
      ...variable,
      id: crypto.randomUUID(),
      userId: user.id
    };

    this._variables.update(current => [...current, newVar]);
    this.saveUserVariables(user.id);
    this.toast.success('Variable creada');
  }

  deleteVariable(id: string) {
    const user = this.authService.currentUser();
    if (!user) return;

    this._variables.update(current => current.filter(v => v.id !== id));
    this.saveUserVariables(user.id);
    this.toast.info('Variable eliminada');
  }

  updateVariable(id: string, value: any) {
    const user = this.authService.currentUser();
    if (!user) return;

    this._variables.update(current => 
      current.map(v => v.id === id ? { ...v, value } : v)
    );
    this.saveUserVariables(user.id);
    this.toast.success('Variable actualizada');
  }

  // --- EXPORT / IMPORT SUPPORT ---
  
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
      
      // Import Theme
      if (data.theme) this.setTheme(data.theme);

      // Import Variables
      if (Array.isArray(data.variables)) {
        // Strategy: Overwrite or Append? Let's Append but check for key collisions
        const currentVars = this.userVariables();
        const newVars: UserVariable[] = [];

        data.variables.forEach((importedVar: any) => {
           // Skip if key already exists? Or update? Let's skip to be safe.
           if (!currentVars.some(v => v.key === importedVar.key)) {
              newVars.push({
                ...importedVar,
                id: crypto.randomUUID(), // New ID
                userId: user.id          // Re-assign ownership
              });
           }
        });

        if (newVars.length > 0) {
           this._variables.update(current => [...current, ...newVars]);
           this.saveUserVariables(user.id);
           this.toast.success(`Importadas ${newVars.length} variables.`);
        } else {
           this.toast.info('No se encontraron nuevas variables para importar.');
        }
      }
    } catch (e) {
      this.toast.error('Error al importar datos. Formato inválido.');
    }
  }

  // Helper for Rules Engine
  resolveValue(value: any, valueType?: 'LITERAL' | 'VARIABLE'): any {
    if (valueType === 'VARIABLE') {
      // Value is the KEY of the variable
      const found = this.userVariables().find(v => v.key === value);
      return found ? found.value : null; // Return value or null if not found
    }
    return value;
  }
}
