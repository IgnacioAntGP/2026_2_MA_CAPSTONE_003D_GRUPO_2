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

  /**
   * Inserta una nueva postulación de ayudante en la base de datos.
   */
  async crearPostulacion({ id_usuario, motivo, experiencia }) {
    const { data, error } = await supabase
      .from('solicitud_ayudante')
      .insert([
        { id_usuario, motivo, experiencia, estado: 'PENDIENTE' }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}

module.exports = new PostulacionAdapter();