const supabase = require('../config/supabase');

class UtilsAdapter {

    // Verificar si el usuario ya tiene una postulación pendiente
    async tienePostulacionPendiente(id_usuario) {
        const { data: postulacionesPendientes, error: errorValidacion } =
            await supabase
                .from('postulacion_ayudante')
                .select('id_solicitud')
                .eq('id_usuario', id_usuario)
                .eq('estado', 'PENDIENTE')
                .limit(1);

        if (errorValidacion) {
            throw errorValidacion;
        }

        return postulacionesPendientes && postulacionesPendientes.length > 0;
    }

    // Verififcar si el usuario ya tiene una postulación aprobada
    async tienePostulacionAprobada(id_usuario) {
        const { data: postulacionesAprobadas, error: errorValidacion } =
            await supabase
                .from('postulacion_ayudante')
                .select('id_solicitud')
                .eq('id_usuario', id_usuario)
                .eq('estado', 'APROBADA')
                .limit(1);

        if (errorValidacion) {
            throw errorValidacion;
        }

        return postulacionesAprobadas && postulacionesAprobadas.length > 0;
    }

    // Verificar si es ayudante
    async esAyudante(id_usuario) {
        const { data: usuarioRol, error: errorValidacion } =
            await supabase
                .from('usuario_rol')
                .select('rol(nombre)')
                .eq('id_usuario', id_usuario)
                .eq('rol.nombre', 'Ayudante')
                .limit(1);

        if (errorValidacion) {
            throw errorValidacion;
        }

        return usuarioRol && usuarioRol.length > 0;
    }

    // Verificar si tiene perfil de ayudante
    async tienePerfilAyudante(id_usuario) {
        const { data: perfilAyudante, error: errorValidacion } =
            await supabase
                .from('ayudante')
                .select('id_usuario')
                .eq('id_usuario', id_usuario)
                .limit(1);

        if (errorValidacion) {
            throw errorValidacion;
        }

        return perfilAyudante && perfilAyudante.length > 0;
    }

    // Obtener ayudante por id_usuario
    async obtenerAyudantePorIdUsuario(id_usuario) {
        const { data: ayudante, error: errorValidacion } =
            await supabase
                .from('ayudante')
                .select('*')
                .eq('id_usuario', id_usuario)
                .single();

        if (errorValidacion) {
            throw errorValidacion;
        }

        return ayudante;
    }

}

module.exports = new UtilsAdapter();