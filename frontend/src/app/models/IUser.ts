export interface Users{
    //TODO añadir fecha_registro, ultimo_acceso
    id:string,
    rut:string,
    nombre:string,
    username:string,
    password:string,
    email:string,
    imagen:string,
    isactive:boolean,
}

export interface UserNuevo{
    rut:string,
    nombre:string,
    username:string,
    password:string,
    email:string,
    imagen:string,
    isactive:boolean,
}