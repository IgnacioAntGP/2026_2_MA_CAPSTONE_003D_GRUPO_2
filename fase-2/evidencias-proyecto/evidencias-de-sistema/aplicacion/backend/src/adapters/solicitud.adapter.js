const supabase = require('../config/supabase');

class SolicitudAdapter {
  // 7. Solicitar ayudantía
  async crearSolicitud({ id_consulta, id_categoria, modalidad, motivo }) {
    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .insert([{
        id_consulta,
        id_categoria,
        modalidad,
        motivo,
        estado: 'PENDIENTE'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // 8. Mis Solicitudes (por estudiante)
  async obtenerPorEstudiante(id_usuario) {
    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .select(`
        id_solicitud,
        modalidad,
        fecha_solicitud,
        estado,
        motivo,
        consulta!inner (
          id_consulta,
          id_usuario,
          titulo,
          asignatura ( nombre )
        ),
        ayudante (
          id_ayudante,
          usuario ( nombre, apellido )
        ),
        ayudantia (
          id_ayudantia,
          fecha_inicio,
          fecha_fin,
          estado,
          observaciones
        )
      `)
      .eq('consulta.id_usuario', id_usuario)
      .order('fecha_solicitud', { ascending: false });

    if (error) throw error;

    return data.map((item) => ({
      id_solicitud: item.id_solicitud,
      id_consulta: item.consulta?.id_consulta,
      titulo: item.consulta?.titulo,
      asignatura: item.consulta?.asignatura?.nombre,
      modalidad: item.modalidad,
      fecha_solicitud: item.fecha_solicitud,
      estado_solicitud: item.estado,
      motivo: item.motivo,
      ayudante: item.ayudante
        ? `${item.ayudante.usuario?.nombre ?? ''} ${item.ayudante.usuario?.apellido ?? ''}`.trim()
        : null,
      ayudantia: Array.isArray(item.ayudantia)
        ? item.ayudantia[0] ?? null
        : item.ayudantia ?? null
    }));
  }

  // 11. Vista Ayudante - Solicitudes Disponibles: Obtener solicitudes sin ayudante asignado
  async obtenerDisponibles() {
    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .select(`
        id_solicitud,
        id_consulta,
        id_ayudante,
        modalidad,
        fecha_solicitud,
        estado,
        motivo,
        consulta (
          titulo,
          descripcion,
          usuario ( nombre, apellido ),
          asignatura ( nombre )
        )
      `)
      .eq('estado', 'PENDIENTE')
      .is('id_ayudante', null)
      .order('fecha_solicitud', { ascending: true });

    if (error) throw error;

    return data.map((item) => ({
      id_solicitud: item.id_solicitud,
      id_consulta: item.id_consulta,
      asignatura: item.consulta?.asignatura?.nombre || null,
      modalidad: item.modalidad,
      titulo_duda: item.consulta?.titulo || null,
      titulo: item.consulta?.titulo || null,
      descripcion_duda: item.consulta?.descripcion || null,
      motivo: item.consulta?.descripcion || null,
      estado: item.estado || 'PENDIENTE',
      estudiante: item.consulta?.usuario ? `${item.consulta.usuario.nombre || ''} ${item.consulta.usuario.apellido || ''}`.trim() : null,
      fecha_solicitud: item.fecha_solicitud
    }));
  }

  // 12. Tomar Solicitud
  async tomarSolicitud(id_solicitud, ayudanteId) {
    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .update({
        id_ayudante: ayudanteId,
        estado: 'EN_PROCESO'
      })
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'PENDIENTE')
      .is('id_ayudante', null)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // 13. Aceptar Ayudante y Crear Ayudantía
  async aceptarAyudante(id_solicitud) {
    const { data: solicitud, error: errorSolicitud } = await supabase
      .from('solicitud_ayudantia')
      .select('*')
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'EN_PROCESO')
      .not('id_ayudante', 'is', null)
      .maybeSingle();

    if (errorSolicitud) throw errorSolicitud;
    if (!solicitud) return { noDisponible: true };

    const { data: solicitudActualizada, error: errorActualizar } = await supabase
      .from('solicitud_ayudantia')
      .update({ estado: 'ACEPTADA' })
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'EN_PROCESO')
      .select()
      .single();

    if (errorActualizar) throw errorActualizar;

    const { data: ayudantia, error: errorAyudantia } = await supabase
      .from('ayudantia')
      .insert({
        id_solicitud: Number(id_solicitud),
        fecha_inicio: new Date().toISOString(),
        estado: 'ACEPTADA',
        observaciones: null
      })
      .select()
      .single();

    if (errorAyudantia) {
      await supabase
        .from('solicitud_ayudantia')
        .update({ estado: 'EN_PROCESO' })
        .eq('id_solicitud', id_solicitud);
      throw errorAyudantia;
    }

    return { solicitud: solicitudActualizada, ayudantia };
  }

  // 14. Rechazar Ayudante
  async rechazarAyudante(id_solicitud) {
    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .update({
        id_ayudante: null,
        estado: 'PENDIENTE'
      })
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'EN_PROCESO')
      .not('id_ayudante', 'is', null)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // 15. Finalizar y resolver ayudantía
  async resolverAyudantia(id_solicitud) {
    const { data: solicitud, error: errorSolicitud } = await supabase
      .from('solicitud_ayudantia')
      .select('*')
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'ACEPTADA')
      .maybeSingle();

    if (errorSolicitud) throw errorSolicitud;
    if (!solicitud) return { noAceptada: true };

    const { data: ayudantiaActual, error: errorBuscarAyudantia } = await supabase
      .from('ayudantia')
      .select('*')
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'ACTIVA')
      .maybeSingle();

    if (errorBuscarAyudantia) throw errorBuscarAyudantia;
    if (!ayudantiaActual) return { noActiva: true };

    const { data: ayudantiaFinalizada, error: errorAyudantia } = await supabase
      .from('ayudantia')
      .update({
        estado: 'FINALIZADA',
        fecha_fin: new Date().toISOString()
      })
      .eq('id_ayudantia', ayudantiaActual.id_ayudantia)
      .eq('estado', 'ACTIVA')
      .select()
      .single();

    if (errorAyudantia) throw errorAyudantia;

    const { data: solicitudResuelta, error: errorResolver } = await supabase
      .from('solicitud_ayudantia')
      .update({ estado: 'RESUELTA' })
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'ACEPTADA')
      .select()
      .single();

