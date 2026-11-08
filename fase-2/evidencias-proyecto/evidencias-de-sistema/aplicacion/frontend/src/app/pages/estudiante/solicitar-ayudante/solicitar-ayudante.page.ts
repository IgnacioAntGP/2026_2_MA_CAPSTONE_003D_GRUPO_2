import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
} from '@ionic/angular';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';

import { TicketService } from '../../../core/services/ConsultaService';
import { Consulta } from '../../../models/IConsulta';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';
import { CategoriaSolicitud } from '../../../models/IFiltros';

@Component({
  selector: 'app-solicitar-ayudante',
  templateUrl: './solicitar-ayudante.page.html',
  styleUrls: ['./solicitar-ayudante.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    CommonModule,
    FormsModule,
    RouterLink,
    SideMenuComponent,
  ],
})
export class SolicitarAyudantePage implements OnInit {
  categoria: CategoriaSolicitud[] = [];

  idCategoriaSeleccionada: string = '';

  idConsulta!: number;
  consulta?: Consulta;

  motivo = '';
  modalidad = '';

  solicitudEnviada = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(Number(id))) {
      this.idConsulta = Number(id);
      // Solo cargamos si el ID es válido
      this.cargarConsulta();
      this.cargarCategorias();
    } else {
      console.error('El ID de la consulta no llegó a la vista');
      // Opcional: Redirigir si el usuario entra sin un ID válido
      this.router.navigate(['/comunidad']);
    }
  }

  cargarConsulta() {
    this.ticketService.obtenerConsultaPorId(this.idConsulta).subscribe({
      next: (data) => {
        this.consulta = data;

        this.cdr.markForCheck();

        console.log('Consulta para tutoría:', data);
      },

      error: (error) => {
        console.error('Error al cargar consulta:', error);
      },
    });
  }

  solicitarAyudantia() {
    const motivo = this.motivo.trim();

    // 🔍 Agrega este log para inspeccionar el estado local antes de enviar
      console.log('--- PAYLOAD EN FRONTEND ---', {
        id_consulta: this.idConsulta,
        modalidad: this.modalidad,
        motivo: motivo,
        id_categoria: this.idCategoriaSeleccionada
      });

    if (!this.modalidad || !motivo || !this.idCategoriaSeleccionada) {
      console.warn('Faltan campos obligatorios');

      return;
    }

    this.ticketService
      .solicitarAyudantia(
        this.idConsulta,
        this.modalidad,
        motivo,
        Number(this.idCategoriaSeleccionada)
      )
      .subscribe({
        next: (respuesta) => {
          console.log('Solicitud de tutoría creada:', respuesta);

          this.solicitudEnviada = true;

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error('Error al solicitar tutoría:', error);
        },
      });
  }

  cargarCategorias() {
    this.ticketService.obtenerCategorias().subscribe({
      next: (data) => {
        // Solo se muestran categorías activas.
        this.categoria = data.filter((categoria) => categoria.esActivo);

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error al cargar categorías:', error);
      },
    });
  }
}
