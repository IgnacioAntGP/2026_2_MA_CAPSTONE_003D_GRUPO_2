const supabase = require('../config/supabase');

async function esAyudante(id_usuario) {
  const { data, error } = await supabase
    .from('ayudante')
    .select('id_ayudante')
    .eq('id_usuario', id_usuario)
    .maybeSingle();

  if (error) {
    throw new Error(`Error al verificar si el usuario es ayudante: ${error.message}`);
  }

  return !!data;
}

async function existePostulacionPendiente(id_consulta) {
  const { data, error } = await supabase
    .from('solicitud_ayudantia')
    .select('id_solicitud')
    .eq('id_consulta', id_consulta)
    .eq('estado', 'PENDIENTE')
    .maybeSingle();

  if (error) {
    throw new Error(`Error al verificar postulaciones pendientes: ${error.message}`);
  }

  return !!data;
}

async function existeConsultaActiva(id_consulta) {
        const { data, error } = await supabase
            .from('consulta')
            .select('id_consulta')
            .eq('id_consulta', id_consulta)
            .eq('estado', true)
            .maybeSingle();

        if (error) {
            throw new Error(`Error al verificar la consulta: ${error.message}`);
        }

        return !!data;
    }

module.exports = {
  esAyudante,
  existePostulacionPendiente,
  existeConsultaActiva
};