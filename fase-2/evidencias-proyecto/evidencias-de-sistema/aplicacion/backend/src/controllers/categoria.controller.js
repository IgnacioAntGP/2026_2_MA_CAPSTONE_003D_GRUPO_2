const {
  crearCategoria,
  obtenerCategoriasActivas
} = require('../adapters/categoria.adapter');

// Crea una nueva categoría.
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

// Obtiene las categorías activas.
async function obtenerCategoriasActivasController(req, res) {
  try {
    const categorias = await obtenerCategoriasActivas();

    return res.status(200).json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías activas:', error);

    return res.status(500).json({
      error: 'No fue posible obtener las categorías activas.'
    });
  }
}

module.exports = {
  crearCategoriaController,
  obtenerCategoriasActivasController
};