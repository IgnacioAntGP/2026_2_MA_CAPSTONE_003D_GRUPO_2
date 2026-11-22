const administracionAdapter =
  require('../adapters/administracion.adapter');


class AdministracionController {

  async obtenerEstadisticas(req, res) {

    try {

      const estadisticas =
        await administracionAdapter
          .obtenerEstadisticas();


      return res
        .status(200)
        .json(estadisticas);

    } catch (err) {

      console.error(
        'Error al obtener estadísticas de administración:',
        err
      );


      return res.status(500).json({
        error: err.message
      });

    }

  }

}


module.exports =
  new AdministracionController();