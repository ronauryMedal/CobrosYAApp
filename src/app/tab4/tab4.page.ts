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
  IonIcon,
  ModalController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { User } from '../services/api';
import { AuthService } from '../services/auth';
import { HeaderComponent } from '../components/header/header.component';
import { CambiarPasswordPage } from '../cambiar-password/cambiar-password.page';

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

  constructor(
    private authService: AuthService,
    private modalController: ModalController
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  editarPerfil() {
    console.log('Editar perfil');
    // Aquí se implementaría la navegación a editar perfil
  }

  async cambiarContrasena() {
    const modal = await this.modalController.create({
      component: CambiarPasswordPage,
      presentingElement: await this.modalController.getTop()
    });
    
    await modal.present();
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
