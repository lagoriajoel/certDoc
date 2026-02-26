import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material/material.module';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EspacioCurricularService } from '../../../core/services/espacio-curricular.service';
import { EspacioCurricular } from '../../../core/models/models';

@Component({
  selector: 'app-espacios-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div class="page-header__left">
          <h1 class="page-title">
            <mat-icon>menu_book</mat-icon>
            Espacios Curriculares
          </h1>
          <span class="page-subtitle">Gestión de materias y espacios curriculares</span>
        </div>
        <button mat-flat-button color="primary" routerLink="nuevo" class="btn-new">
          <mat-icon>add</mat-icon>
          Nuevo Espacio
        </button>
      </div>

      <!-- Stats card -->
      <div class="stats-row">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-inner">
              <div class="stat-icon-wrap stat-icon--blue">
                <mat-icon>menu_book</mat-icon>
              </div>
              <div>
                <div class="stat-value">{{ dataSource.data.length }}</div>
                <div class="stat-label">Total registrados</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-inner">
              <div class="stat-icon-wrap stat-icon--green">
                <mat-icon>filter_list</mat-icon>
              </div>
              <div>
                <div class="stat-value">{{ dataSource.filteredData.length }}</div>
                <div class="stat-label">Resultados filtrados</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Tabla -->
      <mat-card class="table-card">
        <mat-card-content>

          <!-- Buscador -->
          <div class="search-bar">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar espacio curricular</mat-label>
              <input matInput [(ngModel)]="searchTerm"
                (ngModelChange)="applyFilter()"
                placeholder="Ej: Física, Matemática...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            @if (searchTerm) {
              <button mat-icon-button (click)="clearSearch()" matTooltip="Limpiar búsqueda">
                <mat-icon>close</mat-icon>
              </button>
            }
          </div>

          <!-- Tabla Material -->
          <div class="table-wrapper">
            <table mat-table [dataSource]="dataSource" matSort class="espacios-table">

              <!-- ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>#</th>
                <td mat-cell *matCellDef="let e">
                  <span class="id-badge">{{ e.id }}</span>
                </td>
              </ng-container>

              <!-- Nombre -->
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                <td mat-cell *matCellDef="let e">
                  <div class="nombre-cell">
                    <div class="nombre-avatar">{{ e.nombre.charAt(0).toUpperCase() }}</div>
                    <strong>{{ e.nombre }}</strong>
                  </div>
                </td>
              </ng-container>

              <!-- Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let e">
                  <div class="action-buttons">
                    <button mat-icon-button
                      [routerLink]="[e.id, 'editar']"
                      matTooltip="Editar espacio curricular"
                      color="primary">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn"
                      (click)="confirmarEliminar(e)"
                      matTooltip="Eliminar espacio curricular">
                      <mat-icon>delete_outline</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>

              <!-- Sin resultados -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data" [attr.colspan]="columns.length">
                  @if (searchTerm) {
                    <mat-icon>search_off</mat-icon>
                    <span>No se encontraron resultados para "<strong>{{ searchTerm }}</strong>"</span>
                  } @else {
                    <mat-icon>library_books</mat-icon>
                    <span>No hay espacios curriculares registrados todavía</span>
                    <br>
                    <button mat-stroked-button color="primary" routerLink="nuevo" style="margin-top: 12px">
                      <mat-icon>add</mat-icon> Crear el primero
                    </button>
                  }
                </td>
              </tr>
            </table>
          </div>

          <mat-paginator
            [pageSizeOptions]="[10, 25, 50]"
            showFirstLastButtons>
          </mat-paginator>

        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1000px; margin: 0 auto; }

    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .page-header__left { display: flex; flex-direction: column; }
    .page-title { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.8rem; font-weight: 700; color: #1e293b; }
    .page-title mat-icon { font-size: 2rem; width: 2rem; height: 2rem; color: #8b5cf6; }
    .page-subtitle { color: #64748b; margin-top: 4px; font-size: 0.9rem; }
    .btn-new { height: 44px; font-weight: 600; }

    /* Stats */
    .stats-row { display: flex; gap: 16px; margin-bottom: 20px; }
    .stat-card { flex: 0 0 auto; border-radius: 12px !important; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important; }
    .stat-inner { display: flex; align-items: center; gap: 16px; }
    .stat-icon-wrap { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .stat-icon-wrap mat-icon { color: white; }
    .stat-icon--blue { background: linear-gradient(135deg, #3b82f6, #6366f1); }
    .stat-icon--green { background: linear-gradient(135deg, #10b981, #059669); }
    .stat-value { font-size: 1.6rem; font-weight: 800; color: #1e293b; line-height: 1; }
    .stat-label { font-size: 0.78rem; color: #64748b; margin-top: 2px; }

    /* Tabla */
    .table-card { border-radius: 12px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; border: 1px solid #e2e8f0; }
    .search-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
    .search-field { flex: 1; max-width: 400px; }
    .table-wrapper { overflow-x: auto; }
    .espacios-table { width: 100%; }

    .id-badge { background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; font-family: monospace; }

    .nombre-cell { display: flex; align-items: center; gap: 12px; }
    .nombre-avatar {
      width: 36px; height: 36px; border-radius: 8px;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.95rem; flex-shrink: 0;
    }

    .action-buttons { display: flex; gap: 4px; }
    .table-row:hover { background: #f8fafc; }

    .no-data { text-align: center; padding: 56px !important; color: #94a3b8; }
    .no-data mat-icon { font-size: 52px; width: 52px; height: 52px; display: block; margin: 0 auto 12px; }

    th.mat-header-cell { font-weight: 700; color: #475569; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; }
  `]
})
export class EspaciosListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columns = ['id', 'nombre', 'acciones'];
  dataSource = new MatTableDataSource<EspacioCurricular>([]);
  searchTerm = '';

  constructor(
    private espacioService: EspacioCurricularService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: EspacioCurricular, filter: string) =>
      data.nombre.toLowerCase().includes(filter);
  }

  load(): void {
    this.espacioService.getAll().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  confirmarEliminar(espacio: EspacioCurricular): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Espacio Curricular',
        message: `¿Estás seguro de eliminar "${espacio.nombre}"? Si tiene movimientos de horas asociados, la operación fallará.`,
        confirmText: 'Eliminar'
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.espacioService.delete(espacio.id).subscribe({
          next: () => {
            this.snackBar.open(`"${espacio.nombre}" eliminado correctamente`, 'Cerrar', { duration: 3500 });
            this.load();
          },
          error: () => {
            this.snackBar.open('No se pudo eliminar. Puede tener movimientos asociados.', 'Cerrar', {
              duration: 5000,
              panelClass: 'snack-error'
            });
          }
        });
      }
    });
  }
}
