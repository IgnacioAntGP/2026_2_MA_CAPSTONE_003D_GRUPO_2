const express = require('express');
const cors = require('cors');

const consultaRoutes = require('./routes/consulta.routes');
const solicitudRoutes = require('./routes/solicitud.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const postulacionRoutes = require('./routes/postulacion.routes');
const especialidadRoutes = require('./routes/especialidad.routes');
const asignaturaRoutes = require('./routes/asignatura.routes');
const notificacionRoutes = require('./routes/notificacion.routes');
const ayudanteRoutes = require('./routes/ayudante.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/consultas', consultaRoutes);
app.use('/api/solicitudes-ayudantia', solicitudRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias-solicitud', categoriaRoutes);
app.use('/api/postulaciones-ayudante', postulacionRoutes);
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/asignaturas', asignaturaRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/ayudantes', ayudanteRoutes);

app.get('/', (_req, res) => {
  res.send('Bienvenido a la API de EntrePares');
});

module.exports = app;