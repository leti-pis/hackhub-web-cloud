import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth-service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

//Intercetta le richieste HTTP e può aggiungere cose (come l'header di autorizzazione con il token JWT se presente nel localStorage)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService);
  const token = authService.token();

  const router = inject(Router);

  const apiInterna = req.url.startsWith('/api/');
  const endpointPubblico = req.url.includes('/api/autenticazione/accesso') || req.url.includes('/api/autenticazione/registrazione');
  
  if (token && apiInterna && !endpointPubblico) {
    const richiestaAutenticata = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(richiestaAutenticata).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
  return next(req);
};
