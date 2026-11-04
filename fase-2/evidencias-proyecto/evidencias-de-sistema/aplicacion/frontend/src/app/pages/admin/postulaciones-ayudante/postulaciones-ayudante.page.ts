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

import { PostulacionService  } from '../../../core/services/PostulacionService';
import { EspecialidadService } from '../../../core/services/EspecialidadService';
import { PostulacionAyudante } from '../../../models/IPostulacionAyudante';
import { IObtenerEspecialidadesResolve } from '../../../models/IEspecialidadAyudante';
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

  especialidadesPorUsuario: { [idUsuario: number]: IObtenerEspecialidadesResolve[] } = {};

  cargando: boolean = false;

  private refrescoSubscription?: Subscription;


  constructor(
    private postulacionService: PostulacionService,
    private especialidadService: EspecialidadService,
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


  cargarPostulacionesPendientes(mostrarCarga: boolean = true) {
    if (mostrarCarga) {
      this.cargando = true;
    }

    this.postulacionService.obtenerPostulacionesPendientes().subscribe({
      next: (data) => {
        // Al venir la asignatura integrada en la data, no requerimos llamadas extra
        this.postulacionesPendientes = [...data];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar postulaciones pendientes:', error);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarEspecialidadesDeUsuario(idUsuario: number) {
  this.especialidadService.obtenerEspecialidadesUsuario(idUsuario).subscribe({
    next: (especialidades) => {
      this.especialidadesPorUsuario[idUsuario] = especialidades;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error(`Error al cargar especialidades del usuario ${idUsuario}:`, error);
    }
  });
  };


  aprobarPostulacion(postulacion: PostulacionAyudante) {
    // Enviamos el id_postulacion y el id_asignatura opcional que eligió el alumno
    this.postulacionService.aprobarPostulacionAyudante(
      postulacion.id_postulacion,
      postulacion.id_asignatura
    ).subscribe({
      next: () => {
        console.log('Postulación aprobada con éxito:', postulacion.id_postulacion);

        this.postulacionesPendientes = this.postulacionesPendientes.filter(
          p => p.id_postulacion !== postulacion.id_postulacion
        );

        this.cdr.detectChanges();
        this.cargarPostulacionesPendientes(false);
      },
      error: (error) => {
        console.error('Error al aprobar postulación:', error);
      }
    });
  }

  rechazarPostulacion(postulacion: PostulacionAyudante) {
    this.postulacionService.rechazarPostulacionAyudante(
      postulacion.id_postulacion
    ).subscribe({
      next: () => {
        console.log('Postulación rechazada:', postulacion.id_postulacion);

        this.postulacionesPendientes = this.postulacionesPendientes.filter(
          p => p.id_postulacion !== postulacion.id_postulacion
        );

        this.cdr.detectChanges();
        this.cargarPostulacionesPendientes(false);
      },
      error: (error) => {
        console.error('Error al rechazar postulación:', error);
      }
    });
  }


  ngOnDestroy() {

    this.refrescoSubscription?.unsubscribe();

  }

}