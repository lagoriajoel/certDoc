import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, UsuarioLogueado } from '../models/models';

const TOKEN_KEY = 'cert_token';
const USER_KEY  = 'cert_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly url = `${environment.apiUrl}/auth`;

  // Signals reactivos para el estado de sesión
  private _usuario = signal<UsuarioLogueado | null>(this.loadUser());
  private _token    = signal<string | null>(this.loadToken());

  readonly usuario  = this._usuario.asReadonly();
  readonly token    = this._token.asReadonly();
  readonly logueado = computed(() => !!this._token());
  readonly esAdmin  = computed(() => this._usuario()?.rol === 'ADMIN');

  constructor(private http: HttpClient, private router: Router) {}

  // ── Login ──────────────────────────────────────────────────
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, request).pipe(
      tap(res => {
        this.saveSession(res);
      })
    );
  }

  // ── Logout ─────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._usuario.set(null);
    this.router.navigate(['/login']);
  }

  // ── Token para el interceptor ──────────────────────────────
  getToken(): string | null {
    return this._token();
  }

  // ── Internals ───────────────────────────────────────────────
  private saveSession(res: LoginResponse): void {
    const user: UsuarioLogueado = {
      username: res.username,
      nombre: res.nombre,
      rol: res.rol
    };
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._token.set(res.token);
    this._usuario.set(user);
  }

  private loadToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUser(): UsuarioLogueado | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
