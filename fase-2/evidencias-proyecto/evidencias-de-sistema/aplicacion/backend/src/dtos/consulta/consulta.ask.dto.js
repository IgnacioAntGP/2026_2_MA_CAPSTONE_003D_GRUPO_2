class CrearConsultaAskDTO {
    constructor(body = {}) {
        this.id_usuario = body.id_usuario || body.idUsuario || null;
        this.id_asignatura = body.id_asignatura || body.idAsignatura || null;
        this.titulo = body.titulo || '';
        this.descripcion = body.descripcion || '';
    }
}

class ActualizarConsultaAskDTO {
    constructor(body = {}) {
        this.titulo = body.titulo || '';
        this.id_asignatura = body.id_asignatura || body.idAsignatura || null;
        this.descripcion = body.descripcion || '';
    }
}

class AgregarRespuestaAskDTO {
    constructor(body = {}) {
        this.id_usuario = body.id_usuario || body.idUsuario || null;
        this.contenido = body.contenido || '';
    }
}

module.exports = {
    CrearConsultaAskDTO,
    ActualizarConsultaAskDTO,
    AgregarRespuestaAskDTO
};