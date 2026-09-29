import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solicitar-tutoria',
  templateUrl: './solicitar-tutoria.page.html',
  styleUrls: ['./solicitar-tutoria.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule ,RouterLink]
})
export class SolicitarTutoriaPage implements OnInit {


  solicitudEnviada = false;
  
  constructor() { }

  ngOnInit() {
  }

  solicitarTutoria() {
    this.solicitudEnviada = true;
  }

}
