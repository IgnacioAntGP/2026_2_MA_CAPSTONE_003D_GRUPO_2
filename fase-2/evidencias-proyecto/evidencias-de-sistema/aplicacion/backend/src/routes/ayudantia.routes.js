const express = require('express');
const router = express.Router();

const ayudantiaController = require('../controllers/ayudantia.controller');

// Rutas de Ayudantías
router.post('/', (req, res) => ayudantiaController.crearAyudantia(req, res));
router.get('/:id', (req, res) => ayudantiaController.obtenerDetalleAyudantia(req, res));

// Rutas de Actividades dentro de la Ayudantía
router.post('/:id/actividades', (req, res) => ayudantiaController.crearActividadAyudantia(req, res));

module.exports = router;