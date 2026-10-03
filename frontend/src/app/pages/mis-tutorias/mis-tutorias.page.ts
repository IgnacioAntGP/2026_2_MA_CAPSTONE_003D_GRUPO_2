import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { TicketService } from '../../services/TicketService';
import { MisTutoria } from '../../models/IMisTutorias';

@Component({
  selector: 'app-mis-tutorias',
  templateUrl: './mis-tutorias.page.html',
  styleUrls: ['./mis-tutorias.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class MisTutoriasPage implements OnInit {

  tutorias: MisTutoria[] = [];

  // Temporal hasta implementar login real
  idUsuarioActual = 1;

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarMisTutorias();
  }

  cargarMisTutorias() {

    this.ticketService.obtenerMisTutorias(this.idUsuarioActual).subscribe({
      next: (data) => {

        this.tutorias = data;

        this.cdr.markForCheck();

        console.log('Mis tutorías:', data);
      },
      error: (error) => {
        console.error('Error al cargar mis tutorías:', error);
      }
    });

  }

}