const supabase = require('../config/supabase');
const { ObtenerCategoriaActividadResolveDTO } = require('../dtos/categoria-actividad/categoria.resolve.dto')

class CategoriaActividadAdapter {

    async obtenerAllCategorias() {
        const { data, error } = await supabase
            .from(`categoria_actividad`)    
            .select(`id_categoria, nombre, descripcion, fecha_creacion`)
            .order(`id_categoria`);

        if (error) {
            throw error;
        }

        return (data || []).map(item => new ObtenerCategoriaActividadResolveDTO(item));
    }

}

module.exports = new CategoriaActividadAdapter();