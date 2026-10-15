const { Router } = require('express');
const router = Router();
const solicitudController = require('../controllers/solicitud.controller');

// /api/solicitudes-ayudantia/...
router.post('/', (req, res) => solicitudController.crear(req, res));
router.get('/disponibles', (req, res) => solicitudController.listarDisponibles(req, res));
router.get('/usuario/:id_usuario', (req, res) => solicitudController.listarPorEstudiante(req, res));
router.get('/ayudante/:id_usuario', (req, res) => solicitudController.listarPorAyudante(req, res));

// Transiciones de estado
router.patch('/:id_solicitud/tomar', (req, res) => solicitudController.tomar(req, res));
router.patch('/:id_solicitud/aceptar', (req, res) => solicitudController.aceptar(req, res));
router.patch('/:id_solicitud/rechazar-ayudante', (req, res) => solicitudController.rechazar(req, res));
router.patch('/:id_solicitud/resolver', (req, res) => solicitudController.resolver(req, res));

module.exports = router;