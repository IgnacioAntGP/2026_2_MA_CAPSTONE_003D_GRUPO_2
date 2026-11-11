class CrearCategoriaActividadAskDTO{
    constructor(body){
        this.nombre = body.nombre? String(body.nombre).trim() : '';
        this.descripcion = body.descripcion? String(body.descripcion).trim() : null;
        this.esActivo = true;
    }
}

class ModificarCategoriaActividadAskDTO{
    constructor(body){
        this.nombre = body.nombre != undefined ? String(body.nombre).trim() : undefined;
        this.descripcion = body.descripcion != undefined ? String(body.descripcion).trim() : undefined;
        this.esActivo = body.esActivo != undefined ? Boolean(body.esActivo) : undefined;
    }
}

module.exports = { CrearCategoriaActividadAskDTO, ModificarCategoriaActividadAskDTO };