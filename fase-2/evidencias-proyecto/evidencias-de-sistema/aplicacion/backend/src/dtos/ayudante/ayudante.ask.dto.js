class ObtenerPerfilPublicoAyudanteAskDTO {
  constructor(rawParams = {}) {
    const idUsuario =
      rawParams.id_usuario != null
        ? Number(rawParams.id_usuario)
        : null;

    if (
      idUsuario === null ||
      Number.isNaN(idUsuario)
    ) {
      throw new Error(
        "El campo 'id_usuario' es obligatorio."
      );
    }

    if (idUsuario <= 0) {
      throw new Error(
        "El campo 'id_usuario' debe ser un identificador válido."
      );
    }

    this.idUsuario = idUsuario;
  }
}

module.exports = {
  ObtenerPerfilPublicoAyudanteAskDTO
};