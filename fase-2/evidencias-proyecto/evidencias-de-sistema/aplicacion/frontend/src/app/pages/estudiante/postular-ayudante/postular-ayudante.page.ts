import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonContent,
  IonButton,
  IonTextarea,
  IonCard,
  IonCardContent
} from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { TicketService } from '../../../core/services/ConsultaService';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

@Component({
  selector: 'app-postular-ayudante',
  templateUrl: './postular-ayudante.page.html',
  styleUrls: ['./postular-ayudante.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonTextarea,
    IonCard,
    IonCardContent,
    CommonModule,
    FormsModule,
    RouterLink,
    SideMenuComponent
  ]
})
export class PostularAyudantePage {

  motivo = '';
  experiencia = '';

  // Temporal hasta implementar autenticación real
  idUsuarioActual = 1;

  solicitudEnviada = false;

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController
  ) {}


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
      .postularComoAyudante(
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

        error: async (error) => {

          console.error(
            'Error al enviar solicitud de ayudante:',
            error
          );

          if (error.status === 409) {

            const alert = await this.alertController.create({
              header: 'Postulación pendiente',
              message:
                'Ya tienes una postulación pendiente. Debes esperar a que sea revisada antes de enviar una nueva.',
              buttons: ['Aceptar']
            });

            await alert.present();

            return;

          }

          const alert = await this.alertController.create({
            header: 'Error',
            message:
              'No fue posible enviar la postulación. Intenta nuevamente.',
            buttons: ['Aceptar']
          });

          await alert.present();

        }

      });

  }

}