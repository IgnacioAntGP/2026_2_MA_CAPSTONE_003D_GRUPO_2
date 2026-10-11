const supabase = require('../config/supabase');

class UsuarioAdapter {
  // 9. Vista Mi Perfil: Datos principales y métricas
  async obtenerPerfilCompleto(id_usuario) {
    const { data, error } = await supabase
      .from('usuario')
      .select(`
        id_usuario,
        nombre,
        apellido,
        rut,
        correo,
        fecha_registro,
        ultimo_acceso,
        es_activo,
        estudiante (
          id_estudiante,
          carrera,
          semestre,
          institucion
        ),
        usuario_rol (
          rol (
            id_rol,
            nombre,
            descripcion
          )
        )
      `)
      .eq('id_usuario', id_usuario)
      .eq('es_activo', true)
      .single();

    if (error) throw error;

    // Publicaciones activas
    const { count: totalPublicaciones, error: errPub } = await supabase
      .from('consulta')
      .select('*', { count: 'exact', head: true })
      .eq('id_usuario', id_usuario)
      .eq('estado', true);

    if (errPub) throw errPub;

    // Respuestas activas
    const { count: totalRespuestas, error: errResp } = await supabase
      .from('respuesta')
      .select('*', { count: 'exact', head: true })
      .eq('id_usuario', id_usuario)
      .eq('estado', true);

    if (errResp) throw errResp;

    // Ayudantias solicitadas
    const { data: consultasUsuario, error: errCons } = await supabase
      .from('consulta')
      .select('id_consulta')
      .eq('id_usuario', id_usuario);

    if (errCons) throw errCons;

    const idsConsultas = consultasUsuario.map((item) => item.id_consulta);
    let totalAyudantias = 0;

    if (idsConsultas.length > 0) {
      const { count, error: errAyud } = await supabase
        .from('solicitud_ayudantia')
        .select('*', { count: 'exact', head: true })
        .in('id_consulta', idsConsultas);

      if (errAyud) throw errAyud;
      totalAyudantias = count || 0;
    }

    return {
      id_usuario: data.id_usuario,
      nombre: data.nombre,
      apellido: data.apellido,
      rut: data.rut,
      correo: data.correo,
      fecha_registro: data.fecha_registro,
      ultimo_acceso: data.ultimo_acceso,
      estudiante: data.estudiante
        ? {
            id_estudiante: data.estudiante.id_estudiante,
            carrera: data.estudiante.carrera,
            semestre: data.estudiante.semestre,
            institucion: data.estudiante.institucion
          }
        : null,
      roles: data.usuario_rol
        ?.map((item) => ({
          id_rol: item.rol?.id_rol,
          nombre: item.rol?.nombre,
          descripcion: item.rol?.descripcion
        }))
        .filter((rol) => rol.id_rol) ?? [],
      actividad: {
        publicaciones: totalPublicaciones || 0,
        respuestas: totalRespuestas || 0,
        tutorias_solicitadas: totalAyudantias || 0
      }
    };
  }

  // 7. Editar Perfil Académico
  async actualizarPerfilEstudiante(id_usuario, { carrera, semestre, institucion }) {
    const { data, error } = await supabase
      .from('estudiante')
      .update({ carrera, semestre, institucion })
      .eq('id_usuario', id_usuario)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // 10. Solicitar ser Ayudante
  async crearSolicitudAyudante({ id_usuario, motivo, experiencia }) {
    const { data, error } = await supabase
      .from('solicitud_ayudante')
      .insert({ id_usuario, motivo, experiencia })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new UsuarioAdapter();