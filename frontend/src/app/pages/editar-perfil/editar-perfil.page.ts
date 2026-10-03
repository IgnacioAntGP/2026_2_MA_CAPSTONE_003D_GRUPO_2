import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

import { TicketService } from '../../services/TicketService';
import { PerfilUsuario } from '../../models/IPerfil';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class EditarPerfilPage implements OnInit {

  perfil?: PerfilUsuario;

  // Temporal hasta implementar login real
  idUsuarioActual = 1;

  carrera = '';
  semestre: number | null = null;
  institucion = '';

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {

    this.ticketService.obtenerPerfil(this.idUsuarioActual).subscribe({
      next: (data) => {

        this.perfil = data;

        this.carrera = data.estudiante?.carrera ?? '';
        this.semestre = data.estudiante?.semestre ?? null;
        this.institucion = data.estudiante?.institucion ?? '';

        this.cdr.markForCheck();

        console.log('Perfil cargado para edición:', data);
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
      }
    });

  }

  guardarCambios() {

    if (
      !this.carrera.trim() ||
      !this.semestre ||
      !this.institucion.trim()
    ) {
      console.warn('Faltan campos obligatorios');
      return;
    }

    this.ticketService.actualizarPerfil(
      this.idUsuarioActual,
      this.carrera.trim(),
      this.semestre,
      this.institucion.trim()
    ).subscribe({
      next: (respuesta) => {

        console.log('Perfil actualizado:', respuesta);

        this.router.navigate(['/mi-perfil']);
      },
      error: (error) => {
        console.error('Error al actualizar perfil:', error);
      }
    });

  }

}