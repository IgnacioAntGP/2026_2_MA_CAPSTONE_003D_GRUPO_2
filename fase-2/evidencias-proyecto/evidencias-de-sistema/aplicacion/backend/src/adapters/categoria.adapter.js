const supabase = require('../config/supabase');

async function crearCategoria({ nombre, descripcion }) {
  const { data, error } = await supabase
    .from('categoria_solicitud')
    .insert([
      {
        nombre,
        descripcion
      }
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  crearCategoria
};