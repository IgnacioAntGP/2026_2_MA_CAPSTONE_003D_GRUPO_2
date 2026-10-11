import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TicketService } from '../../../core/services/ConsultaService';
import { Consulta } from '../../../models/IConsulta';

@Component({
  selector: 'app-solicitar-ayudante',
  templateUrl: './solicitar-ayudante.page.html',
  styleUrls: ['./solicitar-ayudante.page.scss'],
  standalone:true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    RouterLink
]
})
export class SolicitarAyudantePage implements OnInit {

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

  solicitarTutoria() {

    const motivo = this.motivo.trim();

    if (!this.modalidad || !motivo) {
      console.warn('Faltan campos obligatorios');
      return;
    }

    this.ticketService.solicitarTutoria(
      this.idConsulta,
      this.modalidad,
      motivo
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

}