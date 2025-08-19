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
  IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { User } from '../services/api';
import { AuthService } from '../services/auth';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  imports: [
    IonContent, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardTitle, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonIcon,
    HeaderComponent,
    CommonModule
  ],
})
export class Tab4Page {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  editarPerfil() {
    console.log('Editar perfil');
    // Aquí se implementaría la navegación a editar perfil
  }

  cambiarContrasena() {
    console.log('Cambiar contraseña');
    // Aquí se implementaría la navegación a cambiar contraseña
  }

  verNotificaciones() {
    console.log('Ver notificaciones');
    // Aquí se implementaría la navegación a notificaciones
  }

  verAyuda() {
    console.log('Ver ayuda');
    // Aquí se implementaría la navegación a ayuda
  }
}
