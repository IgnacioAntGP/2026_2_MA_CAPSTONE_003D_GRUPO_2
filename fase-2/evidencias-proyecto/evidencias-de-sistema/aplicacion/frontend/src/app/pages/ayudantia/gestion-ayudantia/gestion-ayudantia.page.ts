import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  IonContent, 
          IonHeader, 
          IonTitle, 
          IonToolbar, 
          IonBadge, 
          IonText, 
          IonIcon, 
          IonButton, 
          IonSpinner, 
          IonModal, 
          IonButtons, 
          IonLabel, 
          IonSelect,
          IonSelectOption, 
          IonItem,
          IonInput,
          IonTextarea
         } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { add, addOutline, checkmarkDoneOutline, eyeOutline, arrowBackOutline, closeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { ActividadService } from '../../../core/services/ActividadService';
import { CategoriaActividadService } from '../../../core/services/CategoriaActividadService';
import { IActividad } from '../../../models/IActividad';
import { ICategoriaActividad, ESTADO_ACTIVIDAD } from '../../../models/ICategoriaActividad'

@Component({
  selector: 'app-gestion-ayudantia',
  templateUrl: './gestion-ayudantia.page.html',
  styleUrls: ['./gestion-ayudantia.page.scss'],
  imports: [IonContent, 
            IonBadge, 
            IonText, 
            IonIcon, 
            IonButton, 
            IonSpinner, 
            CommonModule, 
            FormsModule,
            IonHeader,
            IonTitle,
            IonToolbar,
            IonModal, 
            IonButtons, 
            IonLabel, 
            IonSelect,
            IonSelectOption, 
            IonItem,
            IonInput,
            IonTextarea
          ]
})
export class GestionAyudantiaPage implements OnInit {
  idAyudantia!: number;
  actividades: IActividad[] = [];
  cargando: boolean = false;

  isModalOpen: boolean = false;
  guardando: boolean = false;

  nuevaActividad = {
    idCategoria: null as number | null,
    nombreActividad: '',
    descripcion: ''
  };

  categoriasDisponibles: ICategoriaActividad[] = [];

  constructor(
    private route: ActivatedRoute,
    private actividadService: ActividadService,
    private categoriaActividadService: CategoriaActividadService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      add, addOutline, checkmarkDoneOutline, eyeOutline, arrowBackOutline, closeOutline
    });
  }

  ngOnInit() {
    this.idAyudantia = Number(this.route.snapshot.paramMap.get('id'));

    if (this.idAyudantia) {
      this.cargarActividadesAyudantia(this.idAyudantia);
    }
    
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaActividadService.obtenerCategoriasActividad().subscribe({
      next: (data) => {
        this.categoriasDisponibles = data;
        console.log("Categorías cargadas para el select:", this.categoriasDisponibles);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  cargarActividadesAyudantia(id: number) {
    this.cargando = true;
    this.actividadService.listarActividades(id).subscribe({
      next: (data) => {
        this.actividades = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar actividades:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  marcarComoCompletada(actividad: IActividad) {
    this.actividadService.modificarEstadoActividad(this.idAyudantia, actividad.idActividad, ESTADO_ACTIVIDAD.COMPLETADA).subscribe({
      next: () => {
        this.cargarActividadesAyudantia(this.idAyudantia);
      },
      error: (err) => console.error('Error al actualizar estado:', err)
    });
  }

  marcarComoEnRevision(actividad: IActividad){
    this.actividadService.modificarEstadoActividad(this.idAyudantia, actividad.idActividad, ESTADO_ACTIVIDAD.EN_REVISION).subscribe({
      next: () => {
        this.cargarActividadesAyudantia(this.idAyudantia);
      },
      error: (err) => console.error('Error al actualizar estado:', err)
    });
  }

  abrirModalNuevaActividad() {
    this.nuevaActividad = { idCategoria: null, nombreActividad: '', descripcion: '' };
    this.isModalOpen = true;
    this.cargarCategorias();
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  guardarActividad() {
    console.log('Valores actuales del formulario:', this.nuevaActividad);

    if (!this.nuevaActividad.idCategoria || 
        !this.nuevaActividad.nombreActividad || 
        this.nuevaActividad.nombreActividad.trim() === '') {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    this.guardando = true;

    this.actividadService.crearActividad(this.idAyudantia, {
      idCategoria: Number(this.nuevaActividad.idCategoria),
      nombreActividad: this.nuevaActividad.nombreActividad.trim(),
      descripcion: this.nuevaActividad.descripcion.trim()
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.cerrarModal();
        this.cargarActividadesAyudantia(this.idAyudantia);
      },
      error: (err) => {
        console.error('Error al crear actividad:', err);
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  volverAtras() {
    window.history.back();
  }
}