class CrearEspecialidadAskDTO {
    constructor(body = {}) {
        this.id_usuario = body.id_usuario != null ? Number(body.id_usuario) : null;
        this.id_asignatura = body.id_asignatura != null ? Number(body.id_asignatura) : null;
        this.nivel_competencia = body.nivel_competencia ? String(body.nivel_competencia).trim().toUpperCase() : 'HABILITADO';
    }
}

module.exports = {
    CrearEspecialidadAskDTO
};