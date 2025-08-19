import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonNote, 
  IonCheckbox, 
  IonSpinner 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { LoginRequest } from '../services/api';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [
    IonContent, 
    IonCard, 
    IonCardContent, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    IonIcon, 
    IonNote, 
    IonCheckbox, 
    IonSpinner,
    ReactiveFormsModule,
    CommonModule
  ],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  mostrarPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('LoginPage ngOnInit');
    this.inicializarFormulario();
    this.cargarCedulaGuardada();
    
    // Si ya está logueado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      console.log('Usuario ya logueado, redirigiendo...');
      this.router.navigate(['/tabs']);
    }
  }

  inicializarFormulario() {
    this.loginForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.minLength(11)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recordar: [false]
    });
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
    
    this.loginForm.patchValue({ cedula: cedula });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  async login() {
    console.log('Iniciando login...');
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { cedula, password, recordar } = this.loginForm.value;
      console.log('Credenciales:', { cedula, password, recordar });

      try {
        // Crear objeto de credenciales
        const credentials: LoginRequest = {
          cedula: cedula,
          password: password
        };

        // Llamar al servicio de autenticación
        console.log('Llamando a la API...');
        this.authService.login(credentials).subscribe({
          next: (response) => {
            console.log('Login exitoso:', response);
            
            // Guardar cédula si "recordar" está marcado
            if (recordar) {
              localStorage.setItem('recordarLogin', 'true');
              localStorage.setItem('cedulaGuardada', cedula);
            } else {
              localStorage.removeItem('recordarLogin');
              localStorage.removeItem('cedulaGuardada');
            }

            // Navegar al dashboard
            console.log('Intentando navegar a /tabs...');
            this.router.navigate(['/tabs']).then(() => {
              console.log('Navegación exitosa');
            }).catch((error) => {
              console.error('Error en navegación:', error);
            });
          },
          error: (error) => {
            console.error('Error en login:', error);
            this.errorMessage = error.message || 'Error al iniciar sesión';
            this.isLoading = false;
          }
        });
        
      } catch (error: any) {
        console.error('Error en login:', error);
        this.errorMessage = error.message || 'Error al iniciar sesión';
        this.isLoading = false;
      }
    } else {
      console.log('Formulario inválido:', this.loginForm.errors);
    }
  }

  // Cargar cédula guardada si existe
  cargarCedulaGuardada() {
    const recordarLogin = localStorage.getItem('recordarLogin');
    const cedulaGuardada = localStorage.getItem('cedulaGuardada');
    
    if (recordarLogin === 'true' && cedulaGuardada) {
      this.loginForm.patchValue({
        cedula: cedulaGuardada,
        recordar: true
      });
    }
  }
}
