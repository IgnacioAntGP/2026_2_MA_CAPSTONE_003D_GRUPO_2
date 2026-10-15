import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { TicketService } from '../../../core/services/ConsultaService';
import { PerfilUsuario } from '../../../models/IPerfil';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
  standalone:true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    RouterLink,
    SideMenuComponent
  ]
})
export class MiPerfilPage implements OnInit {

  perfil?: PerfilUsuario;

  // Temporal hasta implementar login real
  idUsuarioActual = 1;

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {

    this.ticketService.obtenerPerfil(this.idUsuarioActual).subscribe({
      next: (data) => {

        this.perfil = data;

        this.cdr.markForCheck();

        console.log('Perfil:', data);
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
      }
    });

  }

}