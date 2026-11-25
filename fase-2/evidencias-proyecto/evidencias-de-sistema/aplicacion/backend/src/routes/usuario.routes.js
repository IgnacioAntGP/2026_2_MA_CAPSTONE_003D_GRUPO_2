const { Router } = require('express');
const router = Router();
const usuarioController = require('../controllers/usuario.controller');
const { verificarToken } = require('../auth/auth.middleware');

// Perfil de usuario
router.get('/:id_usuario/perfil', verificarToken, (req, res) => usuarioController.obtenerPerfil(req, res));
router.patch('/:id_usuario/perfil', verificarToken, (req, res) => usuarioController.actualizarPerfil(req, res));

module.exports = router;