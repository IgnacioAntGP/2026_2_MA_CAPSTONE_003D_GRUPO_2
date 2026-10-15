import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { RouterLink, ActivatedRoute,Router } from '@angular/router';

import { TicketService } from '../../../core/services/ConsultaService';
import { Consulta } from '../../../models/IConsulta';
import { RespuestaConsulta } from '../../../models/IRespuesta';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

@Component({
  selector: 'app-detalle-consulta',
  templateUrl: './detalle-consulta.page.html',
  styleUrls: ['./detalle-consulta.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    RouterLink,
    SideMenuComponent
]
})
export class DetalleConsultaPage implements OnInit {

  menuAbierto = false;

  consulta?: Consulta;
  idConsulta!: number;

  respuestas: RespuestaConsulta[] = [];

  nuevaRespuesta = '';

  // Temporal hasta implementar login/sesión real
  idUsuarioActual = 1;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {

    this.idConsulta = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.cargarConsulta();
    this.cargarRespuestas();
  }


  cargarConsulta() {

    this.ticketService.obtenerConsultaPorId(this.idConsulta).subscribe({
      next: (data) => {
        this.consulta = data;

        this.cdr.markForCheck();

        console.log('Consulta seleccionada:', data);
      },
      error: (error) => {
        console.error('Error al cargar la consulta:', error);
      }
    });

  }


  cargarRespuestas() {

    this.ticketService.obtenerRespuestas(this.idConsulta).subscribe({
      next: (data) => {
        this.respuestas = data;

        this.cdr.markForCheck();

        console.log('Respuestas de la consulta:', data);
      },
      error: (error) => {
        console.error('Error al cargar respuestas:', error);
      }
    });

  }


  publicarRespuesta() {

    const contenido = this.nuevaRespuesta.trim();

    if (!contenido) {
      return;
    }

    this.ticketService.agregarRespuesta(
      this.idConsulta,
      this.idUsuarioActual,
      contenido
    ).subscribe({
      next: () => {

        console.log('Respuesta publicada correctamente');

        this.nuevaRespuesta = '';

        // Recargar respuestas desde la base de datos
        this.cargarRespuestas();

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al publicar respuesta:', error);
      }
    });

  }


  eliminarPublicacion() {

    const confirmar = confirm(
      '¿Estás seguro de que deseas eliminar esta publicación?'
    );

    if (!confirmar) {
      return;
    }

    this.ticketService
      .desactivarConsulta(this.idConsulta)
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Publicación desactivada:',
            respuesta
          );

          this.router.navigate([
            '/mis-publicaciones'
          ]);

        },

        error: (error) => {

          console.error(
            'Error al desactivar publicación:',
            error
          );

        }

      });

  }

}