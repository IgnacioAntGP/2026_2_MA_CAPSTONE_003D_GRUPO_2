export interface CategoriaSolicitud{
    id_categoria: bigint;
    nombre: string;
    descripcion: string;
    esActivo: boolean;
}

export interface NuevaCategoriaSolicitud{
    nombre: string;
    descripcion: string;
    esActivo?: boolean;
};