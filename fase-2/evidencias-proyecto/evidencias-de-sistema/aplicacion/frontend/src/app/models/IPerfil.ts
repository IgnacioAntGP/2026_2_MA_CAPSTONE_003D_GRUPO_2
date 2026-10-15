export interface PerfilUsuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  rut: string;
  correo: string;
  fecha_registro: string;
  ultimo_acceso: string | null;

  estudiante: {
    id_estudiante: number;
    carrera: string;
    semestre: number;
    institucion: string;
  } | null;

  roles: {
    id_rol: number;
    nombre: string;
    descripcion: string;
  }[];

  actividad: {
  publicaciones: number;
  respuestas: number;
  tutorias_solicitadas: number;
  };
}