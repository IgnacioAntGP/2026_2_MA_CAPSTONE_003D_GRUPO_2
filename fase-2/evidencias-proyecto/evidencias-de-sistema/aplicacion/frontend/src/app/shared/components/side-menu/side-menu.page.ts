import {ChangeDetectorRef,Component,OnInit} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {IonButton,IonIcon} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  menuOutline,
  closeOutline,
  documentTextOutline,
  schoolOutline,
  starOutline,
  personOutline,
  ribbonOutline,
  peopleOutline,
  settingsOutline,
  logOutOutline,
  notificationsOutline
} from 'ionicons/icons';

import {finalize,take,timeout} from 'rxjs';

import {
  Notificacion,
  NotificacionService
} from '../../../core/services/NotificacionService';

import {
  AyudanteService,
  PerfilPublicoAyudante
} from '../../../core/services/AyudanteService';

import {
  AyudantiaService
} from '../../../core/services/AyudantiaService';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonButton,
    IonIcon
  ]
})
export class SideMenuComponent
  implements OnInit {

  menuAbierto = false;

  notificacionesAbiertas = false;

  cargandoNotificaciones = false;

  errorNotificaciones = false;
  
  perfilAyudanteAbierto = false;

  procesandoDecision = false;

  errorDecision = false;

  notificaciones: Notificacion[] = [];

  noLeidas = 0;


  // Perfil del ayudante seleccionado
  perfilAyudanteSeleccionado:
    PerfilPublicoAyudante | null = null;

  notificacionSeleccionada:
    Notificacion | null = null;

  cargandoPerfilAyudante = false;

  errorPerfilAyudante = false;


  // Temporal hasta conectar sesión real
  idUsuarioActual = 1;


  constructor(
    private notificacionService:
      NotificacionService,

    private ayudanteService:
      AyudanteService,

    private ayudantiaService:
      AyudantiaService,

    private cdr:
      ChangeDetectorRef
  ) {

    addIcons({
      menuOutline,
      closeOutline,
      documentTextOutline,
      schoolOutline,
      starOutline,
      personOutline,
      ribbonOutline,
      peopleOutline,
      settingsOutline,
      logOutOutline,
      notificationsOutline
    });

  }


  ngOnInit(): void {
    this.cargarNoLeidas();
  }


  cargarNoLeidas(): void {

    this.notificacionService
      .contarNoLeidas(
        this.idUsuarioActual
      )
      .pipe(
        take(1)
      )
      .subscribe({

        next: (respuesta) => {

          this.noLeidas =
            respuesta.no_leidas;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error al obtener notificaciones no leídas:',
            err
          );

          this.noLeidas = 0;

          this.cdr.detectChanges();

        }

      });

  }


  cargarNotificaciones(): void {

    this.cargandoNotificaciones = true;

    this.errorNotificaciones = false;

    this.cdr.detectChanges();


    this.notificacionService
      .obtenerPorUsuario(
        this.idUsuarioActual
      )
      .pipe(

        take(1),

        timeout(8000),

        finalize(() => {

          this.cargandoNotificaciones =
            false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (data) => {

          this.notificaciones =
            Array.isArray(data)
              ? data
              : [];

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error al obtener notificaciones:',
            err
          );

          this.notificaciones = [];

          this.errorNotificaciones = true;

          this.cdr.detectChanges();

        }

      });

  }


  seleccionarNotificacion(
    notificacion: Notificacion
  ): void {

    this.notificacionSeleccionada =
      notificacion;

    this.errorPerfilAyudante = false;


    // Si todavía no está leída,
    // primero la marcamos como leída
    if (!notificacion.leida) {

      this.notificacionService
        .marcarComoLeida(
          notificacion.id_notificacion,
          this.idUsuarioActual
        )
        .pipe(
          take(1)
        )
        .subscribe({

          next: () => {

            // Actualización visual inmediata
            notificacion.leida = true;

            this.noLeidas =
              Math.max(
                0,
                this.noLeidas - 1
              );

            this.cdr.detectChanges();


            // Luego cargar perfil
            this.cargarPerfilAyudante(
              notificacion
            );

          },

          error: (err) => {

            console.error(
              'Error al marcar la notificación como leída:',
              err
            );

          }

        });

      return;
    }


    // Si ya estaba leída,
    // cargamos directamente el perfil
    this.cargarPerfilAyudante(
      notificacion
    );

  }


  cargarPerfilAyudante(
    notificacion: Notificacion
  ): void {

    const idUsuarioOrigen =
      notificacion.id_usuario_origen;


    if (!idUsuarioOrigen) {

      console.error(
        'La notificación no tiene un usuario de origen asociado.'
      );

      this.errorPerfilAyudante = true;

      return;
    }


    this.cargandoPerfilAyudante = true;

    this.errorPerfilAyudante = false;

    this.perfilAyudanteSeleccionado = null;

    this.cdr.detectChanges();


    this.ayudanteService
      .obtenerPerfilPublico(
        idUsuarioOrigen
      )
      .pipe(

        take(1),

        timeout(8000),

        finalize(() => {

          this.cargandoPerfilAyudante =
            false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (perfil) => {

          this.perfilAyudanteSeleccionado =
            perfil;

          this.notificacionesAbiertas =
            false;

          this.perfilAyudanteAbierto =
            true;

          console.log(
            'Perfil público del ayudante:',
            perfil
          );

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error al obtener el perfil del ayudante:',
            err
          );

          this.errorPerfilAyudante = true;

          this.cdr.detectChanges();

        }

      });

  }


  alternarNotificaciones(): void {

    this.menuAbierto = false;

    this.notificacionesAbiertas =
      !this.notificacionesAbiertas;


    if (
      this.notificacionesAbiertas
    ) {

      this.cargarNotificaciones();

    }

  }


  cerrarNotificaciones(): void {

    this.notificacionesAbiertas =
      false;

  }


  alternarMenu(): void {

    this.notificacionesAbiertas =
      false;

    this.menuAbierto =
      !this.menuAbierto;

  }


  cerrarMenu(): void {

    this.menuAbierto = false;

  }


  obtenerAsignatura(
    notificacion: Notificacion
  ): string | null {

    return (
      notificacion
        .solicitud
        ?.consulta
        ?.asignatura
        ?.nombre
      ?? null
    );

  }


  obtenerTituloConsulta(
    notificacion: Notificacion
  ): string | null {

    return (
      notificacion
        .solicitud
        ?.consulta
        ?.titulo
      ?? null
    );

  }

  cerrarPerfilAyudante(): void {

    this.perfilAyudanteAbierto =
      false;

    this.perfilAyudanteSeleccionado =
      null;

  }

  aceptarAyudanteSeleccionado(): void {

    const idSolicitud =
      this.notificacionSeleccionada
        ?.id_solicitud;


    if (!idSolicitud) {
      return;
    }


    this.procesandoDecision = true;

    this.errorDecision = false;


    this.ayudantiaService
      .confirmarAyudante(
        idSolicitud
      )
      .pipe(
        take(1),
        finalize(() => {

          this.procesandoDecision =
            false;

          this.cdr.detectChanges();

        })
      )
      .subscribe({

        next: () => {

          if (
            this.notificacionSeleccionada
              ?.solicitud
          ) {

            this.notificacionSeleccionada
              .solicitud
              .estado = 'ACEPTADA';

          }


          this.perfilAyudanteAbierto =
            false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error al aceptar ayudante:',
            err
          );

          this.errorDecision = true;

          this.cdr.detectChanges();

        }

      });

  }


  rechazarAyudanteSeleccionado(): void {

    const idSolicitud =
      this.notificacionSeleccionada
        ?.id_solicitud;


    if (!idSolicitud) {
      return;
    }


    this.procesandoDecision = true;

    this.errorDecision = false;


    this.ayudantiaService
      .rechazarAyudante(
        idSolicitud
      )
      .pipe(
        take(1),
        finalize(() => {

          this.procesandoDecision =
            false;

          this.cdr.detectChanges();

        })
      )
      .subscribe({

        next: () => {

          if (
            this.notificacionSeleccionada
              ?.solicitud
          ) {

            this.notificacionSeleccionada
              .solicitud
              .estado = 'PENDIENTE';

          }


          this.perfilAyudanteAbierto =
            false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error al rechazar ayudante:',
            err
          );

          this.errorDecision = true;

          this.cdr.detectChanges();

        }

      });

  }

  obtenerResultadoNotificacion(
    notificacion: Notificacion
  ): 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | null {

    const solicitud =
      notificacion.solicitud;

    if (!solicitud) {
      return null;
    }


    const idUsuarioOrigen =
      notificacion.id_usuario_origen;

    const idUsuarioAyudanteActual =
      solicitud.ayudante?.id_usuario ?? null;


    // El mismo ayudante sigue esperando
    // la decisión del estudiante.
    if (
      solicitud.estado === 'EN_PROCESO' &&
      idUsuarioAyudanteActual === idUsuarioOrigen
    ) {
      return 'PENDIENTE';
    }


    // La solicitud fue aceptada y
    // corresponde al ayudante de esta notificación.
    if (
      solicitud.estado === 'ACEPTADA' &&
      idUsuarioAyudanteActual === idUsuarioOrigen
    ) {
      return 'ACEPTADA';
    }


    // Ya no existe un ayudante asignado.
    // Este ayudante fue rechazado.
    if (
      solicitud.estado === 'PENDIENTE' &&
      idUsuarioAyudanteActual === null
    ) {
      return 'RECHAZADA';
    }


    // Otro ayudante tomó posteriormente
    // la misma solicitud.
    if (
      idUsuarioAyudanteActual !== null &&
      idUsuarioAyudanteActual !== idUsuarioOrigen
    ) {
      return 'RECHAZADA';
    }


    return null;
  }

}