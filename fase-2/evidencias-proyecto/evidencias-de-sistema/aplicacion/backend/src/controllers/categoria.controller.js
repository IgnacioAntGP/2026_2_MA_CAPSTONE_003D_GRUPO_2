const { crearCategoria } = require('../adapters/categoria.adapter');

async function crearCategoriaController(req, res) {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        error: 'El nombre de la categoría es obligatorio.'
      });
    }

    const categoria = await crearCategoria({
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null
    });

    return res.status(201).json({
      mensaje: 'Categoría creada correctamente.',
      categoria
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);

    return res.status(500).json({
      error: 'No fue posible crear la categoría.'
    });
  }
}

module.exports = {
  crearCategoriaController
};