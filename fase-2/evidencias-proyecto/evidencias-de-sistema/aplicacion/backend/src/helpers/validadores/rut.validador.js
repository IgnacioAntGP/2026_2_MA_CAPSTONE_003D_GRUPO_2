function limpiarRut(rutRaw) {
  if (typeof rutRaw !== 'string') return null;

  const limpio = rutRaw.replace(/[^0-9kK]/g, '').toUpperCase();

  return limpio.length >= 2 ? limpio : null;
}

function normalizarRut(rutRaw) {
  const limpio = limpiarRut(rutRaw);

  if (!limpio) return null;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  if (!/^\d+$/.test(cuerpo)) return null;

  return `${cuerpo}-${dv}`;
}

function calcularDigitoVerificador(cuerpoRut) {
  const cuerpoStr =
    typeof cuerpoRut === 'number' && Number.isInteger(cuerpoRut)
      ? String(cuerpoRut)
      : typeof cuerpoRut === 'string'
      ? cuerpoRut.replace(/[^0-9]/g, '')
      : '';

  if (!/^\d{6,9}$/.test(cuerpoStr)) return null;

  let suma = 0;
  let factor = 2;

  for (let i = cuerpoStr.length - 1; i >= 0; i--) {
    suma += Number(cuerpoStr[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }

  const resto = 11 - (suma % 11);

  if (resto === 11) return '0';
  if (resto === 10) return 'K';

  return String(resto);
}

function validarRut(rutRaw) {
  const normalizado = normalizarRut(rutRaw);

  if (!normalizado) return false;

  const [cuerpo, dvIngresado] = normalizado.split('-');
  const dvEsperado = calcularDigitoVerificador(cuerpo);

  if (!dvEsperado) return false;

  return dvIngresado === dvEsperado;
}

function formatearRutConPuntos(rutRaw) {
  const normalizado = normalizarRut(rutRaw);

  if (!normalizado) return null;

  const [cuerpo, dv] = normalizado.split('-');
  const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${cuerpoConPuntos}-${dv}`;
}

module.exports = {
  limpiarRut,
  normalizarRut,
  calcularDigitoVerificador,
  validarRut,
  formatearRutConPuntos
};