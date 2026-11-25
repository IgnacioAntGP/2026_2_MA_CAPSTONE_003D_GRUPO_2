import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonCard,
  IonCardContent,
  IonBadge,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
} from '@ionic/angular';

import { AyudantiaService } from '../../../core/services/AyudantiaService';

import { PublicacionComunidad } from '../../../models/ISolicitudAyudantia';

import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

import { LoginService } from '../../../core/services/LoginService';
import { UsuarioAutenticado } from '../../../models/IAuth';
import { AyudanteService } from '../../../core/services/AyudanteService';

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
    IonBadge,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonChip,
    SideMenuComponent,
  ],
})
export class PanelAyudantePage implements OnInit {
  usuarioAyudante: UsuarioAutenticado | null = null;

  metricas = {
    pendientes: 0,
    activas: 0,
    finalizadas: 0,
    evaluacion: '4.9',
  };

  publicacionesComunidad: PublicacionComunidad[] = [];

  constructor(
    private ayudantiaService: AyudantiaService,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private ayudanteService: AyudanteService
  ) {}

  ngOnInit() {
    this.usuarioAyudante = null;
    this.publicacionesComunidad = [];
    this.cdr.detectChanges();
  }

  ionViewWillEnter() {
    this.usuarioAyudante = null;
    this.publicacionesComunidad = [];
    this.cargarMetaData();
  }

  private obtenerIdUsuarioSession(): number | null {
    const idUsuario = this.loginService.obtenerIdUsuario();

    if (!idUsuario) {
      console.warn('Error al obtener el ID del usuario en sesión.');
      return null;
    }

    return idUsuario;
  }

  cargarMetaData() {
    this.usuarioAyudante = this.loginService.obtenerUsuario();
    const idUsuario = this.obtenerIdUsuarioSession();

    this.ayudantiaService.obtenerPublicacionesComunidad().subscribe({
      next: (data) => {
        this.publicacionesComunidad = data.slice(0, 3);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error comunidad:', error);
      },
    });

    this.ayudantiaService.obtenerSolicitudesDisponibles().subscribe({
      next: (data) => {
        this.metricas.pendientes = data.length;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error disponibles:', error);
      },
    });

    if (!idUsuario) {
      this.metricas.activas = 0;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      return;
    }

    this.ayudantiaService.obtenerMisAyudantias(idUsuario).subscribe({
      next: (data) => {
        this.metricas.activas = data.length;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error mis ayudantías:', error);
      },
    });

    this.ayudanteService.obtenerPerfilPublico(idUsuario).subscribe({
      next: (perfil) => {
        const stats = perfil?.estadisticas;

        if (stats) {
          this.metricas.finalizadas = stats.ayudantias_finalizadas ?? 0;
          this.metricas.evaluacion =
            stats.promedio_valoracion != null
              ? Number(stats.promedio_valoracion).toFixed(1)
              : 'N/A';
        }

        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar estadísticas del perfil:', error);
      },
    });
  }
}
