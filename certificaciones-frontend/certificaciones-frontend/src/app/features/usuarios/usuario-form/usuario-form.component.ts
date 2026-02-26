import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material/material.module';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <button mat-icon-button routerLink="/usuarios" matTooltip="Volver">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="page-title">Nuevo Usuario</h1>
          <p class="page-subtitle">Completá los datos para crear un usuario</p>
        </div>
      </div>

      <div class="form-layout">

        <!-- Formulario -->
        <mat-card class="form-card">
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre completo</mat-label>
                <input matInput formControlName="nombre" placeholder="Ej: Juan Pérez">
                <mat-icon matSuffix>badge</mat-icon>
                @if (form.get('nombre')?.errors?.['required'] && form.get('nombre')?.touched) {
                  <mat-error>El nombre es obligatorio</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre de usuario</mat-label>
                <input matInput formControlName="username" placeholder="Ej: jperez"
                  autocomplete="off">
                <mat-icon matSuffix>alternate_email</mat-icon>
                @if (form.get('username')?.errors?.['required'] && form.get('username')?.touched) {
                  <mat-error>El usuario es obligatorio</mat-error>
                }
                @if (form.get('username')?.errors?.['minlength'] && form.get('username')?.touched) {
                  <mat-error>Mínimo 3 caracteres</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Contraseña</mat-label>
                <input matInput formControlName="password"
                  [type]="mostrarPassword ? 'text' : 'password'"
                  autocomplete="new-password">
                <button mat-icon-button matSuffix type="button"
                  (click)="mostrarPassword = !mostrarPassword">
                  <mat-icon>{{ mostrarPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (form.get('password')?.errors?.['required'] && form.get('password')?.touched) {
                  <mat-error>La contraseña es obligatoria</mat-error>
                }
                @if (form.get('password')?.errors?.['minlength'] && form.get('password')?.touched) {
                  <mat-error>Mínimo 6 caracteres</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Rol</mat-label>
                <mat-select formControlName="rol">
                  <mat-option value="OPERADOR">
                    <mat-icon>person</mat-icon> Operador
                  </mat-option>
                  <mat-option value="ADMIN">
                    <mat-icon>shield</mat-icon> Administrador
                  </mat-option>
                </mat-select>
                @if (form.get('rol')?.errors?.['required'] && form.get('rol')?.touched) {
                  <mat-error>El rol es obligatorio</mat-error>
                }
              </mat-form-field>

              <!-- Error global -->
              @if (errorMsg) {
                <div class="form-error">
                  <mat-icon>error_outline</mat-icon>
                  {{ errorMsg }}
                </div>
              }

              <!-- Botones -->
              <div class="form-actions">
                <button mat-stroked-button type="button" routerLink="/usuarios">
                  Cancelar
                </button>
                <button mat-flat-button color="primary" type="submit" [disabled]="loading">
                  @if (loading) {
                    <mat-spinner diameter="18" color="accent"></mat-spinner>
                  } @else {
                    <mat-icon>save</mat-icon>
                  }
                  Crear Usuario
                </button>
              </div>

            </form>
          </mat-card-content>
        </mat-card>

        <!-- Info card -->
        <mat-card class="info-card">
          <mat-card-content>
            <h3 class="info-title">
              <mat-icon>info_outline</mat-icon> Roles disponibles
            </h3>
            <div class="rol-info">
              <div class="rol-item">
                <span class="rol-chip admin"><mat-icon>shield</mat-icon> ADMIN</span>
                <p>Acceso completo. Puede crear, editar y eliminar usuarios, docentes y movimientos.</p>
              </div>
              <div class="rol-item">
                <span class="rol-chip operador"><mat-icon>person</mat-icon> OPERADOR</span>
                <p>Acceso estándar. Puede gestionar docentes y movimientos pero no usuarios.</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 900px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .page-title { margin: 0; font-size: 1.5rem; font-weight: 700; color: #1e293b; }
    .page-subtitle { margin: 2px 0 0; color: #64748b; font-size: 0.85rem; }

    .form-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
    .form-card { border-radius: 12px !important; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important; }
    .full-width { width: 100%; margin-bottom: 4px; }

    .form-error { display: flex; align-items: center; gap: 8px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px 14px; color: #dc2626; font-size: 0.875rem; margin-bottom: 16px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }

    /* Info card */
    .info-card { border-radius: 12px !important; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important; height: fit-content; }
    .info-title { display: flex; align-items: center; gap: 8px; margin: 0 0 20px; font-size: 1rem; font-weight: 700; color: #1e293b; }
    .info-title mat-icon { color: #6366f1; }
    .rol-info { display: flex; flex-direction: column; gap: 20px; }
    .rol-item p { margin: 8px 0 0; font-size: 0.82rem; color: #64748b; line-height: 1.5; }
    .rol-chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
    .rol-chip mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .rol-chip.admin    { background: #ede9fe; color: #6d28d9; }
    .rol-chip.operador { background: #dbeafe; color: #1d4ed8; }

    @media (max-width: 768px) { .form-layout { grid-template-columns: 1fr; } }
  `]
})
export class UsuarioFormComponent {
  form: FormGroup;
  loading = false;
  errorMsg = '';
  mostrarPassword = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre:   ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol:      ['OPERADOR', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMsg = '';

    this.usuarioService.crear(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Usuario creado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Error al crear el usuario';
      }
    });
  }
}
