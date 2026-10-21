import { CategoriaSolicitud, NuevaCategoriaSolicitud } from './../../../models/IFiltros';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';
import { RouterLink } from '@angular/router';
import { addIcons,  } from 'ionicons';
import { trashOutline, createOutline, checkmarkOutline, addOutline, refreshOutline  } from 'ionicons/icons';
import { IonContent, IonGrid, IonRow, IonCol, IonNote, IonButton, IonIcon, IonBadge, IonModal } from '@ionic/angular';
import { AdministracionService } from '../../../core/services/AdministracionService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categoria-solicitudes',
  templateUrl: './categoria-solicitudes.page.html',
  styleUrls: ['./categoria-solicitudes.page.scss'],
  standalone: true,
  imports: [IonContent, IonGrid, IonRow, IonCol, IonNote, IonIcon, IonButton, 
    IonBadge, CommonModule, FormsModule, SideMenuComponent, RouterLink, IonModal,]
})
export class CategoriaSolicitudesPage implements OnInit, OnDestroy {
  isModalOpen = false;
  nuevaCategoria = {
    nombre: '',
    descripcion: ''
  };
  public categoriasSolicitud: CategoriaSolicitud[] = [];
  private refrescoSubscription?: Subscription; 

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

  filtroEstado: 'todos' | 'activas' | 'inactivas' = 'todos';

  filtrarPorEstado(estado: 'todos' | 'activas' | 'inactivas') {
    this.filtroEstado = estado;
  }

  refrescarCategorias(){
    this.adminService.obtenerCategorias().subscribe({
      next: (data: CategoriaSolicitud[]) => {
        this.categoriasSolicitud = Array.isArray(data) ? [...data] : [];
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al refrescar las nuevas categorias:', error);
      }
    });
  }

  refrescarManual() {
    this.adminService.obtenerCategorias();
  }

  // Lista filtrada reactiva
  get categoriasVisibles(): CategoriaSolicitud[] {
    if (this.filtroEstado === 'activas') {
      return this.categoriasSolicitud.filter(c => c.esActivo);
    }
    if (this.filtroEstado === 'inactivas') {
      return this.categoriasSolicitud.filter(c => !c.esActivo);
    }
    return this.categoriasSolicitud;
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
    this.nuevaCategoria = { nombre: '', descripcion: '' };
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.cdr.markForCheck();
  }

  guardarCategoria() {
    const nombre = this.nuevaCategoria.nombre.trim();
    const descripcion = this.nuevaCategoria.descripcion.trim();

    if (!nombre || !descripcion) {
      return;
    }

    const payload: NuevaCategoriaSolicitud = {
      nombre,
      descripcion
    };

    this.adminService.crearCategoria(payload).subscribe({
      next: (categoriaCreada: CategoriaSolicitud) => {
        this.categoriasSolicitud = [categoriaCreada, ...this.categoriasSolicitud];
        this.cerrarModal();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al registrar la nueva categoría:', error);
      }
    });
  }
}
