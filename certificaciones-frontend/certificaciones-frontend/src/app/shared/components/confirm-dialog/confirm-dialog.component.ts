import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogData } from '../../../core/models/models';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="confirm-dialog__header">
        <mat-icon class="confirm-dialog__icon">warning_amber</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-stroked-button [mat-dialog-close]="false">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button mat-flat-button color="warn" [mat-dialog-close]="true">
          <mat-icon>delete</mat-icon>
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog { padding: 8px; min-width: 360px; }
    .confirm-dialog__header { display: flex; align-items: center; gap: 12px; }
    .confirm-dialog__icon { color: #f59e0b; font-size: 32px; width: 32px; height: 32px; }
    h2 { margin: 0; font-size: 1.2rem; }
    p { color: #64748b; margin-top: 8px; }
    mat-dialog-actions { gap: 8px; padding-top: 16px; }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
