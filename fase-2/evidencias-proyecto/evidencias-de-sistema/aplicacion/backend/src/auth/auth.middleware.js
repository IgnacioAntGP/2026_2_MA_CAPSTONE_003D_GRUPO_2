const supabase = require('../config/supabase');
const usuarioAdapter = require('../adapters/usuario.adapter');

async function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de autenticación no proporcionado o formato inválido.'
      });
    }

    const token = authHeader.split(' ')[1]?.trim();

    if (!token) {
      return res.status(401).json({
        error: 'Token vacío.'
      });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        error: 'Token inválido o expirado.'
      });
    }

    const { data: perfil, error: perfilError } = await supabase
      .from('usuario')
      .select('id_usuario, user_uid, nombre, apellido, rut, correo, es_activo')
      .eq('user_uid', data.user.id)
      .single();

    if (perfilError || !perfil) {
      return res.status(401).json({
        error: 'Usuario no registrado en el sistema.'
      });
    }

    if (!perfil.es_activo) {
      return res.status(403).json({
        error: 'La cuenta de usuario se encuentra inactiva.'
      });
    }

    const roles = await usuarioAdapter.obtenerRolesPorIdUsuarioAsync(perfil.id_usuario);
    const nombresRoles = roles.map((r) => r.nombre);

    req.user = {
      id_usuario: perfil.id_usuario,
      user_uid: perfil.user_uid,
      nombre: perfil.nombre,
      apellido: perfil.apellido,
      correo: perfil.correo,
      roles: nombresRoles,
      rolesDetalle: roles
    };

    return next();
  } catch (err) {
    console.error('Error en middleware verificarToken:', err);
    return res.status(500).json({
      error: 'Error al validar la autenticación.'
    });
  }
}

function autorizarRoles(...rolesPermitidos) {
  const permitidosNormalizados = rolesPermitidos.map((r) => String(r).toLowerCase());

  return (req, res, next) => {
    const rolesUsuario = (Array.isArray(req.user?.roles) ? req.user.roles : [])
      .map((r) => String(r).toLowerCase());

    const tienePermiso = permitidosNormalizados.some((rol) => rolesUsuario.includes(rol));

    if (!tienePermiso) {
      return res.status(403).json({
        error: 'No tienes permisos suficientes para realizar esta acción.'
      });
    }

    return next();
  };
}

module.exports = {
  verificarToken,
  autorizarRoles
};