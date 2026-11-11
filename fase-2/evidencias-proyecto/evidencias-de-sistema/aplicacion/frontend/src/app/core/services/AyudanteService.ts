import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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


@Injectable({
  providedIn: 'root'
})
export class AyudanteService {

  private apiUrl =
    'http://localhost:3000/api';


  constructor(
    private http: HttpClient
  ) {}


  obtenerPerfilPublico(
    idUsuario: number
  ): Observable<PerfilPublicoAyudante> {

    return this.http.get<PerfilPublicoAyudante>(
      `${this.apiUrl}/ayudantes/usuario/${idUsuario}/perfil`
    );
  }

}