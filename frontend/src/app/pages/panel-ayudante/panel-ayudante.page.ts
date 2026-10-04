import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { Users } from '../../models/IUser';

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
    IonIcon
  ]
})
export class PanelAyudantePage implements OnInit {
  // Pestaña activa del menú principal: 'comunidad' | 'solicitudes' | 'mis-ayudantias'
  pestanaActiva: 'comunidad' | 'solicitudes' | 'mis-ayudantias' = 'solicitudes';

  // Modal para la sesión 1:1
  isModalSesionOpen: boolean = false;
  ayudantiaEnSesion: SolicitudTutoria | null = null;

  // 1. Datos generales del perfil del Ayudante
  usuarioAyudante: Users = {
    id: 'usr-01',
    rut: '12.345.678-9',
    nombre: 'Ignacio González',
    username: 'igonzalez',
    password: '***',
    email: 'igonzalez@duocuc.cl',
    imagen: '../../../assets/icon/favicon.png',
    isactive: true
  };

  // 2. Duda y discusiones del foro/comunidad
  publicacionesComunidad = [
    {
      id: 'com-1',
      autor: 'Felipe Morales',
      asignatura: 'Arquitectura de Software',
      titulo: '¿Cómo implementar Clean Architecture en NestJS?',
      respuestasCount: 4
    },
    {
      id: 'com-2',
      autor: 'Valentina Soto',
      asignatura: 'Bases de Datos',
      titulo: 'Optimización de índices compuestos en PostgreSQL',
      respuestasCount: 2
    }
  ];

  // 3. Lista completa de solicitudes de ayudantías pedidas por estudiantes
  solicitudesDisponibles: SolicitudTutoria[] = [
    {
      id: 'sol-101',
      estudiante: 'Matías Silva',
      asignatura: 'Programación Web',
      duda: 'Duda con ruteo en Angular Standalone',
      descripcion: 'No me cargan las rutas secundarias del router outlet con componentes independientes.',
      estado: 'abierta'
    },
    {
      id: 'sol-102',
      estudiante: 'Camila Rojas',
      asignatura: 'Bases de Datos',
      duda: 'Problemas con subconsultas correlacionadas',
      descripcion: 'Al hacer el SELECT anidado me arroja error de tipos en la cláusula WHERE.',
      estado: 'abierta'
    }
  ];

  // 4. Mis Ayudantías (Aceptadas / Asignadas)
  misAyudantias: SolicitudTutoria[] = [
    {
      id: 'sol-99',
      estudiante: 'Andrés Castro',
      asignatura: 'Programación Web',
      duda: 'Consumo de endpoints con provideHttpClient',
      descripcion: 'La suscripción devuelve undefined al momento de renderizar en el template.',
      estado: 'en_proceso'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  cambiarPestana(event: any) {
    this.pestanaActiva = event.detail.value;
  }

  // Objetivo: Flujo de redirección hacia la lista completa de solicitudes
  irAListaCompleta() {
    this.pestanaActiva = 'solicitudes';
  }

  // Objetivo: Botón para mandar solicitud de aceptación de ayudantía
  aceptarSolicitud(solicitud: SolicitudTutoria) {
    solicitud.estado = 'en_proceso';

    // Desaparece de la cola pública para evitar colisión de ayudantes
    this.solicitudesDisponibles = this.solicitudesDisponibles.filter(s => s.id !== solicitud.id);

    // Se agrega a Mis Ayudantías de inmediato
    this.misAyudantias = [solicitud, ...this.misAyudantias];

    // Opcional: abre directamente la ventana de contacto 1:1
    this.abrirVentanaSesion(solicitud);
  }

  // Objetivo: Mostrar la ventana de la ayudantía 1:1
  abrirVentanaSesion(ayudantia: SolicitudTutoria) {
    this.ayudantiaEnSesion = ayudantia;
    this.isModalSesionOpen = true;
  }

  cerrarVentanaSesion() {
    this.isModalSesionOpen = false;
  }

  // Flujo de cierre o escalamiento dentro de la ventana 1:1
  cerrarCaso(estadoFinal: 'resuelta' | 'escalada') {
    if (!this.ayudantiaEnSesion) return;

    this.ayudantiaEnSesion.estado = estadoFinal;
    this.cerrarVentanaSesion();
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}