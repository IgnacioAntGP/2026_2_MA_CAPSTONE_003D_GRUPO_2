const express = require('express');
const router = express.Router();

const ayudantiaController = require('../controllers/ayudantia.controller');

router.post('/', (req, res) => ayudantiaController.crearAyudantia(req, res));
router.get('/:id', (req, res) => ayudantiaController.obtenerDetalleAyudantia(req, res));

module.exports = router;