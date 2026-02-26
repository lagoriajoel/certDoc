import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'docentes', pathMatch: 'full' },
  {
    path: 'docentes',
    loadChildren: () =>
      import('./features/docentes/docentes.routes').then(m => m.DOCENTES_ROUTES)
  },
   {
    path: 'espacios-curriculares',
    loadChildren: () =>
      import('./features/espacios-curriculares/espacios-curriculares.routes').then(m => m.ESPACIOS_ROUTES)
  },
  { path: '**', redirectTo: 'docentes' }
];
