import { IAsignatura } from './IAsignatura';

export interface PostulacionAyudante {
  id_postulacion: number;
  id_usuario: number;
  id_asignatura?: number | null;
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

  asignatura: IAsignatura;
}