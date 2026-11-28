import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EspecialidadAyudante {
  id_asignatura: number;
  asignatura: string | null;
  codigo: string | null;
  nivel_competencia: string | null;
}

export interface EstadisticasAyudante {
  ayudantias_finalizadas: number;
  total_evaluaciones: number;
  promedio_valoracion: number | null;
}

export interface PerfilPublicoAyudante {
  id_ayudante: number;
  id_usuario: number;

  nombre: string;
  apellido: string;

  descripcion: string | null;

  carrera: string | null;
  semestre: number | null;
  institucion: string | null;

  especialidades: EspecialidadAyudante[];

  estadisticas: EstadisticasAyudante;
}

interface RespuestaPerfilPublicoAyudante {
  esAyudante: boolean;
  perfil: PerfilPublicoAyudante | null;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AyudanteService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  obtenerTodos(): Observable<PerfilPublicoAyudante[]> {
    return this.http.get<PerfilPublicoAyudante[]>(`${this.apiUrl}/ayudantes`);
  }

  obtenerPerfilPublico(idUsuario: number): Observable<PerfilPublicoAyudante> {
    return this.http
      .get<RespuestaPerfilPublicoAyudante>(
        `${this.apiUrl}/ayudantes/usuario/${idUsuario}/perfil`
      )
      .pipe(
        map((respuesta) => {
          if (!respuesta.esAyudante || !respuesta.perfil) {
            throw new Error(
              respuesta.mensaje || 'El usuario no tiene un perfil de ayudante.'
            );
          }

          return respuesta.perfil;
        })
      );
  }
}
