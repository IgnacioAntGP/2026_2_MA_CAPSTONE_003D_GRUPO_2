const supabase = require('../config/supabase');

const { ObtenerUsuarioPerfilPublicoResolveDTO } = require('../dtos/usuario/usuario.resolve.dto');
const { ROL_POR_NOMBRE } = require('../helpers/enums/rol.enum');

const SELECT_USUARIO_CRUD = `
    id_usuario,
    user_uid,
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
      id_rol,
      fecha_asignacion,
      rol (
        id_rol,
        nombre,
        descripcion
      )
    )
  `;

class UsuarioAdapter {
  // Datos públicos necesarios para perfiles relacionados
  async obtenerPerfilPublico(id_usuario) {
    const { data, error } = await supabase
      .from('usuario')
      .select(
        `
          id_usuario,
          nombre,
          apellido,

          estudiante (
            carrera,
            semestre,
            institucion
          )
        `
      )
      .eq('id_usuario', id_usuario)
      .eq('es_activo', true)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return new ObtenerUsuarioPerfilPublicoResolveDTO(data);
  }

  // 9. Vista Mi Perfil: Datos principales y métricas
  async obtenerPerfilCompleto(id_usuario) {
    const { data, error } = await supabase
      .from('usuario')
      .select(
        `
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
      `
      )
      .eq('id_usuario', id_usuario)
      .eq('es_activo', true)
      .single();

    if (error) throw error;

    // Publicaciones activas
    const { count: totalPublicaciones, error: errPub } = await supabase
      .from('consulta')
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('id_usuario', id_usuario)
      .eq('estado', true);

    if (errPub) throw errPub;

    // Respuestas activas
    const { count: totalRespuestas, error: errResp } = await supabase
      .from('respuesta')
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('id_usuario', id_usuario)
      .eq('estado', true);

    if (errResp) throw errResp;

    // Ayudantías solicitadas
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
        .select('*', {
          count: 'exact',
          head: true
        })
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

      roles:
        data.usuario_rol
          ?.map((item) => ({
            id_rol: item.rol?.id_rol,

            nombre: item.rol?.nombre?.trim().toUpperCase(),

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
      .update({
        carrera,
        semestre,
        institucion
      })
      .eq('id_usuario', id_usuario)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Obtiene los roles activos de un usuario consultando "usuario_rol" y "rol".
   */
  async obtenerRolesPorIdUsuarioAsync(idUsuario) {
    const { data, error } = await supabase
      .from('usuario_rol')
      .select(
        `
        id_rol,
        rol (
          id_rol,
          nombre,
          descripcion
        )
      `
      )
      .eq('id_usuario', idUsuario);

    if (error) {
      throw error;
    }

    return (data || [])
      .map((item) => item.rol)
      .filter(Boolean)
      .map((rol) => ({
        ...rol,
        nombre: typeof rol.nombre === 'string' ? rol.nombre.trim().toUpperCase() : rol.nombre
      }));
  }

  async buscarPorIdAsync(id_usuario, { soloActivos = false } = {}) {
    let query = supabase.from('usuario').select(SELECT_USUARIO_CRUD).eq('id_usuario', id_usuario);

    if (soloActivos) {
      query = query.eq('es_activo', true);
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data;
  }

  async buscarPorCorreoAsync(correo) {
    const { data, error } = await supabase
      .from('usuario')
      .select('id_usuario, user_uid, correo, rut, es_activo')
      .eq('correo', correo)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async buscarPorRutAsync(rut) {
    const { data, error } = await supabase
      .from('usuario')
      .select('id_usuario, user_uid, correo, rut, es_activo')
      .eq('rut', rut)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async listarUsuariosAsync({ soloActivos = false } = {}) {
    let query = supabase
      .from('usuario')
      .select(SELECT_USUARIO_CRUD)
      .order('id_usuario', { ascending: true });

    if (soloActivos) {
      query = query.eq('es_activo', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async obtenerRolPorNombreAsync(nombreRol) {
    const nombreIngresado = String(nombreRol ?? '').trim().toUpperCase();
    const nombreNormalizado = ROL_POR_NOMBRE[nombreIngresado] ?? nombreIngresado;
    const { data, error } = await supabase
      .from('rol')
      .select('id_rol, nombre, descripcion')
      .ilike('nombre', nombreNormalizado)
      .maybeSingle();

    if (error) throw error;
    return data
      ? {
          ...data,
          nombre: typeof data.nombre === 'string' ? data.nombre.trim().toUpperCase() : data.nombre
        }
      : data;
  }

  async crearUsuarioAsync(datosUsuario) {
    const { data, error } = await supabase
      .from('usuario')
      .insert(datosUsuario)
      .select(SELECT_USUARIO_CRUD)
      .single();

    if (error) throw error;
    return data;
  }

  async asignarRolUsuarioAsync(id_usuario, id_rol) {
    const { data, error } = await supabase
      .from('usuario_rol')
      .upsert({ id_usuario, id_rol }, { onConflict: 'id_usuario,id_rol', ignoreDuplicates: true })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async sincronizarRolesUsuarioAsync(id_usuario, idsRoles = []) {
    const unicos = [...new Set(idsRoles.filter((id) => id != null))];

    if (unicos.length > 0) {
      const filas = unicos.map((id_rol) => ({
        id_usuario,
        id_rol
      }));

      const { error: errorUpsert } = await supabase
        .from('usuario_rol')
        .upsert(filas, {
          onConflict: 'id_usuario,id_rol',
          ignoreDuplicates: true
        });

      if (errorUpsert) throw errorUpsert;
    }

    const { data: rolesActuales, error: errorSelect } = await supabase
      .from('usuario_rol')
      .select('id_rol')
      .eq('id_usuario', id_usuario);

    if (errorSelect) throw errorSelect;

    const idsObsoletos = (rolesActuales || [])
      .map((rol) => rol.id_rol)
      .filter((id_rol) => !unicos.includes(id_rol));

    if (idsObsoletos.length > 0) {
      const { error: errorDelete } = await supabase
        .from('usuario_rol')
        .delete()
        .eq('id_usuario', id_usuario)
        .in('id_rol', idsObsoletos);

      if (errorDelete) throw errorDelete;
    }

    return unicos;
  }

  async actualizarUsuarioAsync(id_usuario, camposActualizar) {
    const { data, error } = await supabase
      .from('usuario')
      .update(camposActualizar)
      .eq('id_usuario', id_usuario)
      .select(SELECT_USUARIO_CRUD)
      .single();

    if (error) throw error;
    return data;
  }

  async cambiarEstadoActivoAsync(id_usuario, es_activo) {
    return this.actualizarUsuarioAsync(id_usuario, {
      es_activo: Boolean(es_activo)
    });
  }

  async eliminarUsuarioFisicoAsync(id_usuario) {
    const { error } = await supabase.from('usuario').delete().eq('id_usuario', id_usuario);

    if (error) throw error;
    return true;
  }

  async eliminarUsuarioPorUserUidFisicoAsync(user_uid) {
    const { error } = await supabase.from('usuario').delete().eq('user_uid', user_uid);

    if (error) throw error;
    return true;
  }
}

module.exports = new UsuarioAdapter();
