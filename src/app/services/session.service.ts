import { Injectable } from '@angular/core';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private warningShown = false;
  private warningTimeout: any = null;

  constructor(private authService: AuthService) {}

  /**
   * Muestra una alerta de advertencia cuando la sesión está por expirar
   */
  async showSessionWarning(timeRemaining: number): Promise<void> {
    // Evitar mostrar múltiples alertas
    if (this.warningShown) {
      return;
    }

    this.warningShown = true;
    const minutes = Math.ceil(timeRemaining / 60000);

    const alert = document.createElement('ion-alert');
    alert.header = '⚠️ Sesión por expirar';
    alert.message = `Tu sesión expirará en ${minutes} minutos.\n\nPor favor, confirma que deseas continuar con la sesión activa.`;
    alert.cssClass = 'session-warning-alert';
    alert.buttons = [
      {
        text: 'Cerrar sesión',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
        handler: () => {
          console.log('Usuario eligió cerrar sesión');
          this.authService.logout();
        }
      },
      {
        text: 'Continuar sesión',
        cssClass: 'alert-button-confirm',
        handler: () => {
          console.log('Usuario eligió continuar sesión');
          this.authService.extendSession();
          this.resetWarning();
        }
      }
    ];

    // Configurar timeout para cerrar automáticamente la alerta
    this.warningTimeout = setTimeout(() => {
      if (alert.isConnected) {
        alert.dismiss();
        this.authService.logout();
      }
    }, timeRemaining);

    document.body.appendChild(alert);
    await alert.present();

    // Limpiar cuando se cierre la alerta
    alert.onDidDismiss().then(() => {
      this.resetWarning();
    });
  }

  /**
   * Muestra una notificación de sesión expirada
   */
  async showSessionExpired(): Promise<void> {
    const alert = document.createElement('ion-alert');
    alert.header = '🕐 Sesión expirada';
    alert.message = 'Tu sesión ha expirado por inactividad.\n\nSerás redirigido a la página de inicio de sesión.';
    alert.cssClass = 'session-expired-alert';
    alert.buttons = [
      {
        text: 'Entendido',
        handler: () => {
          console.log('Usuario aceptó que la sesión expiró, haciendo logout...');
          this.authService.logout();
        }
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
    
    // Asegurar que el alert se cierre después de un tiempo si el usuario no responde
    setTimeout(() => {
      if (alert.isConnected) {
        console.log('Forzando cierre del alert de sesión expirada...');
        alert.dismiss();
        this.authService.logout();
      }
    }, 10000); // 10 segundos de timeout
  }

  /**
   * Resetea el estado de la advertencia
   */
  private resetWarning(): void {
    this.warningShown = false;
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
      this.warningTimeout = null;
    }
  }

  /**
   * Verifica si se debe mostrar la advertencia de sesión
   */
  shouldShowWarning(timeRemaining: number): boolean {
    const warningTime = 5 * 60 * 1000; // 5 minutos antes de expirar
    return timeRemaining <= warningTime && timeRemaining > 0 && !this.warningShown;
  }
}
