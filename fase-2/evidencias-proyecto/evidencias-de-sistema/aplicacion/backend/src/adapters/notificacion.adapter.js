const supabase = require('../config/supabase');

class NotificacionAdapter {

  // Crear una nueva notificación
  async crearNotificacion({
    id_usuario_destino,
    id_usuario_origen = null,
    id_solicitud = null,
    tipo,
    titulo,
    mensaje
  }) {

    const { data, error } = await supabase
      .from('notificacion')
      .insert({
        id_usuario_destino,
        id_usuario_origen,
        id_solicitud,
        tipo,
        titulo,
        mensaje
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }


  // Obtener todas las notificaciones de un usuario
  async obtenerPorUsuario(id_usuario) {

    const { data, error } = await supabase
      .from('notificacion')
      .select(`
        id_notificacion,
        id_usuario_destino,
        id_usuario_origen,
        id_solicitud,
        tipo,
        titulo,
        mensaje,
        leida,
        fecha_creacion,
        fecha_lectura,

        usuario_origen:usuario!fk_notificacion_usuario_origen (
          id_usuario,
          nombre,
          apellido
        ),

        solicitud:solicitud_ayudantia!fk_notificacion_solicitud (
          id_solicitud,
          id_ayudante,
          modalidad,
          estado,

          ayudante (
            id_ayudante,
            id_usuario
          ),

          consulta (
            id_consulta,
            titulo,

            asignatura (
              id_asignatura,
              nombre
            )
          )
        )
      `)
      .eq(
        'id_usuario_destino',
        id_usuario
      )
      .order(
        'fecha_creacion',
        {
          ascending: false
        }
      );

    if (error) throw error;

    return data || [];
  }

  // Obtener cantidad de notificaciones no leídas
  async contarNoLeidas(id_usuario) {

    const { count, error } = await supabase
      .from('notificacion')
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('id_usuario_destino', id_usuario)
      .eq('leida', false);

    if (error) throw error;

    return count || 0;
  }


  // Marcar una notificación como leída
  async marcarComoLeida(
    id_notificacion,
    id_usuario
  ) {

    const { data, error } = await supabase
      .from('notificacion')
      .update({
        leida: true,
        fecha_lectura: new Date().toISOString()
      })
      .eq(
        'id_notificacion',
        id_notificacion
      )
      .eq(
        'id_usuario_destino',
        id_usuario
      )
      .select()
      .maybeSingle();

    if (error) throw error;

    return data;
  }

}

module.exports =
  new NotificacionAdapter();