export interface Ayudantia {
    id_ayudantia: number;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    estado: string;
    observaciones: string | null;
    id_solicitud: number;
}