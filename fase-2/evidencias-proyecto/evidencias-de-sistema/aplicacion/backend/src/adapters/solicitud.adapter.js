const supabase = require('../config/supabase');
const {
  CrearSolicitudAyudantiaAskDTO,
  TomarSolicitudAyudantiaAskDTO
} = require('../dtos/solicitud/solicitud.ask.dto');
const {
  ObtenerSolicitudDisponibleResolveDTO,
  ObtenerSolicitudEstudianteResolveDTO,
  ObtenerSolicitudAyudanteResolveDTO
} = require('../dtos/solicitud/solicitud.resolve.dto');
const ayudantiaAdapter = require('./ayudantia.adapter.js');
const { ID_ESTADO_ACTIVIDAD } = require('../helpers/enums/estado-actividad.enum');
const { ESTADO_AYUDANTIA } = require('../helpers/enums/estado-ayudantia.enum');
const { ESTADO_SOLICITUD_AYUDANTIA } = require('../helpers/enums/estado-solicitud.enum');


class SolicitudAdapter {

  // 7. Solicitar ayudantía
  async crearSolicitud(body) {
    const inputDTO = new CrearSolicitudAyudantiaAskDTO(body);

    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .insert([
        {
          id_consulta: inputDTO.id_consulta,
          id_categoria: inputDTO.id_categoria,
          modalidad: inputDTO.modalidad,
          motivo: inputDTO.motivo,
          estado: ESTADO_SOLICITUD_AYUDANTIA.PENDIENTE
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error devuelto por Supabase:', error);
      throw error;
    }

    return data;
  }

  // 8. Mis Solicitudes (por estudiante)
  async obtenerPorEstudiante(id_usuario) {
    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .select(
        `
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
      `
      )
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
        ? (item.ayudantia[0] ? { id_ayudantia: item.ayudantia[0].id_ayudantia } : null)
        : (item.ayudantia ? { id_ayudantia: item.ayudantia.id_ayudantia } : null)
    }));
  }

  // 11. Vista AYUDANTE - Solicitudes Disponibles
  async obtenerDisponibles(id_categoria = null, ayudanteId) {
    let selectSolicitudes = supabase
      .from('solicitud_ayudantia')
      .select(
        `
        id_solicitud,
        id_consulta,
        id_categoria,
        id_ayudante,
        modalidad,
        fecha_solicitud,
        estado,
        motivo,
        categoria_solicitud (
          nombre,
          es_especialidad
        ),
        consulta (
          id_asignatura,
          titulo,
          descripcion,
          usuario ( nombre, apellido ),
          asignatura ( nombre )
        )
      `
      )
      .eq('estado', ESTADO_SOLICITUD_AYUDANTIA.PENDIENTE)
      .is('id_ayudante', null);

    const categoriaId = Number(id_categoria);

    if (
      id_categoria &&
      id_categoria !== 'todas' &&
      id_categoria !== 'null' &&
      id_categoria !== 'undefined' &&
      !isNaN(categoriaId)
    ) {
      selectSolicitudes = selectSolicitudes.eq('id_categoria', categoriaId);
    }

    const { data, error } = await selectSolicitudes.order('fecha_solicitud', { ascending: true });

    if (error) throw error;

    const { data: especialidades, error: errorEspecialidades } = await supabase
      .from('especialidad_ayudante')
      .select('id_asignatura')
      .eq('id_ayudante', ayudanteId);

    if (errorEspecialidades) throw errorEspecialidades;

    const idsAsignaturasEspecializadas = new Set(
      (especialidades || []).map((especialidad) => Number(especialidad.id_asignatura))
    );

    return (data || [])
      .filter((item) => {
        if (!item.categoria_solicitud?.es_especialidad) return true;

        const idAsignatura = Number(item.consulta?.id_asignatura);
        return Number.isFinite(idAsignatura) &&
          idsAsignaturasEspecializadas.has(idAsignatura);
      })
      .map((item) => ({
        id_solicitud: item.id_solicitud,
        id_consulta: item.id_consulta,
        id_asignatura: item.consulta?.id_asignatura ?? null,
        id_categoria: item.id_categoria,
        categoria_nombre: item.categoria_solicitud?.nombre || 'General',
        asignatura: item.consulta?.asignatura?.nombre || 'General',
        modalidad: item.modalidad,
        titulo_duda: item.consulta?.titulo || null,
        descripcion_duda: item.motivo || item.consulta?.descripcion || null,
        estado: item.estado || ESTADO_SOLICITUD_AYUDANTIA.PENDIENTE,
        estudiante: item.consulta?.usuario
          ? `${item.consulta.usuario.nombre || ''} ${item.consulta.usuario.apellido || ''}`.trim()
          : 'ESTUDIANTE',
        fecha_solicitud: item.fecha_solicitud
      }));
  }

  // 12. Tomar Solicitud
  async tomarSolicitud(id_solicitud, ayudanteId) {
    const { data: solicitud, error: errorSolicitud } = await supabase
      .from('solicitud_ayudantia')
      .select(`
        id_solicitud,
        estado,
        id_ayudante,
        categoria_solicitud (
          es_especialidad
        ),
        consulta (
          id_asignatura
        )
      `)
      .eq('id_solicitud', id_solicitud)
      .eq('estado', ESTADO_SOLICITUD_AYUDANTIA.PENDIENTE)
      .is('id_ayudante', null)
      .maybeSingle();

    if (errorSolicitud) throw errorSolicitud;
    if (!solicitud) return null;

    if (solicitud.categoria_solicitud?.es_especialidad) {
      const idAsignatura = Number(solicitud.consulta?.id_asignatura);
      if (!Number.isFinite(idAsignatura)) return { noAutorizado: true };

      const { data: especialidad, error: errorEspecialidad } = await supabase
        .from('especialidad_ayudante')
        .select('id_asignatura')
        .eq('id_ayudante', ayudanteId)
        .eq('id_asignatura', idAsignatura)
        .maybeSingle();

      if (errorEspecialidad) throw errorEspecialidad;
      if (!especialidad) return { noAutorizado: true };
    }

    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .update({
        id_ayudante: ayudanteId,
        estado: ESTADO_SOLICITUD_AYUDANTIA.EN_PROCESO
      })
      .eq('id_solicitud', id_solicitud)
      .eq('estado', ESTADO_SOLICITUD_AYUDANTIA.PENDIENTE)
      .is('id_ayudante', null)
      .select(`
        id_solicitud,
        id_consulta,
        id_ayudante,
        modalidad,
        fecha_solicitud,
        estado,
        motivo,
        id_categoria,

        consulta (
          id_usuario,
          titulo
        ),

        ayudante (
          id_usuario,
          usuario (
            nombre,
            apellido
          )
        )
      `)
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  // 13. Aceptar AYUDANTE y Crear Ayudantía
  async aceptarAyudante(id_solicitud) {
    const { data: solicitud, error: errorSolicitud } = await supabase
        .from('solicitud_ayudantia')
        .select('*')
        .eq('id_solicitud', id_solicitud)
        .eq('estado', ESTADO_SOLICITUD_AYUDANTIA.EN_PROCESO)
        .not('id_ayudante', 'is', null)
        .maybeSingle();

    if (errorSolicitud) throw errorSolicitud;
    if (!solicitud) return { noDisponible: true };

    const { data: solicitudActualizada, error: errorActualizar } = await supabase
        .from('solicitud_ayudantia')
        .update({ estado: ESTADO_SOLICITUD_AYUDANTIA.ACEPTADA })
        .eq('id_solicitud', id_solicitud)
        .eq('estado', ESTADO_SOLICITUD_AYUDANTIA.EN_PROCESO)
        .select()
        .single();

    if (errorActualizar) throw errorActualizar;

    try {
        const resultadoAyudantia = await ayudantiaAdapter.guardarAyudantia({
            id_solicitud: id_solicitud,
            fecha_inicio: new Date().toISOString(),
            estado: ESTADO_AYUDANTIA.ACEPTADA,
            observaciones: null
        });

        return {
            solicitud: solicitudActualizada,
            ayudantia: resultadoAyudantia.ayudantia,
            mensaje: "Ayudantía creada con éxito"
        };

    } catch (errorAyudantia) {
        await supabase
            .from('solicitud_ayudantia')
            .update({ estado: ESTADO_SOLICITUD_AYUDANTIA.EN_PROCESO })
            .eq('id_solicitud', id_solicitud);

        throw errorAyudantia;
    }
  };

  // 14. Rechazar AYUDANTE
  async rechazarAyudante(id_solicitud) {
    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .update({
        id_ayudante: null,
        estado: ESTADO_SOLICITUD_AYUDANTIA.PENDIENTE
      })
      .eq('id_solicitud', id_solicitud)
      .eq('estado', ESTADO_SOLICITUD_AYUDANTIA.EN_PROCESO)
      .not('id_ayudante', 'is', null)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // 15. Finalizar y resolver ayudantía
  async resolverAyudantia(id_solicitud, id_usuario, esAdministrador = false) {
    const { data: solicitud, error: errorSolicitud } = await supabase
      .from('solicitud_ayudantia')
      .select('*')
      .eq('id_solicitud', id_solicitud)
      .eq('estado', ESTADO_SOLICITUD_AYUDANTIA.ACEPTADA)
      .maybeSingle();

    if (errorSolicitud) throw errorSolicitud;
    if (!solicitud) return { noAceptada: true };

    if (!esAdministrador) {
      const perfilAyudante = await this.obtenerAyudantePorUsuario(id_usuario);
      if (
        !perfilAyudante ||
        Number(perfilAyudante.id_ayudante) !== Number(solicitud.id_ayudante)
      ) {
        return { noAutorizado: true };
      }
    }

    const { data: ayudantiaActual, error: errorBuscarAyudantia } = await supabase
      .from('ayudantia')
      .select('*')
      .eq('id_solicitud', id_solicitud)
      .in('estado', [ESTADO_AYUDANTIA.ACEPTADA, ESTADO_AYUDANTIA.EN_CURSO])
      .maybeSingle();

    if (errorBuscarAyudantia) throw errorBuscarAyudantia;
    if (!ayudantiaActual) return { noActiva: true };

    const { data: actividades, error: errorActividades } = await supabase
      .from('actividad_ayudantia')
      .select('id_estado_actividad')
      .eq('id_ayudantia', ayudantiaActual.id_ayudantia);

    if (errorActividades) throw errorActividades;
    const estadosFinalizables = [
      ID_ESTADO_ACTIVIDAD.COMPLETADA,
      ID_ESTADO_ACTIVIDAD.CANCELADA
    ];
    if (
      !actividades?.length ||
      actividades.some((actividad) => !estadosFinalizables.includes(Number(actividad.id_estado_actividad)))
    ) {
      return { actividadesPendientes: true };
    }

    const { data: ayudantiaFinalizada, error: errorAyudantia } = await supabase
      .from('ayudantia')
      .update({
        estado: ESTADO_AYUDANTIA.FINALIZADA,
        fecha_fin: new Date().toISOString()
      })
      .eq('id_ayudantia', ayudantiaActual.id_ayudantia)
      .in('estado', [ESTADO_AYUDANTIA.ACEPTADA, ESTADO_AYUDANTIA.EN_CURSO])
      .select()
      .single();

    if (errorAyudantia) throw errorAyudantia;

    const { data: solicitudResuelta, error: errorResolver } = await supabase
      .from('solicitud_ayudantia')
      .update({ estado: ESTADO_SOLICITUD_AYUDANTIA.RESUELTA })
      .eq('id_solicitud', id_solicitud)
      .eq('estado', ESTADO_SOLICITUD_AYUDANTIA.ACEPTADA)
      .select()
      .single();

    if (errorResolver) {
      await supabase
        .from('ayudantia')
        .update({
          estado: ayudantiaActual.estado,
          fecha_fin: null
        })
        .eq('id_ayudantia', ayudantiaActual.id_ayudantia);

      throw errorResolver;
    }

    return {
      solicitud: solicitudResuelta,
      ayudantia: ayudantiaFinalizada
    };
  }

  async escalarAyudantia(id_solicitud, id_usuario, esAdministrador = false) {
    const { data: solicitud, error: errorSolicitud } = await supabase
      .from('solicitud_ayudantia')
      .select('*')
      .eq('id_solicitud', id_solicitud)
      .eq('estado', ESTADO_SOLICITUD_AYUDANTIA.ACEPTADA)
      .maybeSingle();

    if (errorSolicitud) throw errorSolicitud;
    if (!solicitud) return { noAceptada: true };

    if (!esAdministrador) {
      const perfilAyudante = await this.obtenerAyudantePorUsuario(id_usuario);
      if (
        !perfilAyudante ||
        Number(perfilAyudante.id_ayudante) !== Number(solicitud.id_ayudante)
      ) {
        return { noAutorizado: true };
      }
    }

    const { data: ayudantiaActual, error: errorBuscarAyudantia } = await supabase
      .from('ayudantia')
      .select('*')
      .eq('id_solicitud', id_solicitud)
      .in('estado', [ESTADO_AYUDANTIA.ACEPTADA, ESTADO_AYUDANTIA.EN_CURSO])
      .maybeSingle();

    if (errorBuscarAyudantia) throw errorBuscarAyudantia;
    if (!ayudantiaActual) return { noActiva: true };

    const { data: ayudantiaEscalada, error: errorEscalar } = await supabase
      .from('ayudantia')
      .update({
        estado: ESTADO_AYUDANTIA.ESCALADA,
        fecha_fin: new Date().toISOString()
      })
      .eq('id_ayudantia', ayudantiaActual.id_ayudantia)
      .in('estado', [ESTADO_AYUDANTIA.ACEPTADA, ESTADO_AYUDANTIA.EN_CURSO])
      .select()
      .single();

    if (errorEscalar) throw errorEscalar;

    return {
      solicitud,
      ayudantia: ayudantiaEscalada
    };
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
      .select(
        `
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
        ),
        ayudantia (
          id_ayudantia,
          fecha_inicio,
          fecha_fin,
          estado,
          observaciones
        )
      `
      )
      .eq('id_ayudante', perfil.id_ayudante)
      .in('estado', [
        ESTADO_SOLICITUD_AYUDANTIA.EN_PROCESO,
        ESTADO_SOLICITUD_AYUDANTIA.ACEPTADA,
        ESTADO_SOLICITUD_AYUDANTIA.RESUELTA
      ])
      .order('fecha_solicitud', { ascending: false });

    if (error) throw error;

    return data.map((item) => {
      const ayudantiaRel = Array.isArray(item.ayudantia)
        ? (item.ayudantia[0] ?? null)
        : (item.ayudantia ?? null);

      return {
        id_solicitud: item.id_solicitud,
        asignatura: item.consulta?.asignatura?.nombre || 'General',
        titulo_duda: item.consulta?.titulo || '',
        descripcion_duda: item.motivo || item.consulta?.descripcion || '',
        estado: item.estado,
        estudiante: item.consulta?.usuario
          ? `${item.consulta.usuario.nombre || ''} ${item.consulta.usuario.apellido || ''}`.trim()
          : 'ESTUDIANTE',
        ayudantia: ayudantiaRel
          ? {
              id_ayudantia: Number(ayudantiaRel.id_ayudantia),
              id_solicitud: Number(item.id_solicitud),
              estado: ayudantiaRel.estado
            }
          : null
      };
    });
  }

  // Obtener identificadores de solicitudes asociadas a un ayudante
  async obtenerPorIdAyudante(id_ayudante) {

    const { data, error } =
      await supabase
        .from('solicitud_ayudantia')
        .select(`
          id_solicitud
        `)
        .eq(
          'id_ayudante',
          id_ayudante
        );

    if (error) {
      throw error;
    }

    return (data || []).map(
      (item) =>
        new ObtenerSolicitudAyudanteResolveDTO(
          item
        )
    );
  }
}

module.exports = new SolicitudAdapter();
