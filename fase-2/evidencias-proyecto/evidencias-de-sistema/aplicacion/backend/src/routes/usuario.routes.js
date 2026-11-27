const { Router } = require('express');
const router = Router();
const usuarioController = require('../controllers/usuario.controller');
const { verificarToken, autorizarRoles } = require('../auth/auth.middleware');

router.get('/perfil', verificarToken, (req, res) =>
  usuarioController.obtenerPerfil(req, res)
);
router.patch('/perfil', verificarToken, (req, res) =>
  usuarioController.actualizarPerfil(req, res)
);

router.post('/', verificarToken, autorizarRoles('ADMINISTRADOR'), (req, res) =>
  usuarioController.crearUsuario(req, res)
);
router.get('/', verificarToken, autorizarRoles('ADMINISTRADOR'), (req, res) =>
  usuarioController.listarUsuarios(req, res)
);
router.get('/:id_usuario', verificarToken, autorizarRoles('ADMINISTRADOR'), (req, res) =>
  usuarioController.obtenerDetalleUsuario(req, res)
);
router.patch('/:id_usuario', verificarToken, autorizarRoles('ADMINISTRADOR'), (req, res) =>
  usuarioController.modificarUsuario(req, res)
);
router.patch('/:id_usuario/activar', verificarToken, autorizarRoles('ADMINISTRADOR'), (req, res) =>
  usuarioController.activarUsuario(req, res)
);
router.patch(
  '/:id_usuario/desactivar',
  verificarToken,
  autorizarRoles('ADMINISTRADOR'),
  (req, res) => usuarioController.desactivarUsuario(req, res)
);

module.exports = router;
