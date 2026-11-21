const { Router } = require('express');
const router = Router();

const administracionController =
  require('../controllers/administracion.controller');


router.get(
  '/estadisticas',
  (req, res) =>
    administracionController.obtenerEstadisticas(
      req,
      res
    )
);


module.exports = router;