import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { IonButton, IonContent, IonSelect, IonSelectOption } from '@ionic/angular';
import { UsuarioService } from '../../../core/services/UsuarioService';
import type {
  CrearUsuarioRequest,
  ModificarUsuarioRequest,
  RolAsignableUsuario,
  UsuarioResponse
} from '../../../models/IUsuario';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.page';

interface DatosUsuario {
  nombre: string;
  apellido: string;
  rut: string;
  email: string;
  password: string;
  roles: RolAsignableUsuario[];
}

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.page.html',
  styleUrls: ['./detalle-usuario.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonSelect,
    IonSelectOption,
    FormsModule,
    RouterLink,
    SideMenuComponent
  ]
})
export class DetalleUsuarioPage implements OnInit {
  readonly rolesDisponibles: readonly RolAsignableUsuario[] = [
    'ESTUDIANTE',
    'AYUDANTE'
  ];

  idUsuario: number | null = null;
  cargandoUsuario = false;
  guardandoUsuario = false;
  rolesProtegidos = false;
  errorCarga = '';
  errorFormulario = '';
  datosUsuario = this.datosVacios();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);

  get esEdicion(): boolean {
    return this.idUsuario !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_usuario');
    if (idParam === null) {
      return;
    }

    const idUsuario = Number(idParam);
    if (!Number.isInteger(idUsuario) || idUsuario < 1) {
      this.errorCarga = 'El identificador del usuario no es válido.';
      return;
    }

    this.idUsuario = idUsuario;
    this.cargarUsuario(idUsuario);
  }

  cargarUsuario(idUsuario: number): void {
    this.cargandoUsuario = true;
    this.errorCarga = '';

    this.usuarioService
      .obtenerUsuario(idUsuario)
      .pipe(
        finalize(() => {
          this.cargandoUsuario = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (usuario) => this.cargarDatosFormulario(usuario),
        error: (error: unknown) => {
          this.errorCarga = this.mensajeError(
            error,
            'No fue posible cargar el usuario.'
          );
        }
      });
  }

  guardarUsuario(): void {
    const datos = {
      nombre: this.datosUsuario.nombre.trim(),
      apellido: this.datosUsuario.apellido.trim(),
      rut: this.datosUsuario.rut.trim(),
      email: this.datosUsuario.email.trim(),
      password: this.datosUsuario.password.trim(),
      roles: [...this.datosUsuario.roles]
    };

    if (
      !datos.nombre ||
      !datos.apellido ||
      !datos.rut ||
      !datos.email ||
      (!this.rolesProtegidos && datos.roles.length === 0) ||
      (!this.esEdicion && datos.password.length < 8)
    ) {
      this.errorFormulario =
        'Completa los campos requeridos, selecciona al menos un rol y usa una contraseña de 8 caracteres como mínimo.';
      return;
    }

    const datosBase = {
      nombre: datos.nombre,
      apellido: datos.apellido,
      rut: datos.rut,
      email: datos.email
    };

    const solicitud = this.idUsuario !== null
      ? this.usuarioService.modificarUsuario(this.idUsuario, {
          ...datosBase,
          ...(!this.rolesProtegidos ? { roles: datos.roles } : {})
        } satisfies ModificarUsuarioRequest)
      : this.usuarioService.crearUsuario({
          ...datosBase,
          password: datos.password,
          roles: datos.roles
        } satisfies CrearUsuarioRequest);

    this.guardandoUsuario = true;
    this.errorFormulario = '';

    solicitud
      .pipe(
        finalize(() => {
          this.guardandoUsuario = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => this.router.navigate(['/gestion-usuarios']),
        error: (error: unknown) => {
          this.errorFormulario = this.mensajeError(
            error,
            'No fue posible guardar el usuario.'
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
      default:
        return rol;
    }
  }

  private cargarDatosFormulario(usuario: UsuarioResponse): void {
    const roles = (usuario.roles ?? [])
      .map((rol) => rol.nombre?.trim().toUpperCase())
      .filter((rol): rol is string => Boolean(rol));

    this.rolesProtegidos = roles.some((rol) => !this.esRolAsignable(rol));
    this.datosUsuario = {
      nombre: usuario.nombre ?? '',
      apellido: usuario.apellido ?? '',
      rut: usuario.rut ?? '',
      email: usuario.email ?? '',
      password: '',
      roles: roles.filter(
        (rol): rol is RolAsignableUsuario => this.esRolAsignable(rol)
      )
    };
  }

  private esRolAsignable(rol: string): rol is RolAsignableUsuario {
    return this.rolesDisponibles.some((rolDisponible) => rolDisponible === rol);
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

  private datosVacios(): DatosUsuario {
    return {
      nombre: '',
      apellido: '',
      rut: '',
      email: '',
      password: '',
      roles: ['ESTUDIANTE']
    };
  }
}
