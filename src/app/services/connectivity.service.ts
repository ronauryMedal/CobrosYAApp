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
    alert.message = 'No hay conexión a internet.\n\nVerifica tu conexión de red y vuelve a intentar.\n\nAlgunas funciones pueden no estar disponibles.';
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
    alert.message = 'El servidor no está disponible en este momento.\n\nEstamos trabajando para resolver el problema.\n\nPuedes seguir usando la aplicación en modo offline.';
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
    alert.message = '¡Conexión restaurada!\n\nTodas las funciones están disponibles nuevamente.';
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
    alert.message = `No pudimos completar la operación\n\n${operation}\n\nNo te preocupes, puedes intentarlo más tarde.`;
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
