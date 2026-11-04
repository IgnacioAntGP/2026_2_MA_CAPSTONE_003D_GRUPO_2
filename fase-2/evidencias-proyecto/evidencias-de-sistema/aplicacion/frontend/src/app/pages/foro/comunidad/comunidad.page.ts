import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonChip,
  IonNote,
  IonSelect,
  IonSelectOption
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

import { TicketService } from '../../../core/services/ConsultaService';
import { Consulta } from '../../../models/IConsulta';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';


@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.page.html',
  styleUrls: ['./comunidad.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,

    IonContent,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonChip,
    IonNote,
    IonSelect,
    IonSelectOption,

    SideMenuComponent
  ]
})
export class ComunidadPage implements OnInit {

  menuAbierto = false;

  consultas: Consulta[] = [];

  textoBusqueda = '';

  asignaturaSeleccionada = 'TODAS';

  soloSinRespuesta = false;


  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {

    addIcons({
      addOutline
    });

  }


  ngOnInit() {

    this.ticketService
      .obtenerConsultasComunidad(true)
      .subscribe({

        next: (data) => {

          this.consultas = data;

          this.cdr.markForCheck();

          console.log(
            'Consultas recibidas:',
            data
          );

        },

        error: (error) => {

          console.error(
            'Error al cargar consultas:',
            error
          );

        }

      });

  }


  get asignaturas(): string[] {

    return [
      ...new Set(
        this.consultas
          .map(
            (consulta) =>
              consulta.asignatura?.trim()
          )
          .filter(
            (asignatura):
              asignatura is string =>
              !!asignatura
          )
      )
    ].sort(
      (a, b) =>
        a.localeCompare(b)
    );

  }


  get consultasFiltradas(): Consulta[] {

    const busqueda =
      this.textoBusqueda
        .trim()
        .toLowerCase();


    return this.consultas.filter(
      (consulta) => {

        const coincideAsignatura =
          this.asignaturaSeleccionada === 'TODAS' ||
          consulta.asignatura ===
            this.asignaturaSeleccionada;


        const necesitaRespuesta =
          !this.soloSinRespuesta ||
          (consulta.total_respuestas ?? 0) === 0;


        const coincideBusqueda =
          !busqueda ||
          consulta.titulo
            .toLowerCase()
            .includes(busqueda) ||
          consulta.descripcion
            .toLowerCase()
            .includes(busqueda) ||
          (consulta.asignatura ?? '')
            .toLowerCase()
            .includes(busqueda) ||
          (consulta.autor ?? '')
            .toLowerCase()
            .includes(busqueda);


        return (
          coincideAsignatura &&
          necesitaRespuesta &&
          coincideBusqueda
        );

      }
    );

  }


  actualizarBusqueda(
    event: CustomEvent
  ): void {

    this.textoBusqueda =
      event.detail.value ?? '';

  }


  cambiarAsignatura(
    event: CustomEvent
  ): void {

    this.asignaturaSeleccionada =
      event.detail.value ?? 'TODAS';

  }


  alternarSinRespuesta(): void {

    this.soloSinRespuesta =
      !this.soloSinRespuesta;

  }

}