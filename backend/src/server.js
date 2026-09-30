const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./config/supabase');

const app = express();
app.use(cors());
app.use(express.json());

// 1. VISTA: Comunidad (Listar consultas con su autor, asignatura y conteo de respuestas)
app.get('/api/consultas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('consulta')
      .select(`
        id_consulta,
        titulo,
        descripcion,
        fecha_creacion,
        asignatura ( id_asignatura, nombre ),
        usuario ( id_usuario, nombre ),
        respuesta ( id_respuesta )
      `)
      .eq('estado', true)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    // Formatear respuesta con conteo
    const resultado = data.map((item) => ({
      id_consulta: item.id_consulta,
      titulo: item.titulo,
      descripcion: item.descripcion,
      fecha_creacion: item.fecha_creacion,
      asignatura: item.asignatura?.nombre,
      autor: item.usuario?.nombre,
      total_respuestas: item.respuesta?.length || 0
    }));

    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. VISTA: Nueva Publicación (Crear consulta)
app.post('/api/consultas', async (req, res) => {
  const { id_usuario, id_asignatura, titulo, descripcion } = req.body;

  if (!id_usuario || !id_asignatura || !titulo || !descripcion) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const { data, error } = await supabase
      .from('consulta')
      .insert([{ id_usuario, id_asignatura, titulo, descripcion }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. VISTA: Mis Publicaciones
app.get('/api/consultas/usuario/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const { data, error } = await supabase
      .from('consulta')
      .select(`
        id_consulta,
        titulo,
        descripcion,
        fecha_creacion,
        asignatura ( nombre ),
        solicitud_ayudantia ( id_solicitud, estado ),
        respuesta ( id_respuesta )
      `)
      .eq('id_usuario', id_usuario)
      .eq('estado', true)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    const formateadas = data.map((item) => ({
      id_consulta: item.id_consulta,
      titulo: item.titulo,
      descripcion: item.descripcion,
      asignatura: item.asignatura?.nombre,
      total_respuestas: item.respuesta?.length || 0,
      tutoria_solicitada: item.solicitud_ayudantia?.length > 0
    }));

    return res.status(200).json(formateadas);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 4. VISTA: Detalle Consulta (Ver respuestas y agregar respuesta)
app.get('/api/consultas/:id_consulta/respuestas', async (req, res) => {
  const { id_consulta } = req.params;

  try {
    const { data, error } = await supabase
      .from('respuesta')
      .select(`
        id_respuesta,
        contenido,
        fecha_respuesta,
        usuario ( nombre, apellido )
      `)
      .eq('id_consulta', id_consulta)
      .eq('estado', true)
      .order('fecha_respuesta', { ascending: true });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/consultas/:id_consulta/respuestas', async (req, res) => {
  const { id_consulta } = req.params;
  const { id_usuario, contenido } = req.body;

  try {
    const { data, error } = await supabase
      .from('respuesta')
      .insert([{ id_consulta, id_usuario, contenido }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 5. VISTA: Solicitar Tutoría (Escalamiento a Ayudantía)
app.post('/api/solicitudes-ayudantia', async (req, res) => {
  const { id_consulta, modalidad, motivo } = req.body;

  try {
    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .insert([{ id_consulta, modalidad, motivo, estado: 'PENDIENTE' }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend EntrePares ejecutándose en el puerto ${PORT}`);
});