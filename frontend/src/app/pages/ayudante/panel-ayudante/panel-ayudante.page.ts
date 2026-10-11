import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AyudantiaService } from '../../../core/services/AyudantiaService';

import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonNote,
  IonItem,
  IonAvatar,
  IonLabel,
  IonBadge,
  IonButton,
  IonList,
} from '@ionic/angular';

import {
  PublicacionComunidad
} from '../../../models/ISolicitudAyudantia';

@Component({
  selector: 'app-panel-ayudante',
  templateUrl: './panel-ayudante.page.html',
  styleUrls: ['./panel-ayudante.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonNote,
    IonItem,
    IonAvatar,
    IonBadge,
    IonList,
  ],
})
export class PanelAyudantePage implements OnInit {

  // Usuario autenticado (Fernanda id_usuario: 4)
  usuarioAyudante = {
    id_usuario: 4,
    nombre: 'Fernanda Morales',
    email: 'f.morales@duocuc.cl',
    imagen: '../assets/icon/favicon.png',
  };

  metricas = {
    pendientes: 0,
    activas: 0,
    evaluacion: '4.9',
  };

  publicacionesComunidad: PublicacionComunidad[] = [];

  constructor (
    private ayudantiaService: 
    AyudantiaService, private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarMetaData();
  }

  // Hook del ciclo de vida de Ionic:
  // Se ejecuta cada vez que la página se vuelve a mostrar
  ionViewWillEnter() {
    this.cargarMetaData();
  }

  // Carga inicial desde PostgreSQL / Node
  cargarMetaData() {
    this.ayudantiaService.obtenerPublicacionesComunidad().subscribe({
      next: (data) => {
        console.log('Payload recibido en panel-ayudante:', data);
        this.publicacionesComunidad = data.slice(0, 3); // Mostrar solo las primeras 3 publicaciones
        this.cdr.markForCheck();
      },
      error: (e) => console.error('Error comunidad:', e),
    });

    this.ayudantiaService.obtenerSolicitudesDisponibles().subscribe({
      next: (data) => {
        this.metricas.pendientes = data.length;
        this.cdr.markForCheck();
      },
      error: (e) => console.error('Error disponibles:', e)
    });

    this.ayudantiaService.obtenerMisAyudantias(this.usuarioAyudante.id_usuario).subscribe({
      next: (data) => {
        this.metricas.activas = data.length;
        this.cdr.markForCheck();
      },
      error: (e) => console.error('Error mis ayudantías:', e)
    });
  }
}
