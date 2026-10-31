import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonChip,
  IonNote
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

import { TicketService } from '../../../core/services/ConsultaService';
import { Consulta } from '../../../models/IConsulta';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';


@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.page.html',
  styleUrls: ['./comunidad.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonChip,
    IonNote,
    SideMenuComponent
  ]
})
export class ComunidadPage implements OnInit {

  menuAbierto = false;

  consultas: Consulta[] = [];


  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {

    addIcons({
      addOutline
    });

  }


  ngOnInit() {

    this.ticketService
      .obtenerConsultasComunidad(true)
      .subscribe({

        next: (data) => {

          this.consultas = data;

          this.cdr.markForCheck();

          console.log(
            'Consultas recibidas:',
            data
          );

        },

        error: (error) => {

          console.error(
            'Error al cargar consultas:',
            error
          );

        }

      });

  }

}