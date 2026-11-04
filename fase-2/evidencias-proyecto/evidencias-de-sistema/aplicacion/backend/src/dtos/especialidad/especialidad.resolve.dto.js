class CrearEspecialidadResolveDTO {
    constructor(body = {}) {
        this.id_ayudante = body.id_ayudante != null ? Number(body.id_ayudante) : null;
        this.id_asignatura = body.id_asignatura != null ? Number(body.id_asignatura) : null;
        this.nivel_competencia = body.nivel_competencia != null ? String(body.nivel_competencia) : '';
        this.fecha_habilitacion = body.fecha_habilitacion ? new Date(body.fecha_habilitacion) : null;
        this.mensaje = body.mensaje != null ? String(body.mensaje) : '';
    }
}

// DTO para formatear cada elemento al listar las especialidades de un ayudante
class ObtenerEspecialidadesResolveDTO {
    constructor(item = {}) {
        this.id_asignatura = item.id_asignatura != null ? Number(item.id_asignatura) : null;
        this.nivel_competencia = item.nivel_competencia != null ? String(item.nivel_competencia) : '';
        this.fecha_habilitacion = item.fecha_habilitacion ? new Date(item.fecha_habilitacion) : null;

        // Mapeamos los datos de la relación con la asignatura si vienen incluidos
        this.asignatura = item.asignatura ? {
            nombre: item.asignatura.nombre || '',
            codigo: item.asignatura.codigo || ''
        } : null;
    }
}

module.exports = {
    CrearEspecialidadResolveDTO,
    ObtenerEspecialidadesResolveDTO
};