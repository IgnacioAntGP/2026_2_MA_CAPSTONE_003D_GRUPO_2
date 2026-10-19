import { CategoriaSolicitud } from './../../../models/IFiltros';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';
import { RouterLink } from '@angular/router';
import { addIcons,  } from 'ionicons';
import { trashOutline, createOutline, checkmarkOutline, addOutline  } from 'ionicons/icons';
import { IonContent, IonGrid, IonRow, IonCol, IonNote, IonButton, IonIcon, IonBadge } from '@ionic/angular';

@Component({
  selector: 'app-categoria-solicitudes',
  templateUrl: './categoria-solicitudes.page.html',
  styleUrls: ['./categoria-solicitudes.page.scss'],
  imports: [IonContent, IonGrid, IonRow, IonCol, IonNote, IonIcon, IonButton, IonBadge, CommonModule, FormsModule, SideMenuComponent, RouterLink,]
})
export class CategoriaSolicitudesPage implements OnInit {

  categoriasSolicitud: CategoriaSolicitud[] = [
    {
      id_categoria: 1n, // Literal de tipo bigint (sufijo 'n')
      nombre: 'Ayudantía General',
      descripcion: 'Consultas transversales que cualquier ayudante puede aceptar',
      esActivo: true
    }
  ];

  constructor() { 
    addIcons({
      trashOutline,
      createOutline,
      checkmarkOutline,
      addOutline
    });
  }

  ngOnInit() {
  }

  editarCategoria(cat: CategoriaSolicitud) {
    console.log('Editar categoría:', cat);
  }

  alternarEstadoCategoria(id: bigint){
    const categoria = this.categoriasSolicitud.find(c => c.id_categoria === id);
    if (categoria) {
      categoria.esActivo = !categoria.esActivo;
    }
  }

  crearNuevaCategoria() {
    // Preparación apra abrir un modal o un formulario interactivo
    console.log('Abrir formulario para crear categoría');
  }

}
