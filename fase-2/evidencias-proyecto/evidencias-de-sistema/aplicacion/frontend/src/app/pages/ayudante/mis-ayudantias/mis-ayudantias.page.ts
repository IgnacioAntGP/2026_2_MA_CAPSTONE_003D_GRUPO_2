import type {
  AyudantiaResumen,
  EstadoAyudantia
} from './../../../models/IAyudantia';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { AyudantiaService } from '../../../core/services/AyudantiaService';
import type {
  EstadoSolicitudAyudantia,
  SolicitudAyudantia
} from '../../../models/ISolicitudAyudantia';
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
import { LoginService } from '../../../core/services/LoginService';

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
  idUsuarioAyudante: number | null = null;

  misAyudantias: SolicitudAyudantia[] = [];

  isModalSesionOpen: boolean = false;

  solicitudAyudantia: SolicitudAyudantia | null = null;
  ayudantiaEnSesion: AyudantiaResumen | null = null;
  errorCaso = '';

  constructor(
    private ayudantiaService: AyudantiaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    this.cargarMisAyudantias();
  }

  ionViewWillEnter() {
    this.cargarMisAyudantias();
  }

  private obtenerIdSession(): number | null {
    const idUsuario = this.loginService.obtenerIdUsuario();

    if(!idUsuario){
      return null;
    }

    return idUsuario;
  }

  cargarMisAyudantias() {
    const idUsuario = this.obtenerIdSession();

    if(!idUsuario){
      this.misAyudantias =[];
      this.cdr.markForCheck();
      return console.warn("No se pudo obtener el ID del usuario de la sesion.")
    }

    this.ayudantiaService.obtenerMisAyudantias(idUsuario).subscribe({
      next: (data) => {
        this.misAyudantias = data;
        this.cdr.markForCheck();
      },

      error: (e) => console.error('Error mis ayudantias:', e),
    });
  }

  estadoVisible(solicitud: SolicitudAyudantia): EstadoSolicitudAyudantia | EstadoAyudantia {
    if (solicitud.ayudantia?.estado === 'ESCALADA') {
      return 'ESCALADA';
    }

    if (
      solicitud.estado === 'RESUELTA' ||
      solicitud.ayudantia?.estado === 'FINALIZADA'
    ) {
      return 'FINALIZADA';
    }

    return solicitud.estado;
  }

  abrirVentanaSesion(solicitud: SolicitudAyudantia) {
    console.log('Solicitud al abrir modal:', JSON.stringify(solicitud, null, 2));
    this.solicitudAyudantia = solicitud;
    this.errorCaso = '';
    this.ayudantiaEnSesion = solicitud.ayudantia ?? null;
    this.isModalSesionOpen = true;
  }

  cerrarVentanaSesion() {
    this.isModalSesionOpen = false;
    this.solicitudAyudantia = null;
    this.ayudantiaEnSesion = null;
    this.errorCaso = '';
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

  cerrarCaso(estadoFinal: 'finalizada' | 'escalada') {
    if (!this.ayudantiaEnSesion) {
      return;
    }

    this.errorCaso = '';
    const solicitud = estadoFinal === 'finalizada'
      ? this.ayudantiaService.resolverSolicitud(this.ayudantiaEnSesion.id_solicitud)
      : this.ayudantiaService.escalarSolicitud(this.ayudantiaEnSesion.id_solicitud);

    solicitud.subscribe({
      next: () => {
        this.cerrarVentanaSesion();
        this.cargarMisAyudantias();
      },
      error: (error: unknown) => {
        console.error('Error al actualizar el estado de la ayudantía:', error);
        this.errorCaso = estadoFinal === 'finalizada'
          ? 'No fue posible finalizar la ayudantía.'
          : 'No fue posible escalar la ayudantía a un docente.';
        this.cdr.markForCheck();
      }
    });
  }
}
