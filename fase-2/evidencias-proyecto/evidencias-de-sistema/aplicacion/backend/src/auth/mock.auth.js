const mockAuthMiddleware = (req, res, next) => {
  // Lee el header x-user-role de Postman, y si no viene ninguno, por defecto le asigna 'Administrador' para las pruebas
  req.userRole = req.headers['x-user-role'] || 'Administrador';
  next();
};

module.exports = mockAuthMiddleware;