import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface UsuarioOrigenNotificacion {
  id_usuario: number;
  nombre: string;
  apellido: string;
}


export interface AsignaturaNotificacion {
  id_asignatura: number;
  nombre: string;
}


export interface ConsultaNotificacion {
  id_consulta: number;
  titulo: string;
  asignatura: AsignaturaNotificacion | null;
}


export interface SolicitudNotificacion {
  id_solicitud: number;
  id_ayudante: number | null;
  modalidad: string;
  estado: string;

  ayudante: AyudanteActualNotificacion | null;

  consulta: ConsultaNotificacion | null;
}


export interface Notificacion {
  id_notificacion: number;
  id_usuario_destino: number;
  id_usuario_origen: number | null;
  id_solicitud: number | null;

  tipo: string;
  titulo: string;
  mensaje: string;

  leida: boolean;

  fecha_creacion: string;
  fecha_lectura: string | null;

  usuario_origen: UsuarioOrigenNotificacion | null;
  solicitud: SolicitudNotificacion | null;
}


export interface RespuestaNoLeidas {
  no_leidas: number;
}


export interface RespuestaMarcarLeida {
  mensaje: string;
  notificacion: Notificacion;
}

export interface AyudanteActualNotificacion {
  id_ayudante: number;
  id_usuario: number;
}


@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private apiUrl =
    'http://localhost:3000/api';


  constructor(
    private http: HttpClient
  ) {}


  // Obtener todas las notificaciones del usuario
  obtenerPorUsuario(
    idUsuario: number
  ): Observable<Notificacion[]> {

    return this.http.get<Notificacion[]>(
      `${this.apiUrl}/notificaciones/usuario/${idUsuario}`
    );
  }


  // Obtener cantidad de notificaciones no leídas
  contarNoLeidas(
    idUsuario: number
  ): Observable<RespuestaNoLeidas> {

    return this.http.get<RespuestaNoLeidas>(
      `${this.apiUrl}/notificaciones/usuario/${idUsuario}/no-leidas`
    );
  }


  // Marcar una notificación como leída
  marcarComoLeida(
    idNotificacion: number,
    idUsuario: number
  ): Observable<RespuestaMarcarLeida> {

    return this.http.patch<RespuestaMarcarLeida>(
      `${this.apiUrl}/notificaciones/${idNotificacion}/leer`,
      {
        id_usuario: idUsuario
      }
    );
  }

}