import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-publicaciones',
  templateUrl: './mis-publicaciones.page.html',
  styleUrls: ['./mis-publicaciones.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink]
})
export class MisPublicacionesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
