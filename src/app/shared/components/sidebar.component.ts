import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Application Sidebar Component.
 * Provides navigation links.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <aside class="w-64 bg-slate-900 text-white h-full flex flex-col">
      <div class="p-6">
        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</div>
        <nav class="space-y-2">
          <a routerLink="/dashboard" routerLinkActive="bg-slate-800 text-white" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <lucide-icon name="layout-dashboard" class="w-5 h-5"></lucide-icon>
            Dashboard
          </a>
          <a routerLink="/inventario" routerLinkActive="bg-slate-800 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <lucide-icon name="monitor" class="w-5 h-5"></lucide-icon>
            Inventario
          </a>
          <a routerLink="/correos" routerLinkActive="bg-slate-800 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <lucide-icon name="mail" class="w-5 h-5"></lucide-icon>
            Envío de Correos
          </a>
          <a routerLink="/actas" routerLinkActive="bg-slate-800 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <lucide-icon name="file-text" class="w-5 h-5"></lucide-icon>
            Generar Actas
          </a>
           <a routerLink="/prestamos" routerLinkActive="bg-slate-800 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <lucide-icon name="clock" class="w-5 h-5"></lucide-icon>
            Préstamos
          </a>
        </nav>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent {}
