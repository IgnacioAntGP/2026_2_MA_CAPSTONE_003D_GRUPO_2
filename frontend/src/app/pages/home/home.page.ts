import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonAvatar,
  IonBadge,
  IonList,
} from '@ionic/angular';
import { Users } from '../../models/IUser'; // Ajusta la ruta relativa a tu IUser.ts

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonAvatar,
    IonBadge,
    IonList,
  ],
})
export class HomePage implements OnInit {
  vistaActiva: 'estudiante' | 'ayudante' = 'estudiante';

  usuarioActual: Users = {
    id: '1',
    rut: '12.345.678-9',
    nombre: 'Ignacio González',
    username: 'igonzalez',
    password: '***',
    email: 'igonzalez@duocuc.cl',
    imagen: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    isactive: true,
  };

  solicitudesPendientes = [
    { id: '1', estudiante: 'Matías Silva', asignatura: 'Programación Web', duda: 'Duda con ruteo en Angular' },
    { id: '2', estudiante: 'Camila Rojas', asignatura: 'Bases de Datos', duda: 'Problemas con subconsultas SQL' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  cambiarVista(event: any) {
    this.vistaActiva = event.detail.value;
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}