export interface IActividad {
  idActividad: number;
  idAyudantia: number;
  idCategoria: number;
  idEstadoActividad: number;
  categoria: string | null;
  nombreActividad: string;
  descripcion: string;
  estado: string;
  esActivo: boolean;
  fechaCreacion: Date;
  fechaModificacion: string | null;
  fechaCompletado: string | null;
}