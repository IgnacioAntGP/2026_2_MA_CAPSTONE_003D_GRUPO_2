export type EstadoAyudantia =
    | 'PENDIENTE'
    | 'ACEPTADA'
    | 'EN_CURSO'
    | 'FINALIZADA'
    | 'ESCALADA';

export interface Ayudantia {
    id_ayudantia: number;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    estado: EstadoAyudantia;
    observaciones: string | null;
    id_solicitud: number;
}

export type AyudantiaResumen = Pick<
    Ayudantia,
    'id_ayudantia' | 'id_solicitud' | 'estado'
>;