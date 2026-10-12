import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

import {
  interval,
  Subscription
} from 'rxjs';

import { TicketService } from '../../../core/services/ConsultaService';
import { PostulacionAyudante } from '../../../models/IPostulacionAyudante';

@Component({
  selector: 'app-panel-admin',
  templateUrl: './panel-admin.page.html',
  styleUrls: ['./panel-admin.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    RouterLink
  ]
})
export class PanelAdminPage implements OnInit, OnDestroy {

  postulacionesPendientes: PostulacionAyudante[] = [];

  private refrescoSubscription?: Subscription;


  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {}

  menuAbierto = false;

  ngOnInit() {

    // Primera carga del resumen
    this.cargarPostulacionesPendientes();

    // Mantener actualizado el contador
    this.refrescoSubscription =
      interval(5000).subscribe(() => {

        this.cargarPostulacionesPendientes();

      });

  }


  cargarPostulacionesPendientes() {

    this.ticketService
      .obtenerPostulacionesPendientes()
      .subscribe({

        next: (data) => {

          this.postulacionesPendientes = [...data];

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al cargar postulaciones pendientes:',
            error
          );

        }

      });

  }


  ngOnDestroy() {

    this.refrescoSubscription?.unsubscribe();

  }
  
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

}