// DTO para la entidad Consulta y su Asignatura
class ConsultaResolveDTO {
  constructor(item = {}) {
    this.id_consulta = item.id_consulta != null ? Number(item.id_consulta) : null;
    this.id_usuario = item.id_usuario != null ? Number(item.id_usuario) : null;
    this.titulo = item.titulo || '';
    this.descripcion = item.descripcion || null;
    this.asignatura = item.asignatura?.nombre || item.asignatura || 'General';
  }
}

// DTO para la entidad Ayudante y su Usuario asociado
class AyudanteResolveDTO {
  constructor(item = {}) {
    this.id_ayudante = item.id_ayudante != null ? Number(item.id_ayudante) : null;
    this.nombre_completo = item.usuario
      ? `${item.usuario.nombre ?? ''} ${item.usuario.apellido ?? ''}`.trim()
      : null;
  }
}

// DTO para la entidad Ayudantia (Ejecución 1:1)
class AyudantiaResolveDTO {
  constructor(item = {}) {
    this.id_ayudantia = item.id_ayudantia != null ? Number(item.id_ayudantia) : null;
    this.fecha_inicio = item.fecha_inicio ? new Date(item.fecha_inicio) : null;
    this.fecha_fin = item.fecha_fin ? new Date(item.fecha_fin) : null;
    this.estado = item.estado || '';
    this.observaciones = item.observaciones != null ? String(item.observaciones).trim() : null;
  }
}

class ObtenerSolicitudDisponibleResolveDTO {
  constructor(item = {}) {
    this.id_solicitud = item.id_solicitud != null ? Number(item.id_solicitud) : null;
    this.id_consulta = item.id_consulta != null ? Number(item.id_consulta) : null;
    this.id_categoria = item.id_categoria != null ? Number(item.id_categoria) : null;
    this.categoria_nombre = item.categoria_solicitud?.nombre || 'General';
    this.asignatura = item.consulta?.asignatura?.nombre || 'General';
    this.modalidad = item.modalidad || '';
    this.titulo_duda = item.consulta?.titulo || null;
    this.descripcion_duda = item.motivo || item.consulta?.descripcion || null;
    this.estado = item.estado || 'PENDIENTE';

    // Extracción segura del estudiante solicitante
    this.estudiante = item.consulta?.usuario
      ? `${item.consulta.usuario.nombre || ''} ${item.consulta.usuario.apellido || ''}`.trim()
      : 'Estudiante';

    this.fecha_solicitud = item.fecha_solicitud ? new Date(item.fecha_solicitud) : null;
  }
}

class ObtenerSolicitudPorEstudianteResolveDTO {
  constructor(item = {}) {
    this.id_solicitud = item.id_solicitud != null ? Number(item.id_solicitud) : null;
    this.modalidad = item.modalidad || '';
    this.fecha_solicitud = item.fecha_solicitud ? new Date(item.fecha_solicitud) : null;
    this.estado_solicitud = item.estado || 'PENDIENTE';
    this.motivo = item.motivo || null;

    // Composición utilizando los DTOs especializados
    this.consulta = item.consulta ? new ConsultaResolveDTO(item.consulta) : null;
    this.ayudante = item.ayudante ? new AyudanteResolveDTO(item.ayudante) : null;
    this.ayudantia = item.ayudantia ? new AyudantiaResolveDTO(item.ayudantia) : null;
  }
}

module.exports = { ObtenerSolicitudDisponibleResolveDTO, ObtenerSolicitudPorEstudianteResolveDTO };
