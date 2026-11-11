// DTO para crear una nueva postulación para ser ayudante
class CrearPostulacionAskDTO{
    constructor(body = {}){
        this.id_usuario = body.id_usuario || null;
        this.id_asignatura = (body.id_asignatura && body.id_asignatura !== 'null') 
            ? Number(body.id_asignatura) 
            : null;
        this.motivo = body.motivo ? String(body.motivo).trim() : null;
        this.experiencia = body.experiencia ? String(body.experiencia).trim() : null;
    }
}

// DTO para obtener la informacion de una postulacion
class ObtenerPostulacionAskDTO{
    constructor(body = {}){
        this.id_postulacion = body.id_postulacion || null;
    }
}

module.exports = {CrearPostulacionAskDTO, ObtenerPostulacionAskDTO};