class CrearCategoriaAskDTO{
    constructor(body){
        this.nombre = body.nombre? String(body.nombre).trim() : '';
        this.descripcion = body.descripcion? String(body.descripcion).trim() : null;
        this.es_activo = true;
    }
}

module.exports = { CrearCategoriaAskDTO };