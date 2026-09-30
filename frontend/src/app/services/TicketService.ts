import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta, NuevaConsulta } from '../models/IConsulta';
import {SolicitudAyudantia, SolicitudAyudantiaPayloadNuevo } from '../models/ISolicitudAyudantia';
import { RespuestaConsulta } from '../models/IRespuesta';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 1. GET: Para la pantalla 'comunidad' (listar todas las consultas)
  obtenerConsultasComunidad(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}/consultas`);
  }

  // 2. POST: Para la pantalla 'nueva-publicacion' (crear consulta)
  crearConsulta(payload: NuevaConsulta): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/consultas`, payload);
  }

  // 3. GET: Para la pantalla 'mis-publicaciones' (consultas por usuario)
  obtenerMisConsultas(idUsuario: number): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}/consultas/usuario/${idUsuario}`);
  }

  // 4. GET: Respuestas para 'detalle-consulta'
  obtenerRespuestas(idConsulta: number | string): Observable<RespuestaConsulta[]> {
    return this.http.get<RespuestaConsulta[]>(`${this.apiUrl}/consultas/${idConsulta}/respuestas`);
  }

  // 5. POST: Agregar respuesta en 'detalle-consulta'
  agregarRespuesta(idConsulta: number | string, idUsuario: number, contenido: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/consultas/${idConsulta}/respuestas`, {
      id_usuario: idUsuario,
      contenido
    });
  }

  // 6. POST: Para 'solicitar-tutoria' (escalar a ayudantía)
  solicitarTutoria(idConsulta: number | string, modalidad: string, motivo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/solicitudes-ayudantia`, {
      id_consulta: idConsulta,
      modalidad,
      motivo
    });
  }
}