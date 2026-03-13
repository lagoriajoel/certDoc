import { Routes } from '@angular/router';

export const DOCENTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./docente-list/docente-list.component').then(m => m.DocenteListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./docente-form/docente-form.component').then(m => m.DocenteFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./docente-detalle/docente-detalle.component').then(m => m.DocenteDetalleComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./docente-form/docente-form.component').then(m => m.DocenteFormComponent)
  },
  {
    path: ':docenteId/movimiento/nuevo',
    loadComponent: () =>
      import('../movimientos/movimiento-form/movimiento-form.component').then(m => m.MovimientoFormComponent)
  },
  {
    path: ':docenteId/movimiento/:id/editar',
    loadComponent: () =>
      import('../movimientos/movimiento-form/movimiento-form.component').then(m => m.MovimientoFormComponent)
  },
   // ── Acta ──
  {
    path: ':docenteId/movimiento/:movimientoId/acta',
    loadComponent: () =>
      import('../movimientos/acta-form/acta-form.component').then(m => m.ActaFormComponent)
  },
  { path: ':docenteId/movimiento/:movimientoId/acta/nuevo', 
    loadComponent: () => 
      import('../movimientos/acta-form/acta-form.component').then(m => m.ActaFormComponent) },
{ path: ':docenteId/movimiento/:movimientoId/acta/:actaId/editar', 
   loadComponent: () =>
     import('../movimientos/acta-form/acta-form.component').then(m => m.ActaFormComponent) },

];
