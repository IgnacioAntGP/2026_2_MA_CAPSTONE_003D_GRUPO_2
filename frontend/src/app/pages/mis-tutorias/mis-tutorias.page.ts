import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { TicketService } from '../../services/ConsultaService';
import { MisTutoria } from '../../models/IMisTutorias';
import { AyudantiaService } from '../../services/AyudantiaService';

@Component({
  selector: 'app-mis-tutorias',
  templateUrl: './mis-tutorias.page.html',
  styleUrls: ['./mis-tutorias.page.scss'],
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
export class MisTutoriasPage implements OnInit {

  tutorias: MisTutoria[] = [];

  // Temporal hasta implementar login real
  idUsuarioActual = 1;

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    private ayudantiaService: AyudantiaService
  ) { }

  ngOnInit() {
    this.cargarMisTutorias();
  }

  cargarMisTutorias() {

    this.ticketService.obtenerMisTutorias(this.idUsuarioActual).subscribe({
      next: (data) => {

        this.tutorias = data;

        this.cdr.markForCheck();

        console.log('Mis tutorías:', data);
      },
      error: (error) => {
        console.error('Error al cargar mis tutorías:', error);
      }
    });
  }

  aceptarAyudante(idSolicitud: number) {
    this.ayudantiaService.confirmarAyudante(idSolicitud).subscribe({
      next: () => {
        // Actualizamos localmente el estado a ACEPTADA para renderizar el botón de contacto
        const item = this.tutorias.find(t => t.id_solicitud === idSolicitud);
        if (item) {
          item.estado_solicitud = 'ACEPTADA';
          this.cdr.markForCheck();
        }
      },
      error: (err) => console.error('Error al aceptar ayudante:', err)
    });
  }

  rechazarAyudante(idSolicitud: number) {
    this.ayudantiaService.rechazarAyudante(idSolicitud).subscribe({
      next: () => {
        // Regresa a PENDIENTE y retira al ayudante
        const item = this.tutorias.find(t => t.id_solicitud === idSolicitud);
        if (item) {
          item.estado_solicitud = 'PENDIENTE';
          item.ayudante = null;
          this.cdr.markForCheck();
        }
      },
      error: (err) => console.error('Error al rechazar ayudante:', err)
    });
  }

  contactoDirecto(tutoria: MisTutoria) {
    console.log('Contacto directo activado con el ayudante:', tutoria.ayudante);
  }
}