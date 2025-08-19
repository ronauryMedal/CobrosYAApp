import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    ReactiveFormsModule
  ],
})
export class SolicitarAdelantoPage implements OnInit {
  adelantoForm!: FormGroup;
  interesPorcentaje = 7; // 7% por defecto

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    const fechaActual = new Date().toLocaleDateString('es-ES');
    
    this.adelantoForm = this.formBuilder.group({
      empleado: ['Laura Patricia Mendoza', Validators.required],
      interes: [this.interesPorcentaje, Validators.required],
      mesesPago: ['', Validators.required],
      montoMensual: [0, Validators.required],
      fechaSolicitud: [fechaActual, Validators.required],
      observacion: [''],
      montoSolicitado: [0, [Validators.required, Validators.min(1)]],
      montoTotal: [0, Validators.required],
      tipoPago: ['Mensual (7% interés)', Validators.required],
      estado: ['pendiente', Validators.required]
    });

    // Escuchar cambios en monto solicitado y meses para recalcular
    this.adelantoForm.get('montoSolicitado')?.valueChanges.subscribe(() => {
      this.calcularMontoTotal();
    });

    this.adelantoForm.get('mesesPago')?.valueChanges.subscribe(() => {
      this.calcularMontoTotal();
    });
  }

  calcularMontoTotal() {
    const montoSolicitado = this.adelantoForm.get('montoSolicitado')?.value || 0;
    const mesesPago = this.adelantoForm.get('mesesPago')?.value || 1;
    
    if (montoSolicitado > 0 && mesesPago > 0) {
      // Calcular interés
      const interes = (montoSolicitado * this.interesPorcentaje) / 100;
      const montoTotal = montoSolicitado + interes;
      const montoMensual = montoTotal / mesesPago;

      this.adelantoForm.patchValue({
        montoTotal: montoTotal.toFixed(2),
        montoMensual: montoMensual.toFixed(2),
        interes: this.interesPorcentaje
      });
    }
  }

  solicitarAdelanto() {
    if (this.adelantoForm.valid) {
      const datosAdelanto = this.adelantoForm.value;
      console.log('Solicitando adelanto:', datosAdelanto);
      
      // Aquí se implementaría la llamada a la API
      // this.apiService.createAdelanto(datosAdelanto).subscribe(...)
      
      // Por ahora solo navegamos de vuelta
      this.router.navigate(['/tabs/tab2']);
    }
  }

  cancelar() {
    this.router.navigate(['/tabs/tab2']);
  }
}
