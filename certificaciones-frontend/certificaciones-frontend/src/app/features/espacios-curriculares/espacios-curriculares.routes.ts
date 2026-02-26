import { Routes } from '@angular/router';

export const ESPACIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./espacios-list/espacios-list.component').then(m => m.EspaciosListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./espacio-form/espacio-form.component').then(m => m.EspacioFormComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./espacio-form/espacio-form.component').then(m => m.EspacioFormComponent)
  }
];
