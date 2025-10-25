import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonSpinner 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { ApiService } from '../services/api';

interface ForgotPasswordRequest {
  email?: string;
  cedula?: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    temporary_password: string;
  };
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: 'forgot-password.page.html',
  styleUrls: ['forgot-password.page.scss'],
  imports: [
    IonContent, 
    IonInput, 
    IonButton, 
    IonIcon, 
    IonSpinner,
    ReactiveFormsModule,
    CommonModule,
    NgIf
  ],
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm!: FormGroup;
  selectedMethod: 'email' | 'cedula' = 'email';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  temporaryPassword = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.email]],
      cedula: ['']
    });

    // Set initial validation based on selected method
    this.updateValidation();
  }

  selectMethod(method: 'email' | 'cedula') {
    this.selectedMethod = method;
    this.clearMessages();
    this.updateValidation();
    
    // Clear the other field
    if (method === 'email') {
      this.forgotPasswordForm.patchValue({ cedula: '' });
    } else {
      this.forgotPasswordForm.patchValue({ email: '' });
    }
  }

  updateValidation() {
    const emailControl = this.forgotPasswordForm.get('email');
    const cedulaControl = this.forgotPasswordForm.get('cedula');

    if (this.selectedMethod === 'email') {
      emailControl?.setValidators([Validators.required, Validators.email]);
      cedulaControl?.clearValidators();
    } else {
      cedulaControl?.setValidators([Validators.required, Validators.minLength(11)]);
      emailControl?.clearValidators();
    }

    emailControl?.updateValueAndValidity();
    cedulaControl?.updateValueAndValidity();
  }

  formatearCedula(event: any) {
    let cedula = event.target.value.replace(/\D/g, ''); // Solo números
    
    if (cedula.length > 0) {
      // Formato: 000-0000000-0
      if (cedula.length <= 3) {
        cedula = cedula;
      } else if (cedula.length <= 10) {
        cedula = cedula.substring(0, 3) + '-' + cedula.substring(3);
      } else {
        cedula = cedula.substring(0, 3) + '-' + cedula.substring(3, 10) + '-' + cedula.substring(10, 11);
      }
    }
    
    this.forgotPasswordForm.patchValue({ cedula: cedula });
  }

  async submitForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      try {
        const formData = this.forgotPasswordForm.value;
        const request: ForgotPasswordRequest = {};

        if (this.selectedMethod === 'email') {
          request.email = formData.email;
        } else {
          request.cedula = formData.cedula;
        }

        console.log('Enviando solicitud de recuperación:', request);

        this.apiService.forgotPassword(request).subscribe({
          next: (response: ForgotPasswordResponse) => {
            console.log('Respuesta del servidor:', response);
            
            if (response.success) {
              this.successMessage = response.message;
              this.temporaryPassword = response.data?.temporary_password || '';
              
              // Auto-redirect to login after 5 seconds
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 5000);
            } else {
              this.errorMessage = response.message;
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error en forgot password:', error);
            this.errorMessage = error.error?.message || 'Error al procesar la solicitud';
            this.isLoading = false;
          }
        });
        
      } catch (error: any) {
        console.error('Error en forgot password:', error);
        this.errorMessage = 'Error al procesar la solicitud';
        this.isLoading = false;
      }
    } else {
      console.log('Formulario inválido:', this.forgotPasswordForm.errors);
      this.errorMessage = 'Por favor, completa todos los campos correctamente';
    }
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
    this.temporaryPassword = '';
  }

  // Obtener la ruta del logo
  getLogoPath(): string {
    return 'assets/images/logos/Logotipo Horizontal a color - Letra blanca.png';
  }
}