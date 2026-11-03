const { CrearCategoriaAskDTO } = require('../dtos/categoria/categoria.ask.dto');
const { CategoriaResolveDTO } = require('../dtos/categoria/categoria.resolve.dto');
const supabase = require('../config/supabase');

// Crea una nueva categoría.
async function crearCategoria( bodyRequest ) {

  const payloadCategoria = new CrearCategoriaAskDTO(bodyRequest);

  const { data, error } = await supabase
    .from('categoria_solicitud')
    .insert([ payloadCategoria ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return new CategoriaResolveDTO(data);
}

//Obtiene todas las categorias
async function obtenerAllCategoriasAsync (){
  const {data, error} = await supabase
    .from('categoria_solicitud')
    .select('id_categoria, nombre, descripcion, es_activo')
    .order('nombre', {ascending : true});

    if(error){
      throw error;
    }

    return data.map((fila) => new CategoriaResolveDTO(fila));
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

  return data.map((fila) => new CategoriaResolveDTO(fila));
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

  return data ? new CategoriaResolveDTO(data) : null;
}

module.exports = {
  crearCategoria,
  obtenerAllCategoriasAsync,
  obtenerCategoriasActivas,
  obtenerCategoriaActivaPorId
};