const usuarioAdapter = require('../../adapters/usuario.adapter');
const estudianteAdapter = require('../../adapters/estudiante.adapter');
const authAdapter = require('../../adapters/auth.adapter');
const { CrearUsuarioAskDTO } = require('../../dtos/usuario/usuario.ask.dto');
const { CrearUsuarioResolveDTO } = require('../../dtos/usuario/usuario.resolve.dto');
const { ROLES } = require('../../helpers/enums/rol.enum');
const {
  validarDatosUsuarioCreacion
} = require('../../helpers/validadores/usuario.validador');
const {
  validarPerfilEstudianteCreacion
} = require('../../helpers/validadores/perfil-estudiante.validador');
const {
  crearErrorDominio,
  lanzarSiInvalido,
  crearErrorCompensacionFallida
} = require('./usuario.errors');
const { armarPayloadUsuarioResolve } = require('./usuario.mapper');

class CrearUsuarioService {
  async crearUsuarioAsync(rawBody = {}) {
    const askDTO = new CrearUsuarioAskDTO(rawBody);

    const validacionUsuario = validarDatosUsuarioCreacion(askDTO);
    lanzarSiInvalido(validacionUsuario, 400);

    const datosCuenta = validacionUsuario.normalizado ?? askDTO;
    const nombre = datosCuenta.nombre;
    const apellido = datosCuenta.apellido;
    const rutNormalizado = datosCuenta.rut;
    const correoNormalizado = datosCuenta.correo ?? datosCuenta.email;

    let perfilNormalizado = null;
    if (askDTO.perfilEstudiante) {
      const validacionPerfil = validarPerfilEstudianteCreacion(askDTO.perfilEstudiante);
      lanzarSiInvalido(validacionPerfil, 400);
      perfilNormalizado = validacionPerfil.normalizado ?? askDTO.perfilEstudiante;
    }

    const existenteCorreo = await usuarioAdapter.buscarPorCorreoAsync(correoNormalizado);
    if (existenteCorreo) {
      throw crearErrorDominio('Ya existe un usuario registrado con ese correo', 409);
    }

    const existenteRut = await usuarioAdapter.buscarPorRutAsync(rutNormalizado);
    if (existenteRut) {
      throw crearErrorDominio('Ya existe un usuario registrado con ese RUT', 409);
    }

    const rolPorDefecto = ROLES?.ESTUDIANTE ?? 'ESTUDIANTE';
    const rolBD = await usuarioAdapter.obtenerRolPorNombreAsync(rolPorDefecto);
    if (!rolBD) {
      throw crearErrorDominio(`No se encontró el rol por defecto ${rolPorDefecto}`, 500);
    }

    let userUid = null;
    try {
      const creadaAuth = await authAdapter.crearUsuarioAuthAsync({
        correo: correoNormalizado,
        password: datosCuenta.password ?? askDTO.password,
        userMetadata: {
          nombre,
          apellido,
          rut: rutNormalizado
        }
      });
      userUid = creadaAuth.id;
    } catch (authError) {
      throw crearErrorDominio(
        `No fue posible crear la cuenta en Supabase Auth: ${authError.message}`,
        500
      );
    }

    let usuarioCreado = null;
    try {
      usuarioCreado = await usuarioAdapter.crearUsuarioAsync({
        user_uid: userUid,
        nombre,
        apellido,
        rut: rutNormalizado,
        correo: correoNormalizado,
        es_activo: true
      });

      await usuarioAdapter.asignarRolUsuarioAsync(usuarioCreado.id_usuario, rolBD.id_rol);

      let perfilGuardado = null;
      if (perfilNormalizado) {
        perfilGuardado = await estudianteAdapter.guardarPerfilEstudianteAsync(
          usuarioCreado.id_usuario,
          {
            carrera: perfilNormalizado.carrera ?? null,
            semestre: perfilNormalizado.semestre ?? null,
            institucion: perfilNormalizado.institucion ?? null
          }
        );
      }

      const payloadResolve = armarPayloadUsuarioResolve(usuarioCreado, {
        rolesOverride: [rolBD],
        perfilOverride: perfilGuardado
      });

      return new CrearUsuarioResolveDTO(payloadResolve);
    } catch (error) {
      const erroresCompensacion = [];

      try {
        if (usuarioCreado?.id_usuario) {
          await usuarioAdapter.eliminarUsuarioFisicoAsync(usuarioCreado.id_usuario);
        } else if (userUid) {
          await usuarioAdapter.eliminarUsuarioPorUserUidFisicoAsync(userUid);
        }
      } catch (errorCompensacion) {
        erroresCompensacion.push({
          accion: 'Eliminar el registro de usuario',
          error: errorCompensacion
        });
      }

      try {
        if (userUid) {
          await authAdapter.eliminarUsuarioAuthAsync(userUid);
        }
      } catch (errorCompensacion) {
        erroresCompensacion.push({
          accion: 'Eliminar la cuenta de Supabase Auth',
          error: errorCompensacion
        });
      }

      if (erroresCompensacion.length > 0) {
        throw crearErrorCompensacionFallida(
          'No se pudo completar la creación del usuario',
          error,
          erroresCompensacion
        );
      }

      throw error;
    }
  }
}

module.exports = new CrearUsuarioService();
