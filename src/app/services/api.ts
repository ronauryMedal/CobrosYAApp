import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConnectivityService } from './connectivity.service';

export interface LoginRequest {
  cedula: string;
  password: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  salario: number;
  empresa: {
    id: number;
    nombre: string;
    metodo_pago: string;
  } | null;
}

export interface LimitesAdelanto {
  salario_mensual: number;
  monto_maximo_solicitable: number;
  porcentaje_maximo: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
    limites_adelanto: LimitesAdelanto;
  };
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

export interface Adelanto {
  id: number;
  monto_solicitado: number;
  interes: number;
  monto_total: number;
  tipo_pago: string;
  meses_pago: number;
  monto_mensual: number;
  motivo: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'pagado';
  fecha_solicitud: string;
  esta_pagado: boolean;
  monto_restante: number;
}

export interface HistorialAdelanto {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  estado: string;
  meses: number;
  montoMensual: number;
  interes: number;
  montoTotal: number;
  observacion?: string;
}

export interface HistorialPago {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  tipo: string; // 'pago' | 'descuento'
  adelantoId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';
  private token: string = '';

  constructor(
    private http: HttpClient,
    private connectivityService: ConnectivityService
  ) {
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

  getHistorialAdelantos(): Observable<ApiResponse<Adelanto[]>> {
    console.log('Obteniendo historial de adelantos...');
    return this.http.get<ApiResponse<Adelanto[]>>(`${this.baseUrl}/empleado/adelantos`, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          console.log('Historial de adelantos recibido:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getHistorialPagos(): Observable<ApiResponse<HistorialPago[]>> {
    console.log('Obteniendo historial de pagos...');
    // Por ahora, si no existe el endpoint de pagos, devolvemos un array vacío
    return new Observable(observer => {
      console.log('Endpoint de pagos no disponible, devolviendo array vacío');
      observer.next({
        success: true,
        message: 'No hay pagos registrados',
        data: []
      });
      observer.complete();
    });
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
    // Verificar que el token existe y no está vacío
    const hasToken = !!this.token && this.token.trim() !== '';
    console.log('ApiService: Verificando autenticación, token existe:', hasToken);
    return hasToken;
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
    let isConnectivityError = false;
    
    console.error('Error completo:', error);
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente (problemas de red)
      isConnectivityError = true;
      errorMessage = 'Problema de conectividad. Verifica tu conexión a internet.';
    } else {
      // Error del servidor
      if (error.status === 0) {
        // Error de red (servidor no alcanzable)
        isConnectivityError = true;
        errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión.';
      } else if (error.status === 401) {
        // El interceptor se encargará de limpiar los datos y redirigir
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
      } else if (error.status >= 500) {
        // Error del servidor
        isConnectivityError = true;
        errorMessage = 'El servidor está experimentando problemas. Inténtalo más tarde.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    // Si es un error de conectividad, actualizar el estado
    if (isConnectivityError) {
      this.connectivityService.updateConnectivityStatus(
        navigator.onLine, 
        false
      );
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
