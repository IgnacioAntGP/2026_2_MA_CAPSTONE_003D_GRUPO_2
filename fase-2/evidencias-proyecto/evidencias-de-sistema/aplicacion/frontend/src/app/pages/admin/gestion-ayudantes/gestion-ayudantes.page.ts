import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonBadge,
  IonSpinner,
  IonSearchbar
} from '@ionic/angular';

import {
  interval,
  Subscription
} from 'rxjs';

import {
  AyudanteService,
  PerfilPublicoAyudante
} from '../../../core/services/AyudanteService';

import {
  SideMenuComponent
} from '../../../shared/components/side-menu/side-menu.page';


@Component({
  selector: 'app-gestion-ayudantes',
  templateUrl: './gestion-ayudantes.page.html',
  styleUrls: ['./gestion-ayudantes.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonBadge,
    IonSpinner,
    IonSearchbar,
    CommonModule,
    FormsModule,
    RouterLink,
    SideMenuComponent
  ]
})
export class GestionAyudantesPage
  implements OnInit, OnDestroy {

  ayudantes: PerfilPublicoAyudante[] = [];

  busqueda: string = '';

  cargando: boolean = false;

  errorCarga: boolean = false;


  private refrescoSubscription?: Subscription;

  private solicitudEnCurso: boolean = false;


  constructor(
    private ayudanteService: AyudanteService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    // Primera carga con indicador visual
    this.cargarAyudantes(true);


    // Actualización automática cada 5 segundos
    this.refrescoSubscription =
      interval(5000).subscribe(() => {

        this.cargarAyudantes(false);

      });

  }


  cargarAyudantes(
    mostrarCarga: boolean = true
  ): void {

    // Evita ejecutar una segunda consulta
    // si todavía existe una en curso.
    if (this.solicitudEnCurso) {

      return;

    }


    this.solicitudEnCurso = true;


    if (mostrarCarga) {

      this.cargando = true;
      this.errorCarga = false;

    }


    this.ayudanteService
      .obtenerTodos()
      .subscribe({

        next: (data) => {

          this.ayudantes = [...data];

          this.cargando = false;
          this.errorCarga = false;
          this.solicitudEnCurso = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al cargar ayudantes:',
            error
          );


          // Solo mostramos el estado de error
          // cuando corresponde a una carga visible.
          // Si falla un refresco automático,
          // conservamos la información anterior.
          if (mostrarCarga) {

            this.ayudantes = [];
            this.errorCarga = true;
            this.cargando = false;

          }


          this.solicitudEnCurso = false;

          this.cdr.detectChanges();

        }

      });

  }


  get ayudantesFiltrados():
    PerfilPublicoAyudante[] {

    const termino =
      this.normalizarTexto(
        this.busqueda
      );


    if (!termino) {

      return this.ayudantes;

    }


    return this.ayudantes.filter(
      (ayudante) => {

        const nombreCompleto =
          this.normalizarTexto(
            `${ayudante.nombre} ${ayudante.apellido}`
          );


        const carrera =
          this.normalizarTexto(
            ayudante.carrera ?? ''
          );


        const institucion =
          this.normalizarTexto(
            ayudante.institucion ?? ''
          );


        const coincideEspecialidad =
          ayudante.especialidades.some(
            (especialidad) => {

              const asignatura =
                this.normalizarTexto(
                  especialidad.asignatura ?? ''
                );


              const codigo =
                this.normalizarTexto(
                  especialidad.codigo ?? ''
                );


              return (
                asignatura.includes(termino) ||
                codigo.includes(termino)
              );

            }
          );


        return (
          nombreCompleto.includes(termino) ||
          carrera.includes(termino) ||
          institucion.includes(termino) ||
          coincideEspecialidad
        );

      }
    );

  }


  private normalizarTexto(
    valor: string
  ): string {

    return valor
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .trim();

  }


  ngOnDestroy(): void {

    this.refrescoSubscription?.unsubscribe();

  }

}