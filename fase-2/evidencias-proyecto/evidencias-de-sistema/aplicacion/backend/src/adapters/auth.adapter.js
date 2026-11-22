const supabase = require('../config/supabase');

class AuthAdapter {
  /**
   * Crea una cuenta en Supabase Auth (auth.users) para un correo dado.
   */
  async crearUsuarioAuthAsync({ correo, password, emailConfirm = true }) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: correo,
      password,
      email_confirm: emailConfirm
    });

    if (error) {
      throw error;
    }

    return data.user;
  }

  /**
   * Elimina una cuenta de Supabase Auth por su UUID.
   */
  async eliminarUsuarioAuthAsync(userUid) {
    if (!userUid) return;

    const { error } = await supabase.auth.admin.deleteUser(userUid);
    if (error) {
      throw error;
    }
  }

  /**
   * Vincula el UUID generado en Supabase Auth con el registro de la tabla "usuario".
   */
  async vincularUserUidEnUsuarioAsync(idUsuario, userUid) {
    const { data, error } = await supabase
      .from('usuario')
      .update({ user_uid: userUid })
      .eq('id_usuario', idUsuario)
      .select('id_usuario, correo, user_uid, es_activo')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

module.exports = new AuthAdapter();