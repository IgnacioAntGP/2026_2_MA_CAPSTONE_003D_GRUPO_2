const { Router } = require('express');
const router = Router();
const consultaController = require('../controllers/consulta.controller');

// /api/consultas/...
router.get('/', (req, res) => consultaController.listarComunidad(req, res));
router.post('/', (req, res) => consultaController.crear(req, res));
router.get('/usuario/:id_usuario', (req, res) => consultaController.listarPorUsuario(req, res));
router.get('/:id_consulta', (req, res) => consultaController.obtenerPorId(req, res));
router.patch('/:id_consulta', (req, res) => consultaController.actualizar(req, res));
router.patch('/:id_consulta/desactivar', (req, res) => consultaController.desactivar(req, res));

// Respuestas anidadas a la consulta
router.get('/:id_consulta/respuestas', (req, res) => consultaController.obtenerRespuestas(req, res));
router.post('/:id_consulta/respuestas', (req, res) => consultaController.agregarRespuesta(req, res));

module.exports = router;