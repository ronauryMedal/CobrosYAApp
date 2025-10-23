import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle,
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonButtons,
  IonIcon,
  IonNote,
  IonSpinner,
  ModalController,
  ToastController
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: 'cambiar-password.page.html',
  styleUrls: ['cambiar-password.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle,
    IonCardContent, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    IonButtons,
    IonIcon,
    IonNote,
    IonSpinner,
    ReactiveFormsModule,
    CommonModule
  ],
})
export class CambiarPasswordPage implements OnInit {
  passwordForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.passwordForm = this.formBuilder.group({
      passwordActual: ['', [Validators.required]],
      passwordNuevo: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      passwordConfirmacion: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const passwordNuevo = form.get('passwordNuevo');
    const passwordConfirmacion = form.get('passwordConfirmacion');
    
    if (passwordNuevo && passwordConfirmacion) {
      return passwordNuevo.value === passwordConfirmacion.value ? null : { passwordMismatch: true };
    }
    return null;
  }

  async cambiarPassword() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { passwordActual, passwordNuevo } = this.passwordForm.value;

      try {
        const response = await this.apiService.cambiarPassword(passwordActual, passwordNuevo).toPromise();
        
        if (response && response.success) {
          this.successMessage = 'Contraseña cambiada exitosamente';
          
          // Mostrar toast de éxito
          const toast = await this.toastController.create({
            message: 'Contraseña cambiada exitosamente',
            duration: 3000,
            color: 'success',
            position: 'top'
          });
          await toast.present();

          // Cerrar modal después de un breve delay
          setTimeout(() => {
            this.cerrar();
          }, 1500);
        }
      } catch (error: any) {
        console.error('Error al cambiar contraseña:', error);
        this.errorMessage = error.message || 'Error al cambiar la contraseña';
        
        // Mostrar toast de error
        const toast = await this.toastController.create({
          message: this.errorMessage,
          duration: 4000,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
      } finally {
        this.isLoading = false;
      }
    }
  }

  cerrar() {
    this.modalController.dismiss();
  }

  // Obtener mensaje de error para la nueva contraseña
  getPasswordNuevoError(): string {
    const control = this.passwordForm.get('passwordNuevo');
    if (control?.errors) {
      if (control.errors['required']) {
        return 'La nueva contraseña es requerida';
      }
      if (control.errors['minlength']) {
        return 'La contraseña debe tener al menos 8 caracteres';
      }
    }
    return '';
  }

  // Obtener mensaje de error para la confirmación de contraseña
  getPasswordConfirmacionError(): string {
    const control = this.passwordForm.get('passwordConfirmacion');
    if (control?.errors) {
      if (control.errors['required']) {
        return 'La confirmación de contraseña es requerida';
      }
    }
    
    // Verificar si las contraseñas no coinciden
    if (this.passwordForm.errors?.['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }
    
    return '';
  }
}
