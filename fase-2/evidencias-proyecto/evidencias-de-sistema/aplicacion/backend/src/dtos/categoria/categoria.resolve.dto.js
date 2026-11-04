class CategoriaResolveDTO {
    constructor(filaSupabase) {
        this.id_categoria = filaSupabase.id_categoria;
        this.nombre = filaSupabase.nombre;
        this.descripcion = filaSupabase.descripcion;
        this.es_activo = filaSupabase.es_activo;
    }
}

module.exports = { CategoriaResolveDTO };