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
  async crearPostulacionAyudante({
    id_usuario,
    motivo,
    experiencia
  }) {

    // Verificar si el usuario ya tiene una postulación pendiente
    const { data: postulacionesPendientes, error: errorValidacion } =
      await supabase
        .from('postulacion_ayudante')
        .select('id_solicitud')
        .eq('id_usuario', id_usuario)
        .eq('estado', 'PENDIENTE')
        .limit(1);

    if (errorValidacion) {
      throw errorValidacion;
    }

    if (
      postulacionesPendientes &&
      postulacionesPendientes.length > 0
    ) {
      const error = new Error(
        'Ya existe una postulación pendiente para este usuario.'
      );

      error.statusCode = 409;

      throw error;
    }


    // Crear nueva postulación
    const { data, error } = await supabase
      .from('postulacion_ayudante')
      .insert({
        id_usuario,
        motivo,
        experiencia,
        estado: 'PENDIENTE'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
  async obtenerPostulacionesPendientes() {
    const { data, error } = await supabase
      .from('postulacion_ayudante')
      .select(`
        id_solicitud,
        id_usuario,
        motivo,
        experiencia,
        fecha_solicitud,
        estado,
        usuario (
          nombre,
          apellido,
          correo,
          rut
        )
      `)
      .eq('estado', 'PENDIENTE')
      .order('fecha_solicitud', { ascending: false });

    if (error) throw error;

    return data;
  }

  async aprobarPostulacionAyudante(id_solicitud) {
    // 1. Obtener la postulación pendiente
    const { data: postulacion, error: errorPostulacion } = await supabase
      .from('postulacion_ayudante')
      .select('*')
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'PENDIENTE')
      .single();

    if (errorPostulacion) throw errorPostulacion;

    // 2. Obtener el rol Ayudante
    const { data: rolAyudante, error: errorRol } = await supabase
      .from('rol')
      .select('id_rol')
      .eq('nombre', 'Ayudante')
      .single();

    if (errorRol) throw errorRol;

    // 3. Revisar si el usuario ya tiene el rol
    const { data: usuarioRol, error: errorUsuarioRol } = await supabase
      .from('usuario_rol')
      .select('*')
      .eq('id_usuario', postulacion.id_usuario)
      .eq('id_rol', rolAyudante.id_rol)
      .maybeSingle();

    if (errorUsuarioRol) throw errorUsuarioRol;

    // 4. Asignar rol si todavía no lo tiene
    if (!usuarioRol) {
      const { error: errorAsignacionRol } = await supabase
        .from('usuario_rol')
        .insert({
          id_usuario: postulacion.id_usuario,
          id_rol: rolAyudante.id_rol
        });

      if (errorAsignacionRol) throw errorAsignacionRol;
    }

    // 5. Revisar si ya existe perfil de ayudante
    const { data: perfilAyudante, error: errorPerfil } = await supabase
      .from('ayudante')
      .select('*')
      .eq('id_usuario', postulacion.id_usuario)
      .maybeSingle();

    if (errorPerfil) throw errorPerfil;

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
        .eq('id_solicitud', id_solicitud)
        .select()
        .single();

    if (errorActualizar) throw errorActualizar;

    return postulacionActualizada;
  }
  async rechazarPostulacionAyudante(id_solicitud) {
    const { data, error } = await supabase
      .from('postulacion_ayudante')
      .update({
        estado: 'RECHAZADA'
      })
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'PENDIENTE')
      .select()
      .single();

    if (error) throw error;

    return data;
  }
}

module.exports = new UsuarioAdapter();