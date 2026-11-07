class CrearAsignaturaAskDTO {
    constructor(rawBody = {}) {
        const nombreRaw = rawBody?.nombre != null ? String(rawBody.nombre).trim() : '';
        const codigoRaw = rawBody?.codigo != null ? String(rawBody.codigo).trim() : '';

        if (!nombreRaw || String(nombreRaw).trim() === '') {
            throw new Error("El campo 'Nombre' es obligatorio.");
        }

        if(!codigoRaw || String(codigoRaw).trim() === ''){
            throw new Error("El campo 'Codigo' es obligatorio.")
        }

        this.nombre =  String(nombreRaw).trim();
        this.codigo = String(codigoRaw).trim();

        this.descripcion = rawBody.descripcion != null ? String(rawBody.descripcion).trim() : null;
        this.estado = rawBody.estado !== undefined ? Boolean(rawBody.estado) : true;
    }
}

module.exports = { CrearAsignaturaAskDTO };