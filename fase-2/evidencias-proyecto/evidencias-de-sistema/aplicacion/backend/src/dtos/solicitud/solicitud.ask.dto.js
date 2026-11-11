class CrearSolicitudAyudantiaAskDTO {
  constructor(body = {}) {
    this.id_consulta = Number(body.id_consulta) || null;
    this.id_categoria = Number(body.id_categoria) || null;
    this.modalidad = body.modalidad ? String(body.modalidad).trim() : 'ONLINE';
    this.motivo = body.motivo ? String(body.motivo).trim() : '';
  }
}

class TomarSolicitudAyudantiaAskDTO {
  constructor(body = {}) {
    this.id_solicitud = body.id_solicitud != null ? Number(body.id_solicitud) : null;
    const ayudante = body.id_ayudante !== undefined ? body.id_ayudante : body.ayudanteId;
    this.id_ayudante = ayudante != null ? Number(ayudante) : null;
  }
}

module.exports = { CrearSolicitudAyudantiaAskDTO, TomarSolicitudAyudantiaAskDTO };
