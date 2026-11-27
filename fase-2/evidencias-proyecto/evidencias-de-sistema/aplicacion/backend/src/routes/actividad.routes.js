const { Router } = require('express');
const actividadController = require('../controllers/actividad.controller');
const { verificarToken, autorizarRoles } = require('../auth/auth.middleware');
const router = Router({ mergeParams: true }); // Hereda :id de ayudantía desde la ruta padre

// Rutas públicas
router.get('/:id/actividades', actividadController.listar);
router.get('/:id/actividades/:id_actividad', actividadController.obtenerDetalle);

// Solo autenticado
router.post(
  '/:id/actividades',
  verificarToken,
  actividadController.crearActividadAyudantia
);

// Autenticado + rol permitido
router.patch(
  '/:id/actividades/:id_actividad',
  verificarToken,
  autorizarRoles('AYUDANTE', 'ADMINISTRADOR'),
  actividadController.modificar
);

// Autenticado + solo ADMINISTRADOR
router.delete(
  '/:id/actividades/:id_actividad',
  verificarToken,
  autorizarRoles('ADMINISTRADOR'),
  actividadController.eliminar
);

module.exports = router;
