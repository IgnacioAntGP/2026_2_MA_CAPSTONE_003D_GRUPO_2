const supabase = require('../config/supabase');

class ConsultaAdapter {
  // 1. Vista Comunidad: Listar consultas con joins y total_respuestas
  async obtenerTodas() {
    const { data, error } = await supabase
      .from('consulta')
      .select(`
        id_consulta,
        titulo,
        descripcion,
        fecha_creacion,
        asignatura (
          id_asignatura,
          nombre
        ),
        usuario (
          id_usuario,
          nombre
        ),
        respuesta (
          id_respuesta
        )
      `)
      .eq('estado', true)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    return data.map((item) => ({
      id_consulta: item.id_consulta,
      titulo: item.titulo,
      descripcion: item.descripcion,
      fecha_creacion: item.fecha_creacion,
      asignatura: item.asignatura?.nombre,
      autor: item.usuario?.nombre,
      total_respuestas: item.respuesta?.length || 0
    }));
  }

  // 2. Vista Nueva Publicación: Crear consulta
  async crear({ id_usuario, id_asignatura, titulo, descripcion }) {
    const { data, error } = await supabase
      .from('consulta')
      .insert([{ id_usuario, id_asignatura, titulo, descripcion }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // 3. Vista Mis Publicaciones: Listar por usuario
  async obtenerPorUsuario(id_usuario) {
    const { data, error } = await supabase
      .from('consulta')
      .select(`
        id_consulta,
        titulo,
        descripcion,
        fecha_creacion,
        asignatura (
          nombre
        ),
        solicitud_ayudantia (
          id_solicitud,
          estado
        ),
        respuesta (
          id_respuesta
        )
      `)
      .eq('id_usuario', id_usuario)
      .eq('estado', true)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    return data.map((item) => ({
      id_consulta: item.id_consulta,
      titulo: item.titulo,
      descripcion: item.descripcion,
      fecha_creacion: item.fecha_creacion,
      asignatura: item.asignatura?.nombre,
      total_respuestas: item.respuesta?.length || 0,
      tutoria_solicitada: item.solicitud_ayudantia?.length > 0
    }));
  }

  // 4. Vista Detalle de Consulta: Obtener por Consulta ID
  async obtenerPorId(id_consulta) {
    const { data, error } = await supabase
      .from('consulta')
      .select(`
        id_consulta,
        id_usuario,
        titulo,
        descripcion,
        fecha_creacion,
        estado,
        asignatura (
          id_asignatura,
          nombre
        ),
        usuario (
          id_usuario,
          nombre,
          apellido
        )
      `)
      .eq('id_consulta', id_consulta)
      .eq('estado', true)
      .single();

    if (error) throw error;

    return {
      id_consulta: data.id_consulta,
      id_usuario: data.id_usuario,
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha_creacion: data.fecha_creacion,
      asignatura: data.asignatura?.nombre,
      autor: `${data.usuario?.nombre ?? ''} ${data.usuario?.apellido ?? ''}`.trim()
    };
  }

  // 5. Vista Detalle Consulta: Respuestas
  async obtenerRespuestas(id_consulta) {
    const { data, error } = await supabase
      .from('respuesta')
      .select(`
        id_respuesta,
        contenido,
        fecha_respuesta,
        usuario (
          nombre,
          apellido
        )
      `)
      .eq('id_consulta', id_consulta)
      .eq('estado', true)
      .order('fecha_respuesta', { ascending: true });

    if (error) throw error;
    return data;
  }

  // 6. Vista Detalle Consulta: Agregar respuesta
  async agregarRespuesta(id_consulta, { id_usuario, contenido }) {
    const { data, error } = await supabase
      .from('respuesta')
      .insert([{ id_consulta, id_usuario, contenido }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // 8. Vista Editar Publicación
  async actualizar(id_consulta, { titulo, id_asignatura, descripcion }) {
    const { data, error } = await supabase
      .from('consulta')
      .update({ titulo, id_asignatura, descripcion })
      .eq('id_consulta', id_consulta)
      .eq('estado', true)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // 9. Acción: Desactivar publicación (baja lógica)
  async desactivar(id_consulta) {
    const { data, error } = await supabase
      .from('consulta')
      .update({ estado: false })
      .eq('id_consulta', id_consulta)
      .eq('estado', true)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new ConsultaAdapter();