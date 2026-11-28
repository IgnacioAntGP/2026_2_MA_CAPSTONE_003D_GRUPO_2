import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonCard,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonBadge,
  IonButton,
} from '@ionic/angular';

import { AyudantiaService } from '../../../core/services/AyudantiaService';
import { SolicitudAyudantia } from '../../../models/ISolicitudAyudantia';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';
import { LoginService } from '../../../core/services/LoginService';
import { UsuarioAutenticado } from '../../../models/IAuth';
import { CategoriaSolicitudService } from '../../../core/services/CategoriaSolicitudService';
import {
  AyudanteService,
  EspecialidadAyudante
} from '../../../core/services/AyudanteService';

@Component({
  selector: 'app-solicitudes-pendientes',
  templateUrl: './solicitudes-pendientes.page.html',
  styleUrls: ['./solicitudes-pendientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonChip,
    IonBadge,
    IonButton,
    SideMenuComponent,
  ],
})
export class SolicitudesPendientesPage implements OnInit {
  private categoriaSolicitudService = inject(CategoriaSolicitudService);

  usuarioAyudante: UsuarioAutenticado | null = null;

  // Arreglo maestro sin alterar
  todasLasSolicitudes: SolicitudAyudantia[] = [];

  categorias: { id_categoria: number; nombre: string }[] = [];

  especialidades: EspecialidadAyudante[] = [];

  categoriaSeleccionada = 'todas';

  asignaturaSeleccionada = 'todas';

  solicitudesDisponibles: SolicitudAyudantia[] = [];

  constructor(
    private ayudantiaService: AyudantiaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private ayudanteService: AyudanteService
  ) {}

  ngOnInit() {
    this.cargarSolicitudes();
    this.cargarEspecialidades();
    this.cargarCategorias();
  }

  private obtenerIdUsuarioSession(): number | null {
    const idUsuario = this.loginService.obtenerIdUsuario();

    if (!idUsuario) {
      console.warn('Error al obtener el ID del usuario en sesión.');
      return null;
    }

    return idUsuario;
  }

  cargarEspecialidades() {
    const idUsuario = this.obtenerIdUsuarioSession();
    if (!idUsuario) {
      this.especialidades = [];
      this.filtrarPorAsignatura();
      return;
    }

    this.ayudanteService.obtenerPerfilPublico(idUsuario).subscribe({
      next: (perfil) => {
        this.especialidades = perfil.especialidades || [];
        this.aplicarFiltros();
        this.cdr.markForCheck();
      },
      error: (e) => console.error('Error al cargar especialidades:', e),
    });
  }

  cargarCategorias() {
    this.categoriaSolicitudService.listarCategoriasSolicitud().subscribe({
      next: (categorias) => {
        this.categorias = categorias || [];
        this.aplicarFiltros();
        this.cdr.markForCheck();
      },
      error: (e) => console.error('Error al cargar categorías:', e),
    });
  }

  cargarSolicitudes() {
    this.ayudantiaService.obtenerSolicitudesDisponibles().subscribe({
      next: (data) => {
        console.log('Arreglo que llega de las solicitudes', data);

        this.todasLasSolicitudes = Array.isArray(data) ? [...data] : data ? [data] : [];

        this.aplicarFiltros();

        this.cdr.markForCheck();
      },

      error: (e) => console.error('Error cargando solicitudes:', e),
    });
  }

  filtrarPorAsignatura() {
    this.aplicarFiltros();
  }

  filtrarPorCategoria() {
    this.aplicarFiltros();
  }

  private aplicarFiltros() {
    this.solicitudesDisponibles = this.todasLasSolicitudes.filter((solicitud) => {
      const coincideCategoria =
        this.categoriaSeleccionada === 'todas' ||
        String(solicitud.id_categoria) === this.categoriaSeleccionada;
      const coincideAsignatura =
        this.asignaturaSeleccionada === 'todas' ||
        String(solicitud.id_asignatura) === this.asignaturaSeleccionada;

      return coincideCategoria && coincideAsignatura;
    });

    this.cdr.markForCheck();
  }

  aceptarSolicitud(solicitud: SolicitudAyudantia) {
    this.ayudantiaService.tomarSolicitud(solicitud.id_solicitud).subscribe({
      next: () => {
        this.todasLasSolicitudes = this.todasLasSolicitudes.filter(
          (s) => s.id_solicitud !== solicitud.id_solicitud
        );

        this.filtrarPorAsignatura();

        this.router.navigate(['/ayudante/tabs/mis-ayudantias']);
      },
      error: (e) => console.error('Error al aceptar solicitud:', e),
    });
  }
}
