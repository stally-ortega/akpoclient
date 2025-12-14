import { Routes } from '@angular/router';
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
    loadComponent: () => import('./features/prestamos/prestamos-page.component').then(m => m.PrestamosPageComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard' // In a real app, redirect to a 404 page
  }
];
