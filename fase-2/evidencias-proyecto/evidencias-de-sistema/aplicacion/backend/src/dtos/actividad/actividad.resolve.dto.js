// DTO Base que contiene los datos completos de la Actividad
class ObtenerListaActividadResolveDTO {
  constructor(item = {}) {
    // Identificadores
    this.idActividad = item.id_actividad != null ? Number(item.id_actividad) : null;
    this.idAyudantia = item.id_ayudantia != null ? Number(item.id_ayudantia) : null;
    this.idCategoria = item.id_categoria != null ? Number(item.id_categoria) : null;
    this.idEstadoActividad =
      item.id_estado_actividad != null ? Number(item.id_estado_actividad) : null;

    // Descriptores
    this.categoria =
      item.categoria_actividad?.nombre != null ? String(item.categoria_actividad.nombre) : null;
    this.nombreActividad = item.nombre_actividad != null ? String(item.nombre_actividad) : '';
    this.descripcion = item.descripcion ?? '';
    this.estado = item.estado ?? 'Pendiente';
    this.esActivo = item.es_activo ?? true;

    // Fechas
    this.fechaCreacion = item.fecha_creacion ? new Date(item.fecha_creacion) : new Date();
    this.fechaModificacion = item.fecha_modificacion ?? null;
    this.fechaCompletado = item.fecha_completado ?? null;
  }
}

class ObtenerDetalleActividadResolveDTO extends ObtenerListaActividadResolveDTO {}

class CrearActividadResolveDTO {
  constructor(data = {}) {
    this.actividad = new ObtenerListaActividadResolveDTO(data);
    this.mensaje = data.mensaje || 'Actividad creada exitosamente';
  }
}

class ModificarActividadResolveDTO {
  constructor(data = {}) {
    this.actividad = new ObtenerListaActividadResolveDTO(data);
    this.mensaje = data.mensaje || 'Actividad modificada con éxito';
  }
}

class EliminarActividadResolveDTO {
  constructor(idActividad) {
    this.actividad = {
      idActividad: Number(idActividad)
    };
    this.mensaje = 'Actividad eliminada permanentemente del sistema';
  }
}

module.exports = {
  ObtenerListaActividadResolveDTO,
  ObtenerDetalleActividadResolveDTO,
  CrearActividadResolveDTO,
  ModificarActividadResolveDTO,
  EliminarActividadResolveDTO
};