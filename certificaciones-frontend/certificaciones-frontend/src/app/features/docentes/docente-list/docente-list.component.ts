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
import { DocenteService } from '../../../core/services/docente.service';
import { Docente } from '../../../core/models/models';

@Component({
  selector: 'app-docente-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="page-header__left">
          <h1 class="page-title">
            <mat-icon>school</mat-icon>
            Docentes
          </h1>
          <span class="page-subtitle">Gestión de personal docente</span>
        </div>
        <button mat-flat-button color="primary" routerLink="nuevo" class="btn-new">
          <mat-icon>add</mat-icon>
          Nuevo Docente
        </button>
      </div>

      <mat-card class="table-card">
        <mat-card-content>
          <!-- Buscador -->
          <div class="search-bar">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar por nombre o DNI</mat-label>
              <input matInput [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()" placeholder="Ej: García, 25678901">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            @if (searchTerm) {
              <button mat-icon-button (click)="clearSearch()" matTooltip="Limpiar búsqueda">
                <mat-icon>close</mat-icon>
              </button>
            }
          </div>

          <!-- Tabla -->
          <div class="table-wrapper">
            <table mat-table [dataSource]="dataSource" matSort class="docentes-table">

              <ng-container matColumnDef="dni">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>DNI</th>
                <td mat-cell *matCellDef="let d">
                  <span class="dni-badge">{{ d.dni }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="apellido">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Apellido</th>
                <td mat-cell *matCellDef="let d">
                  <strong>{{ d.apellido }}</strong>
                </td>
              </ng-container>

              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                <td mat-cell *matCellDef="let d">{{ d.nombre }}</td>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let d">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary"
                      [routerLink]="[d.id]" matTooltip="Ver detalle">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button
                      [routerLink]="[d.id, 'editar']" matTooltip="Editar">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn"
                      (click)="confirmarEliminar(d)" matTooltip="Eliminar">
                      <mat-icon>delete_outline</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>

              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data" [attr.colspan]="columns.length">
                  <mat-icon>search_off</mat-icon>
                  <span>No se encontraron docentes</span>
                </td>
              </tr>
            </table>
          </div>

          <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .page-header__left { display: flex; flex-direction: column; }
    .page-title { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.8rem; font-weight: 700; color: #1e293b; }
    .page-title mat-icon { font-size: 2rem; width: 2rem; height: 2rem; color: #3b82f6; }
    .page-subtitle { color: #64748b; margin-top: 4px; font-size: 0.9rem; }
    .btn-new { height: 44px; font-weight: 600; }
    .table-card { border-radius: 12px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; border: 1px solid #e2e8f0; }
    .search-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
    .search-field { flex: 1; max-width: 400px; }
    .table-wrapper { overflow-x: auto; }
    .docentes-table { width: 100%; }
    .dni-badge { background: #eff6ff; color: #2563eb; padding: 3px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; font-family: monospace; }
    .action-buttons { display: flex; gap: 4px; }
    .table-row:hover { background: #f8fafc; }
    .no-data { text-align: center; padding: 48px !important; color: #94a3b8; }
    .no-data mat-icon { font-size: 48px; width: 48px; height: 48px; display: block; margin: 0 auto 8px; }
    th.mat-header-cell { font-weight: 700; color: #475569; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
  `]
})
export class DocenteListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columns = ['dni', 'apellido', 'nombre', 'acciones'];
  dataSource = new MatTableDataSource<Docente>([]);
  searchTerm = '';

  constructor(
    private docenteService: DocenteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void { this.load(); }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Docente, filter: string) => {
      const term = filter.toLowerCase();
      return data.dni.toLowerCase().includes(term) ||
             data.nombre.toLowerCase().includes(term) ||
             data.apellido.toLowerCase().includes(term);
    };
  }

  load(): void {
    this.docenteService.getAll().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  confirmarEliminar(docente: Docente): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Docente',
        message: `¿Estás seguro de eliminar a ${docente.apellido}, ${docente.nombre}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar'
      }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.docenteService.delete(docente.id!).subscribe(() => {
          this.snackBar.open('Docente eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.load();
        });
      }
    });
  }
}
