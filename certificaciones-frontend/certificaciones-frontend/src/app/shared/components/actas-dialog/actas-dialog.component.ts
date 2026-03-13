import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActaService } from '../../../core/services/acta.service';
import { Acta, MovimientoHoras } from '../../../core/models/models';
import { ActaPrintComponent } from '../acta-print/acta-print.component';

export interface ActasDialogData {
  movimiento: MovimientoHoras;
  docenteId: number;
}

interface ActaItem {
  tipo: string;
  label: string;
  descripcion: string;
  icono: string;
  disponible: boolean; // solo disponible si el movimiento tiene fechaBaja para BAJA_HORAS
  acta?: Acta;
}

@Component({
  selector: 'app-actas-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="dialog-header">
      <div class="header-info">
        <h2 class="dialog-title">Actas del movimiento</h2>
        <span class="dialog-subtitle">
          {{ movimiento.espacioCurricularNombre || movimiento.cargoNombre }}
          @if (movimiento.curso) { — {{ movimiento.curso }} {{ movimiento.division }} }
        </span>
      </div>
      <button mat-icon-button (click)="close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <div class="dialog-body">
      @if (loading) {
        <div class="loading-state">
          <mat-spinner diameter="32"></mat-spinner>
        </div>
      } @else {
        <div class="actas-list">
          @for (item of actaItems; track item.tipo) {
            <div class="acta-item" [class.disabled]="!item.disponible">
              <div class="acta-icon" [class]="'icon-' + item.tipo.toLowerCase()">
                <mat-icon>{{ item.icono }}</mat-icon>
              </div>
              <div class="acta-info">
                <span class="acta-label">{{ item.label }}</span>
                <span class="acta-desc">{{ item.descripcion }}</span>
                @if (item.acta) {
                  <span class="acta-numero">Nº {{ item.acta.numeroDisposicion }}</span>
                }
              </div>
              <div class="acta-actions">
                @if (!item.disponible) {
                  <span class="acta-no-disponible">Requiere fecha de baja</span>
                } @else if (item.acta) {
                  <button mat-stroked-button (click)="verActa(item.acta!)">
                    <mat-icon>visibility</mat-icon> Ver
                  </button>
                  <button mat-stroked-button (click)="editarActa(item)">
                    <mat-icon>edit</mat-icon> Editar
                  </button>
                  <button mat-icon-button color="warn" (click)="eliminarActa(item)" matTooltip="Eliminar">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                } @else {
                  <button mat-flat-button color="primary" (click)="crearActa(item)">
                    <mat-icon>add</mat-icon> Crear
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .dialog-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 20px 20px 12px; border-bottom: 1px solid #e2e8f0; }
    .dialog-title { margin: 0; font-size: 1.1rem; font-weight: 700; color: #1e293b; }
    .dialog-subtitle { font-size: 0.85rem; color: #64748b; }
    .dialog-body { padding: 16px 20px 20px; min-width: 480px; }
    .loading-state { display: flex; justify-content: center; padding: 32px; }
    .actas-list { display: flex; flex-direction: column; gap: 12px; }
    .acta-item { display: flex; align-items: center; gap: 12px; padding: 14px; border: 1px solid #e2e8f0; border-radius: 10px; background: #f8fafc; }
    .acta-item.disabled { opacity: 0.5; }
    .acta-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .icon-alta_horas { background: #dcfce7; color: #15803d; }
    .icon-baja_horas { background: #fee2e2; color: #dc2626; }
    .icon-cambio_situacion_revista { background: #fef3c7; color: #d97706; }
    .acta-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .acta-label { font-size: 0.9rem; font-weight: 600; color: #1e293b; }
    .acta-desc { font-size: 0.78rem; color: #64748b; }
    .acta-numero { font-size: 0.78rem; color: #2563eb; font-weight: 600; }
    .acta-actions { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }
    .acta-no-disponible { font-size: 0.75rem; color: #94a3b8; font-style: italic; }
  `]
})
export class ActasDialogComponent implements OnInit {
  movimiento: MovimientoHoras;
  docenteId: number;
  loading = true;
  actaItems: ActaItem[] = [];

  constructor(
    public dialogRef: MatDialogRef<ActasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActasDialogData,
    private actaService: ActaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.movimiento = data.movimiento;
    this.docenteId = data.docenteId;
  }

  ngOnInit(): void {
    this.cargarActas();
  }

  cargarActas(): void {
    this.loading = true;
    this.actaService.getByMovimiento(this.movimiento.id!).subscribe(actas => {
      this.buildItems(actas);
      this.loading = false;
    });
  }

  buildItems(actas: Acta[]): void {
    const tieneFechaBaja = !!this.movimiento.fechaBaja;
    const actaAlta = actas.find(a => a.tipoActa === 'ALTA_HORAS');
    const actaBaja = actas.find(a => a.tipoActa === 'BAJA_HORAS');

    this.actaItems = [
      {
        tipo: 'ALTA_HORAS',
        label: 'Acta de Alta',
        descripcion: 'Designación / inicio de servicio',
        icono: 'arrow_upward',
        disponible: true,
        acta: actaAlta
      },
      {
        tipo: 'BAJA_HORAS',
        label: 'Acta de Baja',
        descripcion: 'Cese / fin de servicio',
        icono: 'arrow_downward',
        disponible: tieneFechaBaja,
        acta: actaBaja
      }
    ];
  }

  crearActa(item: ActaItem): void {
    this.dialogRef.close();
    this.router.navigate(
      ['/docentes', this.docenteId, 'movimiento', this.movimiento.id, 'acta', 'nuevo'],
      { queryParams: { tipo: item.tipo } }
    );
  }

  editarActa(item: ActaItem): void {
    this.dialogRef.close();
    this.router.navigate(
      ['/docentes', this.docenteId, 'movimiento', this.movimiento.id, 'acta', item.acta!.id, 'editar']
    );
  }

  verActa(acta: Acta): void {
    this.dialog.open(ActaPrintComponent, {
      data: acta,
      width: '90vw',
      maxWidth: '1100px',
      panelClass: 'print-dialog'
    });
  }

  eliminarActa(item: ActaItem): void {
    this.actaService.delete(item.acta!.id!).subscribe(() => {
      this.snackBar.open('Acta eliminada', 'Cerrar', { duration: 3000 });
      this.cargarActas();
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}