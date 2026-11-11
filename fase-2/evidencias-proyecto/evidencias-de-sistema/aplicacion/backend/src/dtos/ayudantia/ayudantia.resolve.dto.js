class CrearAyudantiaResolveDTO {
  constructor(rawBody = {}) {
    this.ayudantia = new ObtenerAyudantiaResolveDTO(rawBody.ayudantia || {});
    this.mensaje = rawBody.mensaje ? String(rawBody.mensaje) : 'Ayudantía creada con éxito';
  }
}

class ObtenerAyudantiaResolveDTO {
  constructor(rawBody = {}) {
    this.idAyudantia = rawBody.id_ayudantia ? Number(rawBody.id_ayudantia) : null;
    this.idSolicitud = rawBody.id_solicitud ? Number(rawBody.id_solicitud) : null;
    this.fechaInicio = rawBody.fecha_inicio ? new Date(rawBody.fecha_inicio).toISOString() : null;
    this.fechaFin = rawBody.fecha_fin ? new Date(rawBody.fecha_fin).toISOString() : null;
    this.estado = rawBody.estado || 'ACEPTADA';
    this.observaciones = rawBody.observaciones ?? null;
  }
}

class ObtenerAyudantiaDetalleResolveDTO {
  constructor(rawBody = {}, actividades = []) {
    this.idAyudantia = rawBody.id_ayudantia ? Number(rawBody.id_ayudantia) : null;
    this.idSolicitud = rawBody.id_solicitud ? Number(rawBody.id_solicitud) : null;
    this.fechaInicio = rawBody.fecha_inicio ? new Date(rawBody.fecha_inicio).toISOString() : null;
    this.fechaFin = rawBody.fecha_fin ? new Date(rawBody.fecha_fin).toISOString() : null;
    this.estado = rawBody.estado || 'ACEPTADA';
    this.observaciones = rawBody.observaciones ?? null;
    this.actividades = actividades;
  }
}

class ModificarAyudantiaResolveDTO {
  constructor(rawBody = {}) {
    this.ayudantia = rawBody.ayudantia ? new ObtenerAyudantiaResolveDTO(rawBody.ayudantia) : null;
    this.mensaje = rawBody.mensaje ? String(rawBody.mensaje) : 'Ayudantía modificada con éxito';
  }
}

class EliminarAyudantiaResolveDTO {
  constructor(rawBody = {}) {
    this.idAyudantia = rawBody.id_ayudantia ? Number(rawBody.id_ayudantia) : null;
    this.mensaje = rawBody.mensaje ? String(rawBody.mensaje) : 'Ayudantía eliminada con éxito';
  }
}

module.exports = {
  CrearAyudantiaResolveDTO,
  ObtenerAyudantiaResolveDTO,
  ModificarAyudantiaResolveDTO,
  EliminarAyudantiaResolveDTO,
  ObtenerAyudantiaDetalleResolveDTO
};