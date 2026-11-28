const { Router } = require('express');
const router = Router();

const administracionController = require('../controllers/administracion.controller');
const { verificarToken, autorizarRoles } = require('../auth/auth.middleware');

router.get('/estadisticas', verificarToken, autorizarRoles('ADMINISTRADOR'), (req, res) =>
  administracionController.obtenerEstadisticas(req, res)
);

module.exports = router;
