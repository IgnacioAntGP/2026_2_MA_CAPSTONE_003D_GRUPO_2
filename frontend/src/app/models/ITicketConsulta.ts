export interface TicketConsulta {
  id_ticket?: string;
  id_alumno: string;
  id_asignatura: number;
  asignatura_nombre?: string; // Para mostrar en pantalla
  modalidad: 'foro_abierto' | 'ayudantia_directa';
  estado_resolucion?: 'abierta' | 'en_proceso' | 'resuelta' | 'escalada';
  titulo_duda: string;
  descripcion_duda: string;
  fecha_creacion?: string;
}

export interface TicketNuevo {
  id_alumno: string;
  id_asignatura: number;
  modalidad: 'foro_abierto' | 'ayudantia_directa';
  titulo_duda: string;
  descripcion_duda: string;
}