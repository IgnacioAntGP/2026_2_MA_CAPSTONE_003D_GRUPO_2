const express = require('express');
const router = express.Router();

const {
  crearNuevaCategoria,
  obtenerCategorias,
  obtenerCategoriasActivas,
  obtenerDetalleCategoria
} = require('../controllers/categoria.controller');

router.post('/', crearNuevaCategoria);
router.get('/', obtenerCategorias);
router.get('/activas', obtenerCategoriasActivas);
router.get('/:id_categoria', obtenerDetalleCategoria);

module.exports = router;