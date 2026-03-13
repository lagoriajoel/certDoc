import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/material/material.module';
import { ActaService } from '../../../core/services/acta.service';
import { MovimientoService } from '../../../core/services/movimiento.service';
import { Acta, TipoActa, MovimientoHoras } from '../../../core/models/models';
import { ActaPrintComponent } from '../../../shared/components/acta-print/acta-print.component';

@Component({
  selector: 'app-acta-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <button mat-icon-button (click)="volver()" matTooltip="Volver">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="page-title">{{ actaId ? 'Editar Acta' : 'Nueva Acta' }}</h1>
          <span class="page-subtitle">
            {{ movimiento?.espacioCurricularNombre || movimiento?.cargoNombre }}
            @if (movimiento?.curso) { — {{ movimiento?.curso }} {{ movimiento?.division }} }
          </span>
        </div>
        @if (actaId) {
          <button mat-flat-button color="accent" (click)="verActa()" class="ml-auto">
            <mat-icon>print</mat-icon> Ver / Imprimir Acta
          </button>
        }
      </div>

      <mat-card class="form-card">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="acta-form">

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tipo de Acta</mat-label>
                <mat-select formControlName="tipoActa" (selectionChange)="onTipoActaChange()">
                  <mat-option value="ALTA_HORAS">Alta de Horas</mat-option>
                  <mat-option value="BAJA_HORAS">Baja de Horas</mat-option>
                  <mat-option value="CAMBIO_SITUACION_REVISTA">Cambio de Situación de Revista</mat-option>
                </mat-select>
                <mat-icon matSuffix>article</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nº Disposición Interna</mat-label>
                <input matInput formControlName="numeroDisposicion" placeholder="Ej: 02/C.P.E.S. Nº 22/26">
                <mat-icon matSuffix>tag</mat-icon>
                @if (form.get('numeroDisposicion')?.errors?.['required'] && form.get('numeroDisposicion')?.touched) {
                  <mat-error>Campo obligatorio</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Fecha del Acta</mat-label>
                <input matInput [matDatepicker]="pickerFecha" formControlName="fechaActa">
                <mat-datepicker-toggle matIconSuffix [for]="pickerFecha"></mat-datepicker-toggle>
                <mat-datepicker #pickerFecha></mat-datepicker>
                @if (form.get('fechaActa')?.errors?.['required'] && form.get('fechaActa')?.touched) {
                  <mat-error>Campo obligatorio</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-section-label">
              Visto
              <button mat-icon-button type="button" matTooltip="Regenerar texto" (click)="generarTextos()">
                <mat-icon>refresh</mat-icon>
              </button>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Visto</mat-label>
              <textarea matInput formControlName="visto" rows="4"></textarea>
            </mat-form-field>

            <div class="form-section-label">Considerando</div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Considerando</mat-label>
              <textarea matInput formControlName="considerando" rows="6"></textarea>
            </mat-form-field>

            <div class="form-section-label">Por Ello — Dispone</div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Artículos</mat-label>
              <textarea matInput formControlName="articulos" rows="6"></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button mat-stroked-button type="button" (click)="volver()">
                <mat-icon>close</mat-icon> Cancelar
              </button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
                <mat-icon>save</mat-icon> {{ actaId ? 'Guardar cambios' : 'Crear Acta' }}
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
    .ml-auto { margin-left: auto; }
    .form-card { border-radius: 12px !important; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; }
    .acta-form { display: flex; flex-direction: column; gap: 8px; padding-top: 8px; }
    .form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .form-section-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; padding: 8px 0 0; border-top: 1px solid #f1f5f9; margin-top: 8px; display: flex; align-items: center; gap: 4px; }
    .full-width { width: 100%; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid #f1f5f9; margin-top: 8px; }
    mat-form-field { width: 100%; }
    @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class ActaFormComponent implements OnInit {
  form!: FormGroup;
  actaId?: number;
  movimientoId!: number;
  docenteId!: number;
  movimiento?: MovimientoHoras;

  constructor(
    private fb: FormBuilder,
    private actaService: ActaService,
    private movimientoService: MovimientoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.docenteId = +this.route.snapshot.paramMap.get('docenteId')!;
    this.movimientoId = +this.route.snapshot.paramMap.get('movimientoId')!;
    const actaIdParam = this.route.snapshot.paramMap.get('actaId');
    if (actaIdParam) this.actaId = +actaIdParam;

    const tipoParam = this.route.snapshot.queryParamMap.get('tipo') || 'ALTA_HORAS';
    this.buildForm(tipoParam);
    this.loadMovimiento();
  }

  buildForm(tipoActa: string = 'ALTA_HORAS'): void {
    this.form = this.fb.group({
      tipoActa: [tipoActa, Validators.required],
      numeroDisposicion: ['', Validators.required],
      fechaActa: [new Date(), Validators.required],
      visto: [''],
      considerando: [''],
      articulos: ['']
    });
  }

  loadMovimiento(): void {
    this.movimientoService.getById(this.movimientoId).subscribe(m => {
      this.movimiento = m;
      if (this.actaId) {
        this.actaService.getByMovimiento(this.movimientoId).subscribe(actas => {
          const acta = actas.find(a => a.id === this.actaId);
          if (acta) {
            this.form.patchValue({
              tipoActa: acta.tipoActa,
              numeroDisposicion: acta.numeroDisposicion,
              fechaActa: acta.fechaActa ? new Date(acta.fechaActa) : new Date(),
              visto: acta.visto,
              considerando: acta.considerando,
              articulos: acta.articulos
            });
          }
        });
      } else {
        this.generarTextos();
      }
    });
  }

  onTipoActaChange(): void {
    if (!this.actaId) this.generarTextos();
  }

  generarTextos(): void {
    if (!this.movimiento) return;
    const tipo = this.form.get('tipoActa')?.value as TipoActa;
    const m = this.movimiento;
    const horas = m.cantidadHoras;
    const espacio = m.espacioCurricularNombre || m.cargoNombre || '';
    const curso = m.curso ? `${m.curso} "${m.division}"` : '';
    const situacion = m.situacionRevistaNombre || '';
    const instrAlta = m.instrumentoLegalAlta || '';
    const instrBaja = m.instrumentoLegalBaja || '';

    let visto = '', considerando = '', articulos = '';
    // Pre-cargar número de disposición según tipo
      if (tipo === 'ALTA_HORAS' || tipo === 'CAMBIO_SITUACION_REVISTA') {
        this.form.patchValue({ numeroDisposicion: instrAlta });
      } else if (tipo === 'BAJA_HORAS') {
        this.form.patchValue({ numeroDisposicion: instrBaja });
      }

    if (tipo === 'ALTA_HORAS') {
      visto = `La necesidad de registrar el alta de horas cátedra en el espacio curricular ${espacio}${curso ? ' del ' + curso : ''}.`;
      considerando = `Que el/la docente ha sido designado/a en ${horas} (${this.numToLetras(horas)}) hora/s cátedra en el espacio curricular de ${espacio}${curso ? ' del ' + curso : ''}, en carácter ${situacion};\n\nQue corresponde dictar el instrumento legal correspondiente.`;
      articulos = `Artículo 1º - DESIGNAR en carácter ${situacion} al/la docente en ${horas} (${this.numToLetras(horas)}) hora/s cátedra del espacio curricular ${espacio}${curso ? ' del ' + curso : ''}, a partir de la fecha que indique el instrumento legal ${instrAlta}.\n\nArtículo 2º - NOTIFICAR al/la docente.\n\nArtículo 3º - TOME RAZÓN Supervisión de Educación Secundaria, Dirección Provincial de Educación Secundaria, Director de Liquidaciones, Director de Control de Sueldos.`;
    } else if (tipo === 'BAJA_HORAS') {
      visto = `La necesidad de registrar la baja de horas cátedra en el espacio curricular ${espacio}${curso ? ' del ' + curso : ''}.`;
      considerando = `Que el/la docente cesa en ${horas} (${this.numToLetras(horas)}) hora/s cátedra en el espacio curricular de ${espacio}${curso ? ' del ' + curso : ''};\n\nQue corresponde dictar el instrumento legal correspondiente.`;
      articulos = `Artículo 1º - CESAR al/la docente en ${horas} (${this.numToLetras(horas)}) hora/s cátedra del espacio curricular ${espacio}${curso ? ' del ' + curso : ''}, a partir de la fecha que indique el instrumento legal ${instrBaja}.\n\nArtículo 2º - NOTIFICAR al/la docente.\n\nArtículo 3º - TOME RAZÓN Supervisión de Educación Secundaria, Dirección Provincial de Educación Secundaria, Director de Liquidaciones, Director de Control de Sueldos.`;
    } else if (tipo === 'CAMBIO_SITUACION_REVISTA') {
      visto = `La necesidad de regularizar acto administrativo anterior por cambio de situación de revista en el espacio curricular ${espacio}${curso ? ' del ' + curso : ''}.`;
      considerando = `Que el/la docente había sido designado/a en ${horas} (${this.numToLetras(horas)}) hora/s cátedra en el espacio curricular de ${espacio}${curso ? ' del ' + curso : ''}, en carácter ${situacion};\n\nQue habiendo operado el cambio de situación de revista, corresponde dictar el instrumento legal correspondiente.`;
      articulos = `Artículo 1º - CAMBIAR LA SITUACIÓN DE REVISTA a ${situacion} al/la docente en ${horas} (${this.numToLetras(horas)}) hora/s cátedra del espacio curricular ${espacio}${curso ? ' del ' + curso : ''}, a partir de la fecha indicada en el instrumento legal ${instrAlta}.\n\nArtículo 2º - NOTIFICAR al/la docente.\n\nArtículo 3º - TOME RAZÓN Supervisión de Educación Secundaria, Dirección Provincial de Educación Secundaria, Director de Liquidaciones, Director de Control de Sueldos.`;
    }

    this.form.patchValue({ visto, considerando, articulos });
  }

  numToLetras(n?: number): string {
    const letras: Record<number, string> = {
      1: 'una', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco',
      6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez',
      11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince',
      16: 'dieciséis', 17: 'diecisiete', 18: 'dieciocho', 19: 'diecinueve',
      20: 'veinte', 24: 'veinticuatro', 30: 'treinta', 36: 'treinta y seis'
    };
    return letras[n || 0] || `${n}`;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw = this.form.value;
    const payload: Acta = {
      movimientoId: this.movimientoId,
      tipoActa: raw.tipoActa,
      numeroDisposicion: raw.numeroDisposicion,
      fechaActa: raw.fechaActa instanceof Date
        ? raw.fechaActa.toISOString().split('T')[0]
        : raw.fechaActa,
      nombreDirectivo: 'Rector/a',
      visto: raw.visto,
      considerando: raw.considerando,
      articulos: raw.articulos
    };

    const op = this.actaId
      ? this.actaService.update(this.actaId, payload)
      : this.actaService.create(payload);

    op.subscribe(() => {
      this.snackBar.open(
        this.actaId ? 'Acta actualizada' : 'Acta creada correctamente',
        'Cerrar', { duration: 3000 }
      );
      this.volver();
    });
  }

  verActa(): void {
    this.actaService.getByMovimiento(this.movimientoId).subscribe(actas => {
      const acta = actas.find(a => a.id === this.actaId);
      if (acta) {
        this.dialog.open(ActaPrintComponent, {
          data: acta,
          width: '90vw',
          maxWidth: '1100px',
          panelClass: 'print-dialog'
        });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/docentes', this.docenteId]);
  }
}