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
  IonCardContent, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonSelect, 
  IonSelectOption, 
  IonTextarea, 
  IonButton, 
  IonButtons, 
  IonBackButton, 
  IonNote, 
  IonIcon 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { User, LimitesAdelanto, ApiService } from '../services/api';

@Component({
  selector: 'app-solicitar-adelanto',
  templateUrl: 'solicitar-adelanto.page.html',
  styleUrls: ['solicitar-adelanto.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonSelect, 
    IonSelectOption, 
    IonTextarea, 
    IonButton, 
    IonButtons, 
    IonBackButton, 
    IonNote, 
    IonIcon,
    ReactiveFormsModule,
    CommonModule
  ],
})
export class SolicitarAdelantoPage implements OnInit {
  adelantoForm!: FormGroup;
  interesPorcentaje = 7; // 7% por defecto
  limitesAdelanto: LimitesAdelanto | null = null;
  montoMaximoSolicitable = 0;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Verificar si el usuario está logueado
    if (!this.authService.isLoggedIn()) {
      console.log('Usuario no logueado, redirigiendo al login');
      this.router.navigate(['/login']);
      return;
    }
    
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    const fechaActual = new Date().toLocaleDateString('es-ES');
    
    // Obtener datos del usuario logueado
    const currentUser = this.authService.getCurrentUser();
    this.limitesAdelanto = this.authService.getLimitesAdelanto();
    
    if (!currentUser) {
      console.error('No hay usuario logueado');
      this.router.navigate(['/login']);
      return;
    }
    
    // Obtener límites de adelanto
    if (this.limitesAdelanto) {
      this.montoMaximoSolicitable = this.limitesAdelanto.monto_maximo_solicitable;
    }
    
    // Crear el nombre completo del empleado
    const nombreEmpleado = currentUser.nombre;
    
    this.adelantoForm = this.formBuilder.group({
      empleado: [nombreEmpleado, Validators.required],
      montoSolicitado: [0, [
        Validators.required, 
        Validators.min(1),
        Validators.max(this.montoMaximoSolicitable)
      ]],
      tipoPago: ['Mensual (7% interés)', Validators.required],
      cantidadInteres: [0, Validators.required], // Nueva campo para la cantidad calculada
      mesesPago: ['1', Validators.required], // Valor fijo: 1 mes
      montoMensual: [0, Validators.required],
      fechaSolicitud: [fechaActual, Validators.required],
      observacion: [''],
      montoTotal: [0, Validators.required],
      estado: ['pendiente', Validators.required]
    });

    // Escuchar cambios solo en monto solicitado para recalcular
    this.adelantoForm.get('montoSolicitado')?.valueChanges.subscribe((value) => {
      this.calcularMontoTotal();
      
      // Validar límite máximo en tiempo real
      if (value && value > this.montoMaximoSolicitable) {
        console.log(`Monto excede el límite: ${value} > ${this.montoMaximoSolicitable}`);
      }
    });

    // Calcular valores iniciales con el valor fijo de 1 mes
    setTimeout(() => {
      this.calcularMontoTotal();
    }, 100);
  }

  calcularMontoTotal() {
    const montoSolicitado = this.adelantoForm.get('montoSolicitado')?.value || 0;
    const mesesPago = 1; // Valor fijo: siempre 1 mes
    
    if (montoSolicitado > 0) {
      // Calcular cantidad de interés (7% del monto solicitado)
      const cantidadInteres = (montoSolicitado * this.interesPorcentaje) / 100;
      const montoTotal = montoSolicitado + cantidadInteres;
      const montoMensual = montoTotal / mesesPago; // Siempre dividido por 1

      this.adelantoForm.patchValue({
        cantidadInteres: cantidadInteres.toFixed(2),
        montoTotal: montoTotal.toFixed(2),
        montoMensual: montoMensual.toFixed(2)
      });
    } else {
      // Si no hay monto solicitado, limpiar los campos calculados
      this.adelantoForm.patchValue({
        cantidadInteres: '0.00',
        montoTotal: '0.00',
        montoMensual: '0.00'
      });
    }
  }

  solicitarAdelanto() {
    if (this.adelantoForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        console.error('No hay usuario logueado');
        this.router.navigate(['/login']);
        return;
      }
      
      // Solo enviar los datos que necesita el backend
      const datosAdelanto = {
        monto_solicitado: this.adelantoForm.get('montoSolicitado')?.value,
        motivo: this.adelantoForm.get('observacion')?.value || 'Solicitud de adelanto',
        meses_pago: parseInt(this.adelantoForm.get('mesesPago')?.value) || 1
      };
      
      console.log('=== DATOS DEL ADELANTO A ENVIAR ===');
      console.log('Datos del formulario completo:', this.adelantoForm.value);
      console.log('Datos simplificados para el backend:', datosAdelanto);
      console.log('=====================================');
      
      // Enviar la solicitud al backend
      this.apiService.createAdelanto(datosAdelanto).subscribe({
        next: (response) => {
          console.log('Adelanto solicitado exitosamente:', response);
          // Mostrar mensaje de éxito y navegar de vuelta
          alert('¡Adelanto solicitado exitosamente!');
          this.router.navigate(['/tabs/tab2']);
        },
        error: (error) => {
          console.error('Error al solicitar adelanto:', error);
          // Mostrar mensaje de error
          alert('Error al solicitar el adelanto: ' + (error.message || 'Error desconocido'));
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/tabs/tab2']);
  }

  // Formatear moneda
  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0
    }).format(monto);
  }

  // Obtener mensaje de error para el monto solicitado
  getMontoSolicitadoError(): string {
    const control = this.adelantoForm.get('montoSolicitado');
    if (control?.errors) {
      if (control.errors['max']) {
        return `❌ Excedió el límite máximo para adelantar. El monto máximo permitido es ${this.formatearMoneda(this.montoMaximoSolicitable)} (${this.limitesAdelanto?.porcentaje_maximo}% del salario)`;
      }
      if (control.errors['min']) {
        return '❌ El monto debe ser mayor a 0';
      }
      if (control.errors['required']) {
        return '❌ El monto es requerido';
      }
    }
    return '';
  }
}
