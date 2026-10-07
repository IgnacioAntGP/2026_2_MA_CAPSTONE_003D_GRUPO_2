export interface SolicitudAyudantia {
  id_solicitud: number;
  asignatura: string;
  modalidad: 'foro_abierto' | 'ayudantia_directa';
  titulo_duda: string;
  duda?: string;               // Alias para compatibilidad directa con el HTML
  descripcion_duda: string;
  descripcion?: string;        // Alias para compatibilidad directa con el HTML
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'ACEPTADA' | 'RESUELTA';
  nombre_estudiante?: string;  // Para mostrar quién solicita apoyo
  estudiante?: string;         // Alias para compatibilidad directa con el HTML
  id_consulta?: number;
  id_ayudante?: number | null;
}

export interface PublicacionComunidad{
  id_consulta: number;
  titulo: string;
  descripcion: string;
  asignatura: string;
  autor: string;
  total_respuestas: number;
  respuestasCount?: number;    // Para el HTML
}

export interface SolicitudAyudantiaPayloadNuevo {
  id_consulta: number | string;
  modalidad: string;
  motivo: string;
}