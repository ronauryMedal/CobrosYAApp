import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface LoginRequest {
  cedula: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      nombre: string;
      email: string;
      telefono: string | null;
      empresa: {
        id: number;
        nombre: string;
      } | null;
    };
    token: string;
    token_type: string;
  };
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: {
    id: number;
    nombre: string;
  } | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Interfaces para el Dashboard
export interface DashboardData {
  resumen: {
    adelantosPendientes: number;
    montoTotalAdelantos: number;
    montoDisponible: number;
    proximoPago: number;
  };
  adelantosRecientes: AdelantoResumen[];
  ultimosPagos: PagoResumen[];
}

export interface AdelantoResumen {
  id: number;
  monto: number;
  fecha: string;
  estado: 'aprobado' | 'pendiente' | 'rechazado';
  descripcion: string;
}

export interface PagoResumen {
  id: number;
  monto: number;
  fecha: string;
  tipo: 'pago' | 'descuento';
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';
  private token: string = '';

  constructor(private http: HttpClient) {
    // Cargar token del localStorage si existe
    this.token = localStorage.getItem('token') || '';
  }

  // Métodos de autenticación
  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Enviando login a:', `${this.baseUrl}/login`);
    console.log('Credenciales:', credentials);
    
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map(response => {
          console.log('Respuesta del login:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Métodos del perfil
  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/empleado/perfil`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProfile(userData: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/empleado/perfil`, userData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Métodos del dashboard
  getDashboard(): Observable<ApiResponse<DashboardData>> {
    console.log('Obteniendo datos del dashboard...');
    return this.http.get<ApiResponse<DashboardData>>(`${this.baseUrl}/empleado/dashboard`, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          console.log('Datos del dashboard recibidos:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  // Métodos de adelantos
  getAdelantos(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/empleado/adelantos`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  createAdelanto(adelantoData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/empleado/adelantos`, adelantoData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAdelanto(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/empleado/adelantos/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getHistorial(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/empleado/adelantos/historial`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Métodos de pagos
  getPagos(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/empleado/pagos`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Métodos de utilidad
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return this.token;
  }

  clearToken() {
    this.token = '';
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error';
    
    console.error('Error completo:', error);
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = error.error.message;
    } else {
      // Error del servidor
      if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
      } else if (error.status === 403) {
        errorMessage = 'Acceso denegado.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else if (error.status === 422) {
        // Error de validación
        const validationErrors = error.error.errors;
        if (validationErrors) {
          const firstError = Object.values(validationErrors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        }
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
