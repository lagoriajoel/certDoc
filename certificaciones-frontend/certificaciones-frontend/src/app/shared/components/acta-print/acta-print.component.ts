import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Acta } from '../../../core/models/models';

@Component({
  selector: 'app-acta-print',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <!-- Acciones (no se imprimen) -->
    <div class="no-print dialog-actions">
      <h2 class="dialog-title">Vista previa — {{ getTipoLabel() }}</h2>
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
    <div class="acta-wrapper">
      <div class="acta-document">

        <!-- Encabezado -->
        <div class="acta-header">
          <img src="assets/logo1.jpg" alt="Logo" class="acta-logo">
          <div class="acta-header-text">
            <p class="acta-provincia">PROVINCIA DE SANTA CRUZ</p>
            <p class="acta-consejo">Consejo Provincial de Educación</p>
          </div>
          <div class="acta-header-right">
            <p class="acta-tipo-label">ACTO ADMINISTRATIVO</p>
            <p class="acta-tipo-valor">{{ getTipoLabel() | uppercase }}</p>
            <p class="acta-lugar-fecha">Caleta Olivia, {{ formatearFecha(acta.fechaActa) }}</p>
          </div>
        </div>

        <hr class="acta-divider">

        <!-- Visto -->
        <div class="acta-section">
          <span class="acta-section-label">VISTO:</span>
          <p class="acta-section-text">{{ acta.visto }}</p>
        </div>

        <!-- Considerando -->
        <div class="acta-section">
          <span class="acta-section-label">CONSIDERANDO:</span>
          <p class="acta-section-text" style="white-space: pre-line">{{ acta.considerando }}</p>
        </div>

        <!-- Por ello -->
        <div class="acta-por-ello">
          <p><strong>POR ELLO:</strong></p>
          <p><strong>LA RECTORÍA DEL COLEGIO PROVINCIAL DE EDUCACIÓN SECUNDARIA Nº 22</strong></p>
          <p><em>Ad Referéndum del Consejo Provincial de Educación</em></p>
          <p><strong>D I S P O N E:</strong></p>
        </div>

        <!-- Artículos -->
        <div class="acta-section">
          <p class="acta-section-text" style="white-space: pre-line">{{ acta.articulos }}</p>
        </div>

        <hr class="acta-divider">

        <!-- Número disposición -->
        <p class="acta-numero">DISPOSICIÓN INTERNA Nº {{ acta.numeroDisposicion }}</p>

        <!-- Pie firmas -->
        <div class="acta-footer">
          <div class="acta-footer-col">
            <div class="acta-sign-line"></div>
            <p>Firma y Aclaración del/la Docente</p>
          </div>
          <div class="acta-footer-col">
            <div class="acta-sign-line"></div>
            <p>Rector/a</p>
            <p class="acta-colegio">C.P.E.S. Nº 22 — Caleta Olivia</p>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* ── Dialog ── */
    .cdk-overlay-pane .mat-mdc-dialog-container,
    .cdk-overlay-pane .mdc-dialog__surface {
      padding: 0 !important;
      overflow: hidden !important;
    }

    .no-print { padding: 16px 24px; border-bottom: 1px solid #e2e8f0; background: white; }
    .dialog-title { margin: 0; font-size: 1.1rem; font-weight: 700; }
    .dialog-actions { display: flex; justify-content: space-between; align-items: center; }
    .dialog-btns { display: flex; gap: 8px; }

    /* ── Wrapper ── */
    .acta-wrapper { padding: 16px; background: #f1f5f9; max-height: 78vh; overflow-y: auto; }

    /* ── Documento ── */
    .acta-document {
      background: white;
      padding: 16mm 14mm;
      max-width: 720px;
      margin: 0 auto;
      box-shadow: 0 2px 12px rgba(0,0,0,0.15);
      border-radius: 4px;
      font-family: 'Times New Roman', Times, serif;
    }

    /* ── Encabezado ── */
    .acta-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 12px; }
    .acta-logo { width: 70px; }
    .acta-header-text { flex: 1; }
    .acta-provincia { margin: 0; font-size: 0.85rem; font-weight: 700; }
    .acta-consejo { margin: 2px 0 0; font-size: 0.8rem; }
    .acta-header-right { text-align: right; }
    .acta-tipo-label { margin: 0; font-size: 0.8rem; font-weight: 700; }
    .acta-tipo-valor { margin: 2px 0 0; font-size: 0.8rem; font-weight: 700; }
    .acta-lugar-fecha { margin: 4px 0 0; font-size: 0.8rem; }
    .acta-divider { border: none; border-top: 1px solid #1e293b; margin: 12px 0; }

    /* ── Secciones ── */
    .acta-section { margin-bottom: 14px; }
    .acta-section-label { font-weight: 700; font-size: 0.9rem; display: block; margin-bottom: 4px; }
    .acta-section-text { margin: 0; font-size: 0.88rem; line-height: 1.6; text-align: justify; }

    /* ── Por ello ── */
    .acta-por-ello { text-align: center; margin: 16px 0; font-size: 0.88rem; line-height: 1.8; }
    .acta-por-ello p { margin: 2px 0; }

    /* ── Número disposición ── */
    .acta-numero { font-size: 0.8rem; font-weight: 700; text-align: center; margin: 12px 0; }

    /* ── Pie ── */
    .acta-footer { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 64px; text-align: center; font-size: 0.82rem; }
    .acta-sign-line { border-bottom: 1px solid #334155; margin-bottom: 8px; }
    .acta-colegio { font-size: 0.75rem; color: #475569; margin: 2px 0 0; }

    /* ══════════════════
       IMPRESIÓN
       ══════════════════ */
    @media print {
      @page {
        size: A4 portrait;
        margin: 15mm 12mm;
      }

      .no-print { display: none !important; }

      .acta-wrapper {
        padding: 0 !important;
        background: white !important;
        max-height: none !important;
        overflow: visible !important;
      }

      .acta-document {
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
      }

      .acta-section-text { font-size: 10pt !important; }
      .acta-por-ello { font-size: 10pt !important; }
      .acta-provincia { font-size: 10pt !important; }
    }
  `]
})
export class ActaPrintComponent {
  today = new Date();

  constructor(
    public dialogRef: MatDialogRef<ActaPrintComponent>,
    @Inject(MAT_DIALOG_DATA) public acta: Acta
  ) {}

  getTipoLabel(): string {
    const labels: Record<string, string> = {
      'ALTA_HORAS': 'Alta de Horas',
      'BAJA_HORAS': 'Baja de Horas',
      'CAMBIO_SITUACION_REVISTA': 'Cambio de Situación de Revista'
    };
    return labels[this.acta.tipoActa] || this.acta.tipoActa;
  }

  print(): void { window.print(); }
  close(): void { this.dialogRef.close(); }

  formatearFecha(fecha: string): string {
  if (!fecha) return '';
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const d = new Date(fecha + 'T00:00:00');
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}
}
