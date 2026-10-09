import { AyudantiaService } from '../../../services/AyudantiaService';
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
  IonModal,
  IonIcon
} from '@ionic/angular';
import { Users } from '../../../models/IUser';
import { PublicacionComunidad, SolicitudAyudantia } from '../../../models/ISolicitudAyudantia';

export interface SolicitudTutoria {
  id: string;
  estudiante: string;
  asignatura: string;
  duda: string;
  descripcion: string;
  estado: 'abierta' | 'en_proceso' | 'resuelta' | 'escalada';
}

@Component({
  selector: 'app-panel-ayudante',
  templateUrl: './panel-ayudante.page.html',
  styleUrls: ['./panel-ayudante.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonModal,
    IonIcon,
    RouterLink
  ]
})
export class PanelAyudantePage implements OnInit {
  pestanaActiva: 'comunidad' | 'solicitudes' | 'mis-ayudantias' = 'comunidad';
  isModalSesionOpen: boolean = false;
  ayudantiaEnSesion: SolicitudAyudantia | null = null;

  // Usuario autenticado ( Fernanda id_usuario: 4)
  usuarioAyudante = {
    id_usuario: 4,
    nombre: 'Fernanda Morales',
    email: 'f.morales@duocuc.cl',
    imagen: '../assets/icon/favicon.png'
  };

  publicacionesComunidad: PublicacionComunidad[] = [];
  solicitudesDisponibles: SolicitudAyudantia[] = [];
  misAyudantias: SolicitudAyudantia[] = [];

  constructor(private router: Router, private ayudantiaService: AyudantiaService) {}

  ngOnInit() {
    this.cargarMetaData();
  }

  // Hook del ciclo de vida de Ionic: Se ejecuta cada vez que la página se vuelve a mostrar
  ionViewWillEnter() {
    this.cargarMetaData();
  }

  cargarMetaData() {
    // Carga inicial desde PostgreSQL / Node
    this.ayudantiaService.obtenerPublicacionesComunidad().subscribe({
      next: (data) => (this.publicacionesComunidad = data),
      error: (e) => console.error('Error comunidad:', e)
    });

    this.ayudantiaService.obtenerSolicitudesDisponibles().subscribe({
      next: (data) => (this.solicitudesDisponibles = data),
      error: (e) => console.error('Error disponibles:', e)
    });

    this.ayudantiaService.obtenerMisAyudantias(this.usuarioAyudante.id_usuario).subscribe({
      next: (data) => (this.misAyudantias = data),
      error: (e) => console.error('Error mis ayudantias:', e)
    });
  }

  cambiarPestana(event: any) {
    this.pestanaActiva = event.detail.value;
  }

  irAListaCompleta() {
    this.pestanaActiva = 'solicitudes';
  }

  // Objetivo: Botón para mandar solicitud de aceptación de ayudantía
  aceptarSolicitud(solicitud: SolicitudAyudantia) {
    this.ayudantiaService.tomarSolicitud(solicitud.id_solicitud, this.usuarioAyudante.id_usuario).subscribe({
      next: () => {
        // Remover de pendientes
        this.solicitudesDisponibles = this.solicitudesDisponibles.filter(s => s.id_solicitud !== solicitud.id_solicitud);

        // Pasar a Activas o EN PROCESO y a MIS AYUDANTIAS
        solicitud.estado = 'EN_PROCESO';
        this.misAyudantias.unshift(solicitud);
        this.abrirVentanaSesion(solicitud);
      },
      error: (e) => console.error('Error al aceptar solicitud:', e)
    });
  }

  // Objetivo: Mostrar la ventana de la ayudantía 1:1
  abrirVentanaSesion(ayudantia: SolicitudAyudantia) {
    this.ayudantiaEnSesion = ayudantia;
    this.isModalSesionOpen = true;
  }

  cerrarVentanaSesion() {
    this.isModalSesionOpen = false;
  }

  // Integración: Cerrar caso
  cerrarCaso(estadoFinal: 'resuelta' | 'escalada') {
    if (!this.ayudantiaEnSesion) return;

    if (estadoFinal === 'resuelta') {
      this.ayudantiaService.resolverSolicitud(this.ayudantiaEnSesion.id_solicitud).subscribe({
        next: () => {
          if (this.ayudantiaEnSesion) this.ayudantiaEnSesion.estado = 'RESUELTA';
          this.cerrarVentanaSesion();
        },
        error: (e) => console.error('Error al resolver la ayudantía:', e)
      });
    } else {
      this.cerrarVentanaSesion();
    }
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}