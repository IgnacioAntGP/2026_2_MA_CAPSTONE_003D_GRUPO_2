const usuarioAdapter = require('../../adapters/usuario.adapter');
const estudianteAdapter = require('../../adapters/estudiante.adapter');
const { ModificarUsuarioAskDTO } = require('../../dtos/usuario/usuario.ask.dto');
const {
  ModificarUsuarioResolveDTO
} = require('../../dtos/usuario/usuario.resolve.dto');
const {
  validarIdUsuario,
  validarDatosUsuarioActualizacion
} = require('../../helpers/validadores/usuario.validador');
const {
  validarPerfilEstudianteActualizacion
} = require('../../helpers/validadores/perfil-estudiante.validador');
const {
  crearErrorDominio,
  lanzarSiInvalido,
  crearErrorCompensacionFallida
} = require('./usuario.errors');
const { armarPayloadUsuarioResolve } = require('./usuario.mapper');

class ActualizarUsuarioService {
  async modificarUsuarioAsync(rawBody = {}, params = {}) {
    const askDTO = new ModificarUsuarioAskDTO(rawBody, params);
    const idValido = validarIdUsuario(askDTO.id_usuario);

    if (!idValido) {
      throw crearErrorDominio('El id_usuario es obligatorio y debe ser válido', 400);
    }

    const usuarioActual = await usuarioAdapter.buscarPorIdAsync(idValido);
    if (!usuarioActual) {
      throw crearErrorDominio('Usuario no encontrado', 404);
    }

    const validacionUsuario = validarDatosUsuarioActualizacion(askDTO);
    lanzarSiInvalido(validacionUsuario, 400);

    const camposUsuario = { ...(validacionUsuario.campos ?? {}) };

    if (camposUsuario.rut !== undefined) {
      const duplicadoRut = await usuarioAdapter.buscarPorRutAsync(camposUsuario.rut);
      if (duplicadoRut && Number(duplicadoRut.id_usuario) !== idValido) {
        throw crearErrorDominio('El RUT ya pertenece a otro usuario', 409);
      }
    }

    const correoActualizado = camposUsuario.correo ?? camposUsuario.email;
    if (correoActualizado !== undefined) {
      const duplicadoCorreo = await usuarioAdapter.buscarPorCorreoAsync(correoActualizado);
      if (duplicadoCorreo && Number(duplicadoCorreo.id_usuario) !== idValido) {
        throw crearErrorDominio('El correo ya pertenece a otro usuario', 409);
      }
      if (camposUsuario.email !== undefined && camposUsuario.correo === undefined) {
        camposUsuario.correo = camposUsuario.email;
        delete camposUsuario.email;
      }
    }

    let rolesResultantes = null;
    if (askDTO.roles !== undefined) {
      if (!Array.isArray(askDTO.roles)) {
        throw crearErrorDominio('El campo roles debe ser un arreglo', 400);
      }

      const rolesResueltos = [];
      for (const rolItem of askDTO.roles) {
        const nombreRol =
          typeof rolItem === 'string'
            ? rolItem.trim().toUpperCase()
            : rolItem?.nombre
              ? String(rolItem.nombre).trim().toUpperCase()
              : null;

        if (!nombreRol) {
          throw crearErrorDominio('Cada rol en roles debe tener un nombre válido', 400);
        }

        const rolBD = await usuarioAdapter.obtenerRolPorNombreAsync(nombreRol);
        if (!rolBD) {
          throw crearErrorDominio(`El rol ${nombreRol} no existe en el sistema`, 400);
        }
        rolesResueltos.push(rolBD);
      }

      rolesResultantes = rolesResueltos;
    }

    let perfilParaGuardar;
    if (askDTO.perfilEstudiante !== undefined) {
      const validacionPerfil = validarPerfilEstudianteActualizacion(askDTO.perfilEstudiante);
      lanzarSiInvalido(validacionPerfil, 400);

      const camposPerfil = validacionPerfil.campos ?? {};
      const actualPerfil = usuarioActual.estudiante ?? {};
      perfilParaGuardar = {
        carrera:
          camposPerfil.carrera !== undefined
            ? camposPerfil.carrera
            : (actualPerfil.carrera ?? null),
        semestre:
          camposPerfil.semestre !== undefined
            ? camposPerfil.semestre
            : (actualPerfil.semestre ?? null),
        institucion:
          camposPerfil.institucion !== undefined
            ? camposPerfil.institucion
            : (actualPerfil.institucion ?? null)
      };
    }

    const camposUsuarioOriginales = Object.keys(camposUsuario).reduce((campos, campo) => {
      campos[campo] = usuarioActual[campo];
      return campos;
    }, {});
    const rolesOriginales = Array.isArray(usuarioActual.usuario_rol)
      ? usuarioActual.usuario_rol
          .map((relacion) => relacion.id_rol ?? relacion.rol?.id_rol)
          .filter((idRol) => idRol != null)
      : [];
    const perfilOriginal = usuarioActual.estudiante
      ? {
          carrera: usuarioActual.estudiante.carrera ?? null,
          semestre: usuarioActual.estudiante.semestre ?? null,
          institucion: usuarioActual.estudiante.institucion ?? null
        }
      : null;

    let usuarioActualizado = usuarioActual;
    let perfilResultante;
    let usuarioEscrito = false;
    let rolesEscritos = false;
    let perfilEscrito = false;

    try {
      if (Object.keys(camposUsuario).length > 0) {
        usuarioEscrito = true;
        usuarioActualizado = await usuarioAdapter.actualizarUsuarioAsync(idValido, camposUsuario);
      }

      if (rolesResultantes !== null) {
        rolesEscritos = true;
        await usuarioAdapter.sincronizarRolesUsuarioAsync(
          idValido,
          rolesResultantes.map((rol) => rol.id_rol)
        );
      }

      if (perfilParaGuardar !== undefined) {
        perfilEscrito = true;
        perfilResultante = await estudianteAdapter.guardarPerfilEstudianteAsync(
          idValido,
          perfilParaGuardar
        );
      }

      const payloadResolve = armarPayloadUsuarioResolve(usuarioActualizado, {
        rolesOverride: rolesResultantes ?? undefined,
        perfilOverride: perfilResultante
      });

      return new ModificarUsuarioResolveDTO(payloadResolve);
    } catch (error) {
      const erroresCompensacion = [];

      if (perfilEscrito) {
        try {
          if (perfilOriginal) {
            await estudianteAdapter.guardarPerfilEstudianteAsync(idValido, perfilOriginal);
          } else {
            await estudianteAdapter.eliminarPerfilEstudianteAsync(idValido);
          }
        } catch (errorCompensacion) {
          erroresCompensacion.push({
            accion: 'Restaurar el perfil de estudiante',
            error: errorCompensacion
          });
        }
      }

      if (rolesEscritos) {
        try {
          await usuarioAdapter.sincronizarRolesUsuarioAsync(idValido, rolesOriginales);
        } catch (errorCompensacion) {
          erroresCompensacion.push({
            accion: 'Restaurar los roles del usuario',
            error: errorCompensacion
          });
        }
      }

      if (usuarioEscrito) {
        try {
          await usuarioAdapter.actualizarUsuarioAsync(idValido, camposUsuarioOriginales);
        } catch (errorCompensacion) {
          erroresCompensacion.push({
            accion: 'Restaurar los datos del usuario',
            error: errorCompensacion
          });
        }
      }

      if (erroresCompensacion.length > 0) {
        throw crearErrorCompensacionFallida(
          'No se pudo completar la actualización del usuario',
          error,
          erroresCompensacion
        );
      }

      throw error;
    }
  }
}

module.exports = new ActualizarUsuarioService();
