import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Consulta, NuevaConsulta } from '../../models/IConsulta';
import {SolicitudAyudantia, SolicitudAyudantiaPayloadNuevo} from '../../models/ISolicitudAyudantia';
import { PostulacionAyudante } from '../../models/IPostulacionAyudante';
import { RespuestaConsulta } from '../../models/IRespuesta';
import { MisTutoria } from '../../models/IMisTutorias';
import { PerfilUsuario } from '../../models/IPerfil';
import { CategoriaSolicitud } from '../../models/IFiltros';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerConsultasComunidad(estado: boolean): Observable<Consulta[]> {
    let params = new HttpParams();
    
    if(estado !== undefined) {
      params = params.set('estado', estado.toString());
    };

    return this.http.get<Consulta[]>(
      `${this.apiUrl}/consultas`, { params }
    );
  }

  crearConsulta(payload: Omit<NuevaConsulta, 'fecha_creacion'>): Observable<Consulta> {
    const fechaActual = new Date().toISOString().split('.')[0];

    return this.http.post<Consulta>(
      `${this.apiUrl}/consultas`,
      { ...payload, fecha_creacion: fechaActual, estado: true }
    );
  }

  obtenerMisConsultas(idUsuario: number): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(
      `${this.apiUrl}/consultas/usuario/${idUsuario}`
    );
  }

  obtenerConsultaPorId(idConsulta: number): Observable<Consulta> {
    return this.http.get<Consulta>(
      `${this.apiUrl}/consultas/${idConsulta}`
    );
  }

  obtenerRespuestas(idConsulta: number | string): Observable<RespuestaConsulta[]> {
    return this.http.get<RespuestaConsulta[]>(
      `${this.apiUrl}/consultas/${idConsulta}/respuestas`
    );
  }

  agregarRespuesta(idConsulta: number | string, idUsuario: number, contenido: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/consultas/${idConsulta}/respuestas`,
      { id_usuario: idUsuario, contenido }
    );
  }

  solicitarAyudantia(idConsulta: number | string, modalidad: string, motivo: string, idCategoria: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/solicitudes-ayudantia`,
      { id_consulta: idConsulta, modalidad, motivo, id_categoria: idCategoria }
    );
  }

  obtenerMisTutorias(idUsuario: number): Observable<MisTutoria[]> {
    return this.http.get<MisTutoria[]>(
      `${this.apiUrl}/solicitudes-ayudantia/usuario/${idUsuario}`
    );
  }

  obtenerPerfil(idUsuario: number): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(
      `${this.apiUrl}/usuarios/${idUsuario}/perfil`
    );
  }

  actualizarPerfil(idUsuario: number, carrera: string, semestre: number, institucion: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/usuarios/${idUsuario}/perfil`,
      { carrera, semestre, institucion }
    );
  }

  actualizarConsulta(idConsulta: number, titulo: string, idAsignatura: number, descripcion: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/consultas/${idConsulta}`,
      { titulo, id_asignatura: idAsignatura, descripcion }
    );
  }

  desactivarConsulta(idConsulta: number): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/consultas/${idConsulta}/desactivar`, 
      {}
    );
  }

  postularComoAyudante(idUsuario: number, motivo: string, experiencia: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/usuarios/postulaciones-ayudante`,
      { id_usuario: idUsuario, motivo, experiencia }
    );
  }

  obtenerPostulacionesPendientes(): Observable<PostulacionAyudante[]> {
    return this.http.get<PostulacionAyudante[]>(
      `${this.apiUrl}/usuarios/postulaciones-ayudante/pendientes`
    );
  }

  aprobarPostulacionAyudante(idSolicitud: number): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/usuarios/postulaciones-ayudante/${idSolicitud}/aprobar`, 
      {}
    );
  }

  rechazarPostulacionAyudante(idSolicitud: number): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/usuarios/postulaciones-ayudante/${idSolicitud}/rechazar`, 
      {}
    );
  }

  obtenerCategorias(): Observable<CategoriaSolicitud[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias-solicitud`).pipe(
      map(items => (items || []).map(cat => ({
        id_categoria: BigInt(cat.id_categoria),
        nombre: cat.nombre,
        descripcion: cat.descripcion || '',
        esActivo: cat.es_activo ?? cat.esActivo ?? true
      })))
    );
  }

}