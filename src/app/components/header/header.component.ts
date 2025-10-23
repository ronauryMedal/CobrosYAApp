import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonAvatar, 
  IonIcon,
  ActionSheetController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonButton, 
    IonAvatar, 
    IonIcon,
    CommonModule
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() showAvatar: boolean = true;
  
  currentUser: User | null = null;
  private mutationObserver?: MutationObserver;

  constructor(
    private authService: AuthService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    // Observar cambios en el tema
    this.observeThemeChanges();
  }

  ngOnDestroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  private observeThemeChanges() {
    this.mutationObserver = new MutationObserver(() => {
      // Forzar detección de cambios
      this.detectThemeChange();
    });

    this.mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  private detectThemeChange() {
    // Forzar actualización del componente
    this.cdr.detectChanges();
  }

  // Obtener URL del avatar
  getAvatarUrl(): string {
    if (this.currentUser?.nombre) {
      // Generar avatar basado en las iniciales del nombre
      const iniciales = this.currentUser.nombre
        .split(' ')
        .map(n => n.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
      
      return `https://ui-avatars.com/api/?name=${iniciales}&background=3880ff&color=fff&size=128&rounded=true`;
    }
    return '';
  }

  // Mostrar action sheet con opciones del usuario
  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.currentUser?.nombre || 'Usuario',
      subHeader: this.currentUser?.email || '',
      buttons: [
        {
          text: 'Ver Perfil',
          icon: 'person-outline',
          handler: () => {
            this.verPerfil();
          }
        },
        {
          text: 'Configuración',
          icon: 'settings-outline',
          handler: () => {
            this.abrirConfiguracion();
          }
        },
        {
          text: 'Ayuda',
          icon: 'help-circle-outline',
          handler: () => {
            this.abrirAyuda();
          }
        },
        {
          text: 'Cerrar Sesión',
          icon: 'log-out-outline',
          role: 'destructive',
          handler: () => {
            this.cerrarSesion();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  // Obtener la ruta del logo según el tema
  getLogoPath(): string {
    // Solo verificar la clase dark en el body (método principal de Ionic)
    const isDarkMode = document.body.classList.contains('dark');
    
    console.log('Tema detectado:', { isDarkMode, bodyClasses: document.body.className });
    
    if (isDarkMode) {
      return 'assets/images/logos/Logotipo Horizontal blanco.png';
    } else {
      return 'assets/images/logos/Logotipo Horizontal a color - Letra a color.png';
    }
  }

  // Métodos de navegación
  verPerfil() {
    this.router.navigate(['/tabs/tab4']);
  }

  abrirConfiguracion() {
    console.log('Abrir configuración');
    // Aquí se implementaría la navegación a configuración
  }

  abrirAyuda() {
    console.log('Abrir ayuda');
    // Aquí se implementaría la navegación a ayuda
  }

  cerrarSesion() {
    this.authService.logout();
  }
}
