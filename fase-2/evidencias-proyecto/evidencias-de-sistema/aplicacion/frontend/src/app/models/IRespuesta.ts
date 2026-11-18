export interface RespuestaConsulta {
  id_respuesta: number;
  contenido: string;
  fecha_respuesta: string;
  autor?: {
    nombre: string;
    apellido: string;
  };
}