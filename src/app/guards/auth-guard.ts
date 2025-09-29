import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Verificar si el usuario está realmente autenticado
    const isLoggedIn = this.authService.isLoggedIn();
    const currentUser = this.authService.getCurrentUser();
    
    console.log('AuthGuard: Verificando autenticación...');
    console.log('AuthGuard: isLoggedIn =', isLoggedIn);
    console.log('AuthGuard: currentUser =', currentUser);
    
    if (isLoggedIn && currentUser) {
      console.log('AuthGuard: Usuario autenticado, permitiendo acceso');
      return true;
    } else {
      console.log('AuthGuard: Usuario no autenticado, redirigiendo a login');
      // Limpiar cualquier dato de autenticación inválido
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
