import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../../models/login-request.model';
import { AuthResponse } from '../../models/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

private apiUrl = '/api/autenticazione';

constructor(private http: HttpClient) {
}

login(request: LoginRequest) {
  return this.http.post<AuthResponse>(`${this.apiUrl}/accesso`, request);
}

}
