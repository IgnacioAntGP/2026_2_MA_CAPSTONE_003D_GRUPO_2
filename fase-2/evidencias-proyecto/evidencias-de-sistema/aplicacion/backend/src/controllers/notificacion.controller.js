const notificacionAdapter = require('../adapters/notificacion.adapter');

class NotificacionController {

  // Obtener notificaciones de un usuario
  async listarPorUsuario(req, res) {
    const { id_usuario } = req.params;

    if (!id_usuario) {
      return res.status(400).json({
        error: 'El ID del usuario es obligatorio.'
      });
    }

    try {
      const data =
        await notificacionAdapter.obtenerPorUsuario(id_usuario);

      return res.status(200).json(data);
    } catch (err) {
      console.error(
        'Error al obtener notificaciones:',
        err
      );

      return res.status(500).json({
        error: err.message
      });
    }
  }


  // Obtener cantidad de notificaciones no leídas
  async contarNoLeidas(req, res) {
    const { id_usuario } = req.params;

    if (!id_usuario) {
      return res.status(400).json({
        error: 'El ID del usuario es obligatorio.'
      });
    }

    try {
      const total =
        await notificacionAdapter.contarNoLeidas(
          id_usuario
        );

      return res.status(200).json({
        no_leidas: total
      });
    } catch (err) {
      console.error(
        'Error al contar notificaciones no leídas:',
        err
      );

      return res.status(500).json({
        error: err.message
      });
    }
  }


  // Marcar una notificación como leída
  async marcarComoLeida(req, res) {
    const { id_notificacion } = req.params;
    const { id_usuario } = req.body;

    if (!id_notificacion || !id_usuario) {
      return res.status(400).json({
        error:
          'El ID de la notificación y el ID del usuario son obligatorios.'
      });
    }

    try {
      const data =
        await notificacionAdapter.marcarComoLeida(
          id_notificacion,
          id_usuario
        );

      if (!data) {
        return res.status(404).json({
          error:
            'La notificación no existe o no pertenece al usuario.'
        });
      }

      return res.status(200).json({
        mensaje:
          'Notificación marcada como leída correctamente.',
        notificacion: data
      });
    } catch (err) {
      console.error(
        'Error al marcar notificación como leída:',
        err
      );

      return res.status(500).json({
        error: err.message
      });
    }
  }

}

module.exports =
  new NotificacionController();