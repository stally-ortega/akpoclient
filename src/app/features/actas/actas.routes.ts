import { Routes } from '@angular/router';
import { DashboardComponent, CrearActaComponent, AprobarPdfComponent } from './pages';

export const ACTAS_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'crear',
    component: CrearActaComponent
  },
  {
    path: 'aprobar',
    component: AprobarPdfComponent
  }
];
