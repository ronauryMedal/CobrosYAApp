import { Component } from '@angular/core';
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
  IonList, 
  IonItem, 
  IonLabel, 
  IonBadge, 
  IonButtons, 
  IonButton, 
  IonIcon 
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
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
    IonList, 
    IonItem, 
    IonLabel, 
    IonBadge, 
    IonButtons, 
    IonButton, 
    IonIcon,
    ExploreContainerComponent
  ],
})
export class Tab2Page {
  constructor(private router: Router) {}

  nuevoAdelanto() {
    console.log('Solicitar nuevo adelanto');
    this.router.navigate(['/solicitar-adelanto']);
  }

  verDetalle(id: number) {
    console.log('Ver detalle del adelanto:', id);
    // Aquí se implementaría la navegación al detalle del adelanto
  }
}
