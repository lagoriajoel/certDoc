import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Docente } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DocenteService {
  private readonly url = `${environment.apiUrl}/docentes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Docente[]> {
    return this.http.get<Docente[]>(this.url);
  }

  getById(id: number): Observable<Docente> {
    return this.http.get<Docente>(`${this.url}/${id}`);
  }

  create(docente: Docente): Observable<Docente> {
    return this.http.post<Docente>(this.url, docente);
  }

  update(id: number, docente: Docente): Observable<Docente> {
    return this.http.put<Docente>(`${this.url}/${id}`, docente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
