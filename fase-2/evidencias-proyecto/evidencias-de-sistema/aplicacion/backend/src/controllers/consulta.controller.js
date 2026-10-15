const consultaAdapter = require('../adapters/consulta.adapter');

class ConsultaController {
  async listarComunidad(req, res) {
    try {
      const data = await consultaAdapter.obtenerTodas();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async crear(req, res) {
    const { id_usuario, id_asignatura, titulo, descripcion } = req.body;

    if (!id_usuario || !id_asignatura || !titulo || !descripcion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
      const data = await consultaAdapter.crear({ id_usuario, id_asignatura, titulo, descripcion });
      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async listarPorUsuario(req, res) {
    const { id_usuario } = req.params;
    try {
      const data = await consultaAdapter.obtenerPorUsuario(id_usuario);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async obtenerPorId(req, res) {
    const { id_consulta } = req.params;
    try {
      const data = await consultaAdapter.obtenerPorId(id_consulta);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async obtenerRespuestas(req, res) {
    const { id_consulta } = req.params;
    try {
      const data = await consultaAdapter.obtenerRespuestas(id_consulta);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async agregarRespuesta(req, res) {
    const { id_consulta } = req.params;
    const { id_usuario, contenido } = req.body;

    if (!id_usuario || !contenido) {
      return res.status(400).json({ error: 'Usuario y contenido son obligatorios.' });
    }

    try {
      const data = await consultaAdapter.agregarRespuesta(id_consulta, { id_usuario, contenido });
      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async actualizar(req, res) {
    const { id_consulta } = req.params;
    const { titulo, id_asignatura, descripcion } = req.body;

    if (!titulo || !id_asignatura || !descripcion) {
      return res.status(400).json({ error: 'Título, asignatura y descripción son obligatorios.' });
    }

    try {
      const data = await consultaAdapter.actualizar(id_consulta, { titulo, id_asignatura, descripcion });
      return res.status(200).json({
        mensaje: 'Publicación actualizada correctamente.',
        consulta: data
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async desactivar(req, res) {
    const { id_consulta } = req.params;
    try {
      const data = await consultaAdapter.desactivar(id_consulta);
      return res.status(200).json({
        mensaje: 'Publicación desactivada correctamente.',
        consulta: data
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ConsultaController();