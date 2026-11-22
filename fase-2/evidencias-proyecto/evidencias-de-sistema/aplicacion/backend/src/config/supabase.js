const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno de Supabase.');
}

// 1. Cliente principal (singleton) para todos los adaptadores de base de datos
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Fábrica para crear un cliente limpio de Auth por cada intento de login
supabase.crearClienteAuth = () =>
  createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

module.exports = supabase;