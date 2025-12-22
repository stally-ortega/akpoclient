import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Sun, Moon, Monitor, Variable, Database, CheckCircle, Trash, Upload, Download } from 'lucide-angular';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'correos',
    loadChildren: () => import('./features/correos/correos.routes').then(m => m.CORREOS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'inventario',
    loadChildren: () => import('./features/inventario/inventario.routes').then(m => m.INVENTARIO_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'actas',
    loadChildren: () => import('./features/actas').then(m => m.ACTAS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'prestamos',
    loadChildren: () => import('./features/prestamos/prestamos.routes').then(m => m.PRESTAMOS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'alertas',
    loadChildren: () => import('./features/alertas/alertas.routes').then(m => m.ALERTAS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'preferencias',
    loadComponent: () => import('./features/preferencias/pages/preferencias-page.component').then(m => m.PreferenciasPageComponent),
    canActivate: [authGuard],
    providers: [
      importProvidersFrom(LucideAngularModule.pick({ 
        Sun, Moon, Monitor, Variable, Database, CheckCircle, Trash, Upload, Download 
      }))
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard' // In a real app, redirect to a 404 page
  }
];
