import { Component } from '@angular/core';
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
  IonCol
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';

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
    HeaderComponent,
    CommonModule
  ],
})
export class Tab3Page {
  segmentoSeleccionado = 'adelantos';

  historialAdelantos = [
    {
      id: 1,
      descripcion: 'Adelanto para gastos médicos',
      monto: 50000,
      fecha: '2024-01-15',
      estado: 'aprobado'
    },
    {
      id: 2,
      descripcion: 'Adelanto para reparación de vehículo',
      monto: 30000,
      fecha: '2024-01-10',
      estado: 'pendiente'
    },
    {
      id: 3,
      descripcion: 'Adelanto para estudios',
      monto: 25000,
      fecha: '2024-01-05',
      estado: 'rechazado'
    },
    {
      id: 4,
      descripcion: 'Adelanto para remodelación de casa',
      monto: 75000,
      fecha: '2024-01-01',
      estado: 'aprobado'
    }
  ];

  historialPagos = [
    {
      id: 1,
      descripcion: 'Pago parcial - Gastos médicos',
      monto: 8500,
      fecha: '2024-02-15',
      tipo: 'pago'
    },
    {
      id: 2,
      descripcion: 'Descuento nómina - Gastos médicos',
      monto: 8500,
      fecha: '2024-02-01',
      tipo: 'descuento'
    },
    {
      id: 3,
      descripcion: 'Pago parcial - Remodelación casa',
      monto: 6250,
      fecha: '2024-02-15',
      tipo: 'pago'
    },
    {
      id: 4,
      descripcion: 'Descuento nómina - Remodelación casa',
      monto: 6250,
      fecha: '2024-02-01',
      tipo: 'descuento'
    }
  ];

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

  getTotalAdelantos(): string {
    const total = this.historialAdelantos.reduce((sum, adelanto) => sum + adelanto.monto, 0);
    return total.toLocaleString();
  }

  getTotalPagos(): string {
    const total = this.historialPagos.reduce((sum, pago) => sum + pago.monto, 0);
    return total.toLocaleString();
  }
}
