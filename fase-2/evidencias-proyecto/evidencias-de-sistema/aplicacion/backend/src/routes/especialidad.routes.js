const { Router } = require('express');
const router = Router();
const especialidadController = require('../controllers/especialidad.controller');
const { verificarToken, autorizarRoles } = require('../auth/auth.middleware');

// Registrar una nueva especialidad para un ayudante
router.post('/', verificarToken, autorizarRoles('ADMINISTRADOR'), (req, res) =>
  especialidadController.agregarEspecialidad(req, res)
);

// Obtener las especialidades de un ayudante por su ID de usuario
router.get('/usuario/:id_usuario', verificarToken, (req, res) =>
  especialidadController.obtenerEspecialidades(req, res)
);

module.exports = router;
