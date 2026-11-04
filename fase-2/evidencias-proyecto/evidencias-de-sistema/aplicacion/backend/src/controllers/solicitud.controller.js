const solicitudAdapter = require('../adapters/solicitud.adapter');
const { obtenerCategoriaActivaPorId } = require('../adapters/categoria.adapter');

class SolicitudController {
  async crear(req, res) {
    const { id_consulta, id_categoria, modalidad, motivo } = req.body;

    if (!id_consulta || !id_categoria || !modalidad || !motivo) {
      return res.status(400).json({
        error: 'Consulta, categoría, modalidad y motivo son obligatorios.'
      });
    }

    try {
      const categoria = await obtenerCategoriaActivaPorId(id_categoria);

      if (!categoria) {
        return res.status(400).json({
          error: 'La categoría seleccionada no existe o no está activa.'
        });
      }

      const data = await solicitudAdapter.crearSolicitud({
        id_consulta,
        id_categoria,
        modalidad,
        motivo
      });

      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({
        error: err.message
      });
    }
  }

  async listarPorEstudiante(req, res) {
    const { id_usuario } = req.params;

    try {
      const data = await solicitudAdapter.obtenerPorEstudiante(id_usuario);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async listarDisponibles(req, res) {
    const { id_categoria } = req.query;

    try {
      // Si se selecciona una categoría específica, se valida que exista y esté activa.
      if (
        id_categoria &&
        id_categoria !== 'todas' &&
        id_categoria !== 'null' &&
        id_categoria !== 'undefined'
      ) {
        const categoria = await obtenerCategoriaActivaPorId(id_categoria);

        if (!categoria) {
          return res.status(400).json({
            error: 'La categoría seleccionada no existe o no está activa.'
          });
        }
      }

      const data = await solicitudAdapter.obtenerDisponibles(id_categoria);
      return res.status(200).json(data);
    } catch (err) {
      console.error('Error en listarDisponibles:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  async tomar(req, res) {
    const { id_solicitud } = req.params;
    const { id_ayudante, id_usuario } = req.body;

    try {
      let ayudanteId = id_ayudante;

      if (!ayudanteId && id_usuario) {
        const perfil = await solicitudAdapter.obtenerAyudantePorUsuario(id_usuario);

        if (!perfil) {
          return res.status(404).json({
            error: 'No se encontró un perfil de ayudante asociado al usuario proporcionado.'
          });
        }

        ayudanteId = perfil.id_ayudante;
      }

      if (!ayudanteId) {
        return res.status(400).json({
          error: 'El ID del Ayudante o el ID del Usuario es obligatorio.'
        });
      }

      const data = await solicitudAdapter.tomarSolicitud(
        id_solicitud,
        ayudanteId
      );

      if (!data) {
        return res.status(409).json({
          error: 'La solicitud ya fue tomada o ya no se encuentra disponible.'
        });
      }

      return res.status(200).json({
        mensaje: 'Solicitud tomada correctamente.',
        solicitud: data
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async aceptar(req, res) {
    const { id_solicitud } = req.params;

    try {
      const resultado = await solicitudAdapter.aceptarAyudante(id_solicitud);

      if (resultado.noDisponible) {
        return res.status(409).json({
          error: 'La solicitud no está disponible para ser aceptada.'
        });
      }

      return res.status(200).json({
        mensaje: 'Ayudante aceptado y ayudantía iniciada correctamente.',
        solicitud: resultado.solicitud,
        ayudantia: resultado.ayudantia
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async rechazar(req, res) {
    const { id_solicitud } = req.params;

    try {
      const data = await solicitudAdapter.rechazarAyudante(id_solicitud);

      if (!data) {
        return res.status(409).json({
          error: 'La solicitud no se encuentra esperando confirmación de un ayudante.'
        });
      }

      return res.status(200).json({
        mensaje: 'Ayudante rechazado. La solicitud volvió a estar disponible.',
        solicitud: data
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async resolver(req, res) {
    const { id_solicitud } = req.params;

    try {
      const resultado = await solicitudAdapter.resolverAyudantia(id_solicitud);

      if (resultado.noAceptada) {
        return res.status(409).json({
          error: 'La solicitud no se encuentra en estado ACEPTADA.'
        });
      }

      if (resultado.noActiva) {
        return res.status(409).json({
          error: 'No existe una ayudantía activa asociada a esta solicitud.'
        });
      }

      return res.status(200).json({
        mensaje: 'Ayudantía finalizada correctamente.',
        solicitud: resultado.solicitud,
        ayudantia: resultado.ayudantia
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async listarPorAyudante(req, res) {
    const { id_usuario } = req.params;

    try {
      const data = await solicitudAdapter.obtenerPorAyudante(id_usuario);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new SolicitudController();