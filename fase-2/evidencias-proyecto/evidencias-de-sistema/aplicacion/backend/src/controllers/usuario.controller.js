const usuarioService = require('../services/usuario.service');

function resolverEstadoHttp(err, codigoPorDefecto = 500) {
  if (err && Number.isInteger(err.statusCode)) {
    return err.statusCode;
  }
  return codigoPorDefecto;
}

class UsuarioController {
  async obtenerPerfil(req, res) {
    if (!req.user?.id_usuario) {
      return res.status(401).json({
        error: 'No fue posible identificar al usuario autenticado.'
      });
    }

    try {
      const usuario = await usuarioService.obtenerPerfilUsuarioAsync(req.user.id_usuario);
      return res.status(200).json(usuario);
    } catch (err) {
      return res.status(resolverEstadoHttp(err)).json({
        error: err.message || 'Error al obtener el perfil del usuario.'
      });
    }
  }

  async actualizarPerfil(req, res) {
    if (!req.user?.id_usuario) {
      return res.status(401).json({
        error: 'No fue posible identificar al usuario autenticado.'
      });
    }

    try {
      const actualizado = await usuarioService.modificarUsuarioAsync(
        { perfilEstudiante: req.body },
        { id_usuario: req.user.id_usuario }
      );
      return res.status(200).json({
        mensaje: 'Perfil actualizado correctamente.',
        estudiante: actualizado.perfilEstudiante
      });
    } catch (err) {
      return res.status(resolverEstadoHttp(err)).json({
        error: err.message || 'Error al actualizar el perfil del usuario.'
      });
    }
  }

  async crearUsuario(req, res) {
    try {
      const creado = await usuarioService.crearUsuarioAsync(req.body);
      return res.status(201).json(creado);
    } catch (err) {
      return res.status(resolverEstadoHttp(err)).json({
        error: err.message || 'Error al crear el usuario.'
      });
    }
  }

  async listarUsuarios(req, res) {
    try {
      const soloActivos =
        req.query.soloActivos === 'true' ||
        req.query.solo_activos === 'true' ||
        req.query.activos === 'true';

      const usuarios = await usuarioService.listarUsuariosAsync({ soloActivos });
      return res.status(200).json(usuarios);
    } catch (err) {
      return res.status(resolverEstadoHttp(err)).json({
        error: err.message || 'Error al listar los usuarios.'
      });
    }
  }

  async obtenerDetalleUsuario(req, res) {
    try {
      const { id_usuario } = req.params;
      const usuario = await usuarioService.obtenerDetalleUsuarioAsync(id_usuario);
      return res.status(200).json(usuario);
    } catch (err) {
      return res.status(resolverEstadoHttp(err)).json({
        error: err.message || 'Error al obtener el detalle del usuario.'
      });
    }
  }

  async modificarUsuario(req, res) {
    try {
      const actualizado = await usuarioService.modificarUsuarioAsync(req.body, req.params);
      return res.status(200).json(actualizado);
    } catch (err) {
      return res.status(resolverEstadoHttp(err)).json({
        error: err.message || 'Error al modificar el usuario.'
      });
    }
  }

  async cambiarEstadoUsuario(req, res, forzarEstado = undefined) {
    try {
      const { id_usuario } = req.params;

      let esActivo = forzarEstado;
      if (typeof esActivo !== 'boolean') {
        if (typeof req.body?.es_activo === 'boolean') {
          esActivo = req.body.es_activo;
        } else if (typeof req.body?.activo === 'boolean') {
          esActivo = req.body.activo;
        } else {
          esActivo = req.body?.es_activo;
        }
      }

      const actualizado = await usuarioService.cambiarEstadoUsuarioAsync(id_usuario, esActivo);
      return res.status(200).json(actualizado);
    } catch (err) {
      return res.status(resolverEstadoHttp(err)).json({
        error: err.message || 'Error al cambiar el estado del usuario.'
      });
    }
  }

  async activarUsuario(req, res) {
    return this.cambiarEstadoUsuario(req, res, true);
  }

  async desactivarUsuario(req, res) {
    return this.cambiarEstadoUsuario(req, res, false);
  }
}

module.exports = new UsuarioController();