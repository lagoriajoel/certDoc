import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioResponse, CrearUsuarioRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly url = `${environment.apiUrl}/auth/usuarios`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(this.url);
  }

  crear(request: CrearUsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.url, request);
  }

  toggleActivo(id: number): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(`${this.url}/${id}/toggle`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
