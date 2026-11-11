// DTO de respuesta de postulación para ser ayudante
class CrearPostulacionResolveDTO {
    constructor(body = {}) {
        this.id_postulacion = body.id_postulacion != null ? Number(body.id_postulacion) : null;
        this.id_asignatura = body.id_asignatura ? Number(body.id_asignatura) : null;
        this.id_usuario = body.id_usuario != null ? Number(body.id_usuario) : null;
        this.mensaje = body.mensaje != null ? String(body.mensaje) : '';
    }
}

// DTO de respuesta para obtener la información de una postulación
class ObtenerPostulacionResolveDTO {
    constructor(body = {}) {
        this.id_postulacion = body.id_postulacion != null ? Number(body.id_postulacion) : null;
        this.id_asignatura = body.id_asignatura != null ? Number(body.id_asignatura) : null;
        this.motivo = body.motivo != null ? String(body.motivo) : '';
        this.experiencia = body.experiencia != null ? String(body.experiencia) : '';
        this.estado = body.estado != null ? String(body.estado) : '';
        this.fecha_solicitud = body.fecha_solicitud ? new Date(body.fecha_solicitud) : null;
        this.usuario = body.usuario || null;
        this.asignatura = body.asignatura || null;
    }
}

// DTO de respuesta para resolver la solicitud de postulación - Aprobar/Rechazar
class ResolverPostulacionResolveDTO {
    constructor(body = {}) {
        this.id_postulacion = body.id_postulacion != null ? Number(body.id_postulacion) : null;
        this.mensaje = body.mensaje != null ? String(body.mensaje) : '';
    }
}

module.exports = {
    CrearPostulacionResolveDTO, 
    ObtenerPostulacionResolveDTO,
    ResolverPostulacionResolveDTO
};