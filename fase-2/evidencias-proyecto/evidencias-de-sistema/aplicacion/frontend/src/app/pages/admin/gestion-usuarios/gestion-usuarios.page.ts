import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';
import { UsuarioService } from '../../../core/services/UsuarioService';
import type { UsuarioResponse } from '../../../models/IUsuario';
import { finalize } from 'rxjs';
import { IonButton, IonContent } from '@ionic/angular';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  correo: string;
  roles: string[];
  activo: boolean;
}

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.page.html',
  styleUrls: ['./gestion-usuarios.page.scss'],
  imports: [
    IonContent,
    IonButton,
    RouterLink,
    SideMenuComponent
  ]
})
export class GestionUsuariosPage implements OnInit {
  usuarios: Usuario[] = [];
  cargandoUsuarios = true;
  usuarioEnProceso: number | null = null;
  errorCarga = '';
  errorAccion = '';

  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.errorCarga = '';

    this.usuarioService
      .listarUsuarios()
      .pipe(
        finalize(() => {
          this.cargandoUsuarios = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios.map((usuario) => this.mapearUsuario(usuario));
        },
        error: (error: unknown) => {
          this.errorCarga = this.mensajeError(
            error,
            'No fue posible cargar los usuarios.'
          );
        }
      });
  }

  cambiarEstado(usuario: Usuario, activo: boolean): void {
    this.errorAccion = '';
    this.usuarioEnProceso = usuario.id;

    const solicitud = activo
      ? this.usuarioService.activarUsuario(usuario.id)
      : this.usuarioService.desactivarUsuario(usuario.id);

    solicitud
      .pipe(
        finalize(() => {
          this.usuarioEnProceso = null;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.usuarios = this.usuarios.map((actual) =>
            actual.id === usuario.id ? { ...actual, activo } : actual
          );
        },
        error: (error: unknown) => {
          this.errorAccion = this.mensajeError(
            error,
            'No fue posible cambiar el estado del usuario.'
          );
        }
      });
  }

  nombreRol(rol: string): string {
    switch (rol) {
      case 'ESTUDIANTE':
        return 'Estudiante';
      case 'AYUDANTE':
        return 'Ayudante';
      case 'ADMINISTRADOR':
        return 'Administrador';
      default:
        return rol;
    }
  }

  private mapearUsuario(usuario: UsuarioResponse): Usuario {
    return {
      id: usuario.id_usuario,
      nombre: usuario.nombre ?? '',
      apellido: usuario.apellido ?? '',
      rut: usuario.rut ?? '',
      correo: usuario.email ?? '',
      roles: (usuario.roles ?? [])
        .map((rol) => rol.nombre?.trim().toUpperCase())
        .filter((rol): rol is string => Boolean(rol)),
      activo: usuario.es_activo
    };
  }

  private mensajeError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const payload = error.error;
      if (payload && typeof payload === 'object' && 'error' in payload) {
        const mensaje = payload.error;
        if (typeof mensaje === 'string' && mensaje.trim()) {
          return mensaje;
        }
      }

      return error.message || fallback;
    }

    return fallback;
  }
}
