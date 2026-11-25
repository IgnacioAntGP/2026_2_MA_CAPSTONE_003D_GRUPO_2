const express = require('express');
const router = express.Router();

const ayudantiaController = require('../controllers/ayudantia.controller');
const { verificarToken } = require('../auth/auth.middleware');

router.post('/', verificarToken, (req, res) => ayudantiaController.crearAyudantia(req, res));

router.get('/:id', verificarToken, (req, res) =>
  ayudantiaController.obtenerDetalleAyudantia(req, res)
);

module.exports = router;
