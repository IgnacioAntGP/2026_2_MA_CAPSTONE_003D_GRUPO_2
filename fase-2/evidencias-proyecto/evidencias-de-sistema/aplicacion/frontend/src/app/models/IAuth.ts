export interface RolAuth {
  id_rol: number;
  nombre: string;
  descripcion: string;
}

export interface UsuarioAutenticado {
  id_usuario: number;
  user_uid: string;
  nombre: string;
  apellido: string;
  correo: string;
  roles: RolAuth[];
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
  refreshToken: string;
  expiresAt: number;
  usuario: UsuarioAutenticado;
}

export interface SesionUsuario {
  token: string;
  refreshToken: string;
  expiresAt: number;
  usuario: UsuarioAutenticado;
}