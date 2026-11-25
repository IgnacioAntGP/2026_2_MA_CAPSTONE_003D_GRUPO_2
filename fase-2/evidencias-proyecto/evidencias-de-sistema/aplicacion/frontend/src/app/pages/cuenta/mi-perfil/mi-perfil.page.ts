import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { IonContent, IonButton, IonCard, IonCardContent, IonBadge } from '@ionic/angular';

import { TicketService } from '../../../core/services/ConsultaService';
import { PerfilUsuario } from '../../../models/IPerfil';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

import { LoginService } from '../../../core/services/LoginService';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,

    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonBadge,

    SideMenuComponent,
  ],
})
export class MiPerfilPage implements OnInit {
  perfil?: PerfilUsuario;

  idUsuarioActual: number | null = null;

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    const idUsuario = this.loginService.obtenerIdUsuario();

    if (!idUsuario) {
      console.warn('No hay un usuario autenticado en la sesión.');
      return;
    }

    this.ticketService.obtenerPerfil(idUsuario).subscribe({
      next: (data) => {
        this.perfil = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
      },
    });
  }
}
