import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { RouterLink } from '@angular/router';

/**
 * Application Header Component.
 * Displays logo, user info, and logout button.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-6">
      <div class="flex items-center gap-4">
        <div class="text-2xl font-bold text-primary">Inventario <span class="text-accent">Akpo</span></div>
      </div>
      
      <div class="flex items-center gap-4" *ngIf="authService.currentUser() as user">
        <div class="text-sm text-right hidden sm:block">
          <div class="font-medium text-slate-900">{{ user.name }}</div>
          <div class="text-slate-500 text-xs">{{ user.email }}</div>
        </div>
        <button (click)="logout()" class="p-2 text-slate-400 hover:text-danger transition-colors" title="Logout">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
