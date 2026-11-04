const supabase = require('../config/supabase');
const utilsAdapter = require('./utils.adapter');
const { CrearEspecialidadAskDTO } = require('../dtos/especialidad/especialidad.ask.dto');
const { CrearEspecialidadResolveDTO, ObtenerEspecialidadesResolveDTO } = require('../dtos/especialidad/especialidad.resolve.dto');

class EspecialidadAdapter {

    // Método para asociar una asignatura a un ayudante ya aprobado
    async crearEspecialidad(rawBody) {
        const inputDTO = new CrearEspecialidadAskDTO(rawBody);

        // 1. Verificamos primero si el ayudante existe
        const ayudante = await utilsAdapter.obtenerAyudantePorIdUsuario(inputDTO.id_usuario);
        if (!ayudante) {
            const err = new Error('El usuario no cuenta con un perfil de ayudante activo.');
            err.name = 'NotFoundError';
            throw err;
        }

        // 2. Comprobación agnóstica: ¿Existe la asignatura?
        const { data: asignatura, error: errorAsignatura } = await supabase
            .from('asignatura')
            .select('id_asignatura')
            .eq('id_asignatura', inputDTO.id_asignatura)
            .maybeSingle();

        if (errorAsignatura) throw errorAsignatura;

        if (!asignatura) {
            const err = new Error('La asignatura especificada no existe en el sistema.');
            err.name = 'NotFoundError';
            throw err;
        }

        // 3. Opcional: Validar si ya la tiene asignada para evitar el error de duplicado por código
        // (o dejar una validación de negocio similar)
        const { data: existingEspecialidad, error: errorExisting } = await supabase
            .from('especialidad_ayudante')
            .select('id_especialidad')
            .eq('id_ayudante', ayudante.id_ayudante)
            .eq('id_asignatura', inputDTO.id_asignatura)
            .maybeSingle();

        if (errorExisting) throw errorExisting;

        if (existingEspecialidad) {
            const err = new Error('El ayudante ya cuenta con esta especialidad asignada.');
            err.name = 'DuplicateError';
            throw err;
        }

        // 4. Si todo existe, procedemos con la inserción segura
        const { data, error } = await supabase
            .from('especialidad_ayudante')
            .insert({
                id_ayudante: ayudante.id_ayudante,
                id_asignatura: inputDTO.id_asignatura,
                nivel: inputDTO.nivel
            })
            .select()
            .single();

        if (error) throw error;

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