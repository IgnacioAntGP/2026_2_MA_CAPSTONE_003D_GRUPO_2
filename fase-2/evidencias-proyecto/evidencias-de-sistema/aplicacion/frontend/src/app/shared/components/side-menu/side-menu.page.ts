import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonButton,
  IonIcon
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  menuOutline,
  closeOutline,
  documentTextOutline,
  schoolOutline,
  starOutline,
  personOutline,
  ribbonOutline,
  peopleOutline,
  settingsOutline,
  logOutOutline
} from 'ionicons/icons';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonButton,
    IonIcon
  ]
})
export class SideMenuComponent {

  menuAbierto: boolean = false;


  constructor() {

    addIcons({
      menuOutline,
      closeOutline,
      documentTextOutline,
      schoolOutline,
      starOutline,
      personOutline,
      ribbonOutline,
      peopleOutline,
      settingsOutline,
      logOutOutline
    });

  }


  alternarMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }


  cerrarMenu(): void {
    this.menuAbierto = false;
  }

}