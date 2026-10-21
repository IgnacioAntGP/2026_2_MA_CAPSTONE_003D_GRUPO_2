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
 
  cargarCategorias() {
    this.ayudantiaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = (data || []).filter(c => c.es_activo === true || c.esActivo === true);
        this.cdr.markForCheck();
      },
      error: (e) => console.error('Error al cargar categorías:', e)
    });
  }

  cargarSolicitudes() {
    this.ayudantiaService.obtenerSolicitudesDisponibles().subscribe({
      next: (data) => {
        console.log("Arreglo que llega de las solicitudes", data)
        this.todasLasSolicitudes = Array.isArray(data) ? [...data] : (data ? [data] : []);
        this.filtrarPorCategoria(); // Aplica el filtro inicial
        this.cdr.markForCheck();
      },
      error: (e) => console.error('Error cargando solicitudes:', e)
    });
  }

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
