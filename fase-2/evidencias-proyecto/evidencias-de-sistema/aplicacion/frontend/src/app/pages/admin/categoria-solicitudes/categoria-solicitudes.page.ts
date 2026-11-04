import {
  CategoriaSolicitud,
  NuevaCategoriaSolicitud
} from './../../../models/IFiltros';

import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  IonButton,
  IonIcon,
  IonBadge,
  IonModal,
  IonCard,
  IonCardContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  IonTextarea
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  trashOutline,
  createOutline,
  checkmarkOutline,
  addOutline,
  refreshOutline
} from 'ionicons/icons';

import { Subscription } from 'rxjs';

import { AdministracionService } from '../../../core/services/AdministracionService';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';


@Component({
  selector: 'app-categoria-solicitudes',
  templateUrl: './categoria-solicitudes.page.html',
  styleUrls: ['./categoria-solicitudes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonNote,
    IonButton,
    IonIcon,
    IonBadge,
    IonModal,
    IonCard,
    IonCardContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonInput,
    IonTextarea,

    SideMenuComponent
  ]
})
export class CategoriaSolicitudesPage
  implements OnInit, OnDestroy {

  isModalOpen = false;


  nuevaCategoria = {
    nombre: '',
    descripcion: ''
  };


  public categoriasSolicitud:
    CategoriaSolicitud[] = [];


  private refrescoSubscription?: Subscription;


  filtroEstado:
    'todos' |
    'activas' |
    'inactivas' = 'todos';


  constructor(
    private adminService: AdministracionService,
    private cdr: ChangeDetectorRef
  ) {

    addIcons({
      trashOutline,
      createOutline,
      checkmarkOutline,
      addOutline,
      refreshOutline
    });

  }


  ngOnInit() {

    this.refrescarCategorias();

  }


  ngOnDestroy() {

    this.refrescoSubscription?.unsubscribe();

  }


  filtrarPorEstado(
    estado:
      'todos' |
      'activas' |
      'inactivas'
  ) {

    this.filtroEstado = estado;

  }


  refrescarCategorias() {

    this.adminService
      .obtenerCategorias()
      .subscribe({

        next: (
          data: CategoriaSolicitud[]
        ) => {

          this.categoriasSolicitud =
            Array.isArray(data)
              ? [...data]
              : [];

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'Error al refrescar las nuevas categorias:',
            error
          );

        }

      });

  }


  refrescarManual() {

    this.adminService.obtenerCategorias();

  }


  get categoriasVisibles():
    CategoriaSolicitud[] {

    if (
      this.filtroEstado === 'activas'
    ) {

      return this.categoriasSolicitud
        .filter(c => c.esActivo);

    }


    if (
      this.filtroEstado === 'inactivas'
    ) {

      return this.categoriasSolicitud
        .filter(c => !c.esActivo);

    }


    return this.categoriasSolicitud;

  }


  editarCategoria(
    cat: CategoriaSolicitud
  ) {

    console.log(
      'Editar categoría:',
      cat
    );

  }


  alternarEstadoCategoria(
    id: bigint
  ) {

    const categoria =
      this.categoriasSolicitud.find(
        c => c.id_categoria === id
      );


    if (categoria) {

      categoria.esActivo =
        !categoria.esActivo;

    }

  }


  crearNuevaCategoria() {

    this.nuevaCategoria = {
      nombre: '',
      descripcion: ''
    };

    this.isModalOpen = true;

  }


  cerrarModal() {

    this.isModalOpen = false;

    this.cdr.markForCheck();

  }


  guardarCategoria() {

    const nombre =
      this.nuevaCategoria.nombre.trim();

    const descripcion =
      this.nuevaCategoria.descripcion.trim();


    if (!nombre || !descripcion) {

      return;

    }


    const payload:
      NuevaCategoriaSolicitud = {

      nombre,
      descripcion

    };


    this.adminService
      .crearCategoria(payload)
      .subscribe({

        next: (
          categoriaCreada:
            CategoriaSolicitud
        ) => {

          this.categoriasSolicitud = [
            categoriaCreada,
            ...this.categoriasSolicitud
          ];

          this.cerrarModal();

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'Error al registrar la nueva categoría:',
            error
          );

        }

      });

  }

}