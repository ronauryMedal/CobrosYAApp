import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Limpiar datos de autenticación
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('recordarLogin');
        localStorage.removeItem('cedulaGuardada');
        
        // Redirigir al login
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
