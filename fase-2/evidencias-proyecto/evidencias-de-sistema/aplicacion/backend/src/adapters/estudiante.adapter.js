const supabase = require('../config/supabase');

class EstudianteAdapter {
  async guardarPerfilEstudianteAsync(id_usuario, datosPerfil = {}) {
    const { data, error } = await supabase
      .from('estudiante')
      .upsert(
        {
          id_usuario,
          carrera: datosPerfil.carrera ?? null,
          semestre: datosPerfil.semestre ?? null,
          institucion: datosPerfil.institucion ?? null
        },
        { onConflict: 'id_usuario' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async eliminarPerfilEstudianteAsync(id_usuario) {
    const { error } = await supabase.from('estudiante').delete().eq('id_usuario', id_usuario);

    if (error) throw error;
    return true;
  }
}

module.exports = new EstudianteAdapter();