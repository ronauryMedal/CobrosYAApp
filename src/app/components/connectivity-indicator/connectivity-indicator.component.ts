import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ConnectivityService, ConnectivityStatus } from '../../services/connectivity.service';

@Component({
  selector: 'app-connectivity-indicator',
  templateUrl: './connectivity-indicator.component.html',
  styleUrls: ['./connectivity-indicator.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ConnectivityIndicatorComponent implements OnInit, OnDestroy {
  connectivityStatus: ConnectivityStatus | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private connectivityService: ConnectivityService) {}

  ngOnInit() {
    this.subscription.add(
      this.connectivityService.connectivity$.subscribe(status => {
        this.connectivityStatus = status;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getStatusIcon(): string {
    if (!this.connectivityStatus) return 'help-outline';
    
    if (!this.connectivityStatus.isOnline) {
      return 'wifi-outline';
    } else if (!this.connectivityStatus.isServerReachable) {
      return 'server-outline';
    } else {
      return 'checkmark-circle-outline';
    }
  }

  getStatusColor(): string {
    if (!this.connectivityStatus) return 'medium';
    
    if (!this.connectivityStatus.isOnline) {
      return 'danger';
    } else if (!this.connectivityStatus.isServerReachable) {
      return 'warning';
    } else {
      return 'success';
    }
  }

  getStatusText(): string {
    if (!this.connectivityStatus) return 'Verificando...';
    
    if (!this.connectivityStatus.isOnline) {
      return 'Sin conexión';
    } else if (!this.connectivityStatus.isServerReachable) {
      return 'Servidor no disponible';
    } else {
      return 'Conectado';
    }
  }

  onIndicatorClick() {
    if (this.connectivityStatus && (!this.connectivityStatus.isOnline || !this.connectivityStatus.isServerReachable)) {
      this.connectivityService.checkConnectivity();
    }
  }
}
