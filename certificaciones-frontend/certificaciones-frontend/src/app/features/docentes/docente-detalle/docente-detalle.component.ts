import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material/material.module';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CertificacionPrintComponent } from '../../../shared/components/certificacion-print/certificacion-print.component';
import { DocenteService } from '../../../core/services/docente.service';
import { MovimientoService } from '../../../core/services/movimiento.service';
import { ActaService } from '../../../core/services/acta.service';
import { Docente, MovimientoHoras, CertificacionResponse } from '../../../core/models/models';
import { ActasDialogComponent } from '../../../shared/components/actas-dialog/actas-dialog.component';
@Component({
  selector: 'app-docente-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, DatePipe],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <button mat-icon-button routerLink="/docentes" matTooltip="Volver al listado">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-info">
          <h1 class="page-title">{{ docente?.apellido }}, {{ docente?.nombre }}</h1>
          <span class="page-subtitle">DNI: {{ docente?.dni }}</span>
        </div>
        <div class="header-actions">
          <button mat-stroked-button [routerLink]="['/docentes', docenteId, 'editar']">
            <mat-icon>edit</mat-icon> Editar
          </button>
          <button mat-flat-button color="accent" (click)="imprimirCertificacion()">
            <mat-icon>print</mat-icon> Imprimir Certificación
          </button>
        </div>
      </div>

      <!-- Tarjeta docente -->
      <mat-card class="docente-card">
        <mat-card-content>
          <div class="docente-info">
            <div class="info-item">
              <span class="info-label">DNI</span>
              <span class="info-value dni">{{ docente?.dni }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Apellido</span>
              <span class="info-value">{{ docente?.apellido }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Nombre</span>
              <span class="info-value">{{ docente?.nombre }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Horas activas</span>
              <span class="info-value hours">{{ totalHorasActivas }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Movimientos -->
      <div class="section-header">
        <h2 class="section-title">
          <mat-icon>schedule</mat-icon>
          Movimientos de Horas
        </h2>
        <button mat-flat-button color="primary"
          [routerLink]="['/docentes', docenteId, 'movimiento', 'nuevo']">
          <mat-icon>add</mat-icon> Agregar Movimiento
        </button>
      </div>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-wrapper">
            <table mat-table [dataSource]="movimientos" class="movimientos-table">

              <ng-container matColumnDef="espacioCurricular">
                <th mat-header-cell *matHeaderCellDef>Espacio Curricular / Cargo</th>
                    <td mat-cell *matCellDef="let m">
                      <strong>{{ m.espacioCurricularNombre || m.cargoNombre }}</strong>
                    </td>
              </ng-container>

              <ng-container matColumnDef="cursoDiv">
                <th mat-header-cell *matHeaderCellDef>Curso / Div.</th>
                <td mat-cell *matCellDef="let m">{{ m.curso }} {{ m.division }}</td>
              </ng-container>

              <ng-container matColumnDef="horas">
                <th mat-header-cell *matHeaderCellDef>Horas</th>
                <td mat-cell *matCellDef="let m">
                      @if (m.tipo === 'HORAS_CATEDRA') {
                        <span class="horas-badge">{{ m.cantidadHoras }}h</span>
                      } @else {
                        <span class="cargo-badge">1 cargo</span>
                      }
                    </td>
              </ng-container>

              <ng-container matColumnDef="situacion">
                <th mat-header-cell *matHeaderCellDef>Situación</th>
                <td mat-cell *matCellDef="let m">
                  <span [class]="'situacion-chip ' + getSituacionClass(m.situacionRevistaNombre)">
                    {{ m.situacionRevistaNombre }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="fechaAlta">
                <th mat-header-cell *matHeaderCellDef>Alta</th>
                <td mat-cell *matCellDef="let m">{{ m.fechaAlta | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <ng-container matColumnDef="fechaBaja">
                <th mat-header-cell *matHeaderCellDef>Baja</th>
                <td mat-cell *matCellDef="let m">
                  @if (m.fechaBaja) {
                    {{ m.fechaBaja | date:'dd/MM/yyyy' }}
                  } @else {
                    <span class="activo-chip">Continúa</span>
                  }
                </td>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let m">
                  <div class="action-buttons">
                    <!-- Botón Acta -->
                    <button mat-icon-button
                      [color]="actasMap[m.id!] ? 'accent' : ''"
                      (click)="abrirActa(m)"
                      [matTooltip]="actasMap[m.id!] ? 'Ver / Editar Acta' : 'Cargar Acta'">
                      <mat-icon>{{ actasMap[m.id!] ? 'description' : 'note_add' }}</mat-icon>
                    </button>
                    <button mat-icon-button
                      [routerLink]="['/docentes', docenteId, 'movimiento', m.id, 'editar']"
                      matTooltip="Editar">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn"
                      (click)="confirmarEliminarMovimiento(m)" matTooltip="Eliminar">
                      <mat-icon>delete_outline</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>

              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data" [attr.colspan]="columns.length">
                  <mat-icon>event_busy</mat-icon>
                  <span>Sin movimientos registrados</span>
                </td>
              </tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
    .header-info { flex: 1; }
    .page-title { margin: 0; font-size: 1.6rem; font-weight: 700; color: #1e293b; }
    .page-subtitle { color: #64748b; font-size: 0.9rem; }
    .header-actions { display: flex; gap: 8px; }
    .docente-card { border-radius: 12px !important; border: 1px solid #e2e8f0; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; }
    .docente-info { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; }
    .info-value { font-size: 1.1rem; font-weight: 600; color: #1e293b; }
    .info-value.dni { font-family: monospace; color: #2563eb; }
    .info-value.hours { color: #059669; font-size: 1.4rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .section-title { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 1.2rem; font-weight: 700; color: #1e293b; }
    .section-title mat-icon { color: #3b82f6; }
    .table-card { border-radius: 12px !important; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; }
    .table-wrapper { overflow-x: auto; }
    .movimientos-table { width: 100%; }
    .cargo-badge { background: #f3e8ff; color: #7c3aed; padding: 2px 10px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; }
    .horas-badge { background: #dbeafe; color: #1d4ed8; padding: 2px 10px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; }
    .activo-chip { background: #dcfce7; color: #15803d; padding: 2px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .situacion-chip { padding: 3px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .situacion-titular { background: #fef3c7; color: #92400e; }
    .situacion-interino { background: #e0e7ff; color: #3730a3; }
    .situacion-suplente { background: #fce7f3; color: #9d174d; }
    .action-buttons { display: flex; gap: 4px; }
    .table-row:hover { background: #f8fafc; }
    .no-data { text-align: center; padding: 48px !important; color: #94a3b8; }
    .no-data mat-icon { font-size: 48px; width: 48px; height: 48px; display: block; margin: 0 auto 8px; }
    th.mat-header-cell { font-weight: 700; color: #475569; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; }
    @media (max-width: 768px) { .docente-info { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class DocenteDetalleComponent implements OnInit {
  docente?: Docente;
  movimientos: MovimientoHoras[] = [];
  columns = ['espacioCurricular', 'cursoDiv', 'horas', 'situacion', 'fechaAlta', 'fechaBaja', 'acciones'];
  docenteId!: number;
  totalHorasActivas = 0;
  actasMap: Record<number, boolean> = {};  // movimientoId → tiene acta?

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private docenteService: DocenteService,
    private movimientoService: MovimientoService,
    private actaService: ActaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.docenteId = +this.route.snapshot.paramMap.get('id')!;
    this.loadDocente();
    this.loadMovimientos();
  }

  loadDocente(): void {
    this.docenteService.getById(this.docenteId).subscribe(d => this.docente = d);
  }

  loadMovimientos(): void {
    this.movimientoService.getByDocente(this.docenteId).subscribe(list => {
      this.movimientos = list;
     this.totalHorasActivas = list
  .filter(m => !m.fechaBaja && m.tipo === 'HORAS_CATEDRA')
  .reduce((sum, m) => sum + (m.cantidadHoras || 0), 0);
      this.verificarActas(list);
    });
  }

  // Verificar qué movimientos ya tienen acta cargada
  verificarActas(movimientos: MovimientoHoras[]): void {
    movimientos.forEach(m => {
      if (m.id) {
        this.actaService.existeActa(m.id).subscribe(res => {
          this.actasMap[m.id!] = res.existe;
        });
      }
    });
  }

  abrirActa(m: MovimientoHoras): void {
  this.dialog.open(ActasDialogComponent, {
    data: { movimiento: m, docenteId: this.docenteId },
    width: '560px'
  });
}

  getSituacionClass(nombre?: string): string {
    const map: Record<string, string> = {
      'Titular': 'situacion-titular',
      'Interino': 'situacion-interino',
      'Suplente': 'situacion-suplente'
    };
    return map[nombre || ''] || '';
  }

  imprimirCertificacion(): void {
    this.movimientoService.getCertificacion(this.docenteId).subscribe(cert => {
      this.dialog.open(CertificacionPrintComponent, {
        data: cert,
        width: '90vw',
        maxWidth: '1100px',
        panelClass: 'print-dialog'
      });
    });
  }

  confirmarEliminarMovimiento(m: MovimientoHoras): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Movimiento',
        message: `¿Eliminar el movimiento de ${m.espacioCurricularNombre} (${m.curso} ${m.division})?`,
        confirmText: 'Eliminar'
      }
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.movimientoService.delete(m.id!).subscribe(() => {
          this.snackBar.open('Movimiento eliminado', 'Cerrar', { duration: 3000 });
          this.loadMovimientos();
        });
      }
    });
  }
}