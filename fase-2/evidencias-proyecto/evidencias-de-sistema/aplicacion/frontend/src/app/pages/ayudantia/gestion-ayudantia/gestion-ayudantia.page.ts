import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBadge, IonText, IonIcon, IonButton } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { add, addOutline, checkmarkDoneOutline, eyeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-gestion-ayudantia',
  templateUrl: './gestion-ayudantia.page.html',
  styleUrls: ['./gestion-ayudantia.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonBadge, IonText, IonIcon, IonButton, CommonModule, FormsModule]
})
export class GestionAyudantiaPage implements OnInit {
 idAyudantia!: number;

  constructor(
    private route: ActivatedRoute 
  ) { 
        addIcons({
          add, addOutline, checkmarkDoneOutline, eyeOutline
        });
  }

  ngOnInit() {
    this.idAyudantia = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.idAyudantia) {
      this.cargarActividadesAyudantia(this.idAyudantia);
    }
  }

  cargarActividadesAyudantia(id: number){
    console.log("ID Ayudantia traido:", id)
  }

  onClick(){
    console.log("accion")
  }
}
