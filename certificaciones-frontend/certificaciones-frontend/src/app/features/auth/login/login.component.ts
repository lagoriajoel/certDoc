import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-shell">

      <!-- Panel izquierdo decorativo -->
      <div class="login-brand">
        <div class="brand-content">
          <div class="brand-icon">🎓</div>
          <h1 class="brand-title">CertDoc</h1>
          <p class="brand-desc">Sistema de Certificaciones<br>de Servicios Docentes</p>
          <div class="brand-footer">
            Consejo Provincial de Educación · Santa Cruz
          </div>
        </div>
      </div>

      <!-- Panel derecho con formulario -->
      <div class="login-form-panel">
        <div class="login-card">

          <div class="login-card-header">
            <h2>Iniciar sesión</h2>
            <p>Ingresá con tus credenciales para continuar</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario</mat-label>
              <input matInput formControlName="username" autocomplete="username"
                placeholder="Ej: admin">
              <mat-icon matSuffix>person_outline</mat-icon>
              @if (form.get('username')?.errors?.['required'] && form.get('username')?.touched) {
                <mat-error>El usuario es obligatorio</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password"
                [type]="mostrarPassword ? 'text' : 'password'"
                autocomplete="current-password">
              <button mat-icon-button matSuffix type="button"
                (click)="mostrarPassword = !mostrarPassword">
                <mat-icon>{{ mostrarPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.get('password')?.errors?.['required'] && form.get('password')?.touched) {
                <mat-error>La contraseña es obligatoria</mat-error>
              }
            </mat-form-field>

            <!-- Error global -->
            @if (errorMsg) {
              <div class="login-error">
                <mat-icon>error_outline</mat-icon>
                <span>{{ errorMsg }}</span>
              </div>
            }

            <button mat-flat-button color="primary" type="submit"
              class="btn-login" [disabled]="loading">
              @if (loading) {
                <mat-spinner diameter="20" color="accent"></mat-spinner>
                <span>Ingresando...</span>
              } @else {
                <mat-icon>login</mat-icon>
                <span>Ingresar</span>
              }
            </button>

          </form>

          <div class="login-hint">
            <mat-icon>info_outline</mat-icon>
            <span>Credenciales por defecto: <strong>admin / admin123</strong></span>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ── Shell ── */
    .login-shell {
      display: flex;
      height: 100vh;
      font-family: 'Inter', sans-serif;
    }

    /* ── Panel izquierdo ── */
    .login-brand {
      flex: 0 0 420px;
      background: linear-gradient(160deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .login-brand::before {
      content: '';
      position: absolute;
      width: 600px; height: 600px;
      border-radius: 50%;
      background: rgba(59,130,246,0.08);
      top: -150px; left: -150px;
    }
    .login-brand::after {
      content: '';
      position: absolute;
      width: 400px; height: 400px;
      border-radius: 50%;
      background: rgba(99,102,241,0.10);
      bottom: -100px; right: -100px;
    }
    .brand-content {
      text-align: center;
      z-index: 1;
      padding: 32px;
    }
    .brand-icon { font-size: 4rem; margin-bottom: 16px; }
    .brand-title {
      font-size: 2.8rem; font-weight: 800;
      color: white; margin: 0 0 12px;
      letter-spacing: 0.02em;
    }
    .brand-desc {
      color: #93c5fd; font-size: 1.05rem;
      line-height: 1.6; margin: 0 0 40px;
    }
    .brand-footer {
      color: #475569; font-size: 0.78rem;
      text-transform: uppercase; letter-spacing: 0.08em;
    }

    /* ── Panel derecho ── */
    .login-form-panel {
      flex: 1;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    }
    .login-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
    }

    /* ── Header ── */
    .login-card-header { margin-bottom: 28px; }
    .login-card-header h2 {
      margin: 0 0 6px;
      font-size: 1.6rem;
      font-weight: 700;
      color: #1e293b;
    }
    .login-card-header p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    /* ── Form ── */
    .login-form { display: flex; flex-direction: column; gap: 4px; }
    .full-width { width: 100%; }

    /* ── Error ── */
    .login-error {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 10px 14px;
      color: #dc2626;
      font-size: 0.875rem;
    }
    .login-error mat-icon { font-size: 18px; width: 18px; height: 18px; }

    /* ── Botón ── */
    .btn-login {
      width: 100%;
      height: 48px;
      margin-top: 8px;
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    /* ── Hint ── */
    .login-hint {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 20px;
      padding: 10px 14px;
      background: #f0f9ff;
      border-radius: 8px;
      font-size: 0.8rem;
      color: #0369a1;
    }
    .login-hint mat-icon { font-size: 16px; width: 16px; height: 16px; }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .login-brand { display: none; }
    }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading    = false;
  errorMsg   = '';
  mostrarPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Si ya está logueado, redirigir
    if (this.authService.logueado()) {
      this.router.navigate(['/docentes']);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMsg = '';

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/docentes']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.status === 401 || err.status === 403
          ? 'Usuario o contraseña incorrectos'
          : 'Error al conectar con el servidor';
      }
    });
  }
}
