const usuarioAdapter = require('../../adapters/usuario.adapter');
const {
  UsuarioResolveDTO
} = require('../../dtos/usuario/usuario.resolve.dto');
const { validarIdUsuario } = require('../../helpers/validadores/usuario.validador');
const { crearErrorDominio } = require('./usuario.errors');
const { armarPayloadUsuarioResolve } = require('./usuario.mapper');

class ConsultarUsuarioService {
  async listarUsuariosAsync(filtros = {}) {
    const soloActivos = Boolean(filtros.soloActivos);
    const registros = await usuarioAdapter.listarUsuariosAsync({ soloActivos });

    return registros.map(
      (registro) => new UsuarioResolveDTO(armarPayloadUsuarioResolve(registro))
    );
  }

  async obtenerDetalleUsuarioAsync(idUsuario) {
    const idValido = validarIdUsuario(idUsuario);
    if (!idValido) {
      throw crearErrorDominio('El id_usuario debe ser un número entero positivo', 400);
    }

    const usuario = await usuarioAdapter.buscarPorIdAsync(idValido);
    if (!usuario) {
      throw crearErrorDominio('Usuario no encontrado', 404);
    }

    return new UsuarioResolveDTO(armarPayloadUsuarioResolve(usuario));
  }

  async obtenerPerfilUsuarioAsync(idUsuario) {
    const idValido = validarIdUsuario(idUsuario);
    if (!idValido) {
      throw crearErrorDominio('El id_usuario debe ser un número entero positivo', 400);
    }

    return usuarioAdapter.obtenerPerfilCompleto(idValido);
  }
}

module.exports = new ConsultarUsuarioService();
