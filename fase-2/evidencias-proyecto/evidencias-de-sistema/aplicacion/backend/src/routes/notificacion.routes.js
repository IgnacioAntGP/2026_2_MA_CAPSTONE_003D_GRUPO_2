const { Router } = require('express');
const router = Router();

const notificacionController =
  require('../controllers/notificacion.controller');


// Obtener notificaciones de un usuario
router.get(
  '/usuario/:id_usuario',
  (req, res) =>
    notificacionController.listarPorUsuario(
      req,
      res
    )
);


// Obtener cantidad de notificaciones no leídas
router.get(
  '/usuario/:id_usuario/no-leidas',
  (req, res) =>
    notificacionController.contarNoLeidas(
      req,
      res
    )
);


// Marcar una notificación como leída
router.patch(
  '/:id_notificacion/leer',
  (req, res) =>
    notificacionController.marcarComoLeida(
      req,
      res
    )
);


module.exports = router;