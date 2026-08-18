import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth-service';
import { RegisterRequest } from '../../models/register-request.model';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  constructor(private authService: AuthService, private router: Router) {}

nomeUtente = '';
email = '';
password = '';
erroreRegistrazione = signal('');
successoRegistrazione = signal('');

registrati() {
  this.erroreRegistrazione.set(''); // Reset dell'errore prima di effettuare la richiesta
  this.successoRegistrazione.set(''); // Reset del successo prima di effettuare la richiesta
  const registerRequest: RegisterRequest = {
    nomeUtente: this.nomeUtente,
    email: this.email,
    password: this.password
  };
  this.authService.register(registerRequest).subscribe(
    {
      next: (response) => {
        console.log('Registrazione riuscita:', response);
        this.successoRegistrazione.set('Registrazione avvenuta con successo!');
      },
      error: (errore) => {
        this.erroreRegistrazione.set('Errore durante la registrazione. Riprova.');
      }
    });
}

}
