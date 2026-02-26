import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CertificacionResponse, MovimientoCertificacion } from '../../../core/models/models';

@Component({
  selector: 'app-certificacion-print',
  standalone: true,
  imports: [CommonModule, DatePipe, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <!-- Acciones (no se imprimen) -->
    <div class="no-print dialog-actions">
      <h2 class="dialog-title">Vista previa de Certificación</h2>
      <div class="dialog-btns">
        <button mat-stroked-button (click)="close()">
          <mat-icon>close</mat-icon> Cerrar
        </button>
        <button mat-flat-button color="primary" (click)="print()">
          <mat-icon>print</mat-icon> Imprimir
        </button>
      </div>
    </div>

    <!-- Contenido imprimible -->
    <div class="cert-wrapper" id="printArea">
      <div class="cert-document">

        <!-- Encabezado -->
        <div class="cert-header">
          <img src="assets/logo1.jpg" alt="Logo Ministerio" class="cert-logo">
          <div class="cert-header-text">
            <h1 class="cert-title">CERTIFICACIÓN DE SERVICIOS DOCENTES</h1>
            <p class="cert-subtitle">Consejo Provincial de Educación - Santa Cruz</p>
          </div>
        </div>

        <hr class="cert-divider">

        <!-- Introducción -->
        <p class="cert-intro">
          La Dirección de la Escuela deja constancia que el/la
          <strong>Prof. {{ cert.apellidoNombre }}</strong>,
          DNI <strong>{{ cert.dni }}</strong>,
          ha prestado servicios en esta institución según el siguiente detalle:
        </p>

        <!-- Tabla -->
        <table class="cert-table">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Espacio Curricular</th>
              <th>Hs.</th>
              <th>Curso</th>
              <th>Div.</th>
              <th>Modalidad</th>
              <th>Sit. Revista</th>
              <th>Fecha Alta</th>
              <th>Instr. Alta</th>
              <th>Fecha Baja</th>
              <th>Instr. Baja</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            @for (m of cert.movimientos; track m.numero) {
              <tr>
                <td class="center">{{ m.numero }}</td>
                <td>{{ m.espacioCurricular }}</td>
                <td class="center"><strong>{{ m.cantidadHoras }}</strong></td>
                <td class="center">{{ m.curso }}</td>
                <td class="center">{{ m.division }}</td>
                <td>{{ m.modalidad }}</td>
                <td>{{ m.situacionRevista }}</td>
                <td class="center">{{ m.fechaAlta | date:'dd/MM/yy' }}</td>
                <td class="small">{{ m.instrumentoLegalAlta }}</td>
                <td class="center">{{ m.fechaBaja ? (m.fechaBaja | date:'dd/MM/yy') : '—' }}</td>
                <td class="small">{{ m.instrumentoLegalBaja || '—' }}</td>
                <td class="small">{{ m.observaciones || '' }}</td>
              </tr>
            }
          </tbody>
        </table>

        <!-- Total horas -->
        <div class="cert-total">
          <span>Total de horas activas:</span>
          <strong class="cert-total-value">{{ cert.totalHorasActivas }} horas</strong>
        </div>

        <!-- Pie -->
        <div class="cert-footer">
          <div class="cert-footer-col">
            <div class="cert-sign-line"></div>
            <p>Firma y Aclaración</p>
            <p class="cert-sign-role">Director/a</p>
          </div>
          <div class="cert-footer-col cert-date-col">
            <p class="cert-lugar">Lugar y fecha: _____________________, {{ today | date:'dd/MM/yyyy' }}</p>
          </div>
          <div class="cert-footer-col">
            <div class="cert-sign-line"></div>
            <p>Sello Institucional</p>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* Dialog Material */
    :host ::ng-deep .cdk-overlay-pane .mdc-dialog__surface {
      padding: 0 !important;
      display: flex !important;
      flex-direction: column !important;
    }

    /* Pantalla */
    .no-print { padding: 16px 24px; border-bottom: 1px solid #e2e8f0; }
    .dialog-title { margin: 0; font-size: 1.1rem; font-weight: 700; }
    .dialog-actions { display: flex; justify-content: space-between; align-items: center; }
    .dialog-btns { display: flex; gap: 8px; }
    .cert-wrapper { padding: 21px; background: #f8fafc; max-height: 75vh; overflow-y: auto; }
    .cert-document { background: white; padding: 5px; max-width: 960px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.12); border-radius: 4px; }

    /* Encabezado */
    .cert-header { display: flex; align-items: center; gap: 20px; margin-bottom: 16px; }
    .cert-logo-placeholder { font-size: 3rem; }
    .cert-logo {  width: 100px;}
    .cert-title { margin: 0; font-size: 1.2rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: #1e293b; }
    .cert-subtitle { margin: 4px 0 0; font-size: 0.85rem; color: #64748b; }
    .cert-divider { border: none; border-top: 2px solid #1e293b; margin: 16px 0; }
    .cert-intro { font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px; color: #334155; }

    /* Tabla */
    .cert-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; margin-bottom: 20px; }
    .cert-table th { background: #1e293b; color: white; padding: 8px 6px; text-align: left; font-size: 0.72rem; white-space: nowrap; }
    .cert-table td { padding: 7px 6px; border-bottom: 1px solid #e2e8f0; color: #334155; }
    .cert-table tr:nth-child(even) td { background: #f8fafc; }
    .cert-table .center { text-align: center; }
    .cert-table .small { font-size: 0.72rem; }

    /* Total */
    .cert-total { display: flex; align-items: center; gap: 12px; justify-content: flex-end; padding: 12px 0; border-top: 2px solid #1e293b; font-size: 0.95rem; color: #334155; }
    .cert-total-value { font-size: 1.1rem; color: #059669; }

    /* Pie */
    .cert-footer { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 60px; text-align: center; font-size: 0.85rem; color: #475569; }
    .cert-sign-line { border-bottom: 1px solid #334155; margin-bottom: 8px; }
    .cert-sign-role { font-weight: 600; }
    .cert-date-col { display: flex; align-items: flex-end; justify-content: center; }
    .cert-lugar { font-size: 0.85rem; color: #475569; }

    /* Print */
    @media print {
       size: A4 landscape;
        margin: 10mm 8mm; 
      .no-print { display: none !important; }
      .cert-wrapper { padding: 0; background: white; max-height: none; overflow: visible; }
      .cert-document { box-shadow: none; padding: 10mm 8mm; max-width: 100%; }
      .cert-table { font-size: 7pt; }
      .cert-title { font-size: 12pt; }
      .cert-intro { font-size: 9pt; }
    }
  `]
})
export class CertificacionPrintComponent {
  today = new Date();

  constructor(
    public dialogRef: MatDialogRef<CertificacionPrintComponent>,
    @Inject(MAT_DIALOG_DATA) public cert: CertificacionResponse
  ) {}

  print(): void { window.print(); }
  close(): void { this.dialogRef.close(); }
}
