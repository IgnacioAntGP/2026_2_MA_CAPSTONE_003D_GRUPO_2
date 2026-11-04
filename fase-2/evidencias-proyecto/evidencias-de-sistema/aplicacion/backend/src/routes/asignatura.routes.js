const express = require('express');
const router = express.Router();
const {
    ingresarNuevaAsignaturaController, 
    obtenerListaAsignaturasController 
    } = require('../controllers/asignatura.controller')

router.post('/', ingresarNuevaAsignaturaController);
router.get('/', obtenerListaAsignaturasController);

module.exports = router;