import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    @if (loadingService.loading$ | async) {
      <div class="spinner-overlay">
        <mat-spinner diameter="48" color="accent"></mat-spinner>
      </div>
    }
  `,
  styles: [`
    .spinner-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15, 23, 42, 0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; backdrop-filter: blur(2px);
    }
  `]
})
export class LoadingSpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}
