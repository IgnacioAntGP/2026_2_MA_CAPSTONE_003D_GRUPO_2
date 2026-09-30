export interface SolicitudAyudantia {
  id: string;
  id_alumno: string;
  estudiante: string;
  id_asignatura: number;
  asignatura: string;
  modalidad: 'foro_abierto' | 'ayudantia_directa';
  titulo_duda: string;
  descripcion_duda: string;
  estado: 'abierta' | 'en_proceso' | 'resuelta' | 'escalada';
  ayudante_asignado?: {
    id: string;
    nombre: string;
    email: string;
  };
}

export interface SolicitudAyudantiaPayloadNuevo {
  id_consulta: number | string;
  modalidad: string;
  motivo: string;
}