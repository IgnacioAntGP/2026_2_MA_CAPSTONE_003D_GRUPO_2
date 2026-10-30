const {
  crearCategoria,
  obtenerAllCategoriasAsync,
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

// Obtiene todas las categorías creadas.
async function obtenerAllCategorias(req, res) {
  try {
    const allCategorias = await obtenerAllCategoriasAsync();

    if (!allCategorias || allCategorias.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron categorias registradas'
      });
    }

    return res.status(200).json(allCategorias);
  } catch (error) {
    console.error('Error interno en controlador:', error);

    return res.status(500).json({
      error: error.message || 'No fue posible procesar la solicitud.',
      codigo: 'INTERNAL_SERVER_ERROR',
      detalle: error.message
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
  obtenerAllCategorias,
  obtenerCategoriasActivasController
};