class CrearAsignaturaResolveDTO {
    constructor(asignatura = {}) {
        this.id_asignatura = asignatura.id_asignatura != null ? Number(asignatura.id_asignatura) : null;
        this.nombre = asignatura.nombre != null ? String(asignatura.nombre) : '';
        this.codigo = asignatura.codigo != null ? String(asignatura.codigo) : '';
        this.descripcion = asignatura.descripcion != null ? String(asignatura.descripcion) : null;
        this.estado = asignatura.estado != null ? Boolean(asignatura.estado) : true;
        this.mensaje = asignatura.mensaje != null ? String(asignatura.mensaje) : 'Asignatura creada exitosamente';
    }
}

class ObtenerAsignaturaResolveDTO {
    constructor(asignatura = {}) {
        this.id_asignatura = asignatura.id_asignatura != null ? Number(asignatura.id_asignatura) : null;
        this.nombre = asignatura.nombre != null ? String(asignatura.nombre) : '';
        this.codigo = asignatura.codigo != null ? String(asignatura.codigo) : '';
        this.descripcion = asignatura.descripcion != null ? String(asignatura.descripcion) : null;
        this.estado = asignatura.estado != null ? Boolean(asignatura.estado) : true;
    }
}

module.exports = {CrearAsignaturaResolveDTO, ObtenerAsignaturaResolveDTO};
