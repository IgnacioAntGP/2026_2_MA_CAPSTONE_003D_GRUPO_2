const { Router } = require('express');
const actividadController = require('../controllers/actividad.controller');
const mockAuthMiddleware = require('../auth/mock.auth');
const router = Router({ mergeParams: true }); // Hereda :id de ayudantía desde la ruta padre

router.get('/:id/actividades', actividadController.listar);
router.get('/:id/actividades/:id_actividad', actividadController.obtenerDetalle);
router.post('/:id/actividades', actividadController.crearActividadAyudantia);
router.patch('/:id/actividades/:id_actividad', mockAuthMiddleware, actividadController.modificar);
router.delete('/:id/actividades/:id_actividad', mockAuthMiddleware, actividadController.eliminar);

module.exports = router;
