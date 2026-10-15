const express = require('express');
const cors = require('cors');

const consultaRoutes = require('./routes/consulta.routes');
const solicitudRoutes = require('./routes/solicitud.routes');
const usuarioRoutes = require('./routes/usuario.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/consultas', consultaRoutes);
app.use('/api/solicitudes-ayudantia', solicitudRoutes);
app.use('/api/usuarios', usuarioRoutes);

module.exports = app;