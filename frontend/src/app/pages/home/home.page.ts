import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {} from '../../models/IUser';
import { TicketService } from '../../services/TicketService';
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
  IonSelectOption,
  IonModal,
  IonSelect,
  IonInput,
  IonTextarea
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
    IonModal,
    IonSelect,
    IonInput,
    IonTextarea,
    IonSelectOption
  ],
})
export class HomePage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  
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

  nuevoTicket = {
    id_alumno: 'usr-01',
    id_asignatura: 1,
    modalidad: 'ayudantia_directa' as const,
    titulo_duda: '',
    descripcion_duda: ''
  };

  constructor(private router: Router, private ticketService: TicketService) {}

  ngOnInit() {}
  
  isModalOpen: boolean = false; // <-- Controla si el modal está visible

  abrirModal() {
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  guardarTicket() {
    this.ticketService.crearTicket(this.nuevoTicket).subscribe({
      next: (res) => {
        this.modal.dismiss(res, 'confirm');
      },
      error: (err) => {
      console.warn('Backend apagado. Simulando respuesta exitosa en memoria...');
      // Generamos el ticket simulado localmente:
      const ticketSimulado = {
        id: String(Date.now()),
        estudiante: this.usuarioActual.nombre,
        asignatura: this.nuevoTicket.id_asignatura === 1 ? 'Programación Web' : 'Bases de Datos',
        duda: this.nuevoTicket.titulo_duda
      };
      // Cerramos el modal confirmando la creación
      this.modal.dismiss(ticketSimulado, 'confirm');
    }
    });
  }

  onModalDismiss(event: any) {
    this.isModalOpen = false;
    // 1. Verificamos que el modal se haya cerrado con éxito y contenga la carga de datos
    if (event.detail.role === 'confirm' && event.detail.data) {
      const data = event.detail.data;

      // 2. Mapeamos la respuesta del backend/modal al formato de tu lista actual
      const nuevoTicket = {
        id: data.id_ticket || data.id || String(Date.now()),
        estudiante: this.usuarioActual.nombre, // O data.estudiante_nombre si lo devuelve la API
        asignatura: data.asignatura_nombre || (data.id_asignatura === 1 ? 'Programación Web' : 'Bases de Datos'),
        duda: data.titulo_duda || data.duda
      };
      
      // 3. Inyección reactiva para *ngFor:
      // Creamos un nuevo arreglo colocando el elemento nuevo en la primera posición
      this.solicitudesPendientes = [nuevoTicket, ...this.solicitudesPendientes];
    }
  }

  cambiarVista(event: any) {
    this.vistaActiva = event.detail.value;
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

}