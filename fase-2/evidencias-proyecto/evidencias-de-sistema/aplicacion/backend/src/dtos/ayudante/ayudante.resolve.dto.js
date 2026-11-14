class ObtenerAyudanteResolveDTO {
  constructor(rawBody = {}) {
    this.id_ayudante =
      rawBody.id_ayudante != null
        ? Number(rawBody.id_ayudante)
        : null;

    this.id_usuario =
      rawBody.id_usuario != null
        ? Number(rawBody.id_usuario)
        : null;

    this.descripcion =
      rawBody.descripcion != null
        ? String(rawBody.descripcion)
        : null;
  }
}


class ObtenerPerfilPublicoAyudanteResolveDTO {
  constructor({
    ayudante = {},
    usuario = {},
    especialidades = [],
    estadisticas = {}
  } = {}) {

    this.id_ayudante =
      ayudante.id_ayudante ?? null;

    this.id_usuario =
      ayudante.id_usuario ?? null;

    this.nombre =
      usuario.nombre ?? '';

    this.apellido =
      usuario.apellido ?? '';

    this.descripcion =
      ayudante.descripcion ?? null;

    this.carrera =
      usuario.carrera ?? null;

    this.semestre =
      usuario.semestre ?? null;

    this.institucion =
      usuario.institucion ?? null;

    this.especialidades =
      especialidades.map(
        (especialidad) => ({
          id_asignatura:
            especialidad.id_asignatura ?? null,

          asignatura:
            especialidad.asignatura?.nombre ?? null,

          codigo:
            especialidad.asignatura?.codigo ?? null,

          nivel_competencia:
            especialidad.nivel_competencia ?? null
        })
      );

    this.estadisticas = {
      ayudantias_finalizadas:
        estadisticas.ayudantias_finalizadas ?? 0,

      total_evaluaciones:
        estadisticas.total_evaluaciones ?? 0,

      promedio_valoracion:
        estadisticas.promedio_valoracion ?? null
    };
  }
}


module.exports = {
  ObtenerAyudanteResolveDTO,
  ObtenerPerfilPublicoAyudanteResolveDTO
};