const supabase = require('../config/supabase');
const usuarioAdapter = require('../adapters/usuario.adapter');

class AuthController {
  async login(req, res) {

    try {
      const correo = (req.body.correo || req.body.email || '').trim().toLowerCase();
      const password = req.body.password;

      if (!correo || !password) {
        return res.status(400).json({
          error: 'Debes ingresar correo y contraseña.'
        });
      }

      const authClient = supabase.crearClienteAuth();

      // 1. Autenticación contra Supabase Auth
      const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
        email: correo,
        password
      });

      if (authError || !authData?.session || !authData?.user) {
        return res.status(401).json({
          error: 'Credenciales inválidas.'
        });
      }

      const authUser = authData.user;

      // 2. Buscar perfil en public.usuario vinculado por user_uid
      const { data: perfil, error: perfilError } = await supabase
        .from('usuario')
        .select('id_usuario, user_uid, nombre, apellido, rut, correo, es_activo')
        .eq('user_uid', authUser.id)
        .single();

      if (perfilError || !perfil) {
        return res.status(404).json({
          error: 'Usuario no encontrado en la base de datos de EntrePares.'
        });
      }

      if (!perfil.es_activo) {
        return res.status(403).json({
          error: 'La cuenta se encuentra inactiva.'
        });
      }

      // 3. Consultar roles desde usuario_rol y rol
      const roles = await usuarioAdapter.obtenerRolesPorIdUsuarioAsync(perfil.id_usuario);

      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso.',
        token: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt: authData.session.expires_at,
        usuario: {
          id_usuario: perfil.id_usuario,
          user_uid: perfil.user_uid,
          nombre: perfil.nombre,
          apellido: perfil.apellido,
          correo: perfil.correo,
          roles
        }
      });
    } catch (err) {
      console.error('Error en AuthController.login:', err);
      return res.status(500).json({
        error: 'Error interno al procesar el inicio de sesión.'
      });
    }
  }
}

module.exports = new AuthController();