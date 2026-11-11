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
  static PENDIENTE = 1;
  static EN_PROCESO = 2;
  static COMPLETADA = 3;
  static CANCELADA = 4;
}

class ActividadAdapter {
  async crearActividad(inputDTO) {

    let payloadInsert = {
      id_ayudantia: inputDTO.idAyudantia,
      id_categoria: inputDTO.idCategoria,
      nombre_actividad: inputDTO.nombreActividad,
      descripcion: inputDTO.descripcion,
      id_estado_actividad: EstadoActividad.PENDIENTE,
      es_activo: true
    }

    const { data, error } = await supabase
      .from('actividad_ayudantia')
      .insert([payloadInsert])
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
    const updatePayload = {};

    if (inputDTO.idCategoria !== undefined) updatePayload.id_categoria = inputDTO.idCategoria;
    if (inputDTO.nombreActividad !== undefined)
      updatePayload.nombre_actividad = inputDTO.nombreActividad;
    if (inputDTO.descripcion !== undefined) updatePayload.descripcion = inputDTO.descripcion;

    if (inputDTO.idEstadoActividad !== undefined) {
      updatePayload.id_estado_actividad = inputDTO.idEstadoActividad;

      if (inputDTO.idEstadoActividad === 3) {
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
