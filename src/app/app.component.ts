import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header.component';
import { SidebarComponent } from './shared/components/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { LoadingComponent } from './shared/components/loading.component';
import { LoadingService } from './core/services/loading.service';
import { OnInit } from '@angular/core';

/**
 * Root Component.
 * Handles the main layout structure.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, SidebarComponent, LoadingComponent],
  template: `
    <div class="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden">
      <!-- Global Loading Screen -->
      <app-loading></app-loading>
      
      <!-- Header (only if authenticated) -->
      <app-header *ngIf="authService.isAuthenticated()" class="flex-none z-20"></app-header>

      <div class="flex flex-1 overflow-hidden relative">
        <!-- Sidebar (only if authenticated) -->
        <app-sidebar *ngIf="authService.isAuthenticated()" class="flex-none h-full z-10 hidden md:block"></app-sidebar>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 w-full">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  private loadingService = inject(LoadingService);

  ngOnInit() {
    // Show splash screen on initial load
    this.loadingService.show();
    
    // Hide after a brief delay if no HTTP calls keep it open, 
    // or let it sync with actual data loading.
    // For effect, we ensure it's visible for at least 2 seconds.
    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }
}
