import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Consulta, NuevaConsulta } from '../models/IConsulta';
import {
  SolicitudAyudantia,
  SolicitudAyudantiaPayloadNuevo
} from '../models/ISolicitudAyudantia';
import { RespuestaConsulta } from '../models/IRespuesta';
import { environment } from '../../environments/environment';
import { MisTutoria } from '../models/IMisTutorias';
import { PerfilUsuario } from '../models/IPerfil';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


  // 1. GET: Para la pantalla 'comunidad' (listar todas las consultas)
  obtenerConsultasComunidad(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(
      `${this.apiUrl}/consultas`
    );
  }


  // 2. POST: Para la pantalla 'nueva-publicacion' (crear consulta)
  crearConsulta(payload: NuevaConsulta): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/consultas`,
      payload
    );
  }


  // 3. GET: Para la pantalla 'mis-publicaciones' (consultas por usuario)
  obtenerMisConsultas(idUsuario: number): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(
      `${this.apiUrl}/consultas/usuario/${idUsuario}`
    );
  }


  // 4. GET: Obtener detalle de una consulta por ID
  obtenerConsultaPorId(idConsulta: number): Observable<Consulta> {
    return this.http.get<Consulta>(
      `${this.apiUrl}/consultas/${idConsulta}`
    );
  }


  // 5. GET: Respuestas para 'detalle-consulta'
  obtenerRespuestas(
    idConsulta: number | string
  ): Observable<RespuestaConsulta[]> {

    return this.http.get<RespuestaConsulta[]>(
      `${this.apiUrl}/consultas/${idConsulta}/respuestas`
    );
  }


  // 6. POST: Agregar respuesta en 'detalle-consulta'
  agregarRespuesta(
    idConsulta: number | string,
    idUsuario: number,
    contenido: string
  ): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/consultas/${idConsulta}/respuestas`,
      {
        id_usuario: idUsuario,
        contenido
      }
    );
  }


  // 7. POST: Para 'solicitar-tutoria' (escalar a ayudantía)
  solicitarTutoria(
    idConsulta: number | string,
    modalidad: string,
    motivo: string
  ): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/solicitudes-ayudantia`,
      {
        id_consulta: idConsulta,
        modalidad,
        motivo
      }
    );
  }

  // 8. GET: Para 'mis-tutorias' (solicitudes por usuario)
  obtenerMisTutorias(idUsuario: number): Observable<MisTutoria[]> {
    return this.http.get<MisTutoria[]>(
      `${this.apiUrl}/solicitudes-ayudantia/usuario/${idUsuario}`
    );
  }

  // 9. GET: Para 'mi-perfil' (datos de usuario, estudiante y roles)
  obtenerPerfil(idUsuario: number): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(
      `${this.apiUrl}/usuarios/${idUsuario}/perfil`
    );
  }
  // 10. PATCH: Para 'editar-perfil' (actualizar datos académicos permitidos)
  actualizarPerfil(
    idUsuario: number,
    carrera: string,
    semestre: number,
    institucion: string
  ): Observable<any> {

    return this.http.patch<any>(
      `${this.apiUrl}/usuarios/${idUsuario}/perfil`,
      {
        carrera,
        semestre,
        institucion
      }
    );
  }
  // 11. PATCH: Editar publicación
  actualizarConsulta(
    idConsulta: number,
    titulo: string,
    idAsignatura: number,
    descripcion: string
  ): Observable<any> {

    return this.http.patch<any>(
      `${this.apiUrl}/consultas/${idConsulta}`,
      {
        titulo,
        id_asignatura: idAsignatura,
        descripcion
      }
    );

  }
  // 9. PATCH: Desactivar publicación
  desactivarConsulta(idConsulta: number): Observable<any> {

    return this.http.patch<any>(
      `${this.apiUrl}/consultas/${idConsulta}/desactivar`,
      {}
    );

  }
  
  // 10. POST: Solicitar ser ayudante
  solicitarSerAyudante(
    idUsuario: number,
    motivo: string,
    experiencia: string
  ): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/solicitudes-ayudante`,
      {
        id_usuario: idUsuario,
        motivo,
        experiencia
      }
    );

  }

}