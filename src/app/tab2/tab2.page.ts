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
  IonIcon, 
  IonButton, 
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';

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
    HeaderComponent,
    CommonModule
  ],
})
export class Tab2Page {
  adelantos = [
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

  constructor(private router: Router) {}

  nuevoAdelanto() {
    console.log('Solicitar nuevo adelanto');
    this.router.navigate(['/solicitar-adelanto']);
  }

  verDetalle(adelanto: any) {
    console.log('Ver detalle del adelanto:', adelanto);
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'aprobado': return 'success';
      case 'pendiente': return 'warning';
      case 'rechazado': return 'danger';
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

  getTotalAprobado(): string {
    const total = this.adelantos
      .filter(a => a.estado === 'aprobado')
      .reduce((sum, a) => sum + a.monto, 0);
    return total.toLocaleString();
  }

  getTotalPendiente(): string {
    const total = this.adelantos
      .filter(a => a.estado === 'pendiente')
      .reduce((sum, a) => sum + a.monto, 0);
    return total.toLocaleString();
  }
}
