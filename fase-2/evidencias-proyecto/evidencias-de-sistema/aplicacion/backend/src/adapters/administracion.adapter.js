const supabase =
  require('../config/supabase');


class AdministracionAdapter {

  async obtenerEstadisticas() {

    /*
     * Las consultas son independientes,
     * por lo que podemos ejecutarlas
     * en paralelo.
     */
    const [
      ayudantesResult,
      consultasResult,
      ayudantiasFinalizadasResult,
      especialidadesResult
    ] = await Promise.all([

      // Ayudantes registrados
      supabase
        .from('ayudante')
        .select(
          '*',
          {
            count: 'exact',
            head: true
          }
        ),


      // Consultas activas
      supabase
        .from('consulta')
        .select(
          '*',
          {
            count: 'exact',
            head: true
          }
        )
        .eq(
          'estado',
          true
        ),


      // Ayudantías finalizadas
      supabase
        .from('ayudantia')
        .select(
          '*',
          {
            count: 'exact',
            head: true
          }
        )
        .eq(
          'estado',
          'FINALIZADA'
        ),


      // Especialidades registradas
      // junto con la asignatura asociada.
      supabase
        .from('especialidad_ayudante')
        .select(`
          id_ayudante,
          id_asignatura,

          asignatura (
            nombre,
            codigo
          )
        `)

    ]);


    /*
     * Validación de errores.
     */
    if (ayudantesResult.error) {
      throw ayudantesResult.error;
    }

    if (consultasResult.error) {
      throw consultasResult.error;
    }

    if (ayudantiasFinalizadasResult.error) {
      throw ayudantiasFinalizadasResult.error;
    }

    if (especialidadesResult.error) {
      throw especialidadesResult.error;
    }


    const especialidades =
      especialidadesResult.data || [];


    /*
     * Cantidad de asignaturas diferentes
     * cubiertas por los ayudantes.
     */
    const idsEspecialidades =
      new Set(
        especialidades.map(
          (item) =>
            item.id_asignatura
        )
      );


    /*
     * Distribución de ayudantes
     * por especialidad.
     */
    const ayudantesPorEspecialidad = {};


    especialidades.forEach(
      (item) => {

        const idAsignatura =
          item.id_asignatura;


        if (!ayudantesPorEspecialidad[idAsignatura]) {

          ayudantesPorEspecialidad[idAsignatura] = {

            id_asignatura:
              idAsignatura,

            especialidad:
              item.asignatura?.nombre ??
              'Sin nombre',

            codigo:
              item.asignatura?.codigo ??
              null,

            total_ayudantes: 0

          };

        }


        ayudantesPorEspecialidad[
          idAsignatura
        ].total_ayudantes += 1;

      }
    );


    return {

      ayudantes_registrados:
        ayudantesResult.count ?? 0,

      consultas_activas:
        consultasResult.count ?? 0,

      ayudantias_finalizadas:
        ayudantiasFinalizadasResult.count ?? 0,

      especialidades_cubiertas:
        idsEspecialidades.size,

      ayudantes_por_especialidad:
        Object.values(
          ayudantesPorEspecialidad
        )

    };

  }

}


module.exports =
  new AdministracionAdapter();