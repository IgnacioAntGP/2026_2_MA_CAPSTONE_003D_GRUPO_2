function formatearFechaISO(fecha) {
  if (!fecha) return null;
  const date = fecha instanceof Date ? fecha : new Date(fecha);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

module.exports = {
  formatearFechaISO
};