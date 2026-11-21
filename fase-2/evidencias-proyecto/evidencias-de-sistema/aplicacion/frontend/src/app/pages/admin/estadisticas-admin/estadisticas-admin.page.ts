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
  IonSpinner,
  IonNote,
  IonButton
} from '@ionic/angular';

import {
  interval,
  Subscription
} from 'rxjs';

import {
  AdministracionService,
  EstadisticasAdministracion
} from '../../../core/services/AdministracionService';

import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';


@Component({
  selector: 'app-estadisticas-admin',
  templateUrl: './estadisticas-admin.page.html',
  styleUrls: ['./estadisticas-admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonSpinner,
    IonNote,
    SideMenuComponent,
    IonButton
  ]
})
export class EstadisticasAdminPage
  implements OnInit, OnDestroy {

  estadisticas: EstadisticasAdministracion = {
    ayudantes_registrados: 0,
    consultas_activas: 0,
    ayudantias_finalizadas: 0,
    especialidades_cubiertas: 0,
    ayudantes_por_especialidad: []
  };

  cargando = false;

  errorCarga = false;

  private solicitudEnCurso = false;

  private refrescoSubscription?: Subscription;


  constructor(
    private administracionService: AdministracionService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {

    // Primera carga visible
    this.cargarEstadisticas();

    // Refresco automático cada 5 segundos
    this.refrescoSubscription =
      interval(5000).subscribe(() => {

        // Los refrescos posteriores son silenciosos
        this.cargarEstadisticas(false);

      });

  }


  cargarEstadisticas(
    mostrarCarga: boolean = true
  ) {

    // Evita realizar dos solicitudes al mismo tiempo
    if (this.solicitudEnCurso) {
      return;
    }

    this.solicitudEnCurso = true;


    if (mostrarCarga) {
      this.cargando = true;
    }


    this.administracionService
      .obtenerEstadisticas()
      .subscribe({

        next: (data) => {

          this.estadisticas = {
            ...data,
            ayudantes_por_especialidad:
              Array.isArray(
                data.ayudantes_por_especialidad
              )
                ? [...data.ayudantes_por_especialidad]
                : []
          };

          this.errorCarga = false;
          this.cargando = false;
          this.solicitudEnCurso = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al cargar estadísticas de administración:',
            error
          );

          this.errorCarga = true;
          this.cargando = false;
          this.solicitudEnCurso = false;

          this.cdr.detectChanges();

        }

      });

  }


  ngOnDestroy() {

    this.refrescoSubscription?.unsubscribe();

  }

}