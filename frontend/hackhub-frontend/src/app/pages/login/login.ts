import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth-service';
import { RouterLink, Router } from '@angular/router';
import { LoginRequest } from '../../models/login-request.model';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  constructor(private authService: AuthService, private router: Router) {}

  nomeUtente = '';
  password = '';
  //signal notifica angular che il valore è cambiato e aggiorna la view
  erroreLogin = signal('');

  loginInCorso = signal(false);

  accedi() : void {
    this.erroreLogin.set(''); // Reset dell'errore prima di effettuare la richiesta
    this.loginInCorso.set(true); // Imposta lo stato di caricamento a true
    const loginRequest: LoginRequest = {
      nomeUtente: this.nomeUtente,
      password: this.password
    };
    this.authService.login(loginRequest)
    .pipe(
      finalize(() => {
        this.loginInCorso.set(false);
      })
    )
    .subscribe(
      {
        next: (response) => {
          this.authService.salvaSessione(response);
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          this.gestisciErrore(error);
        }
      });
  }

  gestisciErrore(errore: HttpErrorResponse): void {
     if (errore.status === 401) {
    this.erroreLogin.set('Nome utente o password errati. Riprova');
    return;
  }
  if (errore.status === 0) {
    this.erroreLogin.set('Impossibile raggiungere il server. Controlla la connessione e riprova');
    return;
  }
  if (errore.status >= 500) {
    this.erroreLogin.set('Errore del server. Riprova più tardi');
    return;
  }
  if (errore.error?.message) {
    this.erroreLogin.set(errore.error.message);
    return;
  }
  this.erroreLogin.set('Si è verificato un errore durante l\'accesso');
  }
}
