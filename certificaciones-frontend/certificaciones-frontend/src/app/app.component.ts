import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from './shared/material/material.module';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, MaterialModule, LoadingSpinnerComponent],
  template: `
    <div class="app-shell">
      <!-- Sidebar -->
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav mode="side" opened class="sidenav">
          <div class="sidenav-header">
            <div class="brand">
              <span class="brand-icon">🎓</span>
              <div class="brand-text">
                <span class="brand-title">CertDoc</span>
                <span class="brand-subtitle">Sistema de Certificaciones</span>
              </div>
            </div>
          </div>
          <mat-divider></mat-divider>
          <mat-nav-list class="nav-list">
            <a mat-list-item routerLink="/docentes" routerLinkActive="active-link">
              <mat-icon matListItemIcon>school</mat-icon>
              <span matListItemTitle>Docentes</span>
            </a>
              <a mat-list-item routerLink="/espacios-curriculares" routerLinkActive="active-link">
              <mat-icon matListItemIcon>menu_book</mat-icon>
              <span matListItemTitle>Espacios Curriculares</span>
            </a>
          </mat-nav-list>
          
          <div class="sidenav-footer">
            <span>v1.0.0</span>
          </div>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <!-- Toolbar -->
          <mat-toolbar class="app-toolbar">
            <span class="toolbar-title">Sistema de Certificaciones Docentes</span>
            <span class="spacer"></span>
            <mat-icon class="toolbar-icon">verified</mat-icon>
          </mat-toolbar>

          <!-- Contenido -->
          <div class="content-area">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>

      <!-- Loading global -->
      <app-loading-spinner></app-loading-spinner>
    </div>
  `,
  styles: [`
    .app-shell { height: 100vh; display: flex; flex-direction: column; }
    .sidenav-container { flex: 1; }
    .sidenav { width: 240px; background: #0f172a; display: flex; flex-direction: column; }
    .sidenav-header { padding: 20px 16px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand-icon { font-size: 2rem; }
    .brand-text { display: flex; flex-direction: column; }
    .brand-title { font-size: 1.2rem; font-weight: 800; color: #f1f5f9; letter-spacing: 0.02em; }
    .brand-subtitle { font-size: 0.7rem; color: #64748b; }
    .nav-list { padding-top: 8px; flex: 1; }
    .nav-list a { color: #94a3b8; border-radius: 8px; margin: 2px 8px; }
    .nav-list a mat-icon { color: #64748b; }
    .nav-list a.active-link { background: rgba(59, 130, 246, 0.15) !important; color: #60a5fa !important; }
    .nav-list a.active-link mat-icon { color: #60a5fa !important; }
    .sidenav-footer { padding: 12px 16px; font-size: 0.75rem; color: #334155; border-top: 1px solid #1e293b; }
    .app-toolbar { background: #fff; border-bottom: 1px solid #e2e8f0; color: #1e293b; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
    .toolbar-title { font-weight: 600; font-size: 0.95rem; color: #475569; }
    .toolbar-icon { color: #3b82f6; }
    .spacer { flex: 1; }
    .main-content { background: #f8fafc; }
    .content-area { min-height: calc(100vh - 64px); }
    mat-divider { border-color: #1e293b !important; }
  `]
})
export class AppComponent {}
