import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-evaluar-tutoria',
  templateUrl: './evaluar-tutoria.page.html',
  styleUrls: ['./evaluar-tutoria.page.scss'],
  standalone:true,
  imports: [IonContent, CommonModule, FormsModule, RouterLink]
})
export class EvaluarTutoriaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
