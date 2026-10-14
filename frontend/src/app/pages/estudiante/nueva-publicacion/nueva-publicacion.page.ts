import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

import { TicketService } from '../../../core/services/ConsultaService';
import { NuevaConsulta } from '../../../models/IConsulta';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

@Component({
  selector: 'app-nueva-publicacion',
  templateUrl: './nueva-publicacion.page.html',
  styleUrls: ['./nueva-publicacion.page.scss'],
  standalone:true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    RouterLink,
    SideMenuComponent
]
})
export class NuevaPublicacionPage implements OnInit {

  titulo = '';
  descripcion = '';
  idAsignatura: number | null = null;

  // Temporal hasta implementar login real
  idUsuarioActual = 1;

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  publicarConsulta() {

    const titulo = this.titulo.trim();
    const descripcion = this.descripcion.trim();

    if (!titulo || !descripcion || !this.idAsignatura) {
      console.warn('Faltan campos obligatorios');
      return;
    }

    const payload: Omit<NuevaConsulta, 'fecha_creacion'> = {
      id_usuario: this.idUsuarioActual,
      id_asignatura: this.idAsignatura,
      titulo,
      descripcion
    };

    this.ticketService.crearConsulta(payload).subscribe({
      next: (respuesta) => {

        console.log('Consulta creada correctamente:', respuesta);

        this.titulo = '';
        this.descripcion = '';
        this.idAsignatura = null;

        this.cdr.markForCheck();

        this.router.navigate(['/comunidad']);
      },
      error: (error) => {
        console.error('Error al crear consulta:', error);
      }
    });

  }

}