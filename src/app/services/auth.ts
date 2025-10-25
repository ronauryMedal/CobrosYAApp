import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService, LoginRequest, User, LimitesAdelanto } from './api';
import { ConnectivityService } from './connectivity.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private limitesAdelantoSubject = new BehaviorSubject<LimitesAdelanto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public limitesAdelanto$ = this.limitesAdelantoSubject.asObservable();

  // Configuración del timeout de sesión (30 minutos en milisegundos)
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos
  private sessionTimeoutId: any = null;
  private lastActivity: number = Date.now();
  private isLoggingOut: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private connectivityService: ConnectivityService
  ) {
    this.checkAuthStatus();
    this.setupActivityListeners();
  }

  private setupActivityListeners() {
    // Eventos que indican actividad del usuario
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.resetSessionTimeout();
      }, true);
    });

    // También resetear timeout en cambios de ruta
    this.router.events.subscribe(() => {
      this.resetSessionTimeout();
    });
  }

  private resetSessionTimeout() {
    if (this.isLoggedIn()) {
      this.lastActivity = Date.now();
      
      // Limpiar timeout anterior
      if (this.sessionTimeoutId) {
        clearTimeout(this.sessionTimeoutId);
      }
      
      // Configurar nuevo timeout
      this.sessionTimeoutId = setTimeout(() => {
        console.log('AuthService: Sesión expirada por inactividad');
        this.handleSessionExpiry();
      }, this.SESSION_TIMEOUT);
      
      console.log('AuthService: Timeout de sesión reseteado');
    }
  }

  private async handleSessionExpiry() {
    // Importar dinámicamente para evitar dependencias circulares
    const { SessionService } = await import('./session.service');
    const sessionService = new SessionService(this);
    
    try {
      await sessionService.showSessionExpired();
      // No llamar logout aquí porque el modal ya lo maneja
    } catch (error) {
      console.error('Error al mostrar alerta de sesión expirada:', error);
      // Solo hacer logout si hay error al mostrar el modal
      this.logout();
    }
  }

  private clearSessionTimeout() {
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
      this.sessionTimeoutId = null;
    }
  }

  private checkAuthStatus() {
    console.log('AuthService: Verificando estado de autenticación...');
    
    // Verificar si hay token y datos de usuario
    if (this.apiService.isAuthenticated()) {
      const userData = localStorage.getItem('userData');
      const limitesData = localStorage.getItem('limitesAdelanto');
      
      console.log('AuthService: Token encontrado, verificando datos de usuario...');
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log('AuthService: Datos de usuario encontrados:', user);
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

          // Configurar timeout de sesión
          this.resetSessionTimeout();
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.clearAuthData();
        }
      } else {
        console.log('AuthService: No hay datos de usuario, intentando obtener perfil...');
        // Si hay token pero no datos de usuario, intentar obtener el perfil
        // Solo hacer esta llamada si no estamos ya en proceso de logout
        if (!this.isLoggingOut) {
          this.apiService.getProfile().subscribe({
            next: (response) => {
              if (response.success) {
                console.log('AuthService: Perfil obtenido exitosamente');
                this.currentUserSubject.next(response.data);
                localStorage.setItem('userData', JSON.stringify(response.data));
                
                // Configurar timeout de sesión
                this.resetSessionTimeout();
              } else {
                console.log('AuthService: Error al obtener perfil, haciendo logout');
                this.logout();
              }
            },
            error: (error) => {
              console.error('AuthService: Error al obtener perfil:', error);
              this.logout();
            }
          });
        }
      }
    } else {
      console.log('AuthService: No hay token válido, limpiando datos...');
      // Si no hay token válido, limpiar cualquier dato residual
      this.clearAuthData();
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
      
      // Verificar conectividad antes de intentar login
      this.connectivityService.ensureConnectivity().then(hasConnectivity => {
        if (!hasConnectivity) {
          observer.error(new Error('No hay conexión disponible'));
          return;
        }
        
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
              
              // Configurar timeout de sesión
              this.resetSessionTimeout();
              
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
            
            // Mostrar mensaje de error amigable
            this.connectivityService.showOperationError(
              'No pudimos iniciar tu sesión. Verifica tus credenciales e intenta nuevamente.',
              error
            );
            
            observer.error(error);
          }
        });
      });
    });
  }

  logout() {
    console.log('AuthService: Iniciando logout...');
    
    // Marcar que estamos en proceso de logout para evitar llamadas adicionales
    this.isLoggingOut = true;
    
    // Limpiar timeout de sesión
    this.clearSessionTimeout();
    
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
        // Resetear la bandera después de limpiar los datos
        this.isLoggingOut = false;
      }
    });
  }

  private clearAuthData() {
    console.log('AuthService: Limpiando datos de autenticación...');
    
    // Limpiar timeout de sesión
    this.clearSessionTimeout();
    
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
    console.log('AuthService: Redirigiendo al login...');
    this.router.navigate(['/login']).then(() => {
      console.log('AuthService: Redirección al login completada');
    }).catch((error) => {
      console.error('AuthService: Error en redirección al login:', error);
    });
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

  // Método para extender la sesión manualmente (útil para operaciones críticas)
  extendSession() {
    if (this.isLoggedIn()) {
      this.resetSessionTimeout();
      console.log('AuthService: Sesión extendida manualmente');
    }
  }

  // Método para obtener el tiempo restante de la sesión
  getSessionTimeRemaining(): number {
    if (!this.isLoggedIn()) {
      return 0;
    }
    
    const timeElapsed = Date.now() - this.lastActivity;
    const timeRemaining = this.SESSION_TIMEOUT - timeElapsed;
    
    return Math.max(0, timeRemaining);
  }
}
