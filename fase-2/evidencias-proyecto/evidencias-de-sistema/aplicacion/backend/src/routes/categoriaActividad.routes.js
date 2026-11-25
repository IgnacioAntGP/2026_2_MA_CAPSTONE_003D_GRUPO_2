const express = require('express');
const router = express.Router();

const categoriaActividadController = require('../controllers/categoriaActividad.controller');
const { verificarToken } = require('../auth/auth.middleware');

router.get('/', verificarToken, (req, res) => categoriaActividadController.obtenerCategorias(req, res));

module.exports = router;