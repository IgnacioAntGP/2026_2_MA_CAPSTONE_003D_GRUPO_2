import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../../core/services/TicketService';
import { Consulta } from '../../../models/IConsulta';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.page.html',
  styleUrls: ['./comunidad.page.scss'],
  imports: [ IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink ]
})
export class ComunidadPage implements OnInit {

  menuAbierto = false;  
  
  consultas:Consulta[] = [];

  constructor(private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ticketService.obtenerConsultasComunidad().subscribe({
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
