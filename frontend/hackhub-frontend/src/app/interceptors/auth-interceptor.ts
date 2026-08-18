import { HttpInterceptorFn } from '@angular/common/http';

//Intercetta le richieste HTTP e può aggiungere cose (come l'header di autorizzazione con il token JWT se presente nel localStorage)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    const richiestaAutenticata = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(richiestaAutenticata);
  }
  return next(req);
};
