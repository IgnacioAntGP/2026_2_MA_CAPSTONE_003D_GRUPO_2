const { Router } = require('express');
const router = Router();

const ayudanteController = require('../controllers/ayudante.controller');
const { verificarToken, autorizarRoles } = require('../auth/auth.middleware');

router.get('/', verificarToken, autorizarRoles('ADMINISTRADOR'), (req, res) =>
  ayudanteController.obtenerTodos(req, res)
);

router.get('/usuario/:id_usuario/perfil', verificarToken, (req, res) =>
  ayudanteController.obtenerPerfilPublico(req, res)
);

module.exports = router;
