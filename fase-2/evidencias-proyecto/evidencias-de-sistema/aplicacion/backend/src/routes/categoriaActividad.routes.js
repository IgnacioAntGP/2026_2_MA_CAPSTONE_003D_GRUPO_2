const express = require('express');
const router = express.Router();

const categoriaActividadController = require('../controllers/categoriaActividad.controller');

router.get('/', (req, res) => categoriaActividadController.obtenerCategorias(req, res));

module.exports = router;