import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PublicacionComunidad, SolicitudAyudantia } from '../models/ISolicitudAyudantia';

@Injectable({
  providedIn: 'root'
})
export class AyudantiaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 1. Obtener publicaciones de la comunidad - GET /api/consultas
  obtenerPublicacionesComunidad(): Observable<PublicacionComunidad[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consultas`).pipe(
      map(items => items.map(i => ({
        id_consulta: i.id_consulta,
        titulo: i.titulo,
        descripcion: i.descripcion,
        fecha_creacion: i.fecha_creacion,
        asignatura: i.asignatura,
        autor: i.autor,
        total_respuestas: i.total_respuestas
      })))
    );
  }

  // 2. Obtener solicitudes pendientes (disponibles para tomar) - GET /api/solicitudes-ayudantia/disponibles
  obtenerSolicitudesDisponibles(): Observable<SolicitudAyudantia[]> {
    return this.http.get<any[]>(`${this.apiUrl}/solicitudes-ayudantia/disponibles`).pipe(
      map(items => items.map(s => ({
        id_solicitud: s.id_solicitud,
        asignatura: s.asignatura,
        modalidad: s.modalidad,
        titulo_duda: s.titulo_duda || s.titulo,
        duda: s.titulo_duda || s.titulo,
        descripcion_duda: s.descripcion_duda || s.motivo,
        descripcion: s.descripcion_duda || s.motivo,
        estado: s.estado,
        nombre_estudiante: s.estudiante,
        estudiante: s.estudiante
      })))
    );
  }

  // 3. Obtener "Mis Ayudantías" del usuario conectado
  obtenerMisAyudantias(idUsuario: number): Observable<SolicitudAyudantia[]> {
    return this.http.get<any[]>(`${this.apiUrl}/solicitudes-ayudantia/ayudante/${idUsuario}`).pipe(
      map(items => items.map(s => ({
        id_solicitud: s.id_solicitud,
        asignatura: s.asignatura,
        modalidad: s.modalidad,
        titulo_duda: s.titulo_duda,
        duda: s.titulo_duda,
        descripcion_duda: s.descripcion_duda,
        descripcion: s.descripcion_duda,
        estado: s.estado,
        nombre_estudiante: s.estudiante,
        estudiante: s.estudiante
      })))
    );
  }

  /**
   * Obtiene solicitudes filtradas por estado
   */
  obtenerSolicitudes(estado?: string): Observable<SolicitudAyudantia[]> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<SolicitudAyudantia[]>(this.apiUrl, { params });
  }

  /**
   * Aceptar solicitud de ayudantía: PENDIENTE -> EN_PROCESO (Al presionar "Aceptar Ayudantía")
   */
  tomarSolicitud(idSolicitud: number, idUsuario: number): Observable<SolicitudAyudantia> {
    return this.http.patch<SolicitudAyudantia>(`${this.apiUrl}/solicitudes-ayudantia/${idSolicitud}/tomar`, {
        id_usuario: idUsuario
    });
  }

  /**
   * Estudiante confirma al ayudante: EN_PROCESO -> ACEPTADA
   */
  confirmarAyudante(idSolicitud: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/solicitudes-ayudantia/${idSolicitud}/aceptar`, {});
  }

  /**
   * Estudiante rechaza al ayudante: EN_PROCESO -> PENDIENTE (id_ayudante vuelve a null)
   */
  rechazarAyudante(idSolicitud: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/solicitudes-ayudantia/${idSolicitud}/rechazar-ayudante`, {});
  }

  /**
   * Finalizar solicitud (ACEPTADA -> RESUELTA)
   */
  resolverSolicitud(idSolicitud: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/solicitudes-ayudantia/${idSolicitud}/resolver`, {});
  }
}