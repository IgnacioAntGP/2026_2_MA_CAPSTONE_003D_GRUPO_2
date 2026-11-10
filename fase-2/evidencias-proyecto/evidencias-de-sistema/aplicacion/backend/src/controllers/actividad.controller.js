const actividadAdapter = require('../adapters/actividad.adapter');
const { CrearActividadAskDTO, ModificarActividadAskDTO } = require('../dtos/actividad/actividad.ask.dto');

class ActividadController {
  async listar(req, res) {
    const { id } = req.params; 
    try {
      const data = await actividadAdapter.obtenerPorAyudantia(id);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async obtenerDetalle(req, res) {
    const { id, id_actividad } = req.params;
    try {
      const data = await actividadAdapter.obtenerPorId(id, id_actividad);
      if (!data) {
        return res.status(404).json({ error: 'Actividad o Ayudantía no encontrada.' });
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async crear(req, res) {
    const { id } = req.params;
    
    //TODO Ver si está enviando correctamente el cuerpo y el idAyudantia al Adapter
    const inputDTO = new CrearActividadAskDTO({ ...req.body, idAyudantia: id });

    if (!inputDTO.idCategoria || !inputDTO.nombreActividad) {
      return res
        .status(400)
        .json({ error: 'La categoría y el nombre de la actividad son obligatorios o tienen un formato incorrecto.' });
    }

    try {
      const resultado = await actividadAdapter.crearActividad(id, inputDTO);
      return res.status(201).json(resultado);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async modificar(req, res) {
    //TODO, RESOLVER POR ID_ESTADO_ACTIVIDAD, NO POR ESTADO
    const { id, id_actividad } = req.params;

    const inputDTO = new ModificarActividadAskDTO(req.body);

    if (inputDTO.esActivo !== undefined && req.userRole !== 'Administrador') {
      return res
        .status(403)
        .json({
          error: 'Acceso denegado. Solo el Administrador puede activar o desactivar una actividad.'
        });
    }

    if (req.userRole === 'Estudiante') {
      return res
        .status(403)
        .json({ error: 'Acceso denegado. Los estudiantes carecen de permisos para modificar actividades.' });
    }

    try {
      const resultado = await actividadAdapter.modificarActividad(id, id_actividad, inputDTO);
      if (!resultado) {
        return res.status(404).json({ error: 'Actividad no encontrada.' });
      }
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async eliminar(req, res) {
    const { id, id_actividad } = req.params;

    // Validación de permisos de rol: Eliminación completa SOLO ADMIN (403 Forbidden)
    if (req.userRole !== 'Administrador') {
      return res
        .status(403)
        .json({
          error: 'Acceso denegado. Solo el Administrador puede eliminar permanentemente una actividad.'
        });
    }

    try {
      const resultado = await actividadAdapter.eliminarActividad(id, id_actividad);
      if (!resultado) {
        return res.status(404).json({ error: 'Actividad no encontrada.' });
      }
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ActividadController();