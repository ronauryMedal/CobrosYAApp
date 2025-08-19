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
  IonGrid, 
  IonRow, 
  IonCol, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonBadge, 
  IonIcon 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
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
    CommonModule
  ],
})
export class Tab1Page {
  // Datos del dashboard
  dashboardData = {
    adelantosPendientes: 2,
    montoTotalAdelantos: 150000,
    montoDisponible: 50000,
    proximoPago: 25000
  };

  // Adelantos recientes
  adelantosRecientes = [
    {
      id: 1,
      monto: 50000,
      fecha: '2024-01-15',
      estado: 'aprobado',
      descripcion: 'Adelanto para gastos médicos'
    },
    {
      id: 2,
      monto: 30000,
      fecha: '2024-01-10',
      estado: 'pendiente',
      descripcion: 'Adelanto para reparación de vehículo'
    },
    {
      id: 3,
      monto: 25000,
      fecha: '2024-01-05',
      estado: 'rechazado',
      descripcion: 'Adelanto para estudios'
    }
  ];

  // Últimos pagos
  ultimosPagos = [
    {
      id: 1,
      monto: 15000,
      fecha: '2024-01-20',
      tipo: 'descuento',
      descripcion: 'Descuento mensual adelanto #1'
    },
    {
      id: 2,
      monto: 12000,
      fecha: '2024-01-15',
      tipo: 'pago',
      descripcion: 'Pago adelanto #2'
    },
    {
      id: 3,
      monto: 8000,
      fecha: '2024-01-10',
      tipo: 'descuento',
      descripcion: 'Descuento mensual adelanto #3'
    }
  ];

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
