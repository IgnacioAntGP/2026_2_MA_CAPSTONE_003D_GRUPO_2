const { Router } = require('express');
const router = Router();

const notificacionController = require('../controllers/notificacion.controller');
const { verificarToken } = require('../auth/auth.middleware');

// Obtener notificaciones de un usuario
router.get('/usuario/:id_usuario', verificarToken, (req, res) => notificacionController.listarPorUsuario(req, res));

// Obtener cantidad de notificaciones no leídas
router.get('/usuario/:id_usuario/no-leidas', verificarToken, (req, res) =>
  notificacionController.contarNoLeidas(req, res)
);

// Marcar una notificación como leída
router.patch('/:id_notificacion/leer', verificarToken, (req, res) =>
  notificacionController.marcarComoLeida(req, res)
);

module.exports = router;
