import { Component } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
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
  IonSegment, 
  IonSegmentButton 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
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
    IonSegment, 
    IonSegmentButton,
    CommonModule
  ],
})
export class Tab3Page {
  selectedSegment = 'adelantos';

  // Historial de adelantos
  historialAdelantos = [
    {
      id: 1,
      monto: 50000,
      fecha: '2024-01-15',
      estado: 'aprobado',
      descripcion: 'Adelanto para gastos médicos',
      meses: 6,
      montoMensual: 8500
    },
    {
      id: 2,
      monto: 30000,
      fecha: '2024-01-10',
      estado: 'pendiente',
      descripcion: 'Adelanto para reparación de vehículo',
      meses: 4,
      montoMensual: 7500
    },
    {
      id: 3,
      monto: 25000,
      fecha: '2024-01-05',
      estado: 'rechazado',
      descripcion: 'Adelanto para estudios',
      meses: 3,
      montoMensual: 8500
    },
    {
      id: 4,
      monto: 75000,
      fecha: '2024-01-01',
      estado: 'aprobado',
      descripcion: 'Adelanto para remodelación de casa',
      meses: 12,
      montoMensual: 6250
    }
  ];

  // Historial de pagos
  historialPagos = [
    {
      id: 1,
      monto: 15000,
      fecha: '2024-01-20',
      tipo: 'descuento',
      descripcion: 'Descuento mensual adelanto #1',
      adelantoId: 1
    },
    {
      id: 2,
      monto: 12000,
      fecha: '2024-01-15',
      tipo: 'pago',
      descripcion: 'Pago adelanto #2',
      adelantoId: 2
    },
    {
      id: 3,
      monto: 8000,
      fecha: '2024-01-10',
      tipo: 'descuento',
      descripcion: 'Descuento mensual adelanto #3',
      adelantoId: 3
    },
    {
      id: 4,
      monto: 6250,
      fecha: '2024-01-05',
      tipo: 'descuento',
      descripcion: 'Descuento mensual adelanto #4',
      adelantoId: 4
    }
  ];

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
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
}
