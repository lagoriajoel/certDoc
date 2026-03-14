import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CertificacionResponse } from '../../../core/models/models';

@Component({
  selector: 'app-certificacion-print',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, DatePipe, FormsModule, MatDialogModule, MatButtonModule,
            MatIconModule, MatInputModule, MatFormFieldModule],
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

    <!-- Nota al pie editable (no se imprime el campo, sí el contenido) -->
    <div class="no-print nota-pie-editor">
      <mat-form-field appearance="outline" class="nota-field">
        <mat-label>Nota al pie (opcional)</mat-label>
        <textarea matInput [(ngModel)]="cert.notaPie" rows="3"
          placeholder="Ej: DI: 265/13 - 17/05/13 LCMJ para desempeñarse como Regente EICO"></textarea>
        <mat-hint>Este texto aparecerá al pie de la certificación impresa</mat-hint>
      </mat-form-field>
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
          <colgroup>
            <col class="col-num">
            <col class="col-espacio">
            <col class="col-hs">
            <col class="col-curso">
            <col class="col-div">
            <col class="col-modalidad">
            <col class="col-sit">
            <col class="col-fecha">
            <col class="col-instr">
            <col class="col-fecha">
            <col class="col-instr">
            <col class="col-obs">
          </colgroup>
          <thead>
            <tr>
              <th>Nº</th>
             <th>E. Curricular / Cargo</th>
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
                    <td>{{ m.tipo === 'CARGO' ? m.cargo : m.espacioCurricular }}</td>
                   <td class="center">{{ m.tipo === 'CARGO' ? '1 cargo' : m.cantidadHoras }}</td>
                    <td class="center">{{ m.curso || '—' }}</td>
                    <td class="center">{{ m.division || '—' }}</td>
                    <td>{{ m.tipo === 'HORAS_CATEDRA' ? m.modalidad : '—' }}</td>
                    <td>{{ m.situacionRevista }}</td>
                    <td class="center">{{ m.fechaAlta | date:'dd/MM/yy' }}</td>
                    <td>{{ m.instrumentoLegalAlta }}</td>
                    <td class="center">{{ m.fechaBaja ? (m.fechaBaja | date:'dd/MM/yy') : '—' }}</td>
                    <td>{{ m.instrumentoLegalBaja || '—' }}</td>
                    <td>{{ m.observaciones || '' }}</td>
                  </tr>
                }
          </tbody>
        </table>

        <!-- Total horas -->
        <div class="cert-total">
          <span>Total de horas activas:</span>
          <strong class="cert-total-value">{{ cert.totalHorasActivas }} horas</strong>
        </div>

        <!-- Nota al pie (solo se muestra si tiene contenido) -->
        @if (cert.notaPie) {
          <div class="cert-nota-pie">
            <p class="cert-nota-titulo">Observaciones:</p>
            <p class="cert-nota-texto" style="white-space: pre-line">{{ cert.notaPie }}</p>
          </div>
        }

        <!-- Pie firmas -->
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
    .cdk-overlay-pane .mat-mdc-dialog-container,
    .cdk-overlay-pane .mdc-dialog__surface { padding: 0 !important; overflow: hidden !important; }

    .no-print { background: white; }
    .dialog-actions { padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .dialog-title { margin: 0; font-size: 1.1rem; font-weight: 700; }
    .dialog-btns { display: flex; gap: 8px; }

    .nota-pie-editor { padding: 12px 24px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
    .nota-field { width: 100%; }

    .cert-wrapper { padding: 8px; background: #f1f5f9; max-height: 62vh; overflow-y: auto; }
    .cert-document { background: white; padding: 10mm 6mm; max-width: 100%; margin: 0 auto; box-shadow: 0 2px 12px rgba(0,0,0,0.15); border-radius: 4px; }

    .cert-header { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
    .cert-logo { width: 80px; }
    .cert-title { margin: 0; font-size: 1rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em; color: #1e293b; }
    .cert-subtitle { margin: 3px 0 0; font-size: 0.8rem; color: #64748b; }
    .cert-divider { border: none; border-top: 2px solid #1e293b; margin: 10px 0; }
    .cert-intro { font-size: 0.88rem; line-height: 1.5; margin-bottom: 14px; color: #334155; }

    .cert-table { width: 100%; border-collapse: collapse; font-size: 0.72rem; margin-bottom: 14px; table-layout: fixed; }
    .col-num { width: 4%; } .col-espacio { width: 15%; } .col-hs { width: 4%; }
    .col-curso { width: 6%; } .col-div { width: 4%; } .col-modalidad { width: 9%; }
    .col-sit { width: 9%; } .col-fecha { width: 8%; } .col-instr { width: 12%; } .col-obs { width: 9%; }
    .cert-table th { background: #000000 !important; color: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; padding: 6px 4px; text-align: left; font-size: 0.65rem; white-space: nowrap; overflow: hidden; }
    .cert-table td { padding: 5px 4px; border-bottom: 1px solid #e2e8f0; color: #334155; overflow: hidden; text-overflow: ellipsis; word-break: break-word; }
    .cert-table tr:nth-child(even) td { background: #f8fafc; }
    .cert-table .center { text-align: center; }

    .cert-total { display: flex; align-items: center; gap: 12px; justify-content: flex-end; padding: 10px 0; border-top: 2px solid #1e293b; font-size: 0.9rem; color: #334155; }
    .cert-total-value { font-size: 1rem; color: #059669; }

    .cert-nota-pie { margin-top: 14px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; }
    .cert-nota-titulo { margin: 0 0 4px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #475569; }
    .cert-nota-texto { margin: 0; font-size: 0.82rem; color: #334155; line-height: 1.6; }

    .cert-footer { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 40px; text-align: center; font-size: 0.82rem; color: #475569; }
    .cert-sign-line { border-bottom: 1px solid #334155; margin-bottom: 8px; }
    .cert-sign-role { font-weight: 600; }
    .cert-date-col { display: flex; align-items: flex-end; justify-content: center; }
    .cert-lugar { font-size: 0.82rem; color: #475569; }
    .col-obs { width: 15%; }
    .col-modalidad { width: 7%; }
    .col-sit { width: 8%; }
    .col-hs { width: 10%; }
    @media print {
      @page { size: A4 landscape; margin: 2mm 6mm; }
      .no-print { display: none !important; }
      .cert-wrapper { padding: 0 !important; background: white !important; max-height: none !important; overflow: visible !important; }
      .cert-document { box-shadow: none !important; border-radius: 0 !important; padding: 0 !important; max-width: 100% !important; width: 100% !important; }
      .cert-table { font-size: 6.5pt !important; }
      .cert-table th { font-size: 6pt !important; padding: 4px 3px !important; background: #000000 !important; color: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .cert-table td { padding: 4px 3px !important; }
      .cert-title { font-size: 10pt !important; }
      .cert-intro { font-size: 8pt !important; }
      .cert-total { font-size: 8pt !important; }
      .cert-nota-pie { border: none !important; background: white !important; padding: 6px 0 !important; border-top: 1px solid #e2e8f0 !important; }
      .cert-nota-titulo { font-size: 7pt !important; }
      .cert-nota-texto { font-size: 7pt !important; }
      .cert-footer { font-size: 7.5pt !important; margin-top: 24px !important; }
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