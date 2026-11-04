import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonTextarea,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip
} from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

@Component({
  selector: 'app-evaluar-tutoria',
  templateUrl: './evaluar-tutoria.page.html',
  styleUrls: ['./evaluar-tutoria.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonTextarea,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    CommonModule,
    FormsModule,
    RouterLink,
    SideMenuComponent
  ]
})
export class EvaluarTutoriaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}