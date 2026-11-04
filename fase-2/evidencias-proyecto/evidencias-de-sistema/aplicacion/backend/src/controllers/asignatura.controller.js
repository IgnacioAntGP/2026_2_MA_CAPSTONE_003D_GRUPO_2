const asignaturaAdapter = require('../adapters/asignatura.adapter')
const { CrearAsignaturaAskDTO } = require('../dtos/asignatura/asignatura.ask.dto')

async function ingresarNuevaAsignaturaController(req, res) {
    try {
        const asignaturaData = new CrearAsignaturaAskDTO(req.body);

        const asignaturaCreada = await asignaturaAdapter.crearNuevaAsignaturaAsync(asignaturaData);

        return res.status(201).json({
            mensaje: 'Asignatura creada exitosamente',
            data: asignaturaCreada
        });

    } catch (error) {
        console.error('Error al crear asignatura:', error.message);

        if (
            error.message.includes('es obligatorio') || 
            error.message.includes('Ya existe una asignatura')
        ) {
            return res.status(400).json({ 
                error: error.message 
            });
        }

        return res.status(500).json({ 
            error: 'Ocurrió un error inesperado al intentar crear la asignatura.' 
        });
    }
}

async function obtenerListaAsignaturasController(req, res){
    try {
        const asignaturas = await asignaturaAdapter.obtenerAllAsignaturasAsync();

        return res.status(200).json(asignaturas);

    } catch (error) {
        return res.status(500).json({
            error: 'Ocurrió un error inesperado al intentar obtener las asignaturas.'
        });
    }
}

module.exports = {ingresarNuevaAsignaturaController, obtenerListaAsignaturasController};