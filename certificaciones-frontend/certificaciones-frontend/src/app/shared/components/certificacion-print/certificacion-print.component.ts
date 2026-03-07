import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CertificacionResponse, MovimientoCertificacion } from '../../../core/models/models';

@Component({
  selector: 'app-certificacion-print',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
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
    /* ── Quitar padding del dialog de Material ── */
    .cdk-overlay-pane .mat-mdc-dialog-container,
    .cdk-overlay-pane .mdc-dialog__surface {
      padding: 0 !important;
      overflow: hidden !important;
    }

    /* ── Acciones del dialog ── */
    .no-print {
      padding: 16px 24px;
      border-bottom: 1px solid #e2e8f0;
      background: white;
    }
    .dialog-title  { margin: 0; font-size: 1.1rem; font-weight: 700; }
    .dialog-actions { display: flex; justify-content: space-between; align-items: center; }
    .dialog-btns   { display: flex; gap: 8px; }

    /* ── Wrapper scroll ── */
    .cert-wrapper {
      padding: 16px;
      background: #f1f5f9;
      max-height: 78vh;
      overflow-y: auto;
    }

    /* ── Hoja (pantalla) ── */
    .cert-document {
      background: white;
      padding: 12mm 8mm;       /* margen visible en pantalla, igual al de impresión */
      max-width: 960px;
      margin: 0 auto;
      box-shadow: 0 2px 12px rgba(0,0,0,0.15);
      border-radius: 4px;
    }

    /* ── Encabezado ── */
    .cert-header       { display: flex; align-items: center; gap: 20px; margin-bottom: 14px; }
    .cert-logo         { width: 90px; }
    .cert-title        { margin: 0; font-size: 1.1rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: #1e293b; }
    .cert-subtitle     { margin: 4px 0 0; font-size: 0.82rem; color: #64748b; }
    .cert-divider      { border: none; border-top: 2px solid #1e293b; margin: 12px 0; }
    .cert-intro        { font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px; color: #334155; }

    /* ── Tabla ── */
    .cert-table            { width: 100%; border-collapse: collapse; font-size: 0.75rem; margin-bottom: 16px; table-layout: fixed; }
    .cert-table th         { background: #1e293b; color: white; padding: 6px 4px; text-align: left; font-size: 0.68rem; white-space: nowrap; }
    .cert-table td         { padding: 6px 4px; border-bottom: 1px solid #e2e8f0; color: #334155; word-break: break-word; }
    .cert-table tr:nth-child(even) td { background: #f8fafc; }
    .cert-table .center    { text-align: center; }
    .cert-table .small     { font-size: 0.68rem; }

    /* ── Total ── */
    .cert-total        { display: flex; align-items: center; gap: 12px; justify-content: flex-end; padding: 10px 0; border-top: 2px solid #1e293b; font-size: 0.9rem; color: #334155; }
    .cert-total-value  { font-size: 1rem; color: #059669; }

    /* ── Pie ── */
    .cert-footer       { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 48px; text-align: center; font-size: 0.82rem; color: #475569; }
    .cert-sign-line    { border-bottom: 1px solid #334155; margin-bottom: 8px; }
    .cert-sign-role    { font-weight: 600; }
    .cert-date-col     { display: flex; align-items: flex-end; justify-content: center; }
    .cert-lugar        { font-size: 0.82rem; color: #475569; }

    /* ══════════════════════════════════════════
       IMPRESIÓN — controla los márgenes reales
       ══════════════════════════════════════════ */
    @media print {
      /* Tamaño y márgenes de la hoja */
      @page {
        size: A4 landscape;
        margin: 8mm 6mm;       /* ← cambiá este valor para ajustar márgenes laterales */
      }

      /* Ocultar todo excepto el contenido */
      body > *                { display: none !important; }
      .cdk-overlay-container  { display: block !important; }
      .no-print               { display: none !important; }

      /* Quitar scroll y fondos */
      .cert-wrapper {
        padding: 0 !important;
        background: white !important;
        max-height: none !important;
        overflow: visible !important;
      }

      /* La hoja ocupa todo el ancho disponible */
      .cert-document {
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 0 !important;    /* el margen lo maneja @page */
        max-width: 100% !important;
        width: 100% !important;
      }

      /* Tipografía reducida para entrar mejor */
      .cert-table    { font-size: 7pt !important; }
      .cert-title    { font-size: 11pt !important; }
      .cert-intro    { font-size: 8.5pt !important; }
      .cert-total    { font-size: 8.5pt !important; }
      .cert-footer   { font-size: 8pt !important; margin-top: 32px !important; }
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