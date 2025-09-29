import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from './services/auth';
import { SessionService } from './services/session.service';
import { ConnectivityIndicatorComponent } from './components/connectivity-indicator/connectivity-indicator.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterOutlet, ConnectivityIndicatorComponent],
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  private sessionWarningTimeout: any = null;
  private sessionExpiryTimeout: any = null;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService
  ) {
    this.setupSessionMonitoring();
  }

  private setupSessionMonitoring() {
    // Verificar cada minuto si la sesión está por expirar
    setInterval(() => {
      if (this.authService.isLoggedIn()) {
        const timeRemaining = this.authService.getSessionTimeRemaining();
        
        if (this.sessionService.shouldShowWarning(timeRemaining)) {
          this.sessionService.showSessionWarning(timeRemaining);
        }
      }
    }, 60000); // Verificar cada minuto
  }
}
