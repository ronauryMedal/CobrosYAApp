import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

// Variable para evitar múltiples redirecciones simultáneas
let isRedirecting = false;

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('AuthInterceptor: Error 401 detectado, haciendo logout automático');
        
        // Evitar múltiples redirecciones simultáneas
        if (!isRedirecting) {
          isRedirecting = true;
          
          // Usar el AuthService para hacer logout limpio
          authService.logout();
          
          // Resetear la bandera después de un breve delay
          setTimeout(() => {
            isRedirecting = false;
          }, 1000);
        }
      } else if (error.status === 403) {
        console.log('AuthInterceptor: Error 403 detectado, acceso denegado');
        // Para errores 403, también podríamos hacer logout dependiendo del caso
        if (req.url.includes('/login') || req.url.includes('/logout')) {
          // No hacer logout para endpoints de autenticación
        } else if (!isRedirecting) {
          isRedirecting = true;
          authService.logout();
          
          setTimeout(() => {
            isRedirecting = false;
          }, 1000);
        }
      }
      return throwError(() => error);
    })
  );
};
