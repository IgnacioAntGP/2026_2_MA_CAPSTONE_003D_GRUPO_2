class ObtenerCategoriaActividadResolveDTO {
    constructor(filaSupabase) {
        this.idCategoria = filaSupabase.id_categoria != null ? Number(filaSupabase.id_categoria) : null;
        this.nombre = filaSupabase.nombre != null ? String(filaSupabase.nombre) : null;
        this.descripcion = filaSupabase.descripcion ?? null;
        this.fechaCreacion = filaSupabase.fechaCreacion != null ? new Date(filaSupabase.fecha_creacion) : null;
    }
}

module.exports = { ObtenerCategoriaActividadResolveDTO };