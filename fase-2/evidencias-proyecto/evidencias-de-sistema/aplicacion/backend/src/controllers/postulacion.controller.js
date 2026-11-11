const _postulacionAdapter = require('../adapters/postulacion.adapter');

class PostulacionController {
  async postularAyudante(req, res) {
    const { id_usuario, id_asignatura, motivo, experiencia } = req.body;

    if (!id_usuario || !motivo || !experiencia) {
      return res.status(400).json({ error: 'Usuario, motivo y experiencia son obligatorios.' });
    }

    try {
      // Limpiamos id_asignatura por si llega como string vacío o "null"
      const asignaturaLimpia = (id_asignatura && id_asignatura !== 'null') ? Number(id_asignatura) : null;

      const data = await _postulacionAdapter.crearPostulacionAyudante({ 
        id_usuario, 
        id_asignatura: asignaturaLimpia,  
        motivo, 
        experiencia 
      });
        
      return res.status(201).json({
        mensaje: 'Solicitud de ayudante enviada correctamente.',
        solicitud: data
      });
    } catch (err) {
      
        return res
          .status(err.statusCode || 500)
          .json({
            error: err.message
          });
    }
  }

  async obtenerPostulacionesPendientes(req, res) {
    try {

      const data =
        await _postulacionAdapter.obtenerPostulacionesPendientes();

      return res.status(200).json(data);

    } catch (err) {

      return res.status(500).json({
        error: err.message
      });

    }
  }

  async aprobarPostulacionAyudante(req, res) {
    const { id_postulacion } = req.params;
    const { id_asignatura } = req.body;

    try {
      const data = await _postulacionAdapter.aprobarPostulacionAyudante(
        id_postulacion, 
        id_asignatura || null
      );

      const mensajeExito = id_asignatura
        ? 'Postulación aprobada y especialidad asignada correctamente.'
        : 'Postulación aprobada correctamente.';

      return res.status(200).json({
        mensaje: mensajeExito,
        postulacion: data
      });

    } catch (err) {
      return res.status(500).json({
        error: err.message
      });
    }
  }

  async rechazarPostulacionAyudante(req, res) {
    const { id_postulacion } = req.params;

    try {
      const data =
        await _postulacionAdapter.rechazarPostulacionAyudante(id_postulacion);

      return res.status(200).json({
        mensaje: 'Postulación rechazada correctamente.',
        postulacion: data
      });

    } catch (err) {
      return res.status(500).json({
        error: err.message
      });
    }
  }
}

module.exports = new PostulacionController();