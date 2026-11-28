const crearUsuarioService = require('./usuario/crear-usuario.service');
const consultarUsuarioService = require('./usuario/consultar-usuario.service');
const actualizarUsuarioService = require('./usuario/actualizar-usuario.service');
const cambiarEstadoUsuarioService = require('./usuario/cambiar-estado-usuario.service');

class UsuarioService {
  crearUsuarioAsync(rawBody) {
    return crearUsuarioService.crearUsuarioAsync(rawBody);
  }

  listarUsuariosAsync(filtros) {
    return consultarUsuarioService.listarUsuariosAsync(filtros);
  }

  obtenerDetalleUsuarioAsync(idUsuario) {
    return consultarUsuarioService.obtenerDetalleUsuarioAsync(idUsuario);
  }

  obtenerPerfilUsuarioAsync(idUsuario) {
    return consultarUsuarioService.obtenerPerfilUsuarioAsync(idUsuario);
  }

  modificarUsuarioAsync(rawBody, params) {
    return actualizarUsuarioService.modificarUsuarioAsync(rawBody, params);
  }

  cambiarEstadoUsuarioAsync(idUsuario, esActivo) {
    return cambiarEstadoUsuarioService.cambiarEstadoUsuarioAsync(idUsuario, esActivo);
  }
}

module.exports = new UsuarioService();
