function crearErrorDominio(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function lanzarSiInvalido(resultado, codigoPorDefecto = 400) {
  if (!resultado || resultado.valido) return;
  const detalle =
    Array.isArray(resultado.errores) && resultado.errores.length > 0
      ? resultado.errores.join(' ')
      : 'Los datos ingresados no son válidos.';
  throw crearErrorDominio(detalle, resultado.statusCode ?? codigoPorDefecto);
}

function crearErrorCompensacionFallida(contexto, errorOriginal, erroresCompensacion) {
  const detalleErrores = erroresCompensacion
    .map(({ accion, error }) => `${accion}: ${error.message || String(error)}`)
    .join('; ');
  const mensajeOriginal = errorOriginal?.message || String(errorOriginal);

  console.error(contexto, {
    errorOriginal: mensajeOriginal,
    erroresCompensacion: erroresCompensacion.map(({ accion, error }) => ({
      accion,
      mensaje: error.message || String(error)
    }))
  });

  const err = crearErrorDominio(
    `${contexto}. Error original: ${mensajeOriginal}. Falló la compensación: ${detalleErrores}`,
    500
  );
  err.cause = errorOriginal;
  return err;
}

module.exports = {
  crearErrorDominio,
  lanzarSiInvalido,
  crearErrorCompensacionFallida
};
