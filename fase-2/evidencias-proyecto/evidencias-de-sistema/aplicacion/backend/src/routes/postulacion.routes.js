const { Router } = require('express');
const router = Router();
const postulacionController = require('../controllers/postulacion.controller');
const { verificarToken, autorizarRoles } = require('../auth/auth.middleware');

// Endpoint específico para solicitar ser ayudante
router.post('/', verificarToken, (req, res) => postulacionController.postularAyudante(req, res));

router.get('/pendientes', verificarToken, (req, res) =>
  postulacionController.obtenerPostulacionesPendientes(req, res)
);

router.patch(
  '/:id_postulacion/aprobar',
  verificarToken,
  autorizarRoles('Administrador'),
  (req, res) => postulacionController.aprobarPostulacionAyudante(req, res)
);

router.patch(
  '/:id_postulacion/rechazar',
  verificarToken,
  autorizarRoles('Administrador'),
  (req, res) => postulacionController.rechazarPostulacionAyudante(req, res)
);

module.exports = router;
