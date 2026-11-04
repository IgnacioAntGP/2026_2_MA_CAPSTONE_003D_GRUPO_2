class CrearEspecialidadResolveDTO {
    constructor(body = {}) {
        this.id_ayudante = body.id_ayudante != null ? Number(body.id_ayudante) : null;
        this.id_asignatura = body.id_asignatura != null ? Number(body.id_asignatura) : null;
        this.nivel_competencia = body.nivel_competencia != null ? String(body.nivel_competencia) : '';
        this.fecha_habilitacion = body.fecha_habilitacion ? new Date(body.fecha_habilitacion) : null;
        this.mensaje = body.mensaje != null ? String(body.mensaje) : '';
    }
}

module.exports = {
    CrearEspecialidadResolveDTO
};