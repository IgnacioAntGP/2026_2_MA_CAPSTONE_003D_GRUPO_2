export interface Users{
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