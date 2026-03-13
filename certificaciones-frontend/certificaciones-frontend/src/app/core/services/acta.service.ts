import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Acta } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ActaService {
  private url = `${environment.apiUrl}/actas`;

  constructor(private http: HttpClient) {}

  // Todas las actas de un movimiento
  getByMovimiento(movimientoId: number): Observable<Acta[]> {
    return this.http.get<Acta[]>(`${this.url}/movimiento/${movimientoId}`);
  }

  // Acta específica por tipo
  getByMovimientoYTipo(movimientoId: number, tipoActa: string): Observable<Acta> {
    return this.http.get<Acta>(`${this.url}/movimiento/${movimientoId}/tipo/${tipoActa}`);
  }

  existeActa(movimientoId: number): Observable<{ existe: boolean }> {
    return this.http.get<{ existe: boolean }>(`${this.url}/movimiento/${movimientoId}/existe`);
  }

  existeActaPorTipo(movimientoId: number, tipoActa: string): Observable<{ existe: boolean }> {
    return this.http.get<{ existe: boolean }>(`${this.url}/movimiento/${movimientoId}/existe/${tipoActa}`);
  }

  create(acta: Acta): Observable<Acta> {
    return this.http.post<Acta>(this.url, acta);
  }

  update(id: number, acta: Acta): Observable<Acta> {
    return this.http.put<Acta>(`${this.url}/${id}`, acta);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}