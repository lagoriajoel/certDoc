import { Routes } from '@angular/router';

export const CARGOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./cargos-list/cargos-list.component').then(m => m.CargosListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./cargo-form/cargo-form.component').then(m => m.CargoFormComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./cargo-form/cargo-form.component').then(m => m.CargoFormComponent)
  }
];