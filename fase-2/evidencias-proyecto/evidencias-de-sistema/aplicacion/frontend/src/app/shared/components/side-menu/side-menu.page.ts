import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonButton
} from '@ionic/angular';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonButton
  ]
})
export class SideMenuComponent {

  menuAbierto: boolean = false;


  alternarMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }


  cerrarMenu(): void {
    this.menuAbierto = false;
  }

}