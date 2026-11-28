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