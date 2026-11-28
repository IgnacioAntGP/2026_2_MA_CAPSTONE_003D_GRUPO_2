class PerfilEstudianteResolveDTO {
  constructor(rawPerfil = {}) {
    if (!rawPerfil || typeof rawPerfil !== 'object') {
      return null;
    }

    this.id_estudiante =
      rawPerfil.id_estudiante != null ? Number(rawPerfil.id_estudiante) : null;
    this.carrera = rawPerfil.carrera ?? null;
    this.semestre = rawPerfil.semestre != null ? Number(rawPerfil.semestre) : null;
    this.institucion = rawPerfil.institucion ?? null;
  }

  static desde(rawPerfil) {
    if (!rawPerfil || typeof rawPerfil !== 'object') {
      return null;
    }
    return new PerfilEstudianteResolveDTO(rawPerfil);
  }
}

module.exports = { PerfilEstudianteResolveDTO }