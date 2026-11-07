const supabase = require('../config/supabase');
const { CrearAsignaturaAskDTO} = require('../dtos/asignatura/asignatura.ask.dto');
const {CrearAsignaturaResolveDTO, ObtenerAsignaturaResolveDTO} = require('../dtos/asignatura/asignatura.resolve.dto');

// Método para ingresar una nueva asignatura al sistema
async function crearNuevaAsignaturaAsync(bodyRequest) {
    const payloadAsignatura = new CrearAsignaturaAskDTO(bodyRequest);

    const {data, error} = await supabase
        .from(`asignatura`)
        .insert([payloadAsignatura])
        .select()
        .single();
    if(error){
        throw error;
    }

    return new CrearAsignaturaResolveDTO(data);
}

// Método para obtener el listado de asignaturas
async function obtenerAllAsignaturasAsync() {
    const {data, error} = await supabase
        .from('asignatura')
        .select(`
            id_asignatura,
            nombre,
            codigo,
            descripcion,
            estado
            `)
        .order(`codigo`)
    if(error){
        throw error;
    }

    return data.map((fila) => new ObtenerAsignaturaResolveDTO(fila));
}

module.exports = {crearNuevaAsignaturaAsync, obtenerAllAsignaturasAsync}