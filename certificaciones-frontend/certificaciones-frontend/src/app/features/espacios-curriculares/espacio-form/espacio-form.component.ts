import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material/material.module';
import { EspacioCurricularService } from '../../../core/services/espacio-curricular.service';
import { EspacioCurricular } from '../../../core/models/models';

@Component({
  selector: 'app-espacio-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <button mat-icon-button routerLink="/espacios-curriculares" matTooltip="Volver al listado">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-text">
          <h1 class="page-title">
            {{ isEditing ? 'Editar Espacio Curricular' : 'Nuevo Espacio Curricular' }}
          </h1>
          <span class="page-subtitle">
            {{ isEditing ? 'Modificar el nombre del espacio curricular' : 'Registrar una nueva materia o espacio curricular' }}
          </span>
        </div>
      </div>

      <!-- Formulario -->
      <div class="form-layout">

        <!-- Card principal -->
        <mat-card class="form-card">
          <mat-card-header>
            <div mat-card-avatar class="form-avatar">
              <mat-icon>{{ isEditing ? 'edit' : 'add_circle' }}</mat-icon>
            </div>
            <mat-card-title>Datos del Espacio Curricular</mat-card-title>
            <mat-card-subtitle>
              {{ isEditing ? 'Modificá el nombre y guardá los cambios' : 'Completá el nombre para registrarlo' }}
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="espacio-form">

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre del Espacio Curricular</mat-label>
                <input
                  matInput
                  formControlName="nombre"
                  placeholder="Ej: Física, Matemática, Historia..."
                  maxlength="150"
                  autofocus>
                <mat-icon matSuffix>menu_book</mat-icon>
                <mat-hint align="end">{{ form.get('nombre')?.value?.length || 0 }}/150</mat-hint>

                @if (form.get('nombre')?.errors?.['required'] && form.get('nombre')?.touched) {
                  <mat-error>El nombre es obligatorio</mat-error>
                }
                @if (form.get('nombre')?.errors?.['minlength'] && form.get('nombre')?.touched) {
                  <mat-error>El nombre debe tener al menos 2 caracteres</mat-error>
                }
                @if (form.get('nombre')?.errors?.['maxlength']) {
                  <mat-error>El nombre no puede superar 150 caracteres</mat-error>
                }
              </mat-form-field>

              <!-- Preview -->
              @if (form.get('nombre')?.value) {
                <div class="preview-card">
                  <span class="preview-label">Vista previa</span>
                  <div class="preview-item">
                    <div class="preview-avatar">
                      {{ form.get('nombre')?.value?.charAt(0)?.toUpperCase() }}
                    </div>
                    <span class="preview-nombre">{{ form.get('nombre')?.value }}</span>
                  </div>
                </div>
              }

              <div class="form-actions">
                <button mat-stroked-button type="button" routerLink="/espacios-curriculares">
                  <mat-icon>close</mat-icon>
                  Cancelar
                </button>
                <button
                  mat-flat-button
                  color="primary"
                  type="submit"
                  [disabled]="form.invalid || form.pristine">
                  <mat-icon>{{ isEditing ? 'save' : 'add' }}</mat-icon>
                  {{ isEditing ? 'Guardar cambios' : 'Crear espacio' }}
                </button>
              </div>

            </form>
          </mat-card-content>
        </mat-card>

        <!-- Card lateral con info -->
        <mat-card class="info-card">
          <mat-card-content>
            <div class="info-title">
              <mat-icon>info_outline</mat-icon>
              <span>¿Qué es un espacio curricular?</span>
            </div>
            <p class="info-text">
              Un espacio curricular representa una materia o área de conocimiento
              que un docente puede dictar. Se utiliza en los movimientos de horas
              para identificar en qué materia trabaja el docente.
            </p>
            <mat-divider></mat-divider>
            <div class="info-examples">
              <span class="info-examples-title">Ejemplos:</span>
              @for (ej of ejemplos; track ej) {
                <div class="example-chip">
                  <mat-icon>circle</mat-icon>
                  {{ ej }}
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

    /* Layout */
    .form-layout { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start; }
    @media (max-width: 768px) { .form-layout { grid-template-columns: 1fr; } }

    /* Form card */
    .form-card { border-radius: 12px !important; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; }
    .form-avatar { background: linear-gradient(135deg, #8b5cf6, #6366f1) !important; border-radius: 10px !important; display: flex; align-items: center; justify-content: center; }
    .form-avatar mat-icon { color: white; }

    .espacio-form { display: flex; flex-direction: column; gap: 16px; padding-top: 12px; }
    .full-width { width: 100%; }

    /* Preview */
    .preview-card { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 14px 16px; }
    .preview-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; display: block; margin-bottom: 10px; }
    .preview-item { display: flex; align-items: center; gap: 12px; }
    .preview-avatar {
      width: 40px; height: 40px; border-radius: 10px;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1.1rem; flex-shrink: 0;
    }
    .preview-nombre { font-size: 1rem; font-weight: 600; color: #1e293b; }

    /* Acciones */
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 8px; border-top: 1px solid #f1f5f9; }

    /* Info card */
    .info-card { border-radius: 12px !important; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; background: #fafbff !important; }
    .info-title { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #6366f1; margin-bottom: 10px; }
    .info-title mat-icon { font-size: 1.1rem; width: 1.1rem; height: 1.1rem; }
    .info-text { font-size: 0.88rem; color: #475569; line-height: 1.6; margin: 0 0 16px; }
    mat-divider { margin-bottom: 16px; }
    .info-examples { display: flex; flex-direction: column; gap: 6px; }
    .info-examples-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 4px; display: block; }
    .example-chip { display: flex; align-items: center; gap: 6px; font-size: 0.875rem; color: #475569; }
    .example-chip mat-icon { font-size: 8px; width: 8px; height: 8px; color: #8b5cf6; }
  `]
})
export class EspacioFormComponent implements OnInit {
  form!: FormGroup;
  isEditing = false;
  espacioId?: number;

  readonly ejemplos = [
    'Física', 'Física Aplicada', 'Matemática',
    'Historia', 'Geografía', 'Lengua y Literatura',
    'Biología', 'Química', 'Educación Física'
  ];

  constructor(
    private fb: FormBuilder,
    private espacioService: EspacioCurricularService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.espacioId = +id;
      this.espacioService.getById(this.espacioId).subscribe(e => {
        this.form.patchValue(e);
      });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150)
      ]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as EspacioCurricular;

    const op = this.isEditing
      ? this.espacioService.update(this.espacioId!, { ...payload, id: this.espacioId! })
      : this.espacioService.create(payload);

    op.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEditing
            ? `"${payload.nombre}" actualizado correctamente`
            : `"${payload.nombre}" creado correctamente`,
          'Cerrar',
          { duration: 3500 }
        );
        this.router.navigate(['/espacios-curriculares']);
      },
      error: () => {
        this.snackBar.open('Ocurrió un error. Verificá los datos e intentá de nuevo.', 'Cerrar', {
          duration: 5000,
          panelClass: 'snack-error'
        });
      }
    });
  }
}
