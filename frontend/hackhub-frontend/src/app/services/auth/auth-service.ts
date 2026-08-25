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

// computed permette di verificare se l'utente è loggato in base alla presenza del token
// è una proprietà derivata che si aggiorna automaticamente quando il valore del token cambia
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

// Salva i dati della sessione nel localStorage e negli stati signal
salvaSessione(response: AuthResponse): void {
  localStorage.setItem('token', response.token);
  localStorage.setItem('nomeUtente', response.nomeUtente);
  localStorage.setItem('tipo', response.tipo);

  this.token.set(response.token);
  this.nomeUtente.set(response.nomeUtente);
  this.tipo.set(response.tipo);
}


}
