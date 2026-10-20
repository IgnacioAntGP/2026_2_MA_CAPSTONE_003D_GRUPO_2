const express = require('express');
const router = express.Router();

const {
  crearCategoriaController,
  obtenerCategoriasActivasController
} = require('../controllers/categoria.controller');

router.post('/', crearCategoriaController);
router.get('/activas', obtenerCategoriasActivasController);

module.exports = router;