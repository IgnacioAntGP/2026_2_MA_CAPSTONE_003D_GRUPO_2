const { RolResolveDTO } = require('../../dtos/rol/rol.resolve.dto');
const {
  PerfilEstudianteResolveDTO
} = require('../../dtos/estudiante/estudiante.resolve.dto');
const { formatearFechaISO } = require('../../helpers/validadores/fecha.validador');

function armarPayloadUsuarioResolve(registroBD, { rolesOverride, perfilOverride } = {}) {
  if (!registroBD) return null;

  const rolesOrigen = Array.isArray(rolesOverride)
    ? rolesOverride
    : Array.isArray(registroBD.roles)
      ? registroBD.roles
      : Array.isArray(registroBD.usuario_rol)
        ? registroBD.usuario_rol
        : [];

  const perfilOrigen =
    perfilOverride !== undefined
      ? perfilOverride
      : (registroBD.estudiante ?? registroBD.perfilEstudiante ?? null);

  return {
    id_usuario: registroBD.id_usuario,
    user_uid: registroBD.user_uid ?? registroBD.auth_id ?? null,
    nombre: registroBD.nombre,
    apellido: registroBD.apellido,
    rut: registroBD.rut,
    email: registroBD.correo ?? registroBD.email ?? null,
    roles: rolesOrigen.map((rol) => new RolResolveDTO(rol)),
    perfilEstudiante: perfilOrigen ? new PerfilEstudianteResolveDTO(perfilOrigen) : null,
    es_activo: registroBD.es_activo,
    fecha_registro: formatearFechaISO(registroBD.fecha_registro),
    ultimo_acceso: formatearFechaISO(registroBD.ultimo_acceso)
  };
}

module.exports = { armarPayloadUsuarioResolve };
