const supabase = require('../config/supabase');

// Crea una nueva categoría.
async function crearCategoria({ nombre, descripcion }) {
  const { data, error } = await supabase
    .from('categoria_solicitud')
    .insert([
      {
        nombre,
        descripcion,
        es_activo: true
      }
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Obtiene todas las categorías.
async function obtenerAllCategoriasAsync() {
  const { data, error } = await supabase
    .from('categoria_solicitud')
    .select('id_categoria, nombre, descripcion, es_activo')
    .order('nombre', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

// Obtiene las categorías activas.
async function obtenerCategoriasActivas() {
  const { data, error } = await supabase
    .from('categoria_solicitud')
    .select('id_categoria, nombre, descripcion, es_activo')
    .eq('es_activo', true)
    .order('nombre', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

// Obtiene una categoría activa por su ID.
async function obtenerCategoriaActivaPorId(id_categoria) {
  const { data, error } = await supabase
    .from('categoria_solicitud')
    .select('id_categoria, nombre, descripcion, es_activo')
    .eq('id_categoria', id_categoria)
    .eq('es_activo', true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  crearCategoria,
  obtenerAllCategoriasAsync,
  obtenerCategoriasActivas,
  obtenerCategoriaActivaPorId
};