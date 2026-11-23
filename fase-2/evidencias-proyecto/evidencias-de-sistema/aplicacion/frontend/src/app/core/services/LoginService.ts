import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  LoginRequest,
  LoginResponse,
  RolAuth,
  SesionUsuario,
  UsuarioAutenticado
} from '../../models/IAuth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl;

  private readonly SESSION_KEY = 'entrepares_session';

  constructor(
    private http: HttpClient
  ) {}

  login(
    correo: string,
    password: string
  ): Observable<LoginResponse> {

    const payload: LoginRequest = {
      correo: correo.trim().toLowerCase(),
      password
    };

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/auth/login`,
        payload
      )
      .pipe(
        tap((response) => {

          const sesion: SesionUsuario = {
            token: response.token,
            refreshToken: response.refreshToken,
            expiresAt: response.expiresAt,
            usuario: response.usuario
          };

          this.guardarSesion(sesion);

        })
      );
  }

  private guardarSesion(
    sesion: SesionUsuario
  ): void {

    localStorage.setItem(
      this.SESSION_KEY,
      JSON.stringify(sesion)
    );
  }

  obtenerSesion(): SesionUsuario | null {

    const sesionGuardada =
      localStorage.getItem(this.SESSION_KEY);

    if (!sesionGuardada) {
      return null;
    }

    try {

      return JSON.parse(
        sesionGuardada
      ) as SesionUsuario;

    } catch {

      this.cerrarSesion();

      return null;
    }
  }

  obtenerUsuario(): UsuarioAutenticado | null {

    return this.obtenerSesion()?.usuario ?? null;
  }

  obtenerIdUsuario(): number | null {

    return this.obtenerUsuario()?.id_usuario ?? null;
  }

  obtenerToken(): string | null {

    return this.obtenerSesion()?.token ?? null;
  }

  obtenerRefreshToken(): string | null {

    return this.obtenerSesion()?.refreshToken ?? null;
  }

  obtenerRoles(): RolAuth[] {

    return this.obtenerUsuario()?.roles ?? [];
  }

  estaAutenticado(): boolean {

    const sesion = this.obtenerSesion();

    if (!sesion?.token) {
      return false;
    }

    const expiracionMilisegundos =
      sesion.expiresAt * 1000;

    if (Date.now() >= expiracionMilisegundos) {

      this.cerrarSesion();

      return false;
    }

    return true;
  }

  cerrarSesion(): void {

    localStorage.removeItem(
      this.SESSION_KEY
    );
  }
}