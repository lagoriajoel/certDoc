import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cargo } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CargoService {
  private url = `${environment.apiUrl}/cargos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.url);
  }

  getById(id: number): Observable<Cargo> {
    return this.http.get<Cargo>(`${this.url}/${id}`);
  }

  create(cargo: Cargo): Observable<Cargo> {
    return this.http.post<Cargo>(this.url, cargo);
  }

  update(id: number, cargo: Cargo): Observable<Cargo> {
    return this.http.put<Cargo>(`${this.url}/${id}`, cargo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}