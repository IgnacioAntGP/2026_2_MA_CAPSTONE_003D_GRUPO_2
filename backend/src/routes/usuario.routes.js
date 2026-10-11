const { Router } = require('express');
const router = Router();
const usuarioController = require('../controllers/usuario.controller');

// Perfil de usuario
router.get('/:id_usuario/perfil', (req, res) => usuarioController.obtenerPerfil(req, res));
router.patch('/:id_usuario/perfil', (req, res) => usuarioController.actualizarPerfil(req, res));

// Endpoint específico para solicitar ser ayudante
router.post('/solicitudes-ayudante', (req, res) => usuarioController.solicitarAyudante(req, res));

module.exports = router;