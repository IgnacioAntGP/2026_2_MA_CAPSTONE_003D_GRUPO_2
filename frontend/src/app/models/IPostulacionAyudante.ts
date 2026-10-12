export interface PostulacionAyudante {
  id_solicitud: number;
  id_usuario: number;
  motivo: string;
  experiencia: string;
  fecha_solicitud: string;
  estado: string;

  usuario: {
    rut: string;
    correo: string;
    nombre: string;
    apellido: string;
  };
}