import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  IonBadge
} from '@ionic/angular';

import {
  interval,
  Subscription
} from 'rxjs';

import { PostulacionService  } from '../../../core/services/PostulacionService';
import { PostulacionAyudante } from '../../../models/IPostulacionAyudante';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

import { hammerOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-panel-admin',
  templateUrl: './panel-admin.page.html',
  styleUrls: ['./panel-admin.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonButton,
    IonCard,
    IonCardContent,
    IonBadge,
    CommonModule,
    RouterLink,
    SideMenuComponent
  ]
})
export class PanelAdminPage implements OnInit, OnDestroy {

  postulacionesPendientes: PostulacionAyudante[] = [];

  private refrescoSubscription?: Subscription;

  menuAbierto = false;


  constructor(
    private postulacionService: PostulacionService,
    private cdr: ChangeDetectorRef
  ) {

    addIcons({
      hammerOutline
    });

  }


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

    this.postulacionService
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