export interface ICrearEspecialidadAsk {
  id_usuario: number;
  id_asignatura: number;
  nivel_competencia?: string;
}

export interface ICrearEspecialidadResolve {
  id_ayudante: number;
  id_asignatura: number;
  nivel_competencia: string;
  fecha_habilitacion: Date | null;
  mensaje: string;
}

export interface IObtenerEspecialidadesResolve {
  id_asignatura: number;
  nivel_competencia: string;
  fecha_habilitacion: Date | null;
  asignatura: {
    nombre: string;
    codigo: string;
  } | null;
}