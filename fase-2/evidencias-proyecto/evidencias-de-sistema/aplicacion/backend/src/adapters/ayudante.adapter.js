const supabase = require('../config/supabase');

class AyudanteAdapter {

  async obtenerPerfilPublico(id_usuario) {

    // 1. Datos principales del ayudante
    const { data: ayudante, error: errorAyudante } =
      await supabase
        .from('ayudante')
        .select(`
          id_ayudante,
          id_usuario,
          descripcion,

          usuario (
            id_usuario,
            nombre,
            apellido,

            estudiante (
              carrera,
              semestre,
              institucion
            )
          )
        `)
        .eq('id_usuario', id_usuario)
        .maybeSingle();

    if (errorAyudante) {
      throw errorAyudante;
    }

    if (!ayudante) {
      return null;
    }


    // Normalizar datos académicos
    const usuario = ayudante.usuario;

    const estudiante =
      Array.isArray(usuario?.estudiante)
        ? usuario.estudiante[0] ?? null
        : usuario?.estudiante ?? null;


    // 2. Especialidades
    const { data: especialidades, error: errorEspecialidades } =
      await supabase
        .from('especialidad_ayudante')
        .select(`
          id_asignatura,
          nivel_competencia,
          fecha_habilitacion,

          asignatura (
            nombre,
            codigo
          )
        `)
        .eq(
          'id_ayudante',
          ayudante.id_ayudante
        );

    if (errorEspecialidades) {
      throw errorEspecialidades;
    }


    // 3. Solicitudes asociadas al ayudante
    const { data: solicitudes, error: errorSolicitudes } =
      await supabase
        .from('solicitud_ayudantia')
        .select('id_solicitud')
        .eq(
          'id_ayudante',
          ayudante.id_ayudante
        );

    if (errorSolicitudes) {
      throw errorSolicitudes;
    }


    const idsSolicitudes =
      (solicitudes || [])
        .map((item) => item.id_solicitud);


    let ayudantiasFinalizadas = [];
    let evaluaciones = [];


    // 4. Ayudantías realmente finalizadas
    if (idsSolicitudes.length > 0) {

      const {
        data: ayudantias,
        error: errorAyudantias
      } = await supabase
        .from('ayudantia')
        .select('id_ayudantia')
        .in(
          'id_solicitud',
          idsSolicitudes
        )
        .eq(
          'estado',
          'FINALIZADA'
        );

      if (errorAyudantias) {
        throw errorAyudantias;
      }

      ayudantiasFinalizadas =
        ayudantias || [];
    }


    const idsAyudantias =
      ayudantiasFinalizadas
        .map((item) => item.id_ayudantia);


    // 5. Evaluaciones recibidas
    if (idsAyudantias.length > 0) {

      const {
        data: dataEvaluaciones,
        error: errorEvaluaciones
      } = await supabase
        .from('evaluacion')
        .select(`
          id_evaluacion,
          valoracion,
          comentario,
          fecha_evaluacion
        `)
        .in(
          'id_ayudantia',
          idsAyudantias
        );

      if (errorEvaluaciones) {
        throw errorEvaluaciones;
      }

      evaluaciones =
        dataEvaluaciones || [];
    }


    // 6. Promedio de valoración
    const promedioValoracion =
      evaluaciones.length > 0
        ? Number(
            (
              evaluaciones.reduce(
                (total, item) =>
                  total + Number(item.valoracion),
                0
              ) / evaluaciones.length
            ).toFixed(1)
          )
        : null;


    // 7. Respuesta pública
    return {

      id_ayudante:
        ayudante.id_ayudante,

      id_usuario:
        ayudante.id_usuario,

      nombre:
        usuario?.nombre || '',

      apellido:
        usuario?.apellido || '',

      descripcion:
        ayudante.descripcion || null,

      carrera:
        estudiante?.carrera || null,

      semestre:
        estudiante?.semestre || null,

      institucion:
        estudiante?.institucion || null,

      especialidades:
        (especialidades || []).map(
          (item) => ({
            id_asignatura:
              item.id_asignatura,

            asignatura:
              item.asignatura?.nombre || null,

            codigo:
              item.asignatura?.codigo || null,

            nivel_competencia:
              item.nivel_competencia
          })
        ),

      estadisticas: {

        ayudantias_finalizadas:
          ayudantiasFinalizadas.length,

        total_evaluaciones:
          evaluaciones.length,

        promedio_valoracion:
          promedioValoracion
      }
    };
  }

}

module.exports =
  new AyudanteAdapter();