import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from './shared/material/material.module';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, MaterialModule, LoadingSpinnerComponent],
  template: `
    <div class="app-shell">
      <mat-sidenav-container class="sidenav-container">

        @if (authService.logueado()) {
          <mat-sidenav mode="side" opened class="sidenav">
            <div class="sidenav-header">
              <div class="brand">
                <span class="brand-icon">🎓</span>
                <div class="brand-text">
                  <span class="brand-title">CertDoc</span>
                  <span class="brand-subtitle">Certificaciones Docentes</span>
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

              <!-- Solo visible para ADMIN -->
              @if (authService.esAdmin()) {
                <mat-divider class="nav-divider"></mat-divider>
                <div class="nav-section-label">Administración</div>
                <a mat-list-item routerLink="/usuarios" routerLinkActive="active-link">
                  <mat-icon matListItemIcon>manage_accounts</mat-icon>
                  <span matListItemTitle>Usuarios</span>
                </a>
              }
            </mat-nav-list>

            <!-- Footer con usuario -->
            <div class="sidenav-footer">
              <div class="user-info">
                <div class="user-avatar">
                  {{ authService.usuario()?.nombre?.charAt(0)?.toUpperCase() }}
                </div>
                <div class="user-details">
                  <span class="user-nombre">{{ authService.usuario()?.nombre }}</span>
                  <span class="user-rol">{{ authService.usuario()?.rol }}</span>
                </div>
              </div>
              <button mat-icon-button (click)="authService.logout()"
                class="btn-logout" matTooltip="Cerrar sesión">
                <mat-icon>logout</mat-icon>
              </button>
            </div>
          </mat-sidenav>
        }

        <mat-sidenav-content class="main-content">
          @if (authService.logueado()) {
            <mat-toolbar class="app-toolbar">
              <span class="toolbar-title">Sistema de Certificaciones Docentes</span>
              <span class="spacer"></span>
              <mat-icon class="toolbar-icon">verified</mat-icon>
            </mat-toolbar>
          }
          <div class="content-area">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>

      </mat-sidenav-container>
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
    .nav-list a.active-link { background: rgba(59,130,246,0.15) !important; color: #60a5fa !important; }
    .nav-list a.active-link mat-icon { color: #60a5fa !important; }

    .nav-divider { border-color: #1e293b !important; margin: 8px 0 !important; }
    .nav-section-label { padding: 8px 24px 4px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #475569; }

    .sidenav-footer { padding: 12px 16px; border-top: 1px solid #1e293b; display: flex; align-items: center; gap: 8px; }
    .user-info { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
    .user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0; }
    .user-details { display: flex; flex-direction: column; min-width: 0; }
    .user-nombre { font-size: 0.8rem; font-weight: 600; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-rol { font-size: 0.68rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    .btn-logout { color: #64748b !important; flex-shrink: 0; }
    .btn-logout:hover { color: #f87171 !important; }

    .app-toolbar { background: #fff; border-bottom: 1px solid #e2e8f0; color: #1e293b; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
    .toolbar-title { font-weight: 600; font-size: 0.95rem; color: #475569; }
    .toolbar-icon { color: #3b82f6; }
    .spacer { flex: 1; }

    .main-content { background: #f8fafc; }
    .content-area { min-height: calc(100vh - 64px); }
    mat-divider { border-color: #1e293b !important; }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
