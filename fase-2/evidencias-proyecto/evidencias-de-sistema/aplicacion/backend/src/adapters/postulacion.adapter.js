const supabase = require('../config/supabase');
const _utilsAdapter = require('./utils.adapter');
const _especialidadAdapter = require('./especialidad.adapter');
const { CrearPostulacionAskDTO } = require('../dtos/postulacion/postulacion.ask.dto');
const { CrearPostulacionResolveDTO, ObtenerPostulacionResolveDTO, ResolverPostulacionResolveDTO } = require('../dtos/postulacion/postulacion.resolve.dto');

class PostulacionAdapter {

  // 10. Solicitar ser Ayudante
  async crearPostulacionAyudante(rawBody) {
    const inputDTO = new CrearPostulacionAskDTO(rawBody);

    // Verificar si el usuario ya tiene una postulación pendiente
    const tienePostulacionPendiente = await _utilsAdapter.tienePostulacionPendiente(inputDTO.id_usuario);

    if (tienePostulacionPendiente) {
      const error = new Error('Ya existe una postulación pendiente para este usuario.');
      error.statusCode = 409;
      throw error;
    }

    // Crear nueva postulación usando los datos del DTO de entrada
    const { data, error } = await supabase
      .from('postulacion_ayudante')
      .insert({
        id_usuario: inputDTO.id_usuario,
        motivo: inputDTO.motivo,
        experiencia: inputDTO.experiencia,
        estado: 'PENDIENTE'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Retornamos mapeado con el Resolve DTO de creación
    return new CrearPostulacionResolveDTO({
      ...data,
      mensaje: 'Postulación creada exitosamente'
    });
  }

  // Obtener postulaciones pendientes
  async obtenerPostulacionesPendientes() {
    const { data, error } = await supabase
      .from('postulacion_ayudante')
      .select(`
        id_postulacion,
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

    // Mapeamos cada elemento utilizando el Resolve DTO de obtención
    return (data || []).map(item => new ObtenerPostulacionResolveDTO(item));
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