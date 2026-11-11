export enum ESTADO_ACTIVIDAD{
    PENDIENTE = 1,
    EN_PROCESO = 2,
    COMPLETADA = 3,
    CANCELADA = 4,
    EN_REVISION = 5,
}

export interface ICategoriaActividad {
    idCategoria: number;
    nombre: string;
    descripcion: string | null;
    fechaCreacion: Date;
}