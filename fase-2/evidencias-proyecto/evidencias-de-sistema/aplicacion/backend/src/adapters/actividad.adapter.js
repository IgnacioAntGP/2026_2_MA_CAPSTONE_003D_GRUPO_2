const supabase = require('../config/supabase');
const {
  CrearActividadResolveDTO,
  ObtenerListaActividadResolveDTO,
  ObtenerDetalleActividadResolveDTO,
  ModificarActividadResolveDTO,
  EliminarActividadResolveDTO
} = require('../dtos/actividad/actividad.resolve.dto');

// Clase encargada de mapear los estados estándar
class EstadoActividad {
  static PENDIENTE = 'Pendiente';
  static EN_PROCESO = 'En Proceso';
  static COMPLETADA = 'Completada';
  static CANCELADA = 'Cancelada';
}

class ActividadAdapter {
  async crearActividad(idAyudantia, inputDTO) {
    //TODO ver si está llegando correctamente los elementos para crear la actividad
    const { data, error } = await supabase
      .from('actividad_ayudantia')
      .insert({
        id_ayudantia: Number(idAyudantia),
        id_categoria: inputDTO.idCategoria,
        nombre_actividad: inputDTO.nombreActividad,
        descripcion: inputDTO.descripcion,
        estado: EstadoActividad.PENDIENTE,
        es_activo: true
      })
      .select()
      .single();

    if (error) throw error;
    return new CrearActividadResolveDTO(data);
  }

  async obtenerPorAyudantia(idAyudantia) {
    const { data, error } = await supabase
      .from('actividad_ayudantia')
      .select(
        `
        *,
        categoria_actividad (
            nombre
        )
      `
      )
      .eq('id_ayudantia', idAyudantia)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;
    return (data || []).map((item) => new ObtenerListaActividadResolveDTO(item));
  }

  async obtenerPorId(idAyudantia, idActividad) {
    const { data, error } = await supabase
      .from('actividad_ayudantia')
      .select(
        `
        *,
        categoria_actividad (
            nombre
        )
      `
      )
      .eq('id_ayudantia', idAyudantia)
      .eq('id_actividad', idActividad)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return new ObtenerDetalleActividadResolveDTO(data);
  }

  async modificarActividad(idAyudantia, idActividad, inputDTO) {
    //TODO, RESOLVER POR ID_ESTADO_ACTIVIDAD, NO POR ESTADO
    const updatePayload = {};

    if (inputDTO.idCategoria !== undefined) updatePayload.id_categoria = inputDTO.idCategoria;
    if (inputDTO.nombreActividad !== undefined)
      updatePayload.nombre_actividad = inputDTO.nombreActividad;
    if (inputDTO.descripcion !== undefined) updatePayload.descripcion = inputDTO.descripcion;

    if (inputDTO.estado !== undefined) {
      updatePayload.estado = inputDTO.estado;

      if (inputDTO.estado === EstadoActividad.COMPLETADA) {
        updatePayload.fecha_completado = new Date().toISOString();
      } else {
        updatePayload.fecha_completado = null;
      }
    }

    if (inputDTO.esActivo !== undefined) updatePayload.es_activo = inputDTO.esActivo;

    updatePayload.fecha_modificacion = new Date().toISOString();

    const { data, error } = await supabase
      .from('actividad_ayudantia')
      .update(updatePayload)
      .eq('id_ayudantia', idAyudantia)
      .eq('id_actividad', idActividad)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return new ModificarActividadResolveDTO(data);
  }

  async eliminarActividad(idAyudantia, idActividad) {
    const { data, error } = await supabase
      .from('actividad_ayudantia')
      .delete()
      .eq('id_ayudantia', idAyudantia)
      .eq('id_actividad', idActividad)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return new EliminarActividadResolveDTO(idActividad);
  }
}

module.exports = new ActividadAdapter();
