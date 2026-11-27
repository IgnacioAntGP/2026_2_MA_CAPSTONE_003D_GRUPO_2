import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
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
import { AyudantiaService } from '../../../core/services/AyudantiaService';
import { CategoriaActividadService } from '../../../core/services/CategoriaActividadService';
import { IActividad } from '../../../models/IActividad';
import { ICategoriaActividad, ESTADO_ACTIVIDAD } from '../../../models/ICategoriaActividad';

import { LoginService } from '../../../core/services/LoginService';
import { RolAuth } from '../../../models/IAuth';

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
  private route = inject(ActivatedRoute);
  private actividadService = inject(ActividadService);
  private ayudantiaService = inject(AyudantiaService);
  private categoriaActividadService = inject(CategoriaActividadService);
  private loginService = inject(LoginService);
  private cdr = inject(ChangeDetectorRef);

  idAyudantia!: number;
  tituloConsulta: string = '';
  actividades: IActividad[] = [];
  cargando: boolean = false;
  estadoAyudantia: string | null = null;
  idSolicitud: number | null = null;
  finalizando: boolean = false;
  actividadActualizandoId: number | null = null;
  errorGestion: string | null = null;

  isModalOpen: boolean = false;
  guardando: boolean = false;

  nuevaActividad = {
    idCategoria: null as number | null,
    nombreActividad: '',
    descripcion: ''
  };

  categoriasDisponibles: ICategoriaActividad[] = [];
  readonly ESTADO_ACTIVIDAD = ESTADO_ACTIVIDAD;
  readonly estadosActividad = [
    { id: ESTADO_ACTIVIDAD.PENDIENTE, etiqueta: 'Pendiente' },
    { id: ESTADO_ACTIVIDAD.EN_PROCESO, etiqueta: 'En proceso' },
    { id: ESTADO_ACTIVIDAD.COMPLETADA, etiqueta: 'Completada' },
    { id: ESTADO_ACTIVIDAD.CANCELADA, etiqueta: 'Cancelada' },
    { id: ESTADO_ACTIVIDAD.EN_REVISION, etiqueta: 'En revisión' }
  ];

  esAyudante: boolean = false;
  esEstudiante: boolean = false;

  constructor() {
    addIcons({
      add, addOutline, checkmarkDoneOutline, eyeOutline, arrowBackOutline, closeOutline
    });
  }

  ngOnInit() {
    this.resolverRolesUsuario();
    const paramId = this.route.snapshot.paramMap.get('id');

    if (paramId) {
      this.idAyudantia = Number(paramId);
      this.cargarActividadesAyudantia(this.idAyudantia);
      this.cargarDetalleAyudantia(this.idAyudantia);
    } else {
      console.error('¡ERROR CRÍTICO!: No llegó ningún ID en la ruta /gestion-ayudantia/:id');
    }
    
    this.cargarCategorias();
  }

  cargarDetalleAyudantia(id: number) {
    this.ayudantiaService.obtenerDetalleAyudantia(id).subscribe({
      next: (data) => {
        this.idSolicitud = data.ayudantia.id_solicitud;
        this.estadoAyudantia = data.ayudantia.estado;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el estado de la ayudantía:', err);
        this.errorGestion = this.mensajeError(err, 'No se pudo cargar el detalle de la ayudantía.');
      }
    });
  }

  cargarCategorias() {
    this.categoriaActividadService.obtenerCategoriasActividad().subscribe({
      next: (data) => {
        this.categoriasDisponibles = data;
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
        this.errorGestion = this.mensajeError(err, 'No se pudieron cargar las actividades.');
        this.cdr.detectChanges();
      }
    });
  }

  marcarComoCompletada(actividad: IActividad) {
    this.cambiarEstadoActividad(actividad, ESTADO_ACTIVIDAD.COMPLETADA);
  }

  marcarComoEnRevision(actividad: IActividad) {
    this.cambiarEstadoActividad(actividad, ESTADO_ACTIVIDAD.EN_REVISION);
  }

  cambiarEstadoActividad(actividad: IActividad, idEstado: number) {
    this.errorGestion = null;
    this.actividadActualizandoId = actividad.idActividad;
    this.actividadService.modificarEstadoActividad(this.idAyudantia, actividad.idActividad, idEstado).subscribe({
      next: () => {
        this.actividadActualizandoId = null;
        this.cargarActividadesAyudantia(this.idAyudantia);
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        this.errorGestion = this.mensajeError(err, 'No se pudo actualizar el estado de la actividad.');
        this.actividadActualizandoId = null;
        this.cdr.detectChanges();
      }
    });
  }

  get ayudantiaFinalizada(): boolean {
    return this.estadoAyudantia?.toUpperCase() === 'FINALIZADA';
  }

  get puedeFinalizarAyudantia(): boolean {
    const estadosFinalizables = [ESTADO_ACTIVIDAD.COMPLETADA, ESTADO_ACTIVIDAD.CANCELADA];
    return this.actividades.length > 0 &&
      this.actividades.every((actividad) => estadosFinalizables.includes(actividad.idEstadoActividad));
  }

  etiquetaEstado(idEstado: number): string {
    return this.estadosActividad.find((estado) => estado.id === idEstado)?.etiqueta ?? 'Desconocido';
  }

  colorEstado(idEstado: number): string {
    if (idEstado === ESTADO_ACTIVIDAD.COMPLETADA) return 'success';
    if (idEstado === ESTADO_ACTIVIDAD.CANCELADA) return 'medium';
    return 'warning';
  }

  finalizarAyudantia() {
    if (!this.idSolicitud || !this.puedeFinalizarAyudantia || this.finalizando) {
      return;
    }

    this.errorGestion = null;
    this.finalizando = true;
    this.ayudantiaService.resolverSolicitud(this.idSolicitud).subscribe({
      next: () => {
        this.estadoAyudantia = 'FINALIZADA';
        this.finalizando = false;
      },
      error: (err) => {
        console.error('Error al finalizar la ayudantía:', err);
        this.errorGestion = this.mensajeError(err, 'No se pudo finalizar la ayudantía.');
        this.finalizando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private mensajeError(error: HttpErrorResponse, mensajePorDefecto: string): string {
    return error.error?.error ?? error.error?.message ?? mensajePorDefecto;
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
    if (!this.nuevaActividad.idCategoria || 
        !this.nuevaActividad.nombreActividad || 
        this.nuevaActividad.nombreActividad.trim() === '') {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    this.errorGestion = null;
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
        this.errorGestion = this.mensajeError(err, 'No se pudo crear la actividad.');
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private resolverRolesUsuario(): void {
    const roles: RolAuth[] = this.loginService.obtenerRoles() ?? [];
    const nombresRoles = roles.map((r) =>
      (typeof r === 'string' ? r : (r.nombre ?? '')).toString().toUpperCase()
    );

    this.esAyudante = nombresRoles.some((rol) =>
      ['AYUDANTE', 'ADMINISTRADOR'].includes(rol)
    );
    this.esEstudiante = nombresRoles.includes('ESTUDIANTE') && !this.esAyudante;
  }

  volverAtras() {
    window.history.back();
  }
}