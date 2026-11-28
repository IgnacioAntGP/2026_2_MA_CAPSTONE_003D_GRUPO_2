class RolResolveDTO {
  constructor(rawRol = {}) {
    if (typeof rawRol === 'string') {
      const codigo = rawRol.trim().toUpperCase();
      this.id_rol = null;
      this.nombre = codigo || null;
      this.descripcion = null;
      return;
    }

    const origen =
      rawRol && typeof rawRol === 'object' && rawRol.rol && typeof rawRol.rol === 'object'
        ? rawRol.rol
        : rawRol && typeof rawRol === 'object'
        ? rawRol
        : {};

    this.id_rol = origen.id_rol != null ? Number(origen.id_rol) : null;
    this.nombre = origen.nombre ? String(origen.nombre).trim().toUpperCase() : null;
    this.descripcion = origen.descripcion ?? null;
  }

  static desdeLista(items = []) {
    return (Array.isArray(items) ? items : [])
      .map((item) => new RolResolveDTO(item))
      .filter((rol) => Boolean(rol.nombre || rol.id_rol != null));
  }
}

module.exports = { RolResolveDTO }