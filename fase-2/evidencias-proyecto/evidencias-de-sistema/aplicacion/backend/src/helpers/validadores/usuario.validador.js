const { ESTADO_USUARIO, ES_ACTIVO_POR_ESTADO } = require('../enums/estado-usuario.enum');
const { normalizarEmail, validarEmail } = require('./email.validador');
const { normalizarRut, validarRut } = require('./rut.validador');

const LONGITUD_MAXIMA_NOMBRE = 100;
const LONGITUD_MINIMA_PASSWORD = 8;

function limpiarTextoUsuario(valor) {
  if (typeof valor !== 'string') return null;

  const limpio = valor.trim().replace(/\s+/g, ' ');

  return limpio.length > 0 ? limpio : null;
}

function resolverEsActivo(entrada, porDefecto = true) {
  if (entrada === undefined || entrada === null || entrada === '') {
    return porDefecto;
  }

  if (typeof entrada === 'boolean') {
    return entrada;
  }

  if (typeof entrada === 'number') {
    if (entrada === 1) return true;
    if (entrada === 0) return false;
    return null;
  }

  const limpio = String(entrada).trim().toUpperCase();

  if (limpio === 'TRUE' || limpio === '1' || limpio === ESTADO_USUARIO.ACTIVO) {
    return ES_ACTIVO_POR_ESTADO[ESTADO_USUARIO.ACTIVO];
  }

  if (limpio === 'FALSE' || limpio === '0' || limpio === ESTADO_USUARIO.INACTIVO) {
    return ES_ACTIVO_POR_ESTADO[ESTADO_USUARIO.INACTIVO];
  }

  return null;
}

function obtenerNombreEstado(esActivo) {
  return Boolean(esActivo) ? ESTADO_USUARIO.ACTIVO : ESTADO_USUARIO.INACTIVO;
}

function validarIdUsuario(idUsuario) {
  if (idUsuario === null || idUsuario === undefined || typeof idUsuario === 'boolean') {
    return null;
  }

  const num = typeof idUsuario === 'number' ? idUsuario : Number(String(idUsuario).trim());

  return Number.isInteger(num) && num > 0 ? num : null;
}

function validarPasswordOpcional(password) {
  if (password === undefined || password === null || password === '') {
    return { valido: true, valor: null, error: null };
  }

  if (typeof password !== 'string') {
    return { valido: false, valor: null, error: 'La contraseña debe ser texto.' };
  }

  const limpia = password.trim();

  if (limpia.length < LONGITUD_MINIMA_PASSWORD) {
    return {
      valido: false,
      valor: null,
      error: `La contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres.`
    };
  }

  return { valido: true, valor: limpia, error: null };
}

function validarDatosUsuarioCreacion(datos = {}) {
  const errores = [];
  const nombre = limpiarTextoUsuario(datos.nombre);
  const apellido = limpiarTextoUsuario(datos.apellido);
  const correo = normalizarEmail(datos.correo ?? datos.email);
  const rut = normalizarRut(datos.rut);

  if (!nombre) {
    errores.push('El nombre es obligatorio.');
  } else if (nombre.length > LONGITUD_MAXIMA_NOMBRE) {
    errores.push(`El nombre no puede superar los ${LONGITUD_MAXIMA_NOMBRE} caracteres.`);
  }

  if (!apellido) {
    errores.push('El apellido es obligatorio.');
  } else if (apellido.length > LONGITUD_MAXIMA_NOMBRE) {
    errores.push(`El apellido no puede superar los ${LONGITUD_MAXIMA_NOMBRE} caracteres.`);
  }

  if (!correo || !validarEmail(correo)) {
    errores.push('El correo electrónico no es válido.');
  }

  if (!rut || !validarRut(rut)) {
    errores.push('El RUT ingresado no es válido.');
  }

  const passResult = validarPasswordOpcional(datos.password);
  
  if (!passResult.valido) {
    errores.push(passResult.error);
  }

  return {
    valido: errores.length === 0,
    errores,
    datosNormalizados: {
      nombre,
      apellido,
      correo,
      rut,
      password: passResult.valor
    }
  };
}

function validarDatosUsuarioActualizacion(datos = {}) {
  const errores = [];
  const campos = {};

  if (datos.nombre !== undefined) {
    const nombre = limpiarTextoUsuario(datos.nombre);
    if (!nombre) {
      errores.push('El nombre no puede estar vacío.');
    } else if (nombre.length > LONGITUD_MAXIMA_NOMBRE) {
      errores.push(`El nombre no puede superar los ${LONGITUD_MAXIMA_NOMBRE} caracteres.`);
    } else {
      campos.nombre = nombre;
    }
  }

  if (datos.apellido !== undefined) {
    const apellido = limpiarTextoUsuario(datos.apellido);
    if (!apellido) {
      errores.push('El apellido no puede estar vacío.');
    } else if (apellido.length > LONGITUD_MAXIMA_NOMBRE) {
      errores.push(`El apellido no puede superar los ${LONGITUD_MAXIMA_NOMBRE} caracteres.`);
    } else {
      campos.apellido = apellido;
    }
  }

  if (datos.correo !== undefined || datos.email !== undefined) {
    const rawCorreo = datos.correo ?? datos.email;
    const correo = normalizarEmail(rawCorreo);
    if (!correo || !validarEmail(correo)) {
      errores.push('El correo electrónico no es válido.');
    } else {
      campos.correo = correo;
    }
  }

  if (datos.rut !== undefined) {
    const rut = normalizarRut(datos.rut);
    if (!rut || !validarRut(rut)) {
      errores.push('El RUT ingresado no es válido.');
    } else {
      campos.rut = rut;
    }
  }

  if (datos.es_activo !== undefined) {
    const estado = resolverEsActivo(datos.es_activo, null);
    if (estado === null) {
      errores.push('El estado de usuario no es válido.');
    } else {
      campos.es_activo = estado;
    }
  }

  return {
    valido: errores.length === 0,
    errores,
    campos
  };
}

module.exports = {
  LONGITUD_MAXIMA_NOMBRE,
  LONGITUD_MINIMA_PASSWORD,
  limpiarTextoUsuario,
  resolverEsActivo,
  obtenerNombreEstado,
  validarIdUsuario,
  validarPasswordOpcional,
  validarDatosUsuarioCreacion,
  validarDatosUsuarioActualizacion
};
