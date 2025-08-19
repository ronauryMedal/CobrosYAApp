import { Component, OnInit } from '@angular/core';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon, 
  IonButton, 
  IonButtons, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonBadge,
  IonAvatar,
  IonNote
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { User } from '../services/api';

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
    IonCardContent, 
    IonCardHeader, 
    IonCardTitle, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonIcon, 
    IonButton, 
    IonButtons, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonBadge,
    IonAvatar,
    IonNote,
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
  }

  cambiarPassword() {
    console.log('Cambiar contraseña');
  }

  notificaciones() {
    console.log('Configurar notificaciones');
  }

  ayuda() {
    console.log('Ayuda');
  }

  cerrarSesion() {
    console.log('Cerrar sesión');
    this.authService.logout();
  }
}
