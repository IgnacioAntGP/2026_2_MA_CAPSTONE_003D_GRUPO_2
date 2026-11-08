// dto/consulta.resolve.dto.js

class UsuarioResumenResolveDTO {
    constructor(usuario = {}) {
        this.idUsuario = usuario.id_usuario || null;
        this.nombre = usuario.nombre || '';
        this.apellido = usuario.apellido || '';
    }
}

class RespuestaConsultaResolveDTO {
    constructor(respuestas = []) {
        this.respuestas = (respuestas || []).map(r => ({
            idRespuesta: r.id_respuesta || null,
            contenido: r.contenido || '',
            fechaRespuesta: r.fecha_respuesta || r.fecha_creacion || null,
            autor: new UsuarioResumenResolveDTO(r.usuario)
        }));
    }
}

class ConsultaComunidadResolveDTO {
    constructor(item = {}) {
        this.id_consulta = item.id_consulta || null;
        this.titulo = item.titulo || '';
        this.descripcion = item.descripcion || '';
        this.fecha_creacion = item.fecha_creacion || null;
        this.asignatura = item.asignatura?.nombre || '';
        this.autor = item.usuario?.nombre || '';
        this.total_respuestas = item.respuesta?.length || 0;
    }
}

class ConsultaUsuarioResolveDTO {
    constructor(item = {}) {
        this.idConsulta = item.id_consulta || null;
        this.titulo = item.titulo || '';
        this.descripcion = item.descripcion || '';
        this.fechaCreacion = item.fecha_creacion || null;
        this.asignatura = item.asignatura?.nombre || '';
        this.totalRespuestas = item.respuesta?.length || 0;
        this.tutoriaSolicitada = (item.solicitud_ayudantia || []).length > 0;
    }
}

class ConsultaDetalleResolveDTO {
    constructor(data = {}) {
        this.idConsulta = data.id_consulta || null;
        this.idUsuario = data.id_usuario || null;
        this.titulo = data.titulo || '';
        this.descripcion = data.descripcion || '';
        this.fechaCreacion = data.fecha_creacion || null;
        this.asignatura = data.asignatura?.nombre || '';
        const autorObj = new UsuarioResumenResolveDTO(data.usuario);
        this.autor = `${autorObj.nombre} ${autorObj.apellido}`.trim();
    }
}

module.exports = {
    ConsultaComunidadResolveDTO,
    ConsultaUsuarioResolveDTO,
    ConsultaDetalleResolveDTO,
    RespuestaConsultaResolveDTO
};
