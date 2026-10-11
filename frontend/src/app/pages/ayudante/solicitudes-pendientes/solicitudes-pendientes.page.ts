import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AyudantiaService } from '../../../services/AyudantiaService';
import { SolicitudAyudantia } from '../../../models/ISolicitudAyudantia';

import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonNote,
  IonBadge,
  IonButton
} from '@ionic/angular';

@Component({
  selector: 'app-solicitudes-pendientes',
  templateUrl: './solicitudes-pendientes.page.html',
  styleUrls: ['./solicitudes-pendientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonNote,
    IonBadge,
    IonButton
  ],
})

export class SolicitudesPendientesPage implements OnInit {
  usuarioAyudante = {
    id_usuario: 4
  };

  solicitudesDisponibles: SolicitudAyudantia[] = [];

  constructor(
    private ayudantiaService: AyudantiaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarSolicitudes();
  }

  ionViewWillEnter() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.ayudantiaService.obtenerSolicitudesDisponibles().subscribe({
      next: (data) => {
        console.log('Payload recibido en solicitudes-pendientes:', data);
        this.solicitudesDisponibles = data;
        this.cdr.markForCheck();
      },
      error: (e) => console.error('Error disponibles:', e),
    });
  }

  aceptarSolicitud(solicitud: SolicitudAyudantia) {
    this.ayudantiaService
      .tomarSolicitud(solicitud.id_solicitud, this.usuarioAyudante.id_usuario)
      .subscribe({
        next: () => {
          this.solicitudesDisponibles = this.solicitudesDisponibles.filter(
            (s) => s.id_solicitud !== solicitud.id_solicitud,
          );
          this.router.navigate(['/ayudante/tabs/mis-ayudantias']);
        },
        error: (e) => console.error('Error al aceptar solicitud:', e),
      });
  }
}
