const express = require('express');
const router = express.Router();

const {
  crearCategoriaController
} = require('../controllers/categoria.controller');

router.post('/', crearCategoriaController);

module.exports = router;