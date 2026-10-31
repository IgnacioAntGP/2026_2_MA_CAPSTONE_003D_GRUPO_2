import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonBadge,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonChip
} from '@ionic/angular';

import { AyudantiaService } from '../../../core/services/AyudantiaService';

import {
  PublicacionComunidad
} from '../../../models/ISolicitudAyudantia';

import {
  SideMenuComponent
} from '../../../shared/components/side-menu/side-menu.page';


@Component({
  selector: 'app-panel-ayudante',
  templateUrl: './panel-ayudante.page.html',
  styleUrls: ['./panel-ayudante.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonBadge,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonChip,
    SideMenuComponent
  ],
})
export class PanelAyudantePage implements OnInit {

  // Usuario autenticado (Fernanda id_usuario: 4)
  usuarioAyudante = {
    id_usuario: 4,
    nombre: 'Fernanda Morales',
    email: 'f.morales@duocuc.cl',
    imagen: '../assets/icon/favicon.png',
  };


  metricas = {
    pendientes: 0,
    activas: 0,
    evaluacion: '4.9',
  };


  publicacionesComunidad: PublicacionComunidad[] = [];


  constructor(
    private ayudantiaService: AyudantiaService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {
    this.cargarMetaData();
  }


  ionViewWillEnter() {
    this.cargarMetaData();
  }


  cargarMetaData() {

    this.ayudantiaService
      .obtenerPublicacionesComunidad()
      .subscribe({

        next: (data) => {

          console.log(
            'Payload recibido en panel-ayudante:',
            data
          );

          this.publicacionesComunidad = data.slice(0, 3);

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'Error comunidad:',
            error
          );

        }

      });


    this.ayudantiaService
      .obtenerSolicitudesDisponibles()
      .subscribe({

        next: (data) => {

          this.metricas.pendientes = data.length;

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'Error disponibles:',
            error
          );

        }

      });


    this.ayudantiaService
      .obtenerMisAyudantias(
        this.usuarioAyudante.id_usuario
      )
      .subscribe({

        next: (data) => {

          this.metricas.activas = data.length;

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'Error mis ayudantías:',
            error
          );

        }

      });

  }

}