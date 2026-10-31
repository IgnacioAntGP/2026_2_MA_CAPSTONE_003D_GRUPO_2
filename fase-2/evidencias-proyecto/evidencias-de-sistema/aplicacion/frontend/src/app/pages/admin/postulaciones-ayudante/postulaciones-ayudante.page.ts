import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonBadge,
  IonNote,
  IonSpinner
} from '@ionic/angular';

import {
  interval,
  Subscription
} from 'rxjs';

import { TicketService } from '../../../core/services/ConsultaService';
import { PostulacionAyudante } from '../../../models/IPostulacionAyudante';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';


@Component({
  selector: 'app-postulaciones-ayudante',
  templateUrl: './postulaciones-ayudante.page.html',
  styleUrls: ['./postulaciones-ayudante.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonBadge,
    IonNote,
    IonSpinner,
    CommonModule,
    RouterLink,
    SideMenuComponent
  ]
})
export class PostulacionesAyudantePage implements OnInit, OnDestroy {

  postulacionesPendientes: PostulacionAyudante[] = [];

  cargando: boolean = false;

  private refrescoSubscription?: Subscription;


  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {

    // Primera carga
    this.cargarPostulacionesPendientes();

    // Refresco automático cada 5 segundos
    this.refrescoSubscription =
      interval(5000).subscribe(() => {

        this.cargarPostulacionesPendientes(false);

      });

  }


  cargarPostulacionesPendientes(
    mostrarCarga: boolean = true
  ) {

    if (mostrarCarga) {
      this.cargando = true;
    }

    this.ticketService
      .obtenerPostulacionesPendientes()
      .subscribe({

        next: (data) => {

          this.postulacionesPendientes = [...data];

          this.cargando = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al cargar postulaciones pendientes:',
            error
          );

          this.cargando = false;

          this.cdr.detectChanges();

        }

      });

  }


  aprobarPostulacion(
    postulacion: PostulacionAyudante
  ) {

    this.ticketService
      .aprobarPostulacionAyudante(
        postulacion.id_solicitud
      )
      .subscribe({

        next: () => {

          console.log(
            'Postulación aprobada:',
            postulacion.id_solicitud
          );

          this.postulacionesPendientes =
            this.postulacionesPendientes.filter(
              p => p.id_solicitud !== postulacion.id_solicitud
            );

          this.cdr.detectChanges();

          this.cargarPostulacionesPendientes(false);

        },

        error: (error) => {

          console.error(
            'Error al aprobar postulación:',
            error
          );

        }

      });

  }


  rechazarPostulacion(
    postulacion: PostulacionAyudante
  ) {

    this.ticketService
      .rechazarPostulacionAyudante(
        postulacion.id_solicitud
      )
      .subscribe({

        next: () => {

          console.log(
            'Postulación rechazada:',
            postulacion.id_solicitud
          );

          this.postulacionesPendientes =
            this.postulacionesPendientes.filter(
              p => p.id_solicitud !== postulacion.id_solicitud
            );

          this.cdr.detectChanges();

          this.cargarPostulacionesPendientes(false);

        },

        error: (error) => {

          console.error(
            'Error al rechazar postulación:',
            error
          );

        }

      });

  }


  ngOnDestroy() {

    this.refrescoSubscription?.unsubscribe();

  }

}