const {
  ROLES,
  ROL_POR_NOMBRE,
  ROL_POR_ID
} = require('../enums/rol.enum');

function normalizarRol(valor) {
  if (valor == null) return null;

  if (typeof valor === 'number' && Number.isInteger(valor)) {
    return ROL_POR_ID[valor] ?? null;
  }

  const texto = String(valor).trim();
  if (!texto) return null;

  if (/^\d+$/.test(texto)) {
    return ROL_POR_ID[Number(texto)] ?? null;
  }

  const mayus = texto.toUpperCase();
  if (Object.values(ROLES).includes(mayus)) {
    return mayus;
  }

  return ROL_POR_NOMBRE[texto.toUpperCase()] ?? null;
}

module.exports = { normalizarRol };