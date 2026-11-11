const ayudanteAdapter =
  require('../adapters/ayudante.adapter');

class AyudanteController {

  async obtenerPerfilPublico(req, res) {
    const { id_usuario } = req.params;

    if (!id_usuario) {
      return res.status(400).json({
        error: 'El ID del usuario es obligatorio.'
      });
    }

    try {
      const perfil =
        await ayudanteAdapter.obtenerPerfilPublico(
          id_usuario
        );

      if (!perfil) {
        return res.status(404).json({
          error:
            'No se encontró un perfil de ayudante asociado al usuario.'
        });
      }

      return res.status(200).json(perfil);

    } catch (err) {
      console.error(
        'Error al obtener perfil público del ayudante:',
        err
      );

      return res.status(500).json({
        error: err.message
      });
    }
  }

}

module.exports =
  new AyudanteController();