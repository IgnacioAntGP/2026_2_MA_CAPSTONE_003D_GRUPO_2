class CrearAyudantiaAskDTO {
  constructor(rawBody = {}) {
    this.idSolicitud = rawBody.id_solicitud ? Number(rawBody.id_solicitud) : null;
    this.fechaInicio = rawBody.fecha_inicio
      ? new Date(rawBody.fecha_inicio).toISOString()
      : new Date().toISOString();
    this.estado = rawBody.estado || 'ACEPTADA';
    this.observaciones = rawBody.observaciones ?? null;
  }
}

class ModificarAyudantiaAskDTO {
  constructor(rawBody = {}) {
    this.idAyudantia = rawBody.id_ayudantia ? Number(rawBody.id_ayudantia) : null;
    this.idSolicitud =
      rawBody.id_solicitud !== undefined ? Number(rawBody.id_solicitud) : undefined;
    this.fechaInicio = rawBody.fecha_inicio
      ? new Date(rawBody.fecha_inicio).toISOString()
      : undefined;
    this.fechaFin = rawBody.fecha_fin ? new Date(rawBody.fecha_fin).toISOString() : undefined;
    this.estado = rawBody.estado !== undefined ? rawBody.estado : undefined;
    this.observaciones = rawBody.observaciones !== undefined ? rawBody.observaciones : undefined;
  }
}

module.exports = { CrearAyudantiaAskDTO, ModificarAyudantiaAskDTO };