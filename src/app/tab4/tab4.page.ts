import { Component, OnInit } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon, 
  IonButton, 
  IonAvatar, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonBadge 
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { AuthService, User } from '../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonIcon, 
    IonButton, 
    IonAvatar, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonBadge,
    ExploreContainerComponent,
    CommonModule
  ],
})
export class Tab4Page implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  editarPerfil() {
    console.log('Editar perfil');
    // Aquí se implementaría la navegación a la página de edición de perfil
  }

  cambiarPassword() {
    console.log('Cambiar contraseña');
    // Aquí se implementaría la navegación a la página de cambio de contraseña
  }

  notificaciones() {
    console.log('Configurar notificaciones');
    // Aquí se implementaría la navegación a la página de notificaciones
  }

  ayuda() {
    console.log('Ayuda y soporte');
    // Aquí se implementaría la navegación a la página de ayuda
  }

  cerrarSesion() {
    console.log('Cerrar sesión');
    this.authService.logout();
  }
}
