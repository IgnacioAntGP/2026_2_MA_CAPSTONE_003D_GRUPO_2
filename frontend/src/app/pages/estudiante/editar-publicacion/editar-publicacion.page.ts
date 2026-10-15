import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TicketService } from '../../../core/services/ConsultaService';
import { Consulta } from '../../../models/IConsulta';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

@Component({
  selector: 'app-editar-publicacion',
  templateUrl: './editar-publicacion.page.html',
  styleUrls: ['./editar-publicacion.page.scss'],
  standalone:true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    RouterLink,
    SideMenuComponent
  ]
})
export class EditarPublicacionPage implements OnInit {

  idConsulta!: number;

  consulta?: Consulta;

  titulo = '';
  descripcion = '';
  idAsignatura: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.idConsulta = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.cargarConsulta();

  }

  cargarConsulta() {

    this.ticketService
      .obtenerConsultaPorId(this.idConsulta)
      .subscribe({

        next: (data) => {

          this.consulta = data;

          this.titulo = data.titulo;
          this.descripcion = data.descripcion;

          /*
            Como el endpoint de detalle actualmente
            entrega el nombre de la asignatura,
            obtenemos temporalmente el ID según su nombre.
          */
          this.idAsignatura = this.obtenerIdAsignatura(
            data.asignatura ?? ''
          );

          this.cdr.markForCheck();

          console.log(
            'Consulta cargada para edición:',
            data
          );

        },

        error: (error) => {

          console.error(
            'Error al cargar publicación:',
            error
          );

        }

      });

  }

  guardarCambios() {

    if (
      !this.titulo.trim() ||
      !this.descripcion.trim() ||
      !this.idAsignatura
    ) {

      console.warn(
        'Título, asignatura y descripción son obligatorios.'
      );

      return;

    }

    this.ticketService
      .actualizarConsulta(
        this.idConsulta,
        this.titulo.trim(),
        this.idAsignatura,
        this.descripcion.trim()
      )
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Publicación actualizada:',
            respuesta
          );

          this.router.navigate([
            '/detalle-consulta',
            this.idConsulta
          ]);

        },

        error: (error) => {

          console.error(
            'Error al actualizar publicación:',
            error
          );

        }

      });

  }

  obtenerIdAsignatura(nombre: string): number | null {

    switch (nombre) {

      case 'Programación':
        return 1;

      case 'Bases de Datos':
        return 2;

      case 'Matemáticas':
        return 3;

      case 'Ingeniería de Software':
        return 4;

      default:
        return null;

    }

  }

}