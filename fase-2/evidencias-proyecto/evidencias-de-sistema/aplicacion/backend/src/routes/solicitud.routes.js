const { Router } = require('express');
const router = Router();
const solicitudController = require('../controllers/solicitud.controller');
const { verificarToken, autorizarRoles } = require('../auth/auth.middleware');

// /api/solicitudes-ayudantia/...
router.post('/', verificarToken, (req, res) => solicitudController.crear(req, res));
router.get('/disponibles', verificarToken, (req, res) => solicitudController.listarDisponibles(req, res));
router.get('/usuario/:id_usuario', verificarToken, (req, res) => solicitudController.listarPorEstudiante(req, res));
router.get('/ayudante/:id_usuario', verificarToken, (req, res) => solicitudController.listarPorAyudante(req, res));

// Transiciones de estado
router.patch('/:id_solicitud/tomar', verificarToken, (req, res) => solicitudController.tomar(req, res));
router.patch('/:id_solicitud/aceptar', verificarToken, (req, res) => solicitudController.aceptar(req, res));
router.patch('/:id_solicitud/rechazar-ayudante', verificarToken, (req, res) => solicitudController.rechazar(req, res));
router.patch(
  '/:id_solicitud/resolver',
  verificarToken,
  autorizarRoles('AYUDANTE', 'ADMINISTRADOR'),
  (req, res) => solicitudController.resolver(req, res)
);

module.exports = router;