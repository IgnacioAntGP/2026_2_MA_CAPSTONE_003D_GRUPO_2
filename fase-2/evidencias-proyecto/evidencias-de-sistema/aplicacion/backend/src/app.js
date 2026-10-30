const express = require('express');
const cors = require('cors');

const consultaRoutes = require('./routes/consulta.routes');
const solicitudRoutes = require('./routes/solicitud.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const categoriaRoutes = require('./routes/categoria.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/consultas', consultaRoutes);
app.use('/api/solicitudes-ayudantia', solicitudRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.use('/api/categorias', categoriaRoutes);
app.use('/api/categorias-solicitud', categoriaRoutes);

module.exports = app;