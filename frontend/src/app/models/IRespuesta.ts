export interface RespuestaConsulta {
  id_respuesta: number;
  contenido: string;
  fecha_respuesta: string;
  usuario?: {
    nombre: string;
    apellido: string;
  };
}