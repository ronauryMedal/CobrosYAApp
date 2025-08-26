import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService, LoginRequest, User, LimitesAdelanto } from './api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private limitesAdelantoSubject = new BehaviorSubject<LimitesAdelanto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public limitesAdelanto$ = this.limitesAdelantoSubject.asObservable();

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    // Verificar si hay token y datos de usuario
    if (this.apiService.isAuthenticated()) {
      const userData = localStorage.getItem('userData');
      const limitesData = localStorage.getItem('limitesAdelanto');
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.currentUserSubject.next(user);
          
          // Cargar límites de adelanto si existen
          if (limitesData) {
            try {
              const limites = JSON.parse(limitesData);
              this.limitesAdelantoSubject.next(limites);
            } catch (error) {
              console.error('Error parsing limites data:', error);
            }
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.clearAuthData();
        }
      } else {
        // Si hay token pero no datos de usuario, intentar obtener el perfil
        this.apiService.getProfile().subscribe({
          next: (response) => {
            if (response.success) {
              this.currentUserSubject.next(response.data);
              localStorage.setItem('userData', JSON.stringify(response.data));
            } else {
              this.logout();
            }
          },
          error: () => {
            this.logout();
          }
        });
      }
    }
  }

  isLoggedIn(): boolean {
    return this.apiService.isAuthenticated() && this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getLimitesAdelanto(): LimitesAdelanto | null {
    return this.limitesAdelantoSubject.value;
  }

  login(credentials: LoginRequest): Observable<any> {
    return new Observable(observer => {
      console.log('AuthService: Iniciando login...');
      this.apiService.login(credentials).subscribe({
        next: (response) => {
          console.log('AuthService: Respuesta del login:', response);
          if (response.success) {
            // Guardar token
            this.apiService.setToken(response.data.token);
            
            // Guardar datos del usuario en localStorage
            const userData = response.data.user;
            const limitesData = response.data.limites_adelanto;
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('limitesAdelanto', JSON.stringify(limitesData));
            
            // Actualizar el estado del usuario y límites
            this.currentUserSubject.next(userData);
            this.limitesAdelantoSubject.next(limitesData);
            
            console.log('AuthService: Login exitoso, token y usuario guardados');
            observer.next(response);
            observer.complete();
          } else {
            console.error('AuthService: Error en respuesta:', response.message);
            observer.error(new Error(response.message || 'Error en el login'));
          }
        },
        error: (error) => {
          console.error('AuthService: Error en login:', error);
          observer.error(error);
        }
      });
    });
  }

  logout() {
    console.log('AuthService: Iniciando logout...');
    // Llamar al endpoint de logout
    this.apiService.logout().subscribe({
      next: () => {
        console.log('Logout exitoso en API');
      },
      error: (error) => {
        console.error('Error en logout API:', error);
      },
      complete: () => {
        this.clearAuthData();
      }
    });
  }

  private clearAuthData() {
    console.log('AuthService: Limpiando datos de autenticación...');
    // Limpiar token y datos del usuario
    this.apiService.clearToken();
    this.currentUserSubject.next(null);
    this.limitesAdelantoSubject.next(null);
    
    // Limpiar localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('limitesAdelanto');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('recordarLogin');
    localStorage.removeItem('cedulaGuardada');
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  // Verificar si el usuario puede acceder a una ruta
  canActivate(): boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  // Método para actualizar datos del usuario
  updateUserData(userData: User) {
    this.currentUserSubject.next(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  }
}
