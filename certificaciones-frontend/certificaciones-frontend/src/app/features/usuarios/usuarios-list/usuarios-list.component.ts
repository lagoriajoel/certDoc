import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/material/material.module';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioResponse } from '../../../core/models/models';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ConfirmDialogComponent],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div class="header-info">
          <h1 class="page-title">
            <mat-icon class="title-icon">manage_accounts</mat-icon>
            Gestión de Usuarios
          </h1>
          <p class="page-subtitle">Administrá los usuarios del sistema</p>
        </div>
        <button mat-flat-button color="primary" routerLink="nuevo">
          <mat-icon>person_add</mat-icon> Nuevo Usuario
        </button>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon total"><mat-icon>group</mat-icon></div>
          <div class="stat-info">
            <span class="stat-num">{{ usuarios.length }}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon activo"><mat-icon>check_circle</mat-icon></div>
          <div class="stat-info">
            <span class="stat-num">{{ activos }}</span>
            <span class="stat-label">Activos</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon inactivo"><mat-icon>block</mat-icon></div>
          <div class="stat-info">
            <span class="stat-num">{{ inactivos }}</span>
            <span class="stat-label">Inactivos</span>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <mat-card class="table-card">
        <mat-card-content>
          <table mat-table [dataSource]="usuarios" class="usuarios-table">

            <!-- Avatar + Nombre -->
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Usuario</th>
              <td mat-cell *matCellDef="let u">
                <div class="user-cell">
                  <div class="avatar" [class]="'avatar-' + u.rol.toLowerCase()">
                    {{ u.nombre.charAt(0).toUpperCase() }}
                  </div>
                  <div class="user-info">
                    <span class="user-nombre">{{ u.nombre }}</span>
                    <span class="user-username">&#64;{{ u.username }}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Rol -->
            <ng-container matColumnDef="rol">
              <th mat-header-cell *matHeaderCellDef>Rol</th>
              <td mat-cell *matCellDef="let u">
                <span [class]="'rol-chip ' + (u.rol === 'ADMIN' ? 'rol-admin' : 'rol-operador')">
                  <mat-icon>{{ u.rol === 'ADMIN' ? 'shield' : 'person' }}</mat-icon>
                  {{ u.rol }}
                </span>
              </td>
            </ng-container>

            <!-- Estado -->
            <ng-container matColumnDef="activo">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let u">
                <span [class]="'estado-chip ' + (u.activo ? 'estado-activo' : 'estado-inactivo')">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </ng-container>

            <!-- Acciones -->
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let u">
                <div class="action-btns">

                  <!-- Toggle activo/inactivo -->
                  <button mat-icon-button
                    [color]="u.activo ? 'warn' : 'primary'"
                    [matTooltip]="u.activo ? 'Desactivar usuario' : 'Activar usuario'"
                    (click)="toggleActivo(u)"
                    [disabled]="u.username === authService.usuario()?.username">
                    <mat-icon>{{ u.activo ? 'person_off' : 'person' }}</mat-icon>
                  </button>

                  <!-- Eliminar -->
                  <button mat-icon-button color="warn"
                    matTooltip="Eliminar usuario"
                    (click)="confirmarEliminar(u)"
                    [disabled]="u.username === authService.usuario()?.username">
                    <mat-icon>delete_outline</mat-icon>
                  </button>

                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell no-data" [attr.colspan]="columns.length">
                <mat-icon>group_off</mat-icon>
                <span>No hay usuarios registrados</span>
              </td>
            </tr>
          </table>
        </mat-card-content>
      </mat-card>

    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1000px; margin: 0 auto; }

    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .header-info { display: flex; flex-direction: column; gap: 4px; }
    .page-title { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.6rem; font-weight: 700; color: #1e293b; }
    .title-icon { color: #6366f1; font-size: 2rem; width: 2rem; height: 2rem; }
    .page-subtitle { margin: 0; color: #64748b; font-size: 0.9rem; }

    /* Stats */
    .stats-row { display: flex; gap: 16px; margin-bottom: 24px; }
    .stat-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 16px 20px; display: flex; align-items: center; gap: 14px; flex: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .stat-icon.total   { background: #ede9fe; color: #6d28d9; }
    .stat-icon.activo  { background: #dcfce7; color: #16a34a; }
    .stat-icon.inactivo{ background: #fee2e2; color: #dc2626; }
    .stat-num { font-size: 1.5rem; font-weight: 700; color: #1e293b; display: block; }
    .stat-label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }

    /* Tabla */
    .table-card { border-radius: 12px !important; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important; }
    .usuarios-table { width: 100%; }

    /* Celda usuario */
    .user-cell { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; color: white; flex-shrink: 0; }
    .avatar-admin    { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
    .avatar-operador { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
    .user-nombre { font-weight: 600; color: #1e293b; display: block; font-size: 0.9rem; }
    .user-username { color: #94a3b8; font-size: 0.78rem; }

    /* Chips */
    .rol-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .rol-chip mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .rol-admin    { background: #ede9fe; color: #6d28d9; }
    .rol-operador { background: #dbeafe; color: #1d4ed8; }
    .estado-chip { padding: 3px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
    .estado-activo  { background: #dcfce7; color: #15803d; }
    .estado-inactivo{ background: #fee2e2; color: #dc2626; }

    .action-btns { display: flex; gap: 4px; }
    .table-row:hover { background: #f8fafc; }
    th.mat-header-cell { font-weight: 700; color: #475569; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; }

    .no-data { text-align: center; padding: 48px !important; color: #94a3b8; }
    .no-data mat-icon { font-size: 48px; width: 48px; height: 48px; display: block; margin: 0 auto 8px; }
  `]
})
export class UsuariosListComponent implements OnInit {
  usuarios: UsuarioResponse[] = [];
  columns = ['nombre', 'rol', 'activo', 'acciones'];

  get activos()   { return this.usuarios.filter(u => u.activo).length; }
  get inactivos() { return this.usuarios.filter(u => !u.activo).length; }

  constructor(
    public authService: AuthService,
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.usuarioService.getAll().subscribe(list => this.usuarios = list);
  }

  toggleActivo(u: UsuarioResponse): void {
    this.usuarioService.toggleActivo(u.id).subscribe(() => {
      this.snackBar.open(
        `Usuario ${u.activo ? 'desactivado' : 'activado'} correctamente`,
        'Cerrar', { duration: 3000 }
      );
      this.load();
    });
  }

  confirmarEliminar(u: UsuarioResponse): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Usuario',
        message: `¿Eliminar al usuario "${u.username}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar'
      }
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.usuarioService.eliminar(u.id).subscribe(() => {
          this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 3000 });
          this.load();
        });
      }
    });
  }
}
