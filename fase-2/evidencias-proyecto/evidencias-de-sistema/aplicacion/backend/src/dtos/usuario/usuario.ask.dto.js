class CrearUsuarioAskDTO {
  constructor(rawBody = {}) {
    const body = rawBody && typeof rawBody === 'object' ? rawBody : {};
    const perfilRaw =
      body.perfilEstudiante && typeof body.perfilEstudiante === 'object'
        ? body.perfilEstudiante
        : body;

    const tieneDatosEstudiante =
      perfilRaw.carrera != null ||
      perfilRaw.semestre != null ||
      perfilRaw.institucion != null;

    this.nombre = body.nombre ?? null;
    this.apellido = body.apellido ?? null;
    this.rut = body.rut ?? null;
    this.email = body.email ?? body.correo ?? null;
    this.password = body.password ?? null;
    this.id_rol = body.idRol ?? body.id_rol ?? null;
    this.roles = body.roles ?? null;
    this.perfilEstudiante = tieneDatosEstudiante
      ? {
          carrera: perfilRaw.carrera ?? null,
          semestre: perfilRaw.semestre ?? null,
          institucion: perfilRaw.institucion ?? null
        }
      : null;
  }
}

class ModificarUsuarioAskDTO {
  constructor(rawBody = {}, params = {}) {
    const body = rawBody && typeof rawBody === 'object' ? rawBody : {};
    const routeParams = params && typeof params === 'object' ? params : {};

    const perfilRaw =
      body.perfilEstudiante && typeof body.perfilEstudiante === 'object'
        ? body.perfilEstudiante
        : body;

    const tieneCamposPerfil =
      perfilRaw.carrera !== undefined ||
      perfilRaw.semestre !== undefined ||
      perfilRaw.institucion !== undefined;

    this.id_usuario =
      routeParams.id ?? routeParams.id_usuario ?? body.id_usuario ?? body.idUsuario ?? null;
    this.nombre = body.nombre !== undefined ? body.nombre : undefined;
    this.apellido = body.apellido !== undefined ? body.apellido : undefined;
    this.rut = body.rut !== undefined ? body.rut : undefined;
    this.email =
      body.email !== undefined
        ? body.email
        : body.correo !== undefined
        ? body.correo
        : undefined;
    this.roles = body.roles !== undefined ? body.roles : undefined;
    this.es_activo =
      body.es_activo !== undefined
        ? body.es_activo
        : body.esActivo !== undefined
        ? body.esActivo
        : undefined;
    this.perfilEstudiante = tieneCamposPerfil
      ? {
          carrera: perfilRaw.carrera !== undefined ? perfilRaw.carrera : undefined,
          semestre: perfilRaw.semestre !== undefined ? perfilRaw.semestre : undefined,
          institucion:
            perfilRaw.institucion !== undefined ? perfilRaw.institucion : undefined
        }
      : undefined;
  }
}

module.exports = { CrearUsuarioAskDTO, ModificarUsuarioAskDTO };