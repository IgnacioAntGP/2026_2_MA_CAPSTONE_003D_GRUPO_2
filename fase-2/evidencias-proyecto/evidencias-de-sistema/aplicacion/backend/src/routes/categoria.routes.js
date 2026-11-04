const express = require('express');
const router = express.Router();

const {
  crearCategoriaController,
  obtenerAllCategorias,
  obtenerCategoriasActivasController
} = require('../controllers/categoria.controller');

router.post('/', crearCategoriaController);
router.get('/', obtenerAllCategorias);
router.get('/activas', obtenerCategoriasActivasController);

module.exports = router;