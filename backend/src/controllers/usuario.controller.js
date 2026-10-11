const usuarioAdapter = require('../adapters/usuario.adapter');

class UsuarioController {
  async obtenerPerfil(req, res) {
    const { id_usuario } = req.params;
    try {
      const data = await usuarioAdapter.obtenerPerfilCompleto(id_usuario);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async actualizarPerfil(req, res) {
    const { id_usuario } = req.params;
    const { carrera, semestre, institucion } = req.body;

    if (!carrera || !semestre || !institucion) {
      return res.status(400).json({ error: 'Carrera, semestre e institución son obligatorios.' });
    }

    try {
      const data = await usuarioAdapter.actualizarPerfilEstudiante(id_usuario, { carrera, semestre, institucion });
      return res.status(200).json({
        mensaje: 'Perfil actualizado correctamente.',
        estudiante: data
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async solicitarAyudante(req, res) {
    const { id_usuario, motivo, experiencia } = req.body;

    if (!id_usuario || !motivo || !experiencia) {
      return res.status(400).json({ error: 'Usuario, motivo y experiencia son obligatorios.' });
    }

    try {
      const data = await usuarioAdapter.crearSolicitudAyudante({ id_usuario, motivo, experiencia });
      return res.status(201).json({
        mensaje: 'Solicitud de ayudante enviada correctamente.',
        solicitud: data
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UsuarioController();