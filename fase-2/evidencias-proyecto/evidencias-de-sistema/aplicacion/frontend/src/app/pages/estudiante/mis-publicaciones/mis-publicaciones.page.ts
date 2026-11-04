import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonNote
} from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { TicketService } from '../../../core/services/ConsultaService';
import { Consulta } from '../../../models/IConsulta';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

@Component({
  selector: 'app-mis-publicaciones',
  templateUrl: './mis-publicaciones.page.html',
  styleUrls: ['./mis-publicaciones.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonNote,
    CommonModule,
    RouterLink,
    SideMenuComponent
  ]
})
export class MisPublicacionesPage implements OnInit {

  publicaciones: Consulta[] = [];

  // Temporal hasta implementar login real
  idUsuarioActual = 1;

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarMisPublicaciones();
  }

  ionViewWillEnter() {
    this.cargarMisPublicaciones();
  }

  cargarMisPublicaciones() {
    this.ticketService.obtenerMisConsultas(this.idUsuarioActual).subscribe({
      next: (data) => {
        this.publicaciones = data;

        this.cdr.markForCheck();

        console.log('Mis publicaciones:', data);
      },
      error: (error) => {
        console.error('Error al cargar mis publicaciones:', error);
      }
    });
  }

}