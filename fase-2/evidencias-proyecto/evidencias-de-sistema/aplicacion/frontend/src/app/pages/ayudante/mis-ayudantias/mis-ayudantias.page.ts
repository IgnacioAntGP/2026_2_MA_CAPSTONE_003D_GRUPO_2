import { Ayudantia } from './../../../models/IAyudantia';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

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
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonBadge,
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
    IonCard,
    IonCardContent,
    IonChip,
    IonBadge,
    SideMenuComponent,
  ],
})
export class MisAyudantiasPage implements OnInit {
  idUsuarioAyudante = 4;

  misAyudantias: SolicitudAyudantia[] = [];

  isModalSesionOpen: boolean = false;

  solicitudAyudantia: SolicitudAyudantia | null = null;
  ayudantiaEnSesion: Ayudantia | null = null;

  constructor(
    private ayudantiaService: AyudantiaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarMisAyudantias();
  }

  ionViewWillEnter() {
    this.cargarMisAyudantias();
  }

  cargarMisAyudantias() {
    this.ayudantiaService.obtenerMisAyudantias(this.idUsuarioAyudante).subscribe({
      next: (data) => {
        this.misAyudantias = data;

        this.cdr.markForCheck();
      },

      error: (e) => console.error('Error mis ayudantias:', e),
    });
  }

  abrirVentanaSesion(solicitud: SolicitudAyudantia) {
    console.log('Solicitud al abrir modal:', JSON.stringify(solicitud, null, 2));
    this.solicitudAyudantia = solicitud;

    const raw = solicitud as any;
    const ayudantiaData = Array.isArray(raw?.ayudantia)
      ? raw.ayudantia[0]
      : raw?.ayudantia;

    this.ayudantiaEnSesion = ayudantiaData ?? (raw?.id_ayudantia ? { id_ayudantia: raw.id_ayudantia } : null);
    this.isModalSesionOpen = true;
  }

  cerrarVentanaSesion() {
    this.isModalSesionOpen = false;
    this.solicitudAyudantia = null;
    this.ayudantiaEnSesion = null;
  }

  @ViewChild('modalAyudantia') modalAyudantia!: IonModal;

  async irAGestionActividades(idAyudantia: number | undefined) {
    console.log('Intentando navegar a gestión con idAyudantia:', idAyudantia);
    if (!idAyudantia) {
      console.warn('No llegó idAyudantia (ayudantiaEnSesion es null o sin id_ayudantia)');
      return;
    }

    const targetId = idAyudantia;

    if (this.modalAyudantia) {
      await this.modalAyudantia.dismiss();
    }

    this.isModalSesionOpen = false;
    this.solicitudAyudantia = null;
    this.ayudantiaEnSesion = null;

    setTimeout(() => {
      this.router.navigate(['/gestion-ayudantia', targetId]).then((navigated) => {
        console.log('Resultado router.navigate:', navigated);
      });
    }, 50);
  }

  cerrarCaso(estadoFinal: 'resuelta' | 'escalada') {
    if (!this.ayudantiaEnSesion) {
      return;
    }

    if (estadoFinal === 'resuelta') {
      this.ayudantiaService.resolverSolicitud(this.ayudantiaEnSesion.id_solicitud).subscribe({
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
