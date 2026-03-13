import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material/material.module';
import { CargoService } from '../../../core/services/cargo.service';
import { Cargo } from '../../../core/models/models';

@Component({
  selector: 'app-cargo-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  providers: [CargoService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <button mat-icon-button routerLink="/cargos" matTooltip="Volver al listado">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-text">
          <h1 class="page-title">{{ isEditing ? 'Editar Cargo' : 'Nuevo Cargo' }}</h1>
          <span class="page-subtitle">
            {{ isEditing ? 'Modificar los datos del cargo' : 'Registrar un nuevo cargo' }}
          </span>
        </div>
      </div>

      <div class="form-layout">
        <mat-card class="form-card">
          <mat-card-header>
            <div mat-card-avatar class="form-avatar">
              <mat-icon>{{ isEditing ? 'edit' : 'add_circle' }}</mat-icon>
            </div>
            <mat-card-title>Datos del Cargo</mat-card-title>
            <mat-card-subtitle>
              {{ isEditing ? 'Modificá los datos y guardá los cambios' : 'Completá los datos para registrarlo' }}
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="cargo-form">

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre del Cargo</mat-label>
                <input matInput formControlName="nombre"
                  placeholder="Ej: Rector, Preceptor, Bibliotecario..." maxlength="100" autofocus>
                <mat-icon matSuffix>work</mat-icon>
                <mat-hint align="end">{{ form.get('nombre')?.value?.length || 0 }}/100</mat-hint>
                @if (form.get('nombre')?.errors?.['required'] && form.get('nombre')?.touched) {
                  <mat-error>El nombre es obligatorio</mat-error>
                }
                @if (form.get('nombre')?.errors?.['minlength'] && form.get('nombre')?.touched) {
                  <mat-error>El nombre debe tener al menos 2 caracteres</mat-error>
                }
              </mat-form-field>

              <!-- Toggle requiere curso -->
              <div class="toggle-field">
                <div class="toggle-info">
                  <span class="toggle-label">Requiere curso y división</span>
                  <span class="toggle-hint">
                    Activá esta opción para cargos como Preceptor que se asignan a un curso específico.
                    Dejalo desactivado para Rector, Secretario, Bibliotecario, etc.
                  </span>
                </div>
                <mat-slide-toggle formControlName="requiereCurso" color="primary"></mat-slide-toggle>
              </div>

              @if (form.get('nombre')?.value) {
                <div class="preview-card">
                  <span class="preview-label">Vista previa</span>
                  <div class="preview-item">
                    <div class="preview-avatar">{{ form.get('nombre')?.value?.charAt(0)?.toUpperCase() }}</div>
                    <div>
                      <span class="preview-nombre">{{ form.get('nombre')?.value }}</span>
                      <span class="preview-tag" [class.tag--si]="form.get('requiereCurso')?.value">
                        {{ form.get('requiereCurso')?.value ? 'Con curso/división' : 'Sin curso/división' }}
                      </span>
                    </div>
                  </div>
                </div>
              }

              <div class="form-actions">
                <button mat-stroked-button type="button" routerLink="/cargos">
                  <mat-icon>close</mat-icon> Cancelar
                </button>
                <button mat-flat-button color="primary" type="submit"
                  [disabled]="form.invalid || form.pristine">
                  <mat-icon>{{ isEditing ? 'save' : 'add' }}</mat-icon>
                  {{ isEditing ? 'Guardar cambios' : 'Crear cargo' }}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <mat-card class="info-card">
          <mat-card-content>
            <div class="info-title">
              <mat-icon>info_outline</mat-icon>
              <span>¿Qué es un cargo?</span>
            </div>
            <p class="info-text">
              Un cargo representa una función directiva o administrativa que puede
              asumir un docente. Se utiliza en los movimientos para registrar cuando
              un docente asume un rol fuera de las horas cátedra.
            </p>
            <mat-divider></mat-divider>
            <div class="info-examples">
              <span class="info-examples-title">Sin curso:</span>
              @for (ej of ejemplosSinCurso; track ej) {
                <div class="example-chip">
                  <mat-icon>circle</mat-icon> {{ ej }}
                </div>
              }
              <span class="info-examples-title" style="margin-top:12px">Con curso:</span>
              @for (ej of ejemplosConCurso; track ej) {
                <div class="example-chip">
                  <mat-icon>circle</mat-icon> {{ ej }}
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 960px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .header-text { display: flex; flex-direction: column; }
    .page-title { margin: 0; font-size: 1.6rem; font-weight: 700; color: #1e293b; }
    .page-subtitle { color: #64748b; font-size: 0.9rem; margin-top: 2px; }

    .form-layout { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start; }
    @media (max-width: 768px) { .form-layout { grid-template-columns: 1fr; } }

    .form-card { border-radius: 12px !important; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; }
    .form-avatar { background: linear-gradient(135deg, #8b5cf6, #6366f1) !important; border-radius: 10px !important; display: flex; align-items: center; justify-content: center; }
    .form-avatar mat-icon { color: white; }
    .cargo-form { display: flex; flex-direction: column; gap: 16px; padding-top: 12px; }
    .full-width { width: 100%; }

    .toggle-field { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; }
    .toggle-info { display: flex; flex-direction: column; gap: 4px; }
    .toggle-label { font-size: 0.9rem; font-weight: 600; color: #1e293b; }
    .toggle-hint { font-size: 0.8rem; color: #64748b; line-height: 1.4; }

    .preview-card { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 14px 16px; }
    .preview-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; display: block; margin-bottom: 10px; }
    .preview-item { display: flex; align-items: center; gap: 12px; }
    .preview-avatar { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; flex-shrink: 0; }
    .preview-nombre { font-size: 1rem; font-weight: 600; color: #1e293b; display: block; }
    .preview-tag { font-size: 0.75rem; padding: 2px 8px; border-radius: 20px; background: #f1f5f9; color: #64748b; margin-top: 4px; display: inline-block; }
    .preview-tag.tag--si { background: #dcfce7; color: #16a34a; }

    .form-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 8px; border-top: 1px solid #f1f5f9; }

    .info-card { border-radius: 12px !important; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; background: #fafbff !important; }
    .info-title { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #6366f1; margin-bottom: 10px; }
    .info-title mat-icon { font-size: 1.1rem; width: 1.1rem; height: 1.1rem; }
    .info-text { font-size: 0.88rem; color: #475569; line-height: 1.6; margin: 0 0 16px; }
    mat-divider { margin-bottom: 16px; }
    .info-examples { display: flex; flex-direction: column; gap: 6px; }
    .info-examples-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; display: block; }
    .example-chip { display: flex; align-items: center; gap: 6px; font-size: 0.875rem; color: #475569; }
    .example-chip mat-icon { font-size: 8px; width: 8px; height: 8px; color: #8b5cf6; }
  `]
})
export class CargoFormComponent implements OnInit {
  form!: FormGroup;
  isEditing = false;
  cargoId?: number;

  readonly ejemplosSinCurso = ['Rector', 'Vicerrector', 'Secretario', 'Prosecretario', 'Bibliotecario'];
  readonly ejemplosConCurso = ['Preceptor'];

  constructor(
    private fb: FormBuilder,
    private cargoService: CargoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.cargoId = +id;
      this.cargoService.getById(this.cargoId).subscribe(c => this.form.patchValue(c));
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      requiereCurso: [false]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.value as Cargo;
    const op = this.isEditing
      ? this.cargoService.update(this.cargoId!, { ...payload, id: this.cargoId! })
      : this.cargoService.create(payload);

    op.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEditing ? `"${payload.nombre}" actualizado correctamente` : `"${payload.nombre}" creado correctamente`,
          'Cerrar', { duration: 3500 }
        );
        this.router.navigate(['/cargos']);
      },
      error: () => {
        this.snackBar.open('Ocurrió un error. Verificá los datos e intentá de nuevo.', 'Cerrar', {
          duration: 5000, panelClass: 'snack-error'
        });
      }
    });
  }
}