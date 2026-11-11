const categoriaActividadAdapter = require('../adapters/categoriaActividad.adapter');
const {} = require('../dtos/categoria-actividad/categoria.resolve.dto');

class CategoriaActividadController {
  async obtenerCategorias(req, res) {
    try {
      const categorias = await categoriaActividadAdapter.obtenerAllCategorias();
      return res.status(200).json(categorias);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new CategoriaActividadController();
