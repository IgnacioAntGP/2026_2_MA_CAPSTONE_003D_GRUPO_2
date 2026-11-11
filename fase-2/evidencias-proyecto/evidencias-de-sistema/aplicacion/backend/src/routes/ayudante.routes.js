const { Router } = require('express');
const router = Router();

const ayudanteController =
  require('../controllers/ayudante.controller');


router.get(
  '/usuario/:id_usuario/perfil',
  (req, res) =>
    ayudanteController.obtenerPerfilPublico(
      req,
      res
    )
);


module.exports = router;