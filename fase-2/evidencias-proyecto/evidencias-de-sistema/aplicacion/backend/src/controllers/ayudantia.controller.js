const ayudantiaAdapter = require('../adapters/ayudantia.adapter');
const {
  CrearAyudantiaAskDTO,
  ModificarAyudantiaAskDTO
} = require('../dtos/ayudantia/ayudantia.ask.dto');
const {
  CrearAyudantiaResolveDTO,
  ObtenerAyudantiaResolveDTO,
  ModificarAyudantiaResolveDTO,
  EliminarAyudantiaResolveDTO
} = require('../dtos/ayudantia/ayudantia.resolve.dto');

class AyudantiaController {
  async crearAyudantia(req, res) {
    try {
      const inputDTO = new CrearAyudantiaAskDTO(req.body);

      if (!inputDTO.idSolicitud) {
        return res.status(400).json({
          error: 'El ID de la Solicitud es obligatorio.'
        });
      }

      const ayudantiaGuardada = await ayudantiaAdapter.guardarAyudantia(inputDTO);

      const responseDTO = new CrearAyudantiaResolveDTO({
        ayudantia: ayudantiaGuardada,
        mensaje: 'Ayudantía creada con éxito'
      });

      return res.status(201).json(responseDTO);
    } catch (error) {
      return res.status(500).json({
        error: 'Error interno del sistema',
        message: error.message
      });
    }
  }

  async obtenerDetalleAyudantia(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: 'El ID de la ayudantía es obligatorio.'
        });
      }

      const ayudantiaEncontrada = await ayudantiaAdapter.obtenerAyudantiaPorId(id);

      if (!ayudantiaEncontrada) {
        return res.status(404).json({
          error: 'Ayudantía no encontrada: no disponible o ha sido eliminada.'
        });
      }

      return res.status(200).json({
        ayudantia: ayudantiaEncontrada,
        mensaje: 'Ayudantía obtenida con éxito'
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Error interno del sistema',
        message: error.message
      });
    }
  }

  async crearActividadAyudantia(req, res) {
    try {
      const { id } = req.params;
      const { nombre_actividad, descripcion, id_categoria, id_estado_actividad } = req.body;

      if (!id || !nombre_actividad || !id_categoria) {
        return res.status(400).json({
          error: 'Faltan campos obligatorios (id de ayudantía, nombre de actividad o categoría).'
        });
      }

      const ayudantia = await ayudantiaAdapter.obtenerAyudantiaPorId(id);
      if (!ayudantia) {
        return res.status(404).json({
          error: 'La ayudantía especificada no existe.'
        });
      }

      const inputDTO = {
        nombreActividad: nombre_actividad,
        descripcion: descripcion || null,
        idCategoria: Number(id_categoria),
        idEstadoActividad: id_estado_actividad ? Number(id_estado_actividad) : undefined
      };

      const actividadGuardada = await ayudantiaAdapter.guardarActividadAyudantia(id, inputDTO);

      return res.status(201).json({
        actividad: actividadGuardada,
        mensaje: 'Actividad registrada con éxito en la ayudantía'
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Error interno del sistema',
        message: error.message
      });
    }
  }
}

module.exports = new AyudantiaController();
