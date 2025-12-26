import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Login Component.
 * Handles user authentication with a premium, animated UI.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); } 20%, 40%, 60%, 80% { transform: translateX(4px); } }
    @keyframes pulseSlow { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.5; } }
    
    .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
    .animate-slide-in-right { animation: slideInRight 0.5s ease-out forwards; }
    .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
    .animate-pulse-slow { animation: pulseSlow 8s infinite ease-in-out; }
  `],
  template: `
    <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden relative selection:bg-blue-500/30">
      
      <!-- Decorative Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-blue-600/10 blur-[120px] animate-pulse-slow"></div>
        <div class="absolute bottom-[10%] right-[5%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse-slow" style="animation-delay: 2s;"></div>
      </div>

      <!-- Main Container -->
      <div class="w-full max-w-[420px] mx-4 relative z-10 animate-fade-in-up">
        
        <!-- Glass Card -->
        <div class="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 md:p-10 relative overflow-hidden group">
          
          <!-- Glossy Effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <!-- Header -->
          <div class="text-center mb-10 relative z-10">
            <div class="mx-auto h-20 w-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 transform group-hover:scale-105 transition-transform duration-300 ring-1 ring-white/20">
               <lucide-icon name="box" class="h-10 w-10 text-white"></lucide-icon>
            </div>
            <h2 class="text-3xl font-bold text-white mb-2 tracking-tight">
              Bienvenido
            </h2>
            <p class="text-slate-400 text-sm">
              Sistema de Gestión de Inventario Akpo
            </p>
          </div>

          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6 relative z-10">
            
            <!-- Email Input -->
            <div class="space-y-1.5 opacity-0 animate-slide-in-right" style="animation-delay: 100ms; animation-fill-mode: forwards;">
              <label for="email" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Usuario</label>
              <div class="relative group/input">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-blue-400 transition-colors">
                   <lucide-icon name="user" class="h-5 w-5"></lucide-icon>
                </div>
                <input 
                  id="email" 
                  type="text" 
                  formControlName="email"
                  class="block w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-700/50 bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-inner"
                  placeholder="usuario.dominio"
                  [class.border-red-500]="isFieldInvalid('email')"
                >
              </div>
              <div *ngIf="isFieldInvalid('email')" class="text-red-400 text-xs ml-1 flex items-center gap-1 animate-shake">
                 <lucide-icon name="alert-circle" class="h-3 w-3"></lucide-icon>
                 <span>El usuario es requerido</span>
              </div>
            </div>

            <!-- Password Input -->
            <div class="space-y-1.5 opacity-0 animate-slide-in-right" style="animation-delay: 200ms; animation-fill-mode: forwards;">
              <label for="password" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Contraseña</label>
              <div class="relative group/input">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-blue-400 transition-colors">
                   <lucide-icon name="lock" class="h-5 w-5"></lucide-icon>
                </div>
                <input 
                  [type]="showPassword() ? 'text' : 'password'" 
                  id="password" 
                  formControlName="password"
                  class="block w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-700/50 bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-inner"
                  placeholder="••••••••"
                  [class.border-red-500]="isFieldInvalid('password')"
                >
                <button 
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors focus:outline-none"
                >
                   <lucide-icon [name]="showPassword() ? 'eye-off' : 'eye'" class="h-5 w-5"></lucide-icon>
                </button>
              </div>
              <div *ngIf="isFieldInvalid('password')" class="text-red-400 text-xs ml-1 flex items-center gap-1 animate-shake">
                 <lucide-icon name="alert-circle" class="h-3 w-3"></lucide-icon>
                 <span>La contraseña es requerida</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading()"
              class="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 transform transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-8 opacity-0 animate-slide-in-right"
              style="animation-delay: 300ms; animation-fill-mode: forwards;"
            >
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-xl"></div>
              <div class="relative flex items-center justify-center gap-2">
                <span *ngIf="!isLoading()">Iniciar Sesión</span>
                <span *ngIf="isLoading()">Verificando...</span>
                <lucide-icon *ngIf="!isLoading()" name="chevron-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></lucide-icon>
                <div *ngIf="isLoading()" class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            </button>

          </form>
          
          <!-- Footer -->
          <div class="mt-8 text-center opacity-0 animate-fade-in-up" style="animation-delay: 400ms; animation-fill-mode: forwards;">
             <p class="text-xs text-slate-500">
               © {{ currentYear }} Akpo. Todos los derechos reservados.
             </p>
          </div>

        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastrService);

  isLoading = signal(false);
  showPassword = signal(false);
  currentYear = new Date().getFullYear();

  loginForm = this.fb.group({
    email: ['', [Validators.required]], // REMOVED Validators.email
    password: ['', [Validators.required]]
  });

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.touched && control.invalid);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { email, password } = this.loginForm.value;
      
      this.authService.login({ email: email!, password: password! }).subscribe({
        next: () => {
          this.toast.success('¡Bienvenido de vuelta!', 'Acceso Correcto');
          this.router.navigate(['/dashboard']);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
