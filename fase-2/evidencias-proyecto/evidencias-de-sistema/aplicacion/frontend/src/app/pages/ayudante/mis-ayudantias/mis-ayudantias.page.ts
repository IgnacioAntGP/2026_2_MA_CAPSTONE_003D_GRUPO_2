import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AyudantiaService } from '../../../core/services/AyudantiaService';
import { SolicitudAyudantia } from '../../../models/ISolicitudAyudantia';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonModal,
  IonButton
} from '@ionic/angular';

@Component({
  selector: 'app-mis-ayudantias',
  templateUrl: './mis-ayudantias.page.html',
  styleUrls: ['./mis-ayudantias.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    SideMenuComponent
  ],
})
export class MisAyudantiasPage implements OnInit {
  idUsuarioAyudante = 4;
  misAyudantias: SolicitudAyudantia[] = [];

  isModalSesionOpen: boolean = false;
  ayudantiaEnSesion: SolicitudAyudantia | null = null;

  constructor (
    private ayudantiaService: AyudantiaService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarMisAyudantias();
  }

  ionViewWillEnter() {
    this.cargarMisAyudantias();
  }

  cargarMisAyudantias() {
    this.ayudantiaService
      .obtenerMisAyudantias(this.idUsuarioAyudante)
      .subscribe({
        next: (data) => {
          this.misAyudantias = data;
          this.cdr.markForCheck();
        },
        error: (e) => console.error('Error mis ayudantias:', e),
      });
  }

  abrirVentanaSesion(ayudantia: SolicitudAyudantia) {
    this.ayudantiaEnSesion = ayudantia;
    this.isModalSesionOpen = true;
  }

  cerrarVentanaSesion() {
    this.isModalSesionOpen = false;
  }

  cerrarCaso(estadoFinal: 'resuelta' | 'escalada') {
    if (!this.ayudantiaEnSesion) return;

    if (estadoFinal === 'resuelta') {
      this.ayudantiaService
        .resolverSolicitud(this.ayudantiaEnSesion.id_solicitud)
        .subscribe({
          next: () => {
            if (this.ayudantiaEnSesion) {
              this.ayudantiaEnSesion.estado = 'RESUELTA';
            }
            this.cerrarVentanaSesion();
            this.cargarMisAyudantias();
          },
          error: (e) => console.error('Error al resolver la ayudantía:', e),
        });
    } else {
      this.cerrarVentanaSesion();
    }
  }
}
