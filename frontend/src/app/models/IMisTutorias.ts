export interface MisTutoria {
  id_solicitud: number;
  id_consulta: number;
  titulo: string;
  asignatura: string;
  modalidad: string;
  fecha_solicitud: string;
  estado_solicitud: string;
  motivo: string;
  ayudante: string | null;
  ayudantia: {
    id_ayudantia: number;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    estado: string;
    observaciones: string | null;
  } | null;
}