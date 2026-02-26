import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material/material.module';
import { DocenteService } from '../../../core/services/docente.service';
import { Docente } from '../../../core/models/models';

@Component({
  selector: 'app-docente-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <button mat-icon-button routerLink="/docentes" matTooltip="Volver">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="page-title">{{ isEditing ? 'Editar Docente' : 'Nuevo Docente' }}</h1>
          <span class="page-subtitle">{{ isEditing ? 'Modificar datos del docente' : 'Registrar nuevo docente' }}</span>
        </div>
      </div>

      <mat-card class="form-card">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="docente-form">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>DNI</mat-label>
                <input matInput formControlName="dni" placeholder="Ej: 25678901" maxlength="20">
                <mat-icon matSuffix>badge</mat-icon>
                @if (form.get('dni')?.errors?.['required'] && form.get('dni')?.touched) {
                  <mat-error>El DNI es obligatorio</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="apellido" placeholder="Ej: García" maxlength="100">
                <mat-icon matSuffix>person</mat-icon>
                @if (form.get('apellido')?.errors?.['required'] && form.get('apellido')?.touched) {
                  <mat-error>El apellido es obligatorio</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="nombre" placeholder="Ej: María Laura" maxlength="100">
                <mat-icon matSuffix>person_outline</mat-icon>
                @if (form.get('nombre')?.errors?.['required'] && form.get('nombre')?.touched) {
                  <mat-error>El nombre es obligatorio</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="/docentes">
                <mat-icon>close</mat-icon>
                Cancelar
              </button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
                <mat-icon>{{ isEditing ? 'save' : 'add' }}</mat-icon>
                {{ isEditing ? 'Guardar cambios' : 'Crear docente' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 800px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .page-title { margin: 0; font-size: 1.6rem; font-weight: 700; color: #1e293b; }
    .page-subtitle { color: #64748b; font-size: 0.9rem; }
    .form-card { border-radius: 12px !important; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid #f1f5f9; margin-top: 8px; }
    mat-form-field { width: 100%; }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class DocenteFormComponent implements OnInit {
  form!: FormGroup;
  isEditing = false;
  docenteId?: number;

  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.docenteId = +id;
      this.docenteService.getById(this.docenteId).subscribe(d => this.form.patchValue(d));
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      dni: ['', [Validators.required, Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.maxLength(100)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const data: Docente = this.form.value;
    const op = this.isEditing
      ? this.docenteService.update(this.docenteId!, data)
      : this.docenteService.create(data);

    op.subscribe(() => {
      this.snackBar.open(
        this.isEditing ? 'Docente actualizado' : 'Docente creado correctamente',
        'Cerrar', { duration: 3000 }
      );
      this.router.navigate(['/docentes']);
    });
  }
}
