const ayudanteService = require('../services/ayudante.service');

const { ObtenerPerfilPublicoAyudanteAskDTO } = require('../dtos/ayudante/ayudante.ask.dto');

class AyudanteController {
  async obtenerTodos(req, res) {
    try {
      const ayudantes = await ayudanteService.obtenerTodos();

      return res.status(200).json(ayudantes);
    } catch (err) {
      console.error('Error al obtener listado de ayudantes:', err);

      return res.status(500).json({
        error: err.message
      });
    }
  }

  async obtenerPerfilPublico(req, res) {
    let inputDTO;

    // 1. Validar y normalizar parámetros de entrada
    try {
      inputDTO = new ObtenerPerfilPublicoAyudanteAskDTO(req.params);
    } catch (err) {
      return res.status(400).json({
        error: err.message
      });
    }

    // 2. Obtener perfil público mediante la capa de servicio
    try {
      const perfil = await ayudanteService.obtenerPerfilPublico(inputDTO.idUsuario);

      if (!perfil) {
        const rolesUsuario = Array.isArray(req?.user?.roles) ? req.user.roles : [];
        const esAdministrador = rolesUsuario.some(
          (r) =>
            (typeof r === 'string' ? r : r?.nombre || '')
              .toString()
              .trim()
              .toUpperCase() === 'ADMINISTRADOR'
        );

        if (esAdministrador) {
          return res.status(200).json({
            idUsuario: inputDTO.idUsuario,
            esAyudante: false,
            perfil: null,
            mensaje: 'El usuario consultado no tiene perfil de ayudante registrado.'
          });
        }

        return res.status(404).json({
          error: 'No se encontró un perfil de ayudante asociado al usuario.'
        });
      }

      return res.status(200).json({
        esAyudante: true,
        perfil
      });
    } catch (err) {
      console.error('Error al obtener perfil público del ayudante:', err);

      return res.status(500).json({
        error: err.message
      });
    }
  }
}

module.exports = new AyudanteController();
