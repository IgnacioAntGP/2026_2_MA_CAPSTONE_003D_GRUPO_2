const express = require('express');
const cors = require('cors');
require('dotenv').config();

const supabase = require('./config/supabase');

const app = express();

app.use(cors());
app.use(express.json());


// ======================================================
// 1. VISTA: Comunidad
// Listar consultas con autor, asignatura y conteo respuestas
// ======================================================

app.get('/api/consultas', async (req, res) => {

  try {

    const { data, error } = await supabase
      .from('consulta')
      .select(`
        id_consulta,
        titulo,
        descripcion,
        fecha_creacion,
        asignatura (
          id_asignatura,
          nombre
        ),
        usuario (
          id_usuario,
          nombre
        ),
        respuesta (
          id_respuesta
        )
      `)
      .eq('estado', true)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

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

    return res.status(500).json({
      error: err.message
    });

  }

});


// ======================================================
// 2. VISTA: Nueva Publicación
// Crear consulta
// ======================================================

app.post('/api/consultas', async (req, res) => {

  const {
    id_usuario,
    id_asignatura,
    titulo,
    descripcion
  } = req.body;

  if (!id_usuario || !id_asignatura || !titulo || !descripcion) {

    return res.status(400).json({
      error: 'Todos los campos son obligatorios.'
    });

  }

  try {

    const { data, error } = await supabase
      .from('consulta')
      .insert([
        {
          id_usuario,
          id_asignatura,
          titulo,
          descripcion
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(data);

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});


// ======================================================
// 3. VISTA: Mis Publicaciones
// Listar consultas por usuario
// ======================================================

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
        asignatura (
          nombre
        ),
        solicitud_ayudantia (
          id_solicitud,
          estado
        ),
        respuesta (
          id_respuesta
        )
      `)
      .eq('id_usuario', id_usuario)
      .eq('estado', true)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    const formateadas = data.map((item) => ({
      id_consulta: item.id_consulta,
      titulo: item.titulo,
      descripcion: item.descripcion,
      fecha_creacion: item.fecha_creacion,
      asignatura: item.asignatura?.nombre,
      total_respuestas: item.respuesta?.length || 0,
      tutoria_solicitada: item.solicitud_ayudantia?.length > 0
    }));

    return res.status(200).json(formateadas);

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});


// ======================================================
// 4. VISTA: Detalle de Consulta
// Obtener consulta por ID
// ======================================================

app.get('/api/consultas/:id_consulta', async (req, res) => {

  const { id_consulta } = req.params;

  try {

    const { data, error } = await supabase
      .from('consulta')
      .select(`
        id_consulta,
        id_usuario,
        titulo,
        descripcion,
        fecha_creacion,
        estado,

        asignatura (
          id_asignatura,
          nombre
        ),

        usuario (
          id_usuario,
          nombre,
          apellido
        )
      `)
      .eq('id_consulta', id_consulta)
      .eq('estado', true)
      .single();

    if (error) throw error;

    const consulta = {

      id_consulta: data.id_consulta,
      id_usuario: data.id_usuario,
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha_creacion: data.fecha_creacion,

      asignatura:
        data.asignatura?.nombre,

      autor:
        `${data.usuario?.nombre ?? ''} ${data.usuario?.apellido ?? ''}`.trim()

    };

    return res.status(200).json(consulta);

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});


// ======================================================
// 5. VISTA: Detalle Consulta
// Obtener respuestas
// ======================================================

app.get(
  '/api/consultas/:id_consulta/respuestas',
  async (req, res) => {

    const { id_consulta } = req.params;

    try {

      const { data, error } = await supabase
        .from('respuesta')
        .select(`
          id_respuesta,
          contenido,
          fecha_respuesta,

          usuario (
            nombre,
            apellido
          )
        `)
        .eq('id_consulta', id_consulta)
        .eq('estado', true)
        .order('fecha_respuesta', { ascending: true });

      if (error) throw error;

      return res.status(200).json(data);

    } catch (err) {

      return res.status(500).json({
        error: err.message
      });

    }

  }
);


// ======================================================
// 6. VISTA: Detalle Consulta
// Agregar respuesta
// ======================================================

app.post(
  '/api/consultas/:id_consulta/respuestas',
  async (req, res) => {

    const { id_consulta } = req.params;

    const {
      id_usuario,
      contenido
    } = req.body;

    if (!id_usuario || !contenido) {

      return res.status(400).json({
        error: 'Usuario y contenido son obligatorios.'
      });

    }

    try {

      const { data, error } = await supabase
        .from('respuesta')
        .insert([
          {
            id_consulta,
            id_usuario,
            contenido
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json(data);

    } catch (err) {

      return res.status(500).json({
        error: err.message
      });

    }

  }
);


// ======================================================
// 7. VISTA: Solicitar Tutoría
// Escalamiento a ayudantía
// ======================================================

app.post('/api/solicitudes-ayudantia', async (req, res) => {

  const {
    id_consulta,
    modalidad,
    motivo
  } = req.body;

  if (!id_consulta || !modalidad || !motivo) {

    return res.status(400).json({
      error: 'Consulta, modalidad y motivo son obligatorios.'
    });

  }

  try {

    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .insert([
        {
          id_consulta,
          modalidad,
          motivo,
          estado: 'PENDIENTE'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(data);

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});


// ======================================================
// 8. VISTA: Mis Tutorías
// Listar solicitudes de ayudantía por estudiante
// ======================================================

app.get(
  '/api/solicitudes-ayudantia/usuario/:id_usuario',
  async (req, res) => {

    const { id_usuario } = req.params;

    try {

      const { data, error } = await supabase
        .from('solicitud_ayudantia')
        .select(`
          id_solicitud,
          modalidad,
          fecha_solicitud,
          estado,
          motivo,

          consulta!inner (
            id_consulta,
            id_usuario,
            titulo,

            asignatura (
              nombre
            )
          ),

          ayudante (
            id_ayudante,

            usuario (
              nombre,
              apellido
            )
          ),

          ayudantia (
            id_ayudantia,
            fecha_inicio,
            fecha_fin,
            estado,
            observaciones
          )
        `)
        .eq('consulta.id_usuario', id_usuario)
        .order('fecha_solicitud', { ascending: false });

      if (error) throw error;

      const resultado = data.map((item) => ({

        id_solicitud:
          item.id_solicitud,

        id_consulta:
          item.consulta?.id_consulta,

        titulo:
          item.consulta?.titulo,

        asignatura:
          item.consulta?.asignatura?.nombre,

        modalidad:
          item.modalidad,

        fecha_solicitud:
          item.fecha_solicitud,

        estado_solicitud:
          item.estado,

        motivo:
          item.motivo,

        ayudante:
          item.ayudante
            ? `${item.ayudante.usuario?.nombre ?? ''} ${item.ayudante.usuario?.apellido ?? ''}`.trim()
            : null,

        ayudantia:
          Array.isArray(item.ayudantia)
            ? item.ayudantia[0] ?? null
            : item.ayudantia ?? null

      }));

      return res.status(200).json(resultado);

    } catch (err) {

      return res.status(500).json({
        error: err.message
      });

    }

  }
);

// ======================================================
// 9. VISTA: Mi Perfil
// Obtener datos de usuario, estudiante y roles
// ======================================================

app.get('/api/usuarios/:id_usuario/perfil', async (req, res) => {

  const { id_usuario } = req.params;

  try {

    // ======================================================
    // 1. Obtener datos principales del usuario
    // ======================================================

    const { data, error } = await supabase
      .from('usuario')
      .select(`
        id_usuario,
        nombre,
        apellido,
        rut,
        correo,
        fecha_registro,
        ultimo_acceso,
        es_activo,

        estudiante (
          id_estudiante,
          carrera,
          semestre,
          institucion
        ),

        usuario_rol (
          rol (
            id_rol,
            nombre,
            descripcion
          )
        )
      `)
      .eq('id_usuario', id_usuario)
      .eq('es_activo', true)
      .single();

    if (error) throw error;


    // ======================================================
    // 2. Contar publicaciones activas del usuario
    // ======================================================

    const {
      count: totalPublicaciones,
      error: errorPublicaciones
    } = await supabase
      .from('consulta')
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('id_usuario', id_usuario)
      .eq('estado', true);

    if (errorPublicaciones) throw errorPublicaciones;


    // ======================================================
    // 3. Contar respuestas activas del usuario
    // ======================================================

    const {
      count: totalRespuestas,
      error: errorRespuestas
    } = await supabase
      .from('respuesta')
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('id_usuario', id_usuario)
      .eq('estado', true);

    if (errorRespuestas) throw errorRespuestas;


    // ======================================================
    // 4. Obtener consultas del usuario
    // para contar sus solicitudes de tutoría
    // ======================================================

    const {
      data: consultasUsuario,
      error: errorConsultas
    } = await supabase
      .from('consulta')
      .select('id_consulta')
      .eq('id_usuario', id_usuario);

    if (errorConsultas) throw errorConsultas;

    const idsConsultas = consultasUsuario.map(
      (item) => item.id_consulta
    );


    // ======================================================
    // 5. Contar tutorías solicitadas
    // ======================================================

    let totalTutorias = 0;

    if (idsConsultas.length > 0) {

      const {
        count,
        error: errorTutorias
      } = await supabase
        .from('solicitud_ayudantia')
        .select('*', {
          count: 'exact',
          head: true
        })
        .in('id_consulta', idsConsultas);

      if (errorTutorias) throw errorTutorias;

      totalTutorias = count || 0;
    }


    // ======================================================
    // 6. Formatear respuesta del perfil
    // ======================================================

    const perfil = {

      id_usuario: data.id_usuario,

      nombre: data.nombre,

      apellido: data.apellido,

      rut: data.rut,

      correo: data.correo,

      fecha_registro: data.fecha_registro,

      ultimo_acceso: data.ultimo_acceso,

      estudiante: data.estudiante
        ? {
            id_estudiante: data.estudiante.id_estudiante,
            carrera: data.estudiante.carrera,
            semestre: data.estudiante.semestre,
            institucion: data.estudiante.institucion
          }
        : null,

      roles: data.usuario_rol
        ?.map((item) => ({
          id_rol: item.rol?.id_rol,
          nombre: item.rol?.nombre,
          descripcion: item.rol?.descripcion
        }))
        .filter((rol) => rol.id_rol)
        ?? [],

      actividad: {
        publicaciones: totalPublicaciones || 0,
        respuestas: totalRespuestas || 0,
        tutorias_solicitadas: totalTutorias
      }

    };

    return res.status(200).json(perfil);

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});
// ======================================================
// 7. VISTA: Editar Perfil
// Actualizar datos académicos permitidos del estudiante
// ======================================================

app.patch('/api/usuarios/:id_usuario/perfil', async (req, res) => {

  const { id_usuario } = req.params;

  const {
    carrera,
    semestre,
    institucion
  } = req.body;

  if (!carrera || !semestre || !institucion) {
    return res.status(400).json({
      error: 'Carrera, semestre e institución son obligatorios.'
    });
  }

  try {

    const { data, error } = await supabase
      .from('estudiante')
      .update({
        carrera,
        semestre,
        institucion
      })
      .eq('id_usuario', id_usuario)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      mensaje: 'Perfil actualizado correctamente.',
      estudiante: data
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});

// ======================================================
// 8. VISTA: Editar Publicación
// Actualizar título, asignatura y descripción
// ======================================================

app.patch('/api/consultas/:id_consulta', async (req, res) => {

  const { id_consulta } = req.params;

  const {
    titulo,
    id_asignatura,
    descripcion
  } = req.body;

  if (!titulo || !id_asignatura || !descripcion) {
    return res.status(400).json({
      error: 'Título, asignatura y descripción son obligatorios.'
    });
  }

  try {

    const { data, error } = await supabase
      .from('consulta')
      .update({
        titulo,
        id_asignatura,
        descripcion
      })
      .eq('id_consulta', id_consulta)
      .eq('estado', true)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      mensaje: 'Publicación actualizada correctamente.',
      consulta: data
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});

// ======================================================
// 9. ACCIÓN: Desactivar publicación
// Eliminación lógica mediante estado = false
// ======================================================

app.patch('/api/consultas/:id_consulta/desactivar', async (req, res) => {

  const { id_consulta } = req.params;

  try {

    const { data, error } = await supabase
      .from('consulta')
      .update({
        estado: false
      })
      .eq('id_consulta', id_consulta)
      .eq('estado', true)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      mensaje: 'Publicación desactivada correctamente.',
      consulta: data
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});

// ======================================================
// 10. VISTA: Solicitar ser ayudante
// Crear solicitud para obtener rol de ayudante
// ======================================================

app.post('/api/solicitudes-ayudante', async (req, res) => {

  const {
    id_usuario,
    motivo,
    experiencia
  } = req.body;

  if (!id_usuario || !motivo || !experiencia) {
    return res.status(400).json({
      error: 'Usuario, motivo y experiencia son obligatorios.'
    });
  }

  try {

    const { data, error } = await supabase
      .from('solicitud_ayudante')
      .insert({
        id_usuario,
        motivo,
        experiencia
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      mensaje: 'Solicitud de ayudante enviada correctamente.',
      solicitud: data
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});

// ======================================================
// INICIAR SERVIDOR
// ======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Backend EntrePares ejecutándose en el puerto ${PORT}`
  );

});