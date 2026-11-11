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
}

module.exports = new AyudantiaController();
