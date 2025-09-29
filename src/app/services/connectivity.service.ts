import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConnectivityStatus {
  isOnline: boolean;
  isServerReachable: boolean;
  lastCheck: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {
  private connectivitySubject = new BehaviorSubject<ConnectivityStatus>({
    isOnline: navigator.onLine,
    isServerReachable: true,
    lastCheck: new Date()
  });

  public connectivity$ = this.connectivitySubject.asObservable();

  constructor() {
    this.setupConnectivityMonitoring();
  }

  private setupConnectivityMonitoring() {
    // Monitorear cambios en la conectividad del navegador
    window.addEventListener('online', () => {
      this.updateConnectivityStatus(true, true);
    });

    window.addEventListener('offline', () => {
      this.updateConnectivityStatus(false, false);
    });

    // Verificar conectividad inicial
    this.checkConnectivity();
  }

  public updateConnectivityStatus(isOnline: boolean, isServerReachable: boolean) {
    const currentStatus = this.connectivitySubject.value;
    const newStatus: ConnectivityStatus = {
      isOnline,
      isServerReachable,
      lastCheck: new Date()
    };

    this.connectivitySubject.next(newStatus);

    // Si cambió el estado, mostrar notificación apropiada
    if (currentStatus.isOnline !== isOnline || currentStatus.isServerReachable !== isServerReachable) {
      this.showConnectivityNotification(newStatus);
    }
  }

  async checkConnectivity(): Promise<boolean> {
    const isOnline = navigator.onLine;
    
    if (!isOnline) {
      this.updateConnectivityStatus(false, false);
      return false;
    }

    try {
      // Intentar hacer una petición simple al servidor
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const isServerReachable = response.ok;
      this.updateConnectivityStatus(true, isServerReachable);
      return isServerReachable;
    } catch (error) {
      console.log('ConnectivityService: Error al verificar conectividad del servidor:', error);
      this.updateConnectivityStatus(true, false);
      return false;
    }
  }

  private async showConnectivityNotification(status: ConnectivityStatus) {
    if (!status.isOnline) {
      await this.showOfflineNotification();
    } else if (!status.isServerReachable) {
      await this.showServerUnreachableNotification();
    } else {
      await this.showBackOnlineNotification();
    }
  }

  private async showOfflineNotification() {
    const alert = document.createElement('ion-alert');
    alert.header = '📡 Sin conexión a internet';
    alert.message = `
      <div style="text-align: center; padding: 20px;">
        <ion-icon name="wifi-outline" style="font-size: 48px; color: #ff6b35;"></ion-icon>
        <p><strong>No hay conexión a internet</strong></p>
        <p>Verifica tu conexión de red y vuelve a intentar.</p>
        <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
          Algunas funciones pueden no estar disponibles.
        </p>
      </div>
    `;
    alert.cssClass = 'connectivity-alert offline';
    alert.buttons = [
      {
        text: 'Reintentar',
        handler: () => {
          this.checkConnectivity();
        }
      },
      {
        text: 'Entendido',
        role: 'cancel'
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }

  private async showServerUnreachableNotification() {
    const alert = document.createElement('ion-alert');
    alert.header = '🔧 Servicio temporalmente no disponible';
    alert.message = `
      <div style="text-align: center; padding: 20px;">
        <ion-icon name="server-outline" style="font-size: 48px; color: #ff6b35;"></ion-icon>
        <p><strong>El servidor no está disponible en este momento</strong></p>
        <p>Estamos trabajando para resolver el problema.</p>
        <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
          Puedes seguir usando la aplicación en modo offline.
        </p>
      </div>
    `;
    alert.cssClass = 'connectivity-alert server-unreachable';
    alert.buttons = [
      {
        text: 'Reintentar',
        handler: () => {
          this.checkConnectivity();
        }
      },
      {
        text: 'Continuar',
        role: 'cancel'
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }

  private async showBackOnlineNotification() {
    const alert = document.createElement('ion-alert');
    alert.header = '✅ Conexión restaurada';
    alert.message = `
      <div style="text-align: center; padding: 20px;">
        <ion-icon name="checkmark-circle-outline" style="font-size: 48px; color: #28a745;"></ion-icon>
        <p><strong>¡Conexión restaurada!</strong></p>
        <p>Todas las funciones están disponibles nuevamente.</p>
      </div>
    `;
    alert.cssClass = 'connectivity-alert back-online';
    alert.buttons = [
      {
        text: 'Genial',
        role: 'cancel'
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }

  // Método para mostrar un mensaje de error genérico para operaciones fallidas
  async showOperationError(operation: string, error?: any): Promise<void> {
    const alert = document.createElement('ion-alert');
    alert.header = '😔 Algo salió mal';
    alert.message = `
      <div style="text-align: center; padding: 20px;">
        <ion-icon name="sad-outline" style="font-size: 48px; color: #ff6b35;"></ion-icon>
        <p><strong>No pudimos completar la operación</strong></p>
        <p>${operation}</p>
        <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
          No te preocupes, puedes intentarlo más tarde.
        </p>
      </div>
    `;
    alert.cssClass = 'connectivity-alert operation-error';
    alert.buttons = [
      {
        text: 'Reintentar',
        handler: () => {
          // Aquí podrías implementar un callback para reintentar
          return true;
        }
      },
      {
        text: 'Entendido',
        role: 'cancel'
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }

  // Método para verificar si hay conectividad antes de hacer operaciones
  async ensureConnectivity(): Promise<boolean> {
    const status = this.connectivitySubject.value;
    
    if (!status.isOnline) {
      await this.showOfflineNotification();
      return false;
    }
    
    if (!status.isServerReachable) {
      await this.showServerUnreachableNotification();
      return false;
    }
    
    return true;
  }

  getCurrentStatus(): ConnectivityStatus {
    return this.connectivitySubject.value;
  }
}
