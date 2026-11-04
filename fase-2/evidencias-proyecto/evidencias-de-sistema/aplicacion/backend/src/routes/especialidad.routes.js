const { Router } = require('express');
const router = Router();
const especialidadController = require('../controllers/especialidad.controller');

// Registrar una nueva especialidad para un ayudante
router.post('/', (req, res) => especialidadController.agregarEspecialidad(req, res));

// Obtener las especialidades de un ayudante por su ID de usuario
router.get('/usuario/:id_usuario', (req, res) => especialidadController.obtenerEspecialidades(req, res));

module.exports = router;