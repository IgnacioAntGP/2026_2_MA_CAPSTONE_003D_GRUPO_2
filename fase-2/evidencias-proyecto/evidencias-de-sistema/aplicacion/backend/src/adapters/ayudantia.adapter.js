const supabase = require('../config/supabase');

class AyudantiaAdapter {
  async guardarAyudantia(inputDTO) {
    const payloadInsert = {
      id_solicitud: inputDTO.idSolicitud,
      fecha_inicio: inputDTO.fechaInicio,
      estado: inputDTO.estado,
      observaciones: inputDTO.observaciones
    };

    const { data: ayudantia, error: errorAyudantia } = await supabase
      .from('ayudantia')
      .insert(payloadInsert)
      .select()
      .single();

    if (errorAyudantia) {
      throw errorAyudantia;
    }

    return ayudantia;
  }

  async obtenerAllAyudantias(){

  }

  async obtenerAyudantiaPorId(idAyudantia) {
    const { data: ayudantia, error: errorAyudantia } = await supabase
      .from('ayudantia')
      .select('*')
      .eq('id_ayudantia', idAyudantia)
      .single();

    if (errorAyudantia || !ayudantia) {
      return null;
    }

    const { data: actividades, error: errorActividades } = await supabase
      .from('actividad_ayudantia')
      .select(`
        *,
        categoria_actividad (
          id_categoria,
          nombre,
          descripcion
        ),
        estado_actividad (
          id_estado_actividad,
          nombre
        )
      `)
      .eq('id_ayudantia', idAyudantia);

    return {
      ...ayudantia,
      actividades: errorActividades ? [] : actividades
    };
  }

  async guardarActividadAyudantia(idAyudantia, inputDTO) {
    const payloadInsert = {
      id_ayudantia: Number(idAyudantia),
      nombre_actividad: inputDTO.nombreActividad,
      descripcion: inputDTO.descripcion,
      es_activo: true,
      id_categoria: inputDTO.idCategoria,
      id_estado_actividad: inputDTO.idEstadoActividad || 1 
    };

    const { data: actividad, error: errorActividad } = await supabase
      .from('actividad_ayudantia')
      .insert(payloadInsert)
      .select()
      .single();

    if (errorActividad) {
      throw errorActividad;
    }

    return actividad;
  }
}

module.exports = new AyudantiaAdapter();
