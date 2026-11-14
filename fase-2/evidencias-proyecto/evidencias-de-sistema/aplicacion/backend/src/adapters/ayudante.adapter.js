const supabase = require('../config/supabase');

const {
  ObtenerAyudanteResolveDTO
} = require('../dtos/ayudante/ayudante.resolve.dto');


class AyudanteAdapter {

  async obtenerPorUsuario(id_usuario) {

    const { data, error } =
      await supabase
        .from('ayudante')
        .select(`
          id_ayudante,
          id_usuario,
          descripcion
        `)
        .eq(
          'id_usuario',
          id_usuario
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return new ObtenerAyudanteResolveDTO(
      data
    );
  }

}


module.exports =
  new AyudanteAdapter();