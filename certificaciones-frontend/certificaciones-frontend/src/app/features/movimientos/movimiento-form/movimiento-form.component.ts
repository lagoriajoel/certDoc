import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { MaterialModule } from '../../../shared/material/material.module';
import { MovimientoService } from 'src/app/core/services/movimiento.service';
import { CargoService } from 'src/app/core/services/cargo.service';
import { Cargo, EspacioCurricular, SituacionRevistaEntity } from 'src/app/core/models/models';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <button mat-icon-button (click)="volver()" matTooltip="Volver">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="page-title">{{ isEditing ? 'Editar Movimiento' : 'Nuevo Movimiento' }}</h1>
          <span class="page-subtitle">{{ isEditing ? 'Modificar movimiento' : 'Registrar movimiento de horas o cargo' }}</span>
        </div>
      </div>

      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title class="card-title">
            <mat-icon>schedule</mat-icon>
            Datos del Movimiento
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="mov-form">

            <!-- Tipo de movimiento -->
            <div class="tipo-selector">
              <button type="button" class="tipo-btn" [class.active]="tipoActual === 'HORAS_CATEDRA'"
                (click)="setTipo('HORAS_CATEDRA')">
                <mat-icon>timer</mat-icon>
                <span>Horas Cátedra</span>
              </button>
              <button type="button" class="tipo-btn" [class.active]="tipoActual === 'CARGO'"
                (click)="setTipo('CARGO')">
                <mat-icon>work</mat-icon>
                <span>Cargo</span>
              </button>
            </div>

            <!-- ── HORAS CÁTEDRA ── -->
            @if (tipoActual === 'HORAS_CATEDRA') {
              <div class="form-row">
                <mat-form-field appearance="outline" class="span-2">
                  <mat-label>Espacio Curricular</mat-label>
                  <mat-select formControlName="espacioCurricularId">
                    @for (e of espacios; track e.id) {
                      <mat-option [value]="e.id">{{ e.nombre }}</mat-option>
                    }
                  </mat-select>
                  <mat-icon matSuffix>menu_book</mat-icon>
                  @if (form.get('espacioCurricularId')?.errors?.['required'] && form.get('espacioCurricularId')?.touched) {
                    <mat-error>Campo obligatorio</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Cantidad de Horas</mat-label>
                  <input matInput type="number" formControlName="cantidadHoras" min="1" max="40">
                  <mat-icon matSuffix>timer</mat-icon>
                  @if (form.get('cantidadHoras')?.errors?.['required'] && form.get('cantidadHoras')?.touched) {
                    <mat-error>Campo obligatorio</mat-error>
                  }
                  @if (form.get('cantidadHoras')?.errors?.['min']) {
                    <mat-error>Mínimo 1 hora</mat-error>
                  }
                </mat-form-field>
              </div>

              <div class="form-row">
               <mat-form-field appearance="outline">
                    <mat-label>Curso</mat-label>
                    <mat-select formControlName="curso">
                      @for (c of cursos; track c) {
                        <mat-option [value]="c">{{ c }}</mat-option>
                      }
                    </mat-select>
                    <mat-icon matSuffix>class</mat-icon>
                    @if (form.get('curso')?.errors?.['required'] && form.get('curso')?.touched) {
                      <mat-error>Campo obligatorio</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>División</mat-label>
                    <mat-select formControlName="division">
                      @for (d of divisiones; track d) {
                        <mat-option [value]="d">{{ d }}</mat-option>
                      }
                    </mat-select>
                    <mat-icon matSuffix>dns</mat-icon>
                    @if (form.get('division')?.errors?.['required'] && form.get('division')?.touched) {
                      <mat-error>Campo obligatorio</mat-error>
                    }
                  </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Modalidad</mat-label>
                  <input matInput formControlName="modalidad" placeholder="Ej: CO , CB">
                  <mat-icon matSuffix>school</mat-icon>
                  @if (form.get('modalidad')?.errors?.['required'] && form.get('modalidad')?.touched) {
                    <mat-error>Campo obligatorio</mat-error>
                  }
                </mat-form-field>
              </div>
            }

            <!-- ── CARGO ── -->
            @if (tipoActual === 'CARGO') {
              <div class="form-row">
                <mat-form-field appearance="outline" class="span-2">
                  <mat-label>Cargo</mat-label>
                  <mat-select formControlName="cargoId" (selectionChange)="onCargoChange($event.value)">
                    @for (c of cargos; track c.id) {
                      <mat-option [value]="c.id">{{ c.nombre }}</mat-option>
                    }
                  </mat-select>
                  <mat-icon matSuffix>work</mat-icon>
                  @if (form.get('cargoId')?.errors?.['required'] && form.get('cargoId')?.touched) {
                    <mat-error>Campo obligatorio</mat-error>
                  }
                </mat-form-field>
              </div>

              <!-- Curso/División solo si el cargo lo requiere (ej: Preceptor) -->
             @if (tipoActual === 'CARGO' && cargoRequiereCurso)  {
                <div class="form-row">
                 <mat-form-field appearance="outline">
                            <mat-label>Curso</mat-label>
                            <mat-select formControlName="curso">
                              @for (c of cursos; track c) {
                                <mat-option [value]="c">{{ c }}</mat-option>
                              }
                            </mat-select>
                            <mat-icon matSuffix>class</mat-icon>
                            @if (form.get('curso')?.errors?.['required'] && form.get('curso')?.touched) {
                              <mat-error>Campo obligatorio</mat-error>
                            }
                          </mat-form-field>

                          <mat-form-field appearance="outline">
                            <mat-label>División</mat-label>
                            <mat-select formControlName="division">
                              @for (d of divisiones; track d) {
                                <mat-option [value]="d">{{ d }}</mat-option>
                              }
                            </mat-select>
                            <mat-icon matSuffix>dns</mat-icon>
                            @if (form.get('division')?.errors?.['required'] && form.get('division')?.touched) {
                              <mat-error>Campo obligatorio</mat-error>
                            }
                          </mat-form-field>
                </div>
              }
            }

            <!-- Situación de revista — siempre visible -->
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Situación de Revista</mat-label>
                <mat-select formControlName="situacionRevistaId">
                  @for (s of situaciones; track s.id) {
                    <mat-option [value]="s.id">{{ s.nombre }}</mat-option>
                  }
                </mat-select>
                <mat-icon matSuffix>how_to_reg</mat-icon>
                @if (form.get('situacionRevistaId')?.errors?.['required'] && form.get('situacionRevistaId')?.touched) {
                  <mat-error>Campo obligatorio</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Alta -->
            <div class="form-section-label">Alta</div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Fecha de Alta</mat-label>
                <input matInput [matDatepicker]="pickerAlta" formControlName="fechaAlta">
                <mat-datepicker-toggle matIconSuffix [for]="pickerAlta"></mat-datepicker-toggle>
                <mat-datepicker #pickerAlta></mat-datepicker>
                @if (form.get('fechaAlta')?.errors?.['required'] && form.get('fechaAlta')?.touched) {
                  <mat-error>Campo obligatorio</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="span-2">
                <mat-label>Instrumento Legal de Alta</mat-label>
                <input matInput formControlName="instrumentoLegalAlta" placeholder="Ej: Res. 0123/2024">
                <mat-icon matSuffix>gavel</mat-icon>
                @if (form.get('instrumentoLegalAlta')?.errors?.['required'] && form.get('instrumentoLegalAlta')?.touched) {
                  <mat-error>Campo obligatorio</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Baja -->
            <div class="form-section-label">Baja <span class="optional">(opcional)</span></div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Fecha de Baja</mat-label>
                <input matInput [matDatepicker]="pickerBaja" formControlName="fechaBaja">
                <mat-datepicker-toggle matIconSuffix [for]="pickerBaja"></mat-datepicker-toggle>
                <mat-datepicker #pickerBaja></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline" class="span-2">
                <mat-label>Instrumento Legal de Baja</mat-label>
                <input matInput formControlName="instrumentoLegalBaja" placeholder="Ej: Res. 0456/2024">
                <mat-icon matSuffix>gavel</mat-icon>
              </mat-form-field>
            </div>

            <!-- Observaciones -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Observaciones</mat-label>
              <textarea matInput formControlName="observaciones" rows="3"
                placeholder="Información adicional..."></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button mat-stroked-button type="button" (click)="volver()">
                <mat-icon>close</mat-icon> Cancelar
              </button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
                <mat-icon>{{ isEditing ? 'save' : 'add' }}</mat-icon>
                {{ isEditing ? 'Guardar cambios' : 'Crear movimiento' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 900px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .page-title { margin: 0; font-size: 1.6rem; font-weight: 700; color: #1e293b; }
    .page-subtitle { color: #64748b; font-size: 0.9rem; }
    .form-card { border-radius: 12px !important; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; }
    .card-title { display: flex; align-items: center; gap: 8px; font-size: 1rem; }
    .card-title mat-icon { color: #3b82f6; }
    .mov-form { display: flex; flex-direction: column; gap: 8px; padding-top: 8px; }
    .form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .form-row .span-2 { grid-column: span 2; }
    .form-section-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; padding: 4px 0 0; border-top: 1px solid #f1f5f9; margin-top: 8px; }
    .optional { font-weight: 400; text-transform: none; color: #94a3b8; }
    .full-width { width: 100%; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid #f1f5f9; margin-top: 8px; }
    mat-form-field { width: 100%; }

    /* Tipo selector */
    .tipo-selector { display: flex; gap: 12px; margin-bottom: 8px; }
    .tipo-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 10px; border: 2px solid #e2e8f0;
      background: white; color: #64748b; font-size: 0.9rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .tipo-btn mat-icon { font-size: 1.1rem; width: 1.1rem; height: 1.1rem; }
    .tipo-btn:hover { border-color: #3b82f6; color: #3b82f6; }
    .tipo-btn.active { border-color: #3b82f6; background: #eff6ff; color: #3b82f6; }
    .tipo-btn.active mat-icon { color: #3b82f6; }

    @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } .form-row .span-2 { grid-column: span 1; } }
  `]
})
export class MovimientoFormComponent implements OnInit {
  form!: FormGroup;
  isEditing = false;
  movimientoId?: number;
  docenteId!: number;
  tipoActual: 'HORAS_CATEDRA' | 'CARGO' = 'HORAS_CATEDRA';
  cargoRequiereCurso = false;
cursos = ['1°', '2°', '3°', '4°', '5°', '6°'];
divisiones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  espacios: EspacioCurricular[] = [];
  situaciones: SituacionRevistaEntity[] = [];
  cargos: Cargo[] = [];

  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoService,
    private cargoService: CargoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.docenteId = +this.route.snapshot.paramMap.get('docenteId')!;
    const movId = this.route.snapshot.paramMap.get('id');
    if (movId) { this.isEditing = true; this.movimientoId = +movId; }

    this.buildForm();
    this.loadCatalogs();
  }

  buildForm(): void {
    this.form = this.fb.group({
      tipo:                  ['HORAS_CATEDRA'],
      // Horas cátedra
      espacioCurricularId:   [null],
      cantidadHoras:         [null, Validators.min(1)],
      modalidad:             [''],
      // Cargo
      cargoId:               [null],
      // Curso/División (compartido)
      curso:                 [''],
      division:              [''],
      // Comunes
      situacionRevistaId:    [null, Validators.required],
      fechaAlta:             [null, Validators.required],
      instrumentoLegalAlta:  ['', Validators.required],
      fechaBaja:             [null],
      instrumentoLegalBaja:  [''],
      observaciones:         ['']
    });
  }

  loadCatalogs(): void {
    forkJoin({
      espacios:   this.movimientoService.getEspaciosCurriculares(),
      situaciones: this.movimientoService.getSituacionesRevista(),
      cargos:     this.cargoService.getAll()
    }).subscribe(({ espacios, situaciones, cargos }) => {
      this.espacios   = espacios;
      this.situaciones = situaciones;
      this.cargos     = cargos;

      if (this.isEditing) {
        this.movimientoService.getById(this.movimientoId!).subscribe((m: any) => {
          this.tipoActual = m.tipo || 'HORAS_CATEDRA';
          this.actualizarValidaciones(this.tipoActual);
          if (m.cargoRequiereCurso) this.cargoRequiereCurso = true;
          this.form.patchValue({
            ...m,
            fechaAlta: m.fechaAlta ? new Date(m.fechaAlta) : null,
            fechaBaja: m.fechaBaja ? new Date(m.fechaBaja) : null
          });
        });
      }
    });
  }

  setTipo(tipo: 'HORAS_CATEDRA' | 'CARGO'): void {
    this.tipoActual = tipo;
    this.form.patchValue({ tipo, cargoId: null, espacioCurricularId: null,
      cantidadHoras: null, modalidad: '', curso: '', division: '' });
    this.cargoRequiereCurso = false;
    this.actualizarValidaciones(tipo);
  }

  onCargoChange(cargoId: number): void {
    const cargo = this.cargos.find(c => c.id === cargoId);
    this.cargoRequiereCurso = cargo?.requiereCurso === true;
    this.actualizarValidaciones('CARGO');
    this.form.updateValueAndValidity();
  }

  actualizarValidaciones(tipo: 'HORAS_CATEDRA' | 'CARGO'): void {
    const ec   = this.form.get('espacioCurricularId')!;
    const hs   = this.form.get('cantidadHoras')!;
    const mod  = this.form.get('modalidad')!;
    const cId  = this.form.get('cargoId')!;
    const cur  = this.form.get('curso')!;
    const div  = this.form.get('division')!;

    if (tipo === 'HORAS_CATEDRA') {
      ec.setValidators(Validators.required);
      hs.setValidators([Validators.required, Validators.min(1)]);
      mod.setValidators(Validators.required);
      cur.setValidators(Validators.required);
      div.setValidators(Validators.required);
      cId.clearValidators();
    } else {
      cId.setValidators(Validators.required);
      ec.clearValidators();
      hs.clearValidators();
      mod.clearValidators();
      if (this.cargoRequiereCurso) {
        cur.setValidators(Validators.required);
        div.setValidators(Validators.required);
      } else {
        cur.clearValidators();
        div.clearValidators();
      }
    }
    [ec, hs, mod, cId, cur, div].forEach(c => c.updateValueAndValidity());
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw = this.form.value;
    const payload = {
      ...raw,
      docenteId: this.docenteId,
      fechaAlta: raw.fechaAlta ? this.toDateStr(raw.fechaAlta) : null,
      fechaBaja: raw.fechaBaja ? this.toDateStr(raw.fechaBaja) : null
    };

    const op = this.isEditing
      ? this.movimientoService.update(this.movimientoId!, payload)
      : this.movimientoService.create(payload);

    op.subscribe(() => {
      this.snackBar.open(
        this.isEditing ? 'Movimiento actualizado' : 'Movimiento creado correctamente',
        'Cerrar', { duration: 3000 }
      );
      this.volver();
    });
  }

  toDateStr(date: Date): string {
    return date instanceof Date ? date.toISOString().split('T')[0] : date;
  }

  volver(): void {
    this.router.navigate(['/docentes', this.docenteId]);
  }
}