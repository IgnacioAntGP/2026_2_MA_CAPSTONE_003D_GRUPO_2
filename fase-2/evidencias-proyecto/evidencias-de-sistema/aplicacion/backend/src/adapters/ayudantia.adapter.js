const supabase = require('../config/supabase');

const {
  ObtenerAyudantiaResolveDTO
} = require('../dtos/ayudantia/ayudantia.resolve.dto');

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
  
  async obtenerFinalizadasPorSolicitudes(
    idsSolicitudes = []
  ) {

    if (
      !Array.isArray(idsSolicitudes) ||
      idsSolicitudes.length === 0
    ) {
      return [];
    }

    const { data, error } =
      await supabase
        .from('ayudantia')
        .select(`
          id_ayudantia,
          id_solicitud,
          fecha_inicio,
          fecha_fin,
          estado,
          observaciones
        `)
        .in(
          'id_solicitud',
          idsSolicitudes
        )
        .eq(
          'estado',
          'FINALIZADA'
        );

    if (error) {
      throw error;
    }

    return (data || []).map(
      (item) =>
        new ObtenerAyudantiaResolveDTO(
          item
        )
    );
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
}

module.exports = new AyudantiaAdapter();
