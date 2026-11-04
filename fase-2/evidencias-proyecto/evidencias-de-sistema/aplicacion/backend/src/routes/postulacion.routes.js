const { Router } = require('express');
const router = Router();
const postulacionController = require('../controllers/postulacion.controller');

// Endpoint específico para solicitar ser ayudante
router.post('/', (req, res) => postulacionController.postularAyudante(req, res));

router.get('/pendientes', (req, res) => postulacionController.obtenerPostulacionesPendientes(req, res));

router.patch('/:id_solicitud/aprobar', (req, res) => postulacionController.aprobarPostulacionAyudante(req, res));

router.patch('/:id_solicitud/rechazar', (req, res) =>postulacionController.rechazarPostulacionAyudante(req, res));

module.exports = router;