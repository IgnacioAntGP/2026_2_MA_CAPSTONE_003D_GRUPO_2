const express = require('express');
const router = express.Router();

const {
  crearNuevaCategoria,
  obtenerCategorias,
  obtenerCategoriasActivas,
  obtenerDetalleCategoria
} = require('../controllers/categoria.controller');
const { verificarToken, autorizarRoles } = require('../auth/auth.middleware');

router.post('/', verificarToken, autorizarRoles('Administrador'), crearNuevaCategoria);

router.get('/', verificarToken, obtenerCategorias);

router.get('/activas', verificarToken, obtenerCategoriasActivas);

router.get('/:id_categoria', verificarToken, obtenerDetalleCategoria);

module.exports = router;
