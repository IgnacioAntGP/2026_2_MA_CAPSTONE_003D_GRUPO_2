export interface IAsignatura {
  id_asignatura: number;
  nombre: string;
  codigo: string;
  descripcion: string | null;
  estado: boolean;
}