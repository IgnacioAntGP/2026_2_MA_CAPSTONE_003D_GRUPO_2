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
// 11. VISTA AYUDANTE: Solicitudes disponibles
// Mostrar solicitudes pendientes que aún no tienen ayudante
// ======================================================

app.get('/api/solicitudes-ayudantia/disponibles', async (req, res) => {

  try {

    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .select(`
        id_solicitud,
        id_consulta,
        id_ayudante,
        modalidad,
        fecha_solicitud,
        estado,
        motivo,
        consulta (
          titulo,
          descripcion,
          usuario ( nombre, apellido),
          asignatura ( nombre )
        )
      `)
      .eq('estado', 'PENDIENTE')
      .is('id_ayudante', null)
      .order('fecha_solicitud', { ascending: true });

    if (error) throw error;

    const solicitudes = data.map((item) => ({
      id_solicitud: item.id_solicitud,
      id_consulta: item.id_consulta,
      asignatura: item.consulta?.asignatura?.nombre || null,
      modalidad: item.modalidad,
      titulo_duda: item.consulta?.titulo || null,
      titulo: item.consulta?.titulo || null,
      descripcion_duda: item.consulta?.descripcion || null,
      motivo: item.consulta?.descripcion || null,
      estado: item.estado || 'PENDIENTE', // PENDIENTE
      estudiante: item.consulta?.usuario ? `${item.consulta.usuario.nombre || ''} ${item.consulta.usuario.apellido || ''}`.trim(): null,
      fecha_solicitud: item.fecha_solicitud,
    }));

    return res.status(200).json(solicitudes);

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
});

// ======================================================
// 12. VISTA AYUDANTE: Tomar solicitud de ayudantia
// Asignar ayudanteId y cambiar Estado de solicitud de 'PENDIENTE' a 'EN_PROCESO'
// ======================================================

app.patch('/api/solicitudes-ayudantia/:id_solicitud/tomar', async (req, res) => {

  const { id_solicitud } = req.params;
  const { id_ayudante, id_usuario } = req.body;

  try {
    let ayudanteId = id_ayudante;
    let usuarioId = id_usuario;

    // Si no se proporciona id_ayudante, buscarlo por id_usuario

    if (!ayudanteId && usuarioId) {
      const { data: perfilAyudante, error: errPerfil } = await supabase
        .from('ayudante')
        .select('id_ayudante')
        .eq('id_usuario', usuarioId)
        .maybeSingle();
      
      if (errPerfil || !perfilAyudante) {
        return res.status(404).json({error: 'No se encontró un perfil de ayudante asociado al usuario proporcionado.'});
      }
      ayudanteId = perfilAyudante.id_ayudante;
    }
       
    if (!ayudanteId) {
      return res.status(400).json({
        error: 'El ID del Ayudante o el ID del Usuario es obligatorio.'
      });
    }

    let solicitudId = id_solicitud;

    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .update({
        id_ayudante: ayudanteId,
        estado: 'EN_PROCESO'
      })
      .eq('id_solicitud', solicitudId)
      .eq('estado', 'PENDIENTE')
      .is('id_ayudante', null)
      .select()
      .maybeSingle();

    if (error) throw error;

    // Si no se actualizó ninguna fila,
    // otro ayudante pudo haberla tomado antes.
    if (!data) {
      return res.status(409).json({
        error: 'La solicitud ya fue tomada o ya no se encuentra disponible.'
      });
    }

    return res.status(200).json({
      mensaje: 'Solicitud tomada correctamente.',
      solicitud: data
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});

// ======================================================
// 13. VISTA ESTUDIANTE: Aceptar ayudante
// Confirmar ayudante y crear la ayudantía
// ======================================================

app.patch('/api/solicitudes-ayudantia/:id_solicitud/aceptar', async (req, res) => {

  const { id_solicitud } = req.params;

  try {

    // 1. Verificar que la solicitud esté EN_PROCESO
    // y que tenga un ayudante asignado
    const { data: solicitud, error: errorSolicitud } = await supabase
      .from('solicitud_ayudantia')
      .select('*')
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'EN_PROCESO')
      .not('id_ayudante', 'is', null)
      .maybeSingle();

    if (errorSolicitud) throw errorSolicitud;

    if (!solicitud) {
      return res.status(409).json({
        error: 'La solicitud no está disponible para ser aceptada.'
      });
    }


    // 2. Cambiar solicitud a ACEPTADA
    const { data: solicitudActualizada, error: errorActualizar } = await supabase
      .from('solicitud_ayudantia')
      .update({
        estado: 'ACEPTADA'
      })
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'EN_PROCESO')
      .select()
      .single();

    if (errorActualizar) throw errorActualizar;


    // 3. Crear la ayudantía
    const { data: ayudantia, error: errorAyudantia } = await supabase
      .from('ayudantia')
      .insert({
        id_solicitud: Number(id_solicitud),
        fecha_inicio: new Date().toISOString(),
        estado: 'ACEPTADA',
        observaciones: null
      })
      .select()
      .single();


    // Si falla la creación de la ayudantía,
    // devolvemos la solicitud a EN_PROCESO.
    if (errorAyudantia) {

      await supabase
        .from('solicitud_ayudantia')
        .update({
          estado: 'EN_PROCESO'
        })
        .eq('id_solicitud', id_solicitud);

      throw errorAyudantia;
    }


    return res.status(200).json({
      mensaje: 'Ayudante aceptado y ayudantía iniciada correctamente.',
      solicitud: solicitudActualizada,
      ayudantia
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});

// ======================================================
// 14. VISTA ESTUDIANTE: Rechazar ayudante
// Liberar solicitud para que vuelva a estar disponible
// ======================================================

app.patch('/api/solicitudes-ayudantia/:id_solicitud/rechazar-ayudante', async (req, res) => {

  const { id_solicitud } = req.params;

  try {

    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .update({
        id_ayudante: null,
        estado: 'PENDIENTE'
      })
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'EN_PROCESO')
      .not('id_ayudante', 'is', null)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(409).json({
        error: 'La solicitud no se encuentra esperando confirmación de un ayudante.'
      });
    }

    return res.status(200).json({
      mensaje: 'Ayudante rechazado. La solicitud volvió a estar disponible.',
      solicitud: data
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});

// ======================================================
// 15. VISTA AYUDANTE: Finalizar ayudantía
// Cerrar la atención y marcar la solicitud como RESUELTA
// ======================================================

app.patch('/api/solicitudes-ayudantia/:id_solicitud/resolver', async (req, res) => {

  const { id_solicitud } = req.params;

  try {

    // 1. Verificar que la solicitud esté ACEPTADA
    const { data: solicitud, error: errorSolicitud } = await supabase
      .from('solicitud_ayudantia')
      .select('*')
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'ACEPTADA')
      .maybeSingle();

    if (errorSolicitud) throw errorSolicitud;

    if (!solicitud) {
      return res.status(409).json({
        error: 'La solicitud no se encuentra en estado ACEPTADA.'
      });
    }


    // 2. Buscar la ayudantía asociada
    const { data: ayudantiaActual, error: errorBuscarAyudantia } = await supabase
      .from('ayudantia')
      .select('*')
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'ACTIVA')
      .maybeSingle();

    if (errorBuscarAyudantia) throw errorBuscarAyudantia;

    if (!ayudantiaActual) {
      return res.status(409).json({
        error: 'No existe una ayudantía activa asociada a esta solicitud.'
      });
    }


    // 3. Finalizar ayudantía
    const { data: ayudantiaFinalizada, error: errorAyudantia } = await supabase
      .from('ayudantia')
      .update({
        estado: 'FINALIZADA',
        fecha_fin: new Date().toISOString()
      })
      .eq('id_ayudantia', ayudantiaActual.id_ayudantia)
      .eq('estado', 'ACTIVA')
      .select()
      .single();

    if (errorAyudantia) throw errorAyudantia;


    // 4. Marcar solicitud como RESUELTA
    const { data: solicitudResuelta, error: errorResolver } = await supabase
      .from('solicitud_ayudantia')
      .update({
        estado: 'RESUELTA'
      })
      .eq('id_solicitud', id_solicitud)
      .eq('estado', 'ACEPTADA')
      .select()
      .single();

    // Si falla este segundo cambio, restauramos la ayudantía
    if (errorResolver) {

      await supabase
        .from('ayudantia')
        .update({
          estado: 'ACTIVA',
          fecha_fin: null
        })
        .eq('id_ayudantia', ayudantiaActual.id_ayudantia);

      throw errorResolver;
    }


    return res.status(200).json({
      mensaje: 'Ayudantía finalizada correctamente.',
      solicitud: solicitudResuelta,
      ayudantia: ayudantiaFinalizada
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});

// ======================================================
// 16. VISTA AYUDANTE: Listar "Mis Ayudantías"
// ======================================================
app.get('/api/solicitudes-ayudantia/ayudante/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const { data: perfil } = await supabase
      .from('ayudante')
      .select('id_ayudante')
      .eq('id_usuario', id_usuario)
      .maybeSingle();

    if (!perfil) return res.status(200).json([]);

    const { data, error } = await supabase
      .from('solicitud_ayudantia')
      .select(`
        id_solicitud,
        modalidad,
        fecha_solicitud,
        estado,
        motivo,
        consulta (
          titulo,
          descripcion,
          asignatura ( nombre ),
          usuario ( nombre, apellido )
        )
      `)
      .eq('id_ayudante', perfil.id_ayudante)
      .in('estado', ['EN_PROCESO', 'ACEPTADA'])
      .order('fecha_solicitud', { ascending: false });

    if (error) throw error;

    const formateadas = data.map((item) => ({
      id_solicitud: item.id_solicitud,
      asignatura: item.consulta?.asignatura?.nombre || 'General',
      titulo_duda: item.consulta?.titulo || '',
      descripcion_duda: item.motivo || item.consulta?.descripcion || '',
      estado: item.estado,
      estudiante: item.consulta?.usuario
        ? `${item.consulta.usuario.nombre || ''} ${item.consulta.usuario.apellido || ''}`.trim()
        : 'Estudiante'
    }));

    return res.status(200).json(formateadas);
  } catch (err) {
    return res.status(500).json({ error: err.message });
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