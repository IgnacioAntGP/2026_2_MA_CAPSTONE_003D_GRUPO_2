import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonBadge,
  IonNote
} from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.page.html',
  styleUrls: ['./evaluaciones.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonBadge,
    IonNote,
    CommonModule,
    RouterLink,
    SideMenuComponent
  ]
})
export class EvaluacionesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}