// Contrato de lectura (GET /api/consultas y GET /api/consultas/usuario/:id)
export interface Consulta {
  id_consulta?: number | string;
  id_usuario: number;
  id_asignatura: number;
  asignatura?: string;
  autor?: string;
  titulo: string;
  descripcion: string;
  total_respuestas?: number;
  fecha_creacion: string; // ISO 8601 = YYYY-MM-DDTHH:mm:ss.sssZ
  estado: boolean; // Por defecto true:'abierta' | false:'cerrada'
  tutoria_solicitada?: boolean;
}

// Payload de creación (POST /api/consultas) -> Coincide con pantalla nueva-publicacion
export interface NuevaConsulta {
  id_usuario: number;
  id_asignatura: number;
  titulo: string;
  descripcion: string;
  fecha_creacion: string; // ISO 8601 = YYYY-MM-DDTHH:mm:ss.sssZ
  estado?: boolean; // Por defecto true:'abierta' | false:'cerrada'
}