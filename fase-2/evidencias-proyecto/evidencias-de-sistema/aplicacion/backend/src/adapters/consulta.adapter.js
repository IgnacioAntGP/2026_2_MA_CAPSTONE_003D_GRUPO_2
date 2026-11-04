const supabase = require('../config/supabase');
const utilsAdapter = require('./utils.adapter'); 
const {
    ConsultaComunidadResolveDTO,
    ConsultaUsuarioResolveDTO,
    ConsultaDetalleResolveDTO,
    RespuestaConsultaResolveDTO
} = require('../dtos/consulta/consulta.resolve.dto');

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

    // Aplicando el DTO de resolución correspondiente
    return (data || []).map(item => new ConsultaComunidadResolveDTO(item));
  };

  // 2. Vista Nueva Publicación: Crear consulta
  async crear({ id_usuario, id_asignatura, titulo, descripcion }) {
    const { data, error } = await supabase
      .from('consulta')
      .insert([{ id_usuario, id_asignatura, titulo, descripcion }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

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
          id_postulacion,
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

    // Aplicando el DTO de resolución correspondiente a mis publicaciones
    return (data || []).map(item => new ConsultaUsuarioResolveDTO(item));
  };

  // 4. Vista Detalle de Consulta: Obtener por Consulta ID
  async obtenerPorId(id_consulta) {
    const existe = await utilsAdapter.existeConsultaActiva(id_consulta);
    if (!existe) {
      const err = new Error('La consulta no existe o ha sido desactivada.');
      err.statusCode = 404;
      throw err;
    }

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

    return new ConsultaDetalleResolveDTO(data);
  };

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

    // Retornando mapeado mediante el DTO de respuestas
    return new RespuestaConsultaResolveDTO(data).respuestas;
  };

  // 6. Vista Detalle Consulta: Agregar respuesta
  async agregarRespuesta(id_consulta, { id_usuario, contenido }) {
    const { data, error } = await supabase
      .from('respuesta')
      .insert([{ id_consulta, id_usuario, contenido }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // 8. Vista Editar Publicación
  async actualizar(id_consulta, { titulo, id_asignatura, descripcion }) {
    const existe = await utilsAdapter.existeConsultaActiva(id_consulta);
    if (!existe) {
      const err = new Error('No se puede actualizar una consulta inexistente.');
      err.statusCode = 404;
      throw err;
    }

    const { data, error } = await supabase
      .from('consulta')
      .update({ titulo, id_asignatura, descripcion })
      .eq('id_consulta', id_consulta)
      .eq('estado', true)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // 9. Acción: Desactivar publicación
  async desactivar(id_consulta) {
    const existe = await utilsAdapter.existeConsultaActiva(id_consulta);
    if (!existe) {
      const err = new Error('La consulta ya se encuentra inactiva o no existe.');
      err.statusCode = 404;
      throw err;
    }

    const { data, error } = await supabase
      .from('consulta')
      .update({ estado: false })
      .eq('id_consulta', id_consulta)
      .eq('estado', true)
      .select()
      .single();

    if (error) throw error;
    return data;
  };
}

module.exports = new ConsultaAdapter();