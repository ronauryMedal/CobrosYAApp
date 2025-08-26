import { Component, OnInit } from '@angular/core';
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonBadge, 
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonButton
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, DashboardData, AdelantoResumen, PagoResumen } from '../services/api';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonContent, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardTitle, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonBadge, 
    IonIcon,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonButton,
    HeaderComponent,
    CommonModule
  ],
})
export class Tab1Page implements OnInit {
  isLoading = true;
  errorMessage = '';
  
  // Datos del dashboard
  dashboardData: DashboardData | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    console.log('Cargando datos del dashboard...');
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getDashboard().subscribe({
      next: (response) => {
        console.log('Dashboard cargado exitosamente:', response);
        if (response.success) {
          this.dashboardData = response.data;
        } else {
          this.errorMessage = response.message || 'Error al cargar el dashboard';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar dashboard:', error);
        this.errorMessage = error.message || 'Error al cargar el dashboard';
        this.isLoading = false;
        
        // Si es un error 401, no mostrar el botón de reintentar
        if (error.status === 401) {
          this.errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        }
      }
    });
  }

  // Método para recargar datos
  doRefresh(event: any) {
    this.cargarDashboard();
    event.target.complete();
  }

  // Navegar a solicitar adelanto
  irASolicitarAdelanto() {
    this.router.navigate(['/solicitar-adelanto']);
  }

  // Navegar al login
  irAlLogin() {
    this.router.navigate(['/login']);
  }

  // Verificar si hay datos válidos en el dashboard
  tieneDatosValidos(): boolean {
    if (!this.dashboardData) return false;
    
    // Verificar si hay adelantos recientes
    const tieneAdelantos = this.dashboardData.adelantosRecientes && 
                          this.dashboardData.adelantosRecientes.length > 0;
    
    // Verificar si hay pagos
    const tienePagos = this.dashboardData.ultimosPagos && 
                      this.dashboardData.ultimosPagos.length > 0;
    
    // Verificar si hay métricas válidas (no NaN o null)
    const resumen = this.dashboardData.resumen;
    const tieneMetricasValidas = resumen && 
                                (resumen.adelantosPendientes > 0 || 
                                 resumen.montoTotalAdelantos > 0 || 
                                 resumen.montoDisponible > 0 || 
                                 resumen.proximoPago > 0);
    
    return tieneAdelantos || tienePagos || tieneMetricasValidas;
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'aprobado': return 'success';
      case 'pendiente': return 'warning';
      case 'rechazado': return 'danger';
      default: return 'medium';
    }
  }

  getTipoColor(tipo: string): string {
    switch (tipo) {
      case 'pago': return 'success';
      case 'descuento': return 'warning';
      default: return 'medium';
    }
  }

  // Formatear moneda
  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0
    }).format(monto);
  }

  // Formatear fecha
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
