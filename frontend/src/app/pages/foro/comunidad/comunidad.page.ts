import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../../services/ConsultaService';
import { Consulta } from '../../../models/IConsulta';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.page.html',
  styleUrls: ['./comunidad.page.scss'],
  standalone: true,
  imports: [ IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink ]
})
export class ComunidadPage implements OnInit {

  menuAbierto = false;  
  
  consultas: Consulta[] = [];

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ticketService.obtenerConsultasComunidad(true).subscribe({
      next: (data) => {
        this.consultas = data;

        this.cdr.markForCheck();

        console.log('Consultas recibidas:', data);
      },
      error: (error) => {
        console.error('Error al cargar consultas:', error);
      }
    });
  }

}
