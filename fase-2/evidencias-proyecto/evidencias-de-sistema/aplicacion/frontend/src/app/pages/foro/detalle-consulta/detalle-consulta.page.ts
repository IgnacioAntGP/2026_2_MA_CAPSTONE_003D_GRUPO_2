import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonNote,
  IonTextarea,
  AlertController,
} from '@ionic/angular';

import { RouterLink, ActivatedRoute, Router } from '@angular/router';

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
    CommonModule,
    FormsModule,
    RouterLink,

    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonChip,
    IonNote,
    IonTextarea,

    SideMenuComponent,
  ],
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
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(Number(id))) {
          this.idConsulta = Number(id);
          // Solo cargamos si el ID es válido
          this.cargarConsulta();
          this.cargarRespuestas();
        } else {
          console.error('El ID de la consulta no llegó a la vista o no es válido');
          this.router.navigate(['/comunidad']);
        }
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
      },
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
      },
    });
  }

  publicarRespuesta() {
    const contenido = this.nuevaRespuesta.trim();

    if (!contenido) {
      return;
    }

    this.ticketService
      .agregarRespuesta(this.idConsulta, this.idUsuarioActual, contenido)
      .subscribe({
        next: () => {
          console.log('Respuesta publicada correctamente');

          this.nuevaRespuesta = '';

          // Recargar respuestas desde la base de datos
          this.cargarRespuestas();

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error('Error al publicar respuesta:', error);
        },
      });
  }

  async eliminarPublicacion() {
    const alert = await this.alertController.create({
      header: 'Eliminar publicación',

      message: '¿Estás seguro de que deseas eliminar esta publicación?',

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },

        {
          text: 'Eliminar',
          role: 'destructive',

          handler: () => {
            this.ticketService.desactivarConsulta(this.idConsulta).subscribe({
              next: (respuesta) => {
                console.log('Publicación desactivada:', respuesta);

                this.router.navigate(['/mis-publicaciones']);
              },

              error: (error) => {
                console.error('Error al desactivar publicación:', error);
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }
}
