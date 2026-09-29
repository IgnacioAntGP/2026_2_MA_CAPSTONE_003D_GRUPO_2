import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-solicitar-ayudante',
  templateUrl: './solicitar-ayudante.page.html',
  styleUrls: ['./solicitar-ayudante.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink]
})
export class SolicitarAyudantePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