    if (errorResolver) {
      await supabase
        .from('ayudantia')
        .update({
          estado: 'ACTIVA',
          fecha_fin: null
        })
        .eq('id_ayudantia', ayudantiaActual.id_ayudantia);
      throw errorResolver;
    }

    return { solicitud: solicitudResuelta, ayudantia: ayudantiaFinalizada };
  }

    // Helper para resolver perfil de ayudante por usuario
  async obtenerAyudantePorUsuario(id_usuario) {
    const { data, error } = await supabase
      .from('ayudante')
      .select('id_ayudante')
      .eq('id_usuario', id_usuario)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // 16. Mis Ayudantías (por ayudante)
  async obtenerPorAyudante(id_usuario) {
    const perfil = await this.obtenerAyudantePorUsuario(id_usuario);
    if (!perfil) return [];

    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .select(`
        id_solicitud,
        modalidad,
        fecha_solicitud,
        estado,
        motivo,
        consulta (
          titulo,
          descripcion,
          asignatura ( nombre ),
          usuario ( nombre, apellido )
        )
      `)
      .eq('id_ayudante', perfil.id_ayudante)
      .in('estado', ['EN_PROCESO', 'ACEPTADA'])
      .order('fecha_solicitud', { ascending: false });

    if (error) throw error;

    return data.map((item) => ({
      id_solicitud: item.id_solicitud,
      asignatura: item.consulta?.asignatura?.nombre || 'General',
      titulo_duda: item.consulta?.titulo || '',
      descripcion_duda: item.motivo || item.consulta?.descripcion || '',
      estado: item.estado,
      estudiante: item.consulta?.usuario
        ? `${item.consulta.usuario.nombre || ''} ${item.consulta.usuario.apellido || ''}`.trim()
        : 'Estudiante'
    }));
  }
}

module.exports = new SolicitudAdapter();