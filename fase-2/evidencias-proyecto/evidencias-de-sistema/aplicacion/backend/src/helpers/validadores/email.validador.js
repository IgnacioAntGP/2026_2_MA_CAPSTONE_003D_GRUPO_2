const LONGITUD_MAXIMA_EMAIL = 150;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normalizarEmail(emailRaw) {
  if (typeof emailRaw !== 'string') return null;

  const limpio = emailRaw.trim().toLowerCase();

  return limpio.length > 0 ? limpio : null;
}

function obtenerDominioEmail(emailRaw) {
  const normalizado = normalizarEmail(emailRaw);

  if (!normalizado || !normalizado.includes('@')) return null;

  const partes = normalizado.split('@');

  if (partes.length !== 2) return null;

  return partes[1] || null;
}

function validarEmail(emailRaw) {
  const normalizado = normalizarEmail(emailRaw);

  if (!normalizado) return false;
  if (normalizado.length > LONGITUD_MAXIMA_EMAIL) return false;
  if (!REGEX_EMAIL.test(normalizado)) return false;

  const [local, dominio] = normalizado.split('@');
  
  if (!local || local.length > 64) return false;
  if (!dominio || dominio.length > 253) return false;

  const etiquetasDominio = dominio.split('.');
  const tieneEtiquetaInvalida = etiquetasDominio.some(
    (etiqueta) =>
      etiqueta.length === 0 ||
      etiqueta.startsWith('-') ||
      etiqueta.endsWith('-')
  );

  return !tieneEtiquetaInvalida;
}

function esDominioPermitido(emailRaw, dominiosPermitidos = []) {
  if (!validarEmail(emailRaw)) return false;
  if (!Array.isArray(dominiosPermitidos) || dominiosPermitidos.length === 0) {
    return true;
  }

  const dominio = obtenerDominioEmail(emailRaw);
  const permitidosNormalizados = dominiosPermitidos
    .filter((d) => typeof d === 'string' && d.trim().length > 0)
    .map((d) => d.trim().toLowerCase().replace(/^@/, ''));

  return permitidosNormalizados.includes(dominio);
}

module.exports = {
  LONGITUD_MAXIMA_EMAIL,
  normalizarEmail,
  obtenerDominioEmail,
  validarEmail,
  esDominioPermitido
};