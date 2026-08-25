import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth-service';
import { RegisterRequest } from '../../models/register-request.model';
import { RouterLink, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  constructor(private authService: AuthService, private router: Router) { }

  nomeUtente = '';
  email = '';
  password = '';
  erroreRegistrazione = signal('');
  successoRegistrazione = signal('');
  registrazioneInCorso = signal(false);

  registrati() : void {
    this.preparazioneRegistrazione();
    const registerRequest: RegisterRequest = {
      nomeUtente: this.nomeUtente,
      email: this.email,
      password: this.password
    };
    this.authService.register(registerRequest).pipe(
      finalize(() => {
        this.registrazioneInCorso.set(false);
      })
    ).subscribe(
      {
        next: () => {
          this.successoRegistrazione.set('Registrazione avvenuta con successo!');
        },
        error: (errore) => {
          this.gestisciErrore(errore);
        }
      });
  }

  private gestisciErrore(errore: HttpErrorResponse): void {
    if (errore.status === 400) {
      if (errore.error?.message) {
        this.erroreRegistrazione.set(errore.error.message);
        return;
      }
      this.erroreRegistrazione.set('Nome utente o password non validi');
      return;
    }
    if (errore.status === 409) {
      if (errore.error?.message) {
        this.erroreRegistrazione.set(errore.error.message);
        return;
      }
      this.erroreRegistrazione.set('Nome utente o email già in uso. Scegli un altro nome utente o utilizza un\'altra email');
      return;
    }
    if (errore.status === 0) {
      this.erroreRegistrazione.set('Impossibile raggiungere il server. Controlla la connessione e riprova');
      return;
    }
    if (errore.status >= 500) {
      this.erroreRegistrazione.set('Errore del server. Riprova più tardi');
      return;
    }
    this.erroreRegistrazione.set('Si è verificato un errore durante la registrazione');
  }

  private preparazioneRegistrazione(): void {
    this.erroreRegistrazione.set('');
    this.successoRegistrazione.set('');
    this.registrazioneInCorso.set(true);
  }

}
