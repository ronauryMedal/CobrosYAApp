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
  IonIcon, 
  IonButton, 
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { ApiService, Adelanto } from '../services/api';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
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
    IonIcon, 
    IonButton, 
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    HeaderComponent,
    CommonModule
  ],
})
export class Tab2Page implements OnInit {
  adelantos: Adelanto[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.cargarAdelantos();
  }

  cargarAdelantos() {
    console.log('Cargando adelantos desde la API...');
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getHistorialAdelantos().subscribe({
      next: (response) => {
        console.log('Respuesta de la API:', response);
        if (response.success) {
          this.adelantos = response.data || [];
          console.log('Adelantos cargados:', this.adelantos);
        } else {
          this.errorMessage = response.message || 'Error al cargar los adelantos';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar adelantos:', error);
        this.errorMessage = error.message || 'Error de conexión';
        this.isLoading = false;
      }
    });
  }

  nuevoAdelanto() {
    console.log('Solicitar nuevo adelanto');
    this.router.navigate(['/solicitar-adelanto']);
  }

  verDetalle(adelanto: any) {
    console.log('Ver detalle del adelanto:', adelanto);
    // Aquí se implementaría la navegación al detalle del adelanto
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'aprobado': return 'success';
      case 'pendiente': return 'warning';
      case 'rechazado': return 'danger';
      case 'pagado': return 'primary';
      default: return 'medium';
    }
  }

  // Métodos para calcular estadísticas
  getAdelantosAprobados(): number {
    return this.adelantos.filter(a => a.estado === 'aprobado').length;
  }

  getAdelantosPendientes(): number {
    return this.adelantos.filter(a => a.estado === 'pendiente').length;
  }

  getTotalAprobado(): number {
    return this.adelantos
      .filter(a => a.estado === 'aprobado')
      .reduce((sum, a) => sum + a.monto_solicitado, 0);
  }

  getTotalPendiente(): number {
    return this.adelantos
      .filter(a => a.estado === 'pendiente')
      .reduce((sum, a) => sum + a.monto_solicitado, 0);
  }

  // Verificar si hay adelantos
  tieneAdelantos(): boolean {
    return this.adelantos.length > 0;
  }

  // Verificar si puede solicitar un nuevo adelanto
  puedeSolicitarAdelanto(): boolean {
    // Si no hay adelantos, puede solicitar
    if (this.adelantos.length === 0) {
      return true;
    }

    // Verificar si tiene adelantos pendientes o aprobados (no pagados)
    const tieneAdelantosActivos = this.adelantos.some(adelanto => 
      adelanto.estado === 'pendiente' || 
      adelanto.estado === 'aprobado' || 
      (adelanto.estado === 'pagado' && adelanto.monto_restante > 0)
    );

    return !tieneAdelantosActivos;
  }

  // Obtener adelantos activos (pendientes, aprobados o con monto restante)
  getAdelantosActivos(): Adelanto[] {
    return this.adelantos.filter(adelanto => 
      adelanto.estado === 'pendiente' || 
      adelanto.estado === 'aprobado' || 
      (adelanto.estado === 'pagado' && adelanto.monto_restante > 0)
    );
  }

  // Obtener adelantos completados (pagados completamente)
  getAdelantosCompletados(): Adelanto[] {
    return this.adelantos.filter(adelanto => 
      adelanto.estado === 'pagado' && adelanto.monto_restante === 0
    );
  }

  // Calcular total de adelantos activos
  getTotalAdelantosActivos(): number {
    return this.getAdelantosActivos().reduce((sum, adelanto) => 
      sum + adelanto.monto_solicitado, 0
    );
  }

  // Calcular total de monto restante
  getTotalMontoRestante(): number {
    return this.adelantos.reduce((sum, adelanto) => 
      sum + adelanto.monto_restante, 0
    );
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
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}
