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

export type RolAsignableUsuario = 'ESTUDIANTE' | 'AYUDANTE';

export interface RolUsuarioResponse {
  nombre: string | null;
}

export interface UsuarioResponse {
  id_usuario: number;
  nombre: string | null;
  apellido: string | null;
  rut: string | null;
  email: string | null;
  roles: RolUsuarioResponse[];
  es_activo: boolean;
}

export interface DatosUsuarioRequest {
  nombre: string;
  apellido: string;
  rut: string;
  email: string;
}

export interface CrearUsuarioRequest extends DatosUsuarioRequest {
  password: string;
  roles: RolAsignableUsuario[];
}

export interface ModificarUsuarioRequest extends DatosUsuarioRequest {
  roles?: RolAsignableUsuario[];
}