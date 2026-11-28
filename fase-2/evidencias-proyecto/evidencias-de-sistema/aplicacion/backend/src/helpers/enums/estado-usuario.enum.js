const ESTADO_USUARIO = Object.freeze({
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO'
});

const ES_ACTIVO_POR_ESTADO = Object.freeze({
  [ESTADO_USUARIO.ACTIVO]: true,
  [ESTADO_USUARIO.INACTIVO]: false
});

module.exports = {
  ESTADO_USUARIO,
  ES_ACTIVO_POR_ESTADO,
};