import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { TicketService } from '../../../core/services/TicketService';
import { Consulta } from '../../../models/IConsulta';

@Component({
  selector: 'app-mis-publicaciones',
  templateUrl: './mis-publicaciones.page.html',
  styleUrls: ['./mis-publicaciones.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterLink
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