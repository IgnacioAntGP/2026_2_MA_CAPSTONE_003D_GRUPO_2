const _especialidadAdapter = require('../adapters/especialidad.adapter');

class EspecialidadController {

    async agregarEspecialidad(req, res) {
        const { id_usuario, id_asignatura } = req.body;

        if (!id_usuario || !id_asignatura) {
            return res.status(400).json({ error: 'El id_usuario y el id_asignatura son obligatorios.' });
        }

        try {
            const data = await _especialidadAdapter.crearEspecialidad({ id_usuario, id_asignatura });

            return res.status(201).json({
                mensaje: 'Especialidad agregada correctamente.',
                especialidad: data
            });
        } catch (err) {
            if (err.name === 'DuplicateError') {
                return res.status(409).json({ error: err.message });
            }
            if (err.name === 'NotFoundError') {
                return res.status(404).json({ error: err.message });
            }

            return res.status(500).json({
                error: err.message
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