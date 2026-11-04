import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonContent,
  IonButton,
  IonTextarea,
  IonCard,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonItem
} from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { PostulacionService } from '../../../core/services/PostulacionService';
import { AsignaturaService } from '../../../core/services/AsignaturaService';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';
import { PostulacionAyudante } from '../../../models/IPostulacionAyudante';
import { IAsignatura } from '../../../models/IAsignatura';

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
    IonSelect,
    IonSelectOption,
    IonItem,
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
  enviandoSolicitud = false;

  asignaturasDisponibles: IAsignatura[] = [];
  idAsignaturaSeleccionada: number | null = null;

  // DTO de la Postulacion
  miPostulacionReciente: PostulacionAyudante | null = null;

  constructor(
    private postulacionService: PostulacionService,
    private asignaturaService: AsignaturaService,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef,
  ) { }

  ionViewWillEnter() {
    this.motivo = '';
    this.experiencia = '';
    this.idAsignaturaSeleccionada = null;
    this.solicitudEnviada = false;
    this.enviandoSolicitud = false;
    this.miPostulacionReciente = null;

    this.cargarAsignaturasDisponibles();
    this.cdr.markForCheck();
  }

  cargarAsignaturasDisponibles() {
    this.asignaturaService.obtenerAsignaturas().subscribe({
      next: (data) => {
        this.asignaturasDisponibles = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar catálogo de asignaturas', err)
    });
  }

  enviarSolicitud() {
    if (this.enviandoSolicitud) {
      return;
    }

    const motivo = this.motivo.trim();
    const experiencia = this.experiencia.trim();

    // Validamos solo los campos obligatorios principales (motivo y experiencia)
    if (!motivo || !experiencia) {
      console.warn('El motivo y la experiencia son obligatorios.');
      return;
    }

    this.enviandoSolicitud = true;

    this.postulacionService
      .postularComoAyudante(
        this.idUsuarioActual,
        this.idAsignaturaSeleccionada, // Puede ser null o number sin romper la validación
        motivo,
        experiencia
      )
      .subscribe({
        next: (respuesta: PostulacionAyudante) => {
          console.log('Solicitud de ayudante enviada:', respuesta);

          this.enviandoSolicitud = false;
          this.solicitudEnviada = true;

          this.miPostulacionReciente = respuesta;

          this.motivo = '';
          this.experiencia = '';
          this.idAsignaturaSeleccionada = null;

          this.cdr.detectChanges();
        },

        error: async (error) => {
          console.error('Error al enviar solicitud de ayudante:', error);

          this.enviandoSolicitud = false;
          this.cdr.detectChanges();

          if (error.status === 409) {
            const alert = await this.alertController.create({
              cssClass: 'entrepares-alert',
              header: 'Postulación pendiente',
              message: 'Ya tienes una postulación pendiente. Debes esperar a que sea revisada.',
              buttons: [
                {
                  text: 'Aceptar',
                  cssClass: 'entrepares-alert-button'
                }
              ]
            });

            await alert.present();
            return;
          }

          const alert = await this.alertController.create({
            cssClass: 'entrepares-alert',
            header: 'Error',
            message: 'No fue posible enviar la postulación. Intenta nuevamente.',
            buttons: [
              {
                text: 'Aceptar',
                cssClass: 'entrepares-alert-button'
              }
            ]
          });

          await alert.present();
        }
      });
  }
}