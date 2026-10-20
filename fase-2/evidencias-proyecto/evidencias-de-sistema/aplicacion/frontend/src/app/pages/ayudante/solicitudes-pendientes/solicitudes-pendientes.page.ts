import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AyudantiaService } from '../../../core/services/AyudantiaService';
import { SolicitudAyudantia } from '../../../models/ISolicitudAyudantia';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

import {
  IonContent
} from '@ionic/angular';

@Component({
  selector: 'app-solicitudes-pendientes',
  templateUrl: './solicitudes-pendientes.page.html',
  styleUrls: ['./solicitudes-pendientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    SideMenuComponent,
    FormsModule
  ],
})

export class SolicitudesPendientesPage implements OnInit {
  usuarioAyudante = {
    id_usuario: 4
  };

  // Arreglo maestro sin alterar
  todasLasSolicitudes: SolicitudAyudantia[] = [];

  // Categorías para el selector
  categorias: any[] = [];
  categoriaSeleccionada: string = 'todas';

  solicitudesDisponibles: SolicitudAyudantia[] = [];

  constructor(
    private ayudantiaService: AyudantiaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarSolicitudes();
    this.cargarCategorias();
  }

  ionViewWillEnter() {
    this.cargarSolicitudes();
    this.cargarCategorias();
  }

  cargarCategorias() {
  // Mock temporal para probar la UI mientras tu compañero hace el back:
  this.categorias = [
    { id_categoria: 1, nombre: 'Ayudantía General', es_activo: true },
    { id_categoria: 2, nombre: 'Revisión de Código / Proyecto', es_activo: true },
    { id_categoria: 3, nombre: 'Preparación de Exámenes', es_activo: true }
  ];
  this.cdr.markForCheck();
}

  /*TODO: Descomentar cuando se expongan los edpoints 
  cargarCategorias() {
    this.ayudantiaService.obtenerCategorias().subscribe({
      next: (data) => {
        // Solo mostramos categorías activas
        this.categorias = (data || []).filter(c => c.es_activo === true || c.esActivo === true);
        this.cdr.markForCheck();
      },
      error: (e) => console.error('Error al cargar categorías en filtro:', e)
    });
  }
    */

  filtrarPorCategoria() {
    if (this.categoriaSeleccionada === 'todas') {
      this.solicitudesDisponibles = [...this.todasLasSolicitudes];
    } else {
      this.solicitudesDisponibles = this.todasLasSolicitudes.filter(
        s => String((s as any).id_categoria) === String(this.categoriaSeleccionada)
      );
    }
    this.cdr.markForCheck();
  }

  cargarSolicitudes() {
    this.ayudantiaService.obtenerSolicitudesDisponibles().subscribe({
      next: (data) => {
        console.log('Payload recibido en solicitudes-pendientes:', data);
        this.solicitudesDisponibles = data;
        this.cdr.markForCheck();
      },
      error: (e) => console.error('Error disponibles:', e),
    });
  }

  aceptarSolicitud(solicitud: SolicitudAyudantia) {
    this.ayudantiaService
      .tomarSolicitud(solicitud.id_solicitud, this.usuarioAyudante.id_usuario)
      .subscribe({
        next: () => {
          this.solicitudesDisponibles = this.solicitudesDisponibles.filter(
            (s) => s.id_solicitud !== solicitud.id_solicitud,
          );
          this.filtrarPorCategoria();
          this.router.navigate(['/ayudante/tabs/mis-ayudantias']);
        },
        error: (e) => console.error('Error al aceptar solicitud:', e),
      });
  }
}
