import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./usuarios-list/usuarios-list.component').then(m => m.UsuariosListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
  }
];
