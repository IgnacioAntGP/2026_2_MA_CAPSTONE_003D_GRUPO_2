const { Router } = require('express');
const router = Router();
const usuarioController = require('../controllers/usuario.controller');

// Perfil de usuario
router.get('/:id_usuario/perfil', (req, res) => usuarioController.obtenerPerfil(req, res));
router.patch('/:id_usuario/perfil', (req, res) => usuarioController.actualizarPerfil(req, res));

// Endpoint específico para solicitar ser ayudante
router.post('/postulaciones-ayudante', (req, res) => usuarioController.postularAyudante(req, res));

router.get('/postulaciones-ayudante/pendientes', (req, res) => usuarioController.obtenerPostulacionesPendientes(req, res));

router.patch('/postulaciones-ayudante/:id_solicitud/aprobar', (req, res) => usuarioController.aprobarPostulacionAyudante(req, res));

router.patch('/postulaciones-ayudante/:id_solicitud/rechazar', (req, res) =>usuarioController.rechazarPostulacionAyudante(req, res));
module.exports = router;