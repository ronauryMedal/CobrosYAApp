import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('AuthInterceptor: Error 401 detectado, haciendo logout automático');
        
        // Usar el AuthService para hacer logout limpio
        authService.logout();
      } else if (error.status === 403) {
        console.log('AuthInterceptor: Error 403 detectado, acceso denegado');
        // Para errores 403, también podríamos hacer logout dependiendo del caso
        if (req.url.includes('/login') || req.url.includes('/logout')) {
          // No hacer logout para endpoints de autenticación
        } else {
          authService.logout();
        }
      }
      return throwError(() => error);
    })
  );
};
