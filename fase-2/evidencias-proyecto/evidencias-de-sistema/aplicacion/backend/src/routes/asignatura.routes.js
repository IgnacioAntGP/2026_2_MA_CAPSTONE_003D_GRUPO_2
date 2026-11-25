const express = require('express');
const router = express.Router();
const {
  ingresarNuevaAsignaturaController,
  obtenerListaAsignaturasController
} = require('../controllers/asignatura.controller');
const { verificarToken } = require('../auth/auth.middleware');

router.post('/', verificarToken, ingresarNuevaAsignaturaController);

router.get('/', verificarToken, obtenerListaAsignaturasController);

module.exports = router;
