const ayudanteAdapter =
  require('../adapters/ayudante.adapter');

const usuarioAdapter =
  require('../adapters/usuario.adapter');

const especialidadAdapter =
  require('../adapters/especialidad.adapter');

const solicitudAdapter =
  require('../adapters/solicitud.adapter');

const ayudantiaAdapter =
  require('../adapters/ayudantia.adapter');

const {
  ObtenerPerfilPublicoAyudanteResolveDTO
} = require('../dtos/ayudante/ayudante.resolve.dto');


class AyudanteService {

  async obtenerPerfilPublico(
    id_usuario
  ) {

    // 1. Obtener datos propios del ayudante
    const ayudante =
      await ayudanteAdapter
        .obtenerPorUsuario(
          id_usuario
        );


    if (!ayudante) {
      return null;
    }


    // 2. Obtener datos personales y académicos
    const usuario =
      await usuarioAdapter
        .obtenerPerfilPublico(
          id_usuario
        );


    if (!usuario) {
      return null;
    }


    // 3. Obtener especialidades
    const especialidades =
      await especialidadAdapter
        .obtenerEspecialidadesPorAyudante(
          ayudante.id_ayudante
        );


    // 4. Obtener solicitudes asociadas
    const solicitudes =
      await solicitudAdapter
        .obtenerPorIdAyudante(
          ayudante.id_ayudante
        );


    const idsSolicitudes =
      solicitudes.map(
        (solicitud) =>
          solicitud.id_solicitud
      );


    // 5. Obtener ayudantías finalizadas
    const ayudantiasFinalizadas =
      await ayudantiaAdapter
        .obtenerFinalizadasPorSolicitudes(
          idsSolicitudes
        );


    // 6. Métricas disponibles actualmente
    const estadisticas = {

      ayudantias_finalizadas:
        ayudantiasFinalizadas.length,

      /*
       * Evaluaciones quedan fuera
       * del alcance actual.
       *
       * Conservamos las propiedades
       * para no modificar el contrato
       * del endpoint ni del frontend.
       */
      total_evaluaciones: 0,

      promedio_valoracion: null
    };


    // 7. Construcción del perfil público
    return new ObtenerPerfilPublicoAyudanteResolveDTO({
      ayudante,
      usuario,
      especialidades,
      estadisticas
    });
  }


  async obtenerTodos() {

    // 1. Obtener todos los perfiles base
    // registrados como ayudantes
    const ayudantes =
      await ayudanteAdapter
        .obtenerTodos();


    if (!ayudantes.length) {
      return [];
    }


    // 2. Reutilizar la construcción del
    // perfil público para cada ayudante
    const perfiles =
      await Promise.all(
        ayudantes.map(
          (ayudante) =>
            this.obtenerPerfilPublico(
              ayudante.id_usuario
            )
        )
      );


    // 3. Excluir perfiles que ya no
    // correspondan a usuarios activos
    return perfiles.filter(
      (perfil) => perfil !== null
    );
  }

}


module.exports =
  new AyudanteService();