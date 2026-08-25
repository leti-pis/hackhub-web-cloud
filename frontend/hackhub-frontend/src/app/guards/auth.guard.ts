import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';

// authGuard è una funzione che implementa l'interfaccia CanActivateFn di Angular. 
// Viene utilizzata per proteggere le rotte dell'applicazione, consentendo l'accesso 
// solo agli utenti autenticati.
//CanActivateFn è un tipo di funzione che viene utilizzato per determinare se una rotta può essere 
// attivata o meno. Si esecute prima che la rotta venga attivata e restituisce un valore booleano 
// o un UrlTree.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(['/login']);
}