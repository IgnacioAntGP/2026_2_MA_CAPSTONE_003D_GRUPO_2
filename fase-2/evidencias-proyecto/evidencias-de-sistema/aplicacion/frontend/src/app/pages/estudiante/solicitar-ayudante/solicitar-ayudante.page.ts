import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TicketService } from '../../../core/services/ConsultaService';
import { Consulta } from '../../../models/IConsulta';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';
import { CategoriaSolicitud } from '../../../models/IFiltros'

@Component({
  selector: 'app-solicitar-ayudante',
  templateUrl: './solicitar-ayudante.page.html',
  styleUrls: ['./solicitar-ayudante.page.scss'],
  standalone:true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    RouterLink,
    SideMenuComponent
]
})
export class SolicitarAyudantePage implements OnInit {

  categoria: CategoriaSolicitud [] = []

  idCategoriaSeleccionada: string = '';

  idConsulta!: number;
  consulta?: Consulta;

  motivo = '';
  modalidad = '';

  solicitudEnviada = false;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.idConsulta = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.cargarConsulta();
    this.cargarCategorias();
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
      }
    });

  }

  solicitarAyudantia() {
    const motivo = this.motivo.trim();

    if (!this.modalidad || !motivo || !this.idCategoriaSeleccionada) {
      console.warn('Faltan campos obligatorios');
      return;
    };

    this.ticketService.solicitarAyudantia(
      this.idConsulta,
      this.modalidad,
      motivo,
      Number(this.idCategoriaSeleccionada)
    ).subscribe({
      next: (respuesta) => {

        console.log('Solicitud de tutoría creada:', respuesta);

        this.solicitudEnviada = true;

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al solicitar tutoría:', error);
      }
    });
  }

  cargarCategorias() {
  this.ticketService.obtenerCategorias().subscribe({
    next: (data) => {
      // Filtrar solo las que estén activas para los estudiantes
      this.categoria = data.filter(c => c.esActivo);
      this.cdr.markForCheck();
    },
    error: (error) => {
      console.error('Error al cargar categorías:', error);
    }
  });
}

}