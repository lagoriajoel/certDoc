import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EspacioCurricular } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EspacioCurricularService {
  private readonly url = `${environment.apiUrl}/espacios-curriculares`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EspacioCurricular[]> {
    return this.http.get<EspacioCurricular[]>(this.url);
  }

  getById(id: number): Observable<EspacioCurricular> {
    return this.http.get<EspacioCurricular>(`${this.url}/${id}`);
  }

  create(espacio: Omit<EspacioCurricular, 'id'>): Observable<EspacioCurricular> {
    return this.http.post<EspacioCurricular>(this.url, espacio);
  }

  update(id: number, espacio: EspacioCurricular): Observable<EspacioCurricular> {
    return this.http.put<EspacioCurricular>(`${this.url}/${id}`, espacio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
