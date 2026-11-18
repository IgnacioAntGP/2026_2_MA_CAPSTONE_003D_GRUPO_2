class ObtenerUsuarioPerfilPublicoResolveDTO {
  constructor(rawBody = {}) {

    const estudiante =
      Array.isArray(rawBody.estudiante)
        ? rawBody.estudiante[0] ?? null
        : rawBody.estudiante ?? null;

    this.id_usuario =
      rawBody.id_usuario != null
        ? Number(rawBody.id_usuario)
        : null;

    this.nombre =
      rawBody.nombre != null
        ? String(rawBody.nombre)
        : '';

    this.apellido =
      rawBody.apellido != null
        ? String(rawBody.apellido)
        : '';

    this.carrera =
      estudiante?.carrera != null
        ? String(estudiante.carrera)
        : null;

    this.semestre =
      estudiante?.semestre != null
        ? Number(estudiante.semestre)
        : null;

    this.institucion =
      estudiante?.institucion != null
        ? String(estudiante.institucion)
        : null;
  }
}

module.exports = {
  ObtenerUsuarioPerfilPublicoResolveDTO
};