const { Router } = require('express');
const actividadController = require('../controllers/actividad.controller');
const router = Router({ mergeParams: true }); // Hereda :id de ayudantía desde la ruta padre

router.get('/:id/actividades', actividadController.listar);
router.get('/:id/actividades/:id_actividad', actividadController.obtenerDetalle);
router.post('/:id/actividades', actividadController.crear);
router.patch('/:id/actividades/:id_actividad', actividadController.modificar);
router.delete('/:id/actividades/:id_actividad', actividadController.eliminar);

module.exports = router;
