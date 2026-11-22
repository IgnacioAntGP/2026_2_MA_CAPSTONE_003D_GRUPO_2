const path = require('path');
const supabase = require(path.resolve(__dirname, '../src/config/supabase'));

async function sincronizarUsuariosExistentes(passwordInicial = 'Temporal@123') {
  // 1. Leer usuarios existentes que aún no tienen UUID vinculado
  const { data: usuarios, error } = await supabase
    .from('usuario')
    .select('id_usuario, correo, user_uid')
    .is('user_uid', null);

  if (error) {
    throw new Error(`Error leyendo tabla usuario: ${error.message}`);
  }

  for (const u of usuarios || []) {
    if (!u.correo) continue;

    // 2. Crear cuenta en Supabase Auth (auth.users)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: u.correo,
      password: passwordInicial,
      email_confirm: true
    });

    if (authError) {
      console.error(`No se pudo crear cuenta Auth para ${u.correo}: ${authError.message}`);
      continue;
    }

    const uuidAuth = authData.user.id;

    // 3. Vincular el UUID generado en la tabla public.usuario
    const { error: updateError } = await supabase
      .from('usuario')
      .update({ user_uid: uuidAuth })
      .eq('id_usuario', u.id_usuario);

    if (updateError) {
      console.error(`Error vinculando UUID a id_usuario=${u.id_usuario}: ${updateError.message}`);
    } else {
      console.log(`OK -> ${u.correo} (id_usuario=${u.id_usuario}) vinculado a ${uuidAuth}`);
    }
  }
}

// Ejecución directa al correr el script con `node`
const passwordArg = process.argv[2];

sincronizarUsuariosExistentes(passwordArg || undefined)
  .then(() => {
    console.log('Sincronización finalizada.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error fatal en sincronización:', err.message);
    process.exit(1);
  });