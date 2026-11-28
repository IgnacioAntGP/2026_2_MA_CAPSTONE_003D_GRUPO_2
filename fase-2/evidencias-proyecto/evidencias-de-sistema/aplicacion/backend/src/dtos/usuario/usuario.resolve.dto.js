class ObtenerUsuarioPerfilPublicoResolveDTO {
  constructor(rawBody = {}) {
    const estudiante = Array.isArray(rawBody.estudiante)
      ? (rawBody.estudiante[0] ?? null)
      : (rawBody.estudiante ?? null);

    this.id_usuario = rawBody.id_usuario != null ? Number(rawBody.id_usuario) : null;

    this.nombre = rawBody.nombre != null ? String(rawBody.nombre) : '';

    this.apellido = rawBody.apellido != null ? String(rawBody.apellido) : '';

    this.carrera = estudiante?.carrera != null ? String(estudiante.carrera) : null;

    this.semestre = estudiante?.semestre != null ? Number(estudiante.semestre) : null;

    this.institucion = estudiante?.institucion != null ? String(estudiante.institucion) : null;
  }
}

class UsuarioResolveDTO {
  constructor(rawData = {}, { mensaje = null } = {}) {
    const data = rawData && typeof rawData === 'object' ? rawData : {};

    if (mensaje) {
      this.mensaje = mensaje;
    }

    this.id_usuario = data.id_usuario != null ? Number(data.id_usuario) : null;
    this.user_uid = data.user_uid ?? data.auth_id ?? null;
    this.nombre = data.nombre ?? null;
    this.apellido = data.apellido ?? null;
    this.rut = data.rut ?? null;
    this.email = data.email ?? data.correo ?? null;
    this.roles = Array.isArray(data.roles) ? data.roles : [];
    this.perfilEstudiante = data.perfilEstudiante ?? null;
    this.es_activo =
      typeof data.es_activo === 'boolean'
        ? data.es_activo
        : Boolean(data.es_activo ?? true);
    this.fecha_registro = data.fecha_registro ?? null;
    this.ultimo_acceso = data.ultimo_acceso ?? null;
  }

  static desdeLista(items = []) {
    return (Array.isArray(items) ? items : []).map(
      (item) => new UsuarioResolveDTO(item)
    );
  }
}

class CrearUsuarioResolveDTO extends UsuarioResolveDTO {
  constructor(rawData = {}, mensaje = 'Usuario creado con éxito') {
    super(rawData, { mensaje });
  }
}

class ModificarUsuarioResolveDTO extends UsuarioResolveDTO {
  constructor(rawData = {}, mensaje = 'Usuario actualizado con éxito') {
    super(rawData, { mensaje });
  }
}

module.exports = {
  ObtenerUsuarioPerfilPublicoResolveDTO,
  UsuarioResolveDTO,
  CrearUsuarioResolveDTO,
  ModificarUsuarioResolveDTO
};
