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
  IonSegment, 
  IonSegmentButton 
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
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
    IonSegment, 
    IonSegmentButton,
    ExploreContainerComponent,
    CommonModule
  ],
})
export class Tab3Page {
  selectedSegment: string = 'adelantos';

  constructor() {}

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
}
