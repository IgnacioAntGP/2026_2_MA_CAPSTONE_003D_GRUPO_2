const usuarioAdapter = require('../../adapters/usuario.adapter');
const {
  ModificarUsuarioResolveDTO
} = require('../../dtos/usuario/usuario.resolve.dto');
const { validarIdUsuario } = require('../../helpers/validadores/usuario.validador');
const { crearErrorDominio } = require('./usuario.errors');
const { armarPayloadUsuarioResolve } = require('./usuario.mapper');

class CambiarEstadoUsuarioService {
  async cambiarEstadoUsuarioAsync(idUsuario, esActivo) {
    if (typeof esActivo !== 'boolean') {
      throw crearErrorDominio('El estado es_activo debe ser booleano', 400);
    }

    const idValido = validarIdUsuario(idUsuario);
    if (!idValido) {
      throw crearErrorDominio('El id_usuario debe ser un número entero positivo', 400);
    }

    const usuarioActual = await usuarioAdapter.buscarPorIdAsync(idValido);
    if (!usuarioActual) {
      throw crearErrorDominio('Usuario no encontrado', 404);
    }

    const actualizado = await usuarioAdapter.cambiarEstadoActivoAsync(idValido, esActivo);
    return new ModificarUsuarioResolveDTO(armarPayloadUsuarioResolve(actualizado));
  }
}

module.exports = new CambiarEstadoUsuarioService();
