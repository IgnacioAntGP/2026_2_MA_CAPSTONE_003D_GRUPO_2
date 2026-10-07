import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

import { TicketService } from '../../services/ConsultaService';

@Component({
  selector: 'app-solicitar-ayudante',
  templateUrl: './solicitar-ayudante.page.html',
  styleUrls: ['./solicitar-ayudante.page.scss'],
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
export class SolicitarAyudantePage {

  motivo = '';
  experiencia = '';

  // Temporal hasta implementar autenticación real
  idUsuarioActual = 1;

  solicitudEnviada = false;

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ionViewWillEnter() {

    this.motivo = '';
    this.experiencia = '';
    this.solicitudEnviada = false;

    this.cdr.markForCheck();

  }

  enviarSolicitud() {

    const motivo = this.motivo.trim();
    const experiencia = this.experiencia.trim();

    if (!motivo || !experiencia) {
      console.warn(
        'Motivo y experiencia son obligatorios.'
      );

      return;
    }

    this.ticketService
      .solicitarSerAyudante(
        this.idUsuarioActual,
        motivo,
        experiencia
      )
      .subscribe({

      next: (respuesta) => {

        console.log(
          'Solicitud de ayudante enviada:',
          respuesta
        );

        this.solicitudEnviada = true;

        this.motivo = '';
        this.experiencia = '';

        this.cdr.markForCheck();

      },
      

        error: (error) => {

          console.error(
            'Error al enviar solicitud de ayudante:',
            error
          );

        }

      });

  }

}