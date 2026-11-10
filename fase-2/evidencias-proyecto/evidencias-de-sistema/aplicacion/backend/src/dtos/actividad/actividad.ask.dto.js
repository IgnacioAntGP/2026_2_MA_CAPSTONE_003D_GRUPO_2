// DTOs Ask (Entrada)
class CrearActividadAskDTO {
  constructor(body = {}) {
    this.idAyudantia = body.idAyudantia != null ? Number(body.idAyudantia) : null;
    this.idCategoria = body.idCategoria != null ? Number(body.idCategoria) : null;
    this.nombreActividad = body.nombreActividad ? String(body.nombreActividad).trim() : null;
    this.descripcion = body.descripcion ? String(body.descripcion).trim() : null;
  }
}

class ModificarActividadAskDTO {
    //TODO, RESOLVER POR ID_ESTADO_ACTIVIDAD, NO POR ESTADO
  constructor(body = {}) {
    this.idCategoria = body.idCategoria !== undefined ? Number(body.idCategoria) : undefined;
    this.nombreActividad =
      body.nombreActividad !== undefined ? String(body.nombreActividad).trim() : undefined;
    this.descripcion = body.descripcion !== undefined ? String(body.descripcion).trim() : undefined;
    this.estado = body.estado !== undefined ? String(body.estado).trim() : undefined;
    this.esActivo = body.esActivo !== undefined ? Boolean(body.esActivo) : undefined;
  }
}

module.exports = {
  CrearActividadAskDTO,
  ModificarActividadAskDTO
};