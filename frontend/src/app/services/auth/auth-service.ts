import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { LoginRequest } from '../../models/login-request.model';
import { AuthResponse } from '../../models/auth-response.model';
import { RegisterRequest } from '../../models/register-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

private apiUrl = '/api/autenticazione';

constructor(private http: HttpClient) {
}

token = signal<string | null>(localStorage.getItem('token'));
nomeUtente = signal<string | null>(localStorage.getItem('nomeUtente'));
tipo = signal<string | null>(localStorage.getItem('tipo'));

isLoggedIn = computed(() => this.token() !== null);

login(request: LoginRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/accesso`, request);
}

register(request: RegisterRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/registrazione`, request);
}

logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('nomeUtente');
  localStorage.removeItem('tipo');

  this.token.set(null);
  this.nomeUtente.set(null);
  this.tipo.set(null);
}

salvaSessione(response: AuthResponse): void {
  localStorage.setItem('token', response.token);
  localStorage.setItem('nomeUtente', response.nomeUtente);
  localStorage.setItem('tipo', response.tipo);

  this.token.set(response.token);
  this.nomeUtente.set(response.nomeUtente);
  this.tipo.set(response.tipo);
}


}
