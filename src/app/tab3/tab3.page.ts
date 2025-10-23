import { Component, OnInit } from '@angular/core';
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonBadge, 
  IonSegment, 
  IonSegmentButton, 
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonIcon,
  IonButton
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { ApiService, Adelanto, HistorialPago } from '../services/api';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonContent, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardTitle, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonBadge, 
    IonSegment, 
    IonSegmentButton, 
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonIcon,
    IonButton,
    HeaderComponent,
    CommonModule
  ],
})
export class Tab3Page implements OnInit {
  segmentoSeleccionado = 'adelantos';
  isLoading = true;
  errorMessage = '';

  historialAdelantos: Adelanto[] = [];
  historialPagos: HistorialPago[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    console.log('Cargando historial...');
    this.isLoading = true;
    this.errorMessage = '';

    // Cargar historial de adelantos
    this.apiService.getHistorialAdelantos().subscribe({
      next: (response) => {
        console.log('Historial de adelantos cargado:', response);
        if (response.success) {
          this.historialAdelantos = response.data || [];
        } else {
          // Si hay error pero no es crítico, solo mostrar array vacío
          this.historialAdelantos = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar historial de adelantos:', error);
        // En caso de error, mostrar array vacío en lugar de error
        this.historialAdelantos = [];
        this.isLoading = false;
      }
    });

    // Cargar historial de pagos
    this.apiService.getHistorialPagos().subscribe({
      next: (response) => {
        console.log('Historial de pagos cargado:', response);
        if (response.success) {
          this.historialPagos = response.data || [];
        } else {
          // Si hay error pero no es crítico, solo mostrar array vacío
          this.historialPagos = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar historial de pagos:', error);
        // En caso de error, mostrar array vacío en lugar de error
        this.historialPagos = [];
        this.isLoading = false;
      }
    });
  }

  segmentChanged(event: any) {
    this.segmentoSeleccionado = event.detail.value;
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

  getTotalAdelantos(): number {
    return this.historialAdelantos.reduce((sum, adelanto) => {
      const monto = adelanto.monto_solicitado || 0;
      return sum + (isNaN(monto) ? 0 : monto);
    }, 0);
  }

  getTotalPagos(): number {
    return this.historialPagos.reduce((sum, pago) => {
      const monto = pago.monto || 0;
      return sum + (isNaN(monto) ? 0 : monto);
    }, 0);
  }

  // Verificar si hay datos
  tieneAdelantos(): boolean {
    return this.historialAdelantos.length > 0;
  }

  tienePagos(): boolean {
    return this.historialPagos.length > 0;
  }

  // Formatear moneda
  formatearMoneda(monto: number): string {
    // Verificar si el monto es válido
    if (monto === null || monto === undefined || isNaN(monto)) {
      return 'RD$0';
    }
    
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

  // Calcular total de monto restante
  getTotalMontoRestante(): number {
    return this.historialAdelantos.reduce((sum, adelanto) => {
      const monto = adelanto.monto_restante || 0;
      return sum + (isNaN(monto) ? 0 : monto);
    }, 0);
  }

  // Obtener adelantos por estado
  getAdelantosPorEstado(estado: string): Adelanto[] {
    return this.historialAdelantos.filter(adelanto => adelanto.estado === estado);
  }

  // Obtener solo adelantos pagados
  getAdelantosPagados(): Adelanto[] {
    return this.historialAdelantos.filter(adelanto => adelanto.estado === 'pagado');
  }

  // Calcular total de adelantos pagados
  getTotalAdelantosPagados(): number {
    return this.getAdelantosPagados().reduce((sum, adelanto) => {
      const monto = adelanto.monto_total || 0;
      return sum + (isNaN(monto) ? 0 : monto);
    }, 0);
  }


}
