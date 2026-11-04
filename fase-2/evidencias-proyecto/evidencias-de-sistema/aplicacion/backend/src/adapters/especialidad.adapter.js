const supabase = require('../config/supabase');
const utilsAdapter = require('./utils.adapter');
const { CrearEspecialidadAskDTO } = require('../dtos/especialidad/especialidad.ask.dto');
const { CrearEspecialidadResolveDTO, ObtenerEspecialidadesResolveDTO } = require('../dtos/especialidad/especialidad.resolve.dto');

class EspecialidadAdapter {

    // Método para asociar una asignatura a un ayudante ya aprobado
    async crearEspecialidad(rawBody) {
        const inputDTO = new CrearEspecialidadAskDTO(rawBody);

        const ayudante = await utilsAdapter.obtenerAyudantePorIdUsuario(inputDTO.id_usuario);

        const { data, error } = await supabase
            .from('especialidad_ayudante')
            .insert({
                id_ayudante: ayudante.id_ayudante,
                id_asignatura: inputDTO.id_asignatura,
                nivel_competencia: inputDTO.nivel_competencia
            })
            .select()
            .single();

        if (error) {
            // Manejo de error por llave duplicada
            if (error.code === '23505') {
                const dupError = new Error('El ayudante ya cuenta con esta especialidad asignada.');
                throw dupError;
            }
            throw error;
        }
        
        return new CrearEspecialidadResolveDTO({
            ...data,
            mensaje: 'Especialidad agregada exitosamente'
        });
    }

    async obtenerEspecialidadesPorUsuario(id_usuario) {
        const ayudante = await utilsAdapter.obtenerAyudantePorIdUsuario(id_usuario);
        
        if (!ayudante) return [];

        const { data, error } = await supabase
            .from('especialidad_ayudante')
            .select(`
                id_asignatura,
                nivel_competencia,
                fecha_habilitacion,
                asignatura (
                    nombre,
                    codigo
                )
            `)
            .eq('id_ayudante', ayudante.id_ayudante);

        if (error) throw error;

        // Mapeamos la respuesta utilizando el nuevo Resolve DTO de listado
        return (data || []).map(item => new ObtenerEspecialidadesResolveDTO(item));
    }
}

module.exports = new EspecialidadAdapter();