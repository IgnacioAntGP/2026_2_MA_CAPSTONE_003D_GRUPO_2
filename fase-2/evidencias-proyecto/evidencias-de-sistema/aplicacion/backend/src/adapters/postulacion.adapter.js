// src/adapters/postulacion.adapter.js
const supabase = require('../config/supabase');

class PostulacionAdapter {
  /**
   * Obtiene el listado completo de solicitudes pendientes o disponibles.
   */
  async obtenerDisponibles() {
    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .select(`
        id_postulacion,
        modalidad,
        estado,
        motivo,
        consulta:id_consulta ( titulo, descripcion )
      `)
      .eq('estado', 'PENDIENTE')
      .order('fecha_solicitud', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Aprobar postulación de ayudante
  async aprobarPostulacionAyudante(id_postulacion, id_asignatura = null) {
    // 1. Obtener la postulación pendiente
    const { data: postulacion, error: errorPostulacion } = await supabase
      .from('postulacion_ayudante')
      .select('*')
      .eq('id_postulacion', id_postulacion)
      .eq('estado', 'PENDIENTE')
      .maybeSingle();

    if (errorPostulacion) throw errorPostulacion;

    if (!postulacion) {
      const err = new Error('La postulación no existe o ya fue procesada.');
      err.name = 'NotFoundError';
      throw err;
    }

    // 2. Obtener el rol Ayudante
    const { data: rolAyudante, error: errorRol } = await supabase
      .from('rol')
      .select('id_rol')
      .eq('nombre', 'Ayudante')
      .single();

    if (errorRol) throw errorRol;

    // 3. Revisar si el usuario ya tiene el rol de ayudante
    const esAyudante = await _utilsAdapter.esAyudante(postulacion.id_usuario);

    // 4. Asignar rol si todavía no lo tiene
    if (!esAyudante) {
      const { error: errorAsignacionRol } = await supabase
        .from('usuario_rol')
        .insert({
          id_usuario: postulacion.id_usuario,
          id_rol: rolAyudante.id_rol
        });

      if (errorAsignacionRol) throw errorAsignacionRol;
    }

    // 5. Revisar si ya existe perfil de ayudante
    const perfilAyudante = await _utilsAdapter.tienePerfilAyudante(postulacion.id_usuario);

    // 6. Crear perfil de ayudante si no existe
    if (!perfilAyudante) {
      const { error: errorCrearPerfil } = await supabase
        .from('ayudante')
        .insert({
          id_usuario: postulacion.id_usuario,
          descripcion: postulacion.experiencia
        });

      if (errorCrearPerfil) throw errorCrearPerfil;
    }

    // 7. Marcar la postulación como aprobada
    const { data: postulacionActualizada, error: errorActualizar } =
      await supabase
        .from('postulacion_ayudante')
        .update({
          estado: 'APROBADA'
        })
        .eq('id_postulacion', id_postulacion)
        .select()
        .maybeSingle();

    if (errorActualizar) throw errorActualizar;

    // 8. Insertar la especialidad del ayudante si se proporciona una asignatura
    if (id_asignatura) {
      const ayudante = await _utilsAdapter.obtenerAyudantePorIdUsuario(postulacion.id_usuario);
      const id_ayudante = ayudante.id_ayudante;
      await _especialidadAdapter.crearEspecialidad(id_ayudante, id_asignatura);
    }

    // 9. Retornar la postulación aprobada
    // Retornamos mapeado con el Resolve DTO de resolución
    return new ResolverPostulacionResolveDTO({
      id_postulacion: postulacionActualizada.id_postulacion,
      mensaje: 'Postulación aprobada exitosamente'
    });
  }

  // Rechazar postulación de ayudante
  async rechazarPostulacionAyudante(id_postulacion) {
    const { data, error } = await supabase
      .from('postulacion_ayudante')
      .update({
        estado: 'RECHAZADA'
      })
      .eq('id_postulacion', id_postulacion)
      .eq('estado', 'PENDIENTE')
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const err = new Error('La postulación no existe o ya fue procesada.');
      err.name = 'NotFoundError';
      throw err;
    }

    // Retornamos mapeado con el Resolve DTO de resolución
    return new ResolverPostulacionResolveDTO({
      id_postulacion: data.id_postulacion,
      mensaje: 'Postulación rechazada exitosamente'
    });
  }
}

module.exports = new PostulacionAdapter();