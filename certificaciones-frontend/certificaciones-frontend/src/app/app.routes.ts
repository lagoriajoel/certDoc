import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'docentes', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'docentes',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/docentes/docentes.routes').then(m => m.DOCENTES_ROUTES)
  },
  {
    path: 'espacios-curriculares',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/espacios-curriculares/espacios-curriculares.routes').then(m => m.ESPACIOS_ROUTES)
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES)
  },
  { path: '**', redirectTo: 'docentes' }
];
