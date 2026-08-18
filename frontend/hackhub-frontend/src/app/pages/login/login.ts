import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth-service';
import { RouterLink, Router } from '@angular/router';
import { LoginRequest } from '../../models/login-request.model';

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

  accedi() {
    this.erroreLogin.set(''); // Reset dell'errore prima di effettuare la richiesta
    const loginRequest: LoginRequest = {
      nomeUtente: this.nomeUtente,
      password: this.password
    };
    this.authService.login(loginRequest).subscribe(
      {
        next: (response) => {
          console.log('Accesso riuscito:', response);
          //localStorage = memoria del browser che mantiene il valore anche dopo un refresh della pagina
          localStorage.setItem('token', response.token);
          //reindirizza l'utente alla pagina principale dopo il login
          this.router.navigate(['/']);
        },
        error: (errore) => {
          this.erroreLogin.set('Nome utente o password errati. Riprova.');
        }
      });
  }
}
