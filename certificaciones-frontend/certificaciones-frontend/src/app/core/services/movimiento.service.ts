import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovimientoHoras, EspacioCurricular, SituacionRevistaEntity, CertificacionResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private readonly url = `${environment.apiUrl}/movimientos-horas`;
  private readonly espaciosUrl = `${environment.apiUrl}/espacios-curriculares`;
  private readonly situacionesUrl = `${environment.apiUrl}/situaciones-revista`;
  private readonly certUrl = `${environment.apiUrl}/certificaciones`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MovimientoHoras[]> {
    return this.http.get<MovimientoHoras[]>(this.url);
  }

  getById(id: number): Observable<MovimientoHoras> {
    return this.http.get<MovimientoHoras>(`${this.url}/${id}`);
  }

  getByDocente(docenteId: number): Observable<MovimientoHoras[]> {
    return this.http.get<MovimientoHoras[]>(`${this.url}/docente/${docenteId}`);
  }

  create(movimiento: MovimientoHoras): Observable<MovimientoHoras> {
    return this.http.post<MovimientoHoras>(this.url, movimiento);
  }

  update(id: number, movimiento: MovimientoHoras): Observable<MovimientoHoras> {
    return this.http.put<MovimientoHoras>(`${this.url}/${id}`, movimiento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getEspaciosCurriculares(): Observable<EspacioCurricular[]> {
    return this.http.get<EspacioCurricular[]>(this.espaciosUrl);
  }

  getSituacionesRevista(): Observable<SituacionRevistaEntity[]> {
    return this.http.get<SituacionRevistaEntity[]>(this.situacionesUrl);
  }

  getCertificacion(docenteId: number): Observable<CertificacionResponse> {
    return this.http.get<CertificacionResponse>(`${this.certUrl}/${docenteId}`);
  }

  getCertificacionPdf(docenteId: number): Observable<Blob> {
    return this.http.get(`${this.certUrl}/${docenteId}/pdf`, { responseType: 'blob' });
  }
}
