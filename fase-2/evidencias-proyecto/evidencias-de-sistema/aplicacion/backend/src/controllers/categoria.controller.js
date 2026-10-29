const categoriaAdapter = require('../adapters/categoria.adapter')
const { CrearCategoriaAskDTO } = require('../dtos/categoria/categoria.ask.dto')

async function crearNuevaCategoria(req, res) {
  try {

    const categoriaAsk = new CrearCategoriaAskDTO(req.body);

    if(!categoriaAsk.nombre){
      return res.status(400).json({
        error: 'El nombre de la categoria es obligatorio.'
      })
    }

    const categoriaNueva = await categoriaAdapter.crearCategoria(categoriaAsk);

    return res.status(201).json({
      mensaje: 'Categoría creada correctamente.',
      categoria: categoriaNueva
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error de interno del sistema al crear nueva categoria.',
      codigo: 'INTERNAL_SERVER_ERROR',
      detalle: error.message
    });
  }
}

async function obtenerCategorias(req, res) {
  try {
    const allCategorias = await categoriaAdapter.obtenerAllCategoriasAsync();
    
    if (!allCategorias || allCategorias.length === 0) {
      return res.status(404).json({ 
        mensaje: 'No se encontraron categorías registradas.' 
      });
    }

    return res.status(200).json(allCategorias);
    
  } catch (error) {
    console.error('Error al obtener todas las categorías:', error);
    return res.status(500).json({ 
      error: 'Error interno del sistema al obtener las categorías.', 
      codigo: 'INTERNAL_SERVER_ERROR',
      detalle: error.message
    });
  }
}

async function obtenerCategoriasActivas(req, res) {
  try {
    const categorias = await categoriaAdapter.obtenerCategoriasActivas();

    if (!categorias || categorias.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron categorías activas registradas.'
      });
    }

    return res.status(200).json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías activas:', error);

    return res.status(500).json({
      error: 'Error interno del sistema al obtener las categorías activas.',
      codigo: 'INTERNAL_SERVER_ERROR',
      detalle: error.message
    });
  }
}

async function obtenerDetalleCategoria(req, res) {
  try {
    const { id_categoria } = req.params;

    if (!id_categoria || isNaN(id_categoria)) {
      return res.status(400).json({
        error: 'El ID de la categoría proporcionado es inválido o no existe.'
      });
    }

    const categoria = await categoriaAdapter.obtenerCategoriaActivaPorId(id_categoria);

    if (!categoria) {
      return res.status(404).json({
        error: 'La categoría solicitada no fue encontrada o se encuentra inactiva.'
      });
    }

    return res.status(200).json(categoria);

  } catch (error) {
    console.error('Error al obtener detalle de categoría por ID:', error);
    return res.status(500).json({
      error: 'Error interno del sistema al obtener categoría activa por ID.',
      codigo: 'INTERNAL_SERVER_ERROR',
      detalle: error.message
    });
  }
}

module.exports = {
  crearNuevaCategoria,
  obtenerCategorias,
  obtenerCategoriasActivas,
  obtenerDetalleCategoria
};