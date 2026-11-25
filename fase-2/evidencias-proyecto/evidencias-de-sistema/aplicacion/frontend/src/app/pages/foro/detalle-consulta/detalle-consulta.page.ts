import { LoginService } from './../../../core/services/LoginService';
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
  IonSpinner,
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
    IonSpinner,
    SideMenuComponent,
  ],
})
export class DetalleConsultaPage implements OnInit {
  menuAbierto = false;

  consulta?: Consulta;
  mensajeErrorConsulta: string | null = null;
  codigoError: number | null = null;
  idConsulta!: number;

  respuestas: RespuestaConsulta[] = [];
  // Banderas de estado
  cargandoRespuestas: boolean = false;
  errorCargandoRespuestas: boolean = false;
  nuevaRespuesta = '';

  idUsuarioActual: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private alertController: AlertController,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    const idConsulta = this.route.snapshot.paramMap.get('id');

    this.cargarPerfil();

    if (idConsulta && !isNaN(Number(idConsulta))) {
      this.idConsulta = Number(idConsulta);
      this.cargarConsulta();
      this.cargarRespuestas();
    } else {
      this.router.navigate(['/comunidad']);
    }
  }

  cargarPerfil() {
    const idUsuario = this.loginService.obtenerIdUsuario();

    if (!idUsuario) {
      console.warn('No hay un usuario autenticado en la sesión.');
      return;
    }

    return this.idUsuarioActual = idUsuario;
  }

  cargarConsulta() {
    this.mensajeErrorConsulta = null;
    this.codigoError = null;

    this.ticketService.obtenerConsultaPorId(this.idConsulta).subscribe({
      next: (data) => {
        this.consulta = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar la consulta:', error);
        this.codigoError = error.status || 500;

        if (this.codigoError === 404) {
          this.mensajeErrorConsulta = 'La consulta que buscas no existe o ha sido eliminada.';
        } else {
          this.mensajeErrorConsulta =
            'Ocurrió un error al cargar la consulta. Inténtalo más tarde.';
        }

        this.cdr.markForCheck();
      },
    });
  }

  cargarRespuestas() {
    this.cargandoRespuestas = true;
    this.errorCargandoRespuestas = false;

    this.ticketService.obtenerRespuestas(this.idConsulta).subscribe({
      next: (data) => {
        this.respuestas = data;
        this.cargandoRespuestas = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar respuestas:', error);

        this.cargandoRespuestas = false;
        this.errorCargandoRespuestas = true;
        this.cdr.markForCheck();
      },
    });
  }

  publicarRespuesta() {
    const contenido = this.nuevaRespuesta.trim();
    const idUsuario = this.loginService.obtenerIdUsuario();

    if (!contenido) {
      return;
    }

    if(!idUsuario){
      console.warn("No se pudo obtener el ID del usuario.")
      return;
    }

    this.idUsuarioActual = idUsuario;

    this.ticketService
      .agregarRespuesta(this.idConsulta, idUsuario, contenido)
      .subscribe({
        next: () => {
          console.log('Respuesta publicada correctamente');
          this.nuevaRespuesta = '';
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
