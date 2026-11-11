const _especialidadAdapter = require('../adapters/especialidad.adapter');

class EspecialidadController {

    async agregarEspecialidad(req, res) {
        const { id_usuario, id_asignatura } = req.body;

        if (!id_usuario || !id_asignatura) {
            return res.status(400).json({ 
                error: 'El id_usuario y el id_asignatura son obligatorios.' 
            });
        }

        try {
            const data = await _especialidadAdapter.crearEspecialidad({ id_usuario, id_asignatura });

            return res.status(201).json({
                mensaje: 'Especialidad agregada correctamente.',
                especialidad: data
            });

        } catch (err) {
            // Mapeo limpio de errores personalizados lanzados desde el adaptador o BD
            if (err.message && err.message.includes('ya cuenta con esta especialidad')) {
                return res.status(409).json({ error: err.message });
            }
            if (err.name === 'NotFoundError' || (err.message && err.message.includes('no encontrado'))) {
                return res.status(404).json({ error: err.message });
            }

            return res.status(500).json({
                error: err.message || 'Error interno al agregar la especialidad.'
            });
        }
    }

    async obtenerEspecialidades(req, res) {
        const { id_usuario } = req.params;

        try {
            const data = await _especialidadAdapter.obtenerEspecialidadesPorUsuario(id_usuario);
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = new EspecialidadController();