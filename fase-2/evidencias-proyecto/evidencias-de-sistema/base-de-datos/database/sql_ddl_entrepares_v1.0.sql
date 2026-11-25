BEGIN;

-- 1. Control de versiones
CREATE TABLE IF NOT EXISTS public.version_sistema (
    id_version BIGINT GENERATED ALWAYS AS IDENTITY,
    version VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fecha_version TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    es_activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_version_sistema PRIMARY KEY (id_version),
    CONSTRAINT uq_version_sistema_version UNIQUE (version),
    CONSTRAINT uq_version_sistema_nombre UNIQUE (nombre)
);

-- 2. Usuario (vinculado a Supabase Auth via user_uid)
CREATE TABLE IF NOT EXISTS public.usuario (
    id_usuario BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rut VARCHAR(12) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMPTZ,
    es_activo BOOLEAN NOT NULL DEFAULT TRUE,
    user_uid UUID NOT NULL,
    CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuario_rut UNIQUE (rut),
    CONSTRAINT uq_usuario_correo UNIQUE (correo),
    CONSTRAINT uq_usuario_user_uid UNIQUE (user_uid),
    CONSTRAINT fk_usuario_auth_users FOREIGN KEY (user_uid)
        REFERENCES auth.users (id) ON DELETE RESTRICT
);

-- 3. Rol y Asignación
CREATE TABLE IF NOT EXISTS public.rol (
    id_rol BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    CONSTRAINT pk_rol PRIMARY KEY (id_rol)
);

CREATE TABLE IF NOT EXISTS public.usuario_rol (
    id_usuario BIGINT NOT NULL,
    id_rol BIGINT NOT NULL,
    fecha_asignacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuario_rol PRIMARY KEY (id_usuario, id_rol),
    CONSTRAINT fk_usuariorol_usuario FOREIGN KEY (id_usuario)
        REFERENCES public.usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_usuariorol_rol FOREIGN KEY (id_rol)
        REFERENCES public.rol (id_rol) ON DELETE CASCADE
);

-- 4. Estudiante y Ayudante
CREATE TABLE IF NOT EXISTS public.estudiante (
    id_estudiante BIGINT GENERATED ALWAYS AS IDENTITY,
    id_usuario BIGINT NOT NULL,
    carrera VARCHAR(150) NOT NULL,
    semestre INTEGER NOT NULL,
    institucion VARCHAR(150) NOT NULL,
    CONSTRAINT pk_estudiante PRIMARY KEY (id_estudiante),
    CONSTRAINT uq_estudiante_usuario UNIQUE (id_usuario),
    CONSTRAINT fk_estudiante_usuario FOREIGN KEY (id_usuario)
        REFERENCES public.usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT chk_estudiante_semestre_valido CHECK (semestre > 0)
);

CREATE TABLE IF NOT EXISTS public.ayudante (
    id_ayudante BIGINT GENERATED ALWAYS AS IDENTITY,
    id_usuario BIGINT NOT NULL,
    descripcion TEXT,
    puntos_reputacion DOUBLE PRECISION DEFAULT 0.0,
    CONSTRAINT pk_ayudante PRIMARY KEY (id_ayudante),
    CONSTRAINT uq_ayudante_usuario UNIQUE (id_usuario),
    CONSTRAINT fk_ayudante_usuario FOREIGN KEY (id_usuario)
        REFERENCES public.usuario (id_usuario) ON DELETE CASCADE
);

-- 5. Asignatura
CREATE TABLE IF NOT EXISTS public.asignatura (
    id_asignatura BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(150) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_asignatura PRIMARY KEY (id_asignatura),
    CONSTRAINT uq_asignatura_codigo UNIQUE (codigo)
);

-- 4.1. Postulación de Ayudante
CREATE TABLE IF NOT EXISTS public.postulacion_ayudante (
    id_postulacion BIGINT GENERATED ALWAYS AS IDENTITY,
    id_usuario BIGINT NOT NULL,
    id_asignatura BIGINT DEFAULT NULL,
    motivo TEXT NOT NULL,
    fecha_solicitud TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    experiencia TEXT,
    CONSTRAINT pk_postulacion_ayudante PRIMARY KEY (id_postulacion),
    CONSTRAINT fk_postulacion_usuario FOREIGN KEY (id_usuario)
        REFERENCES public.usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_postulacion_asignatura FOREIGN KEY (id_asignatura)
        REFERENCES public.asignatura (id_asignatura) ON DELETE SET NULL
);

-- 6. Categoria Solicitud
CREATE TABLE IF NOT EXISTS public.categoria_solicitud (
    id_categoria BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    es_activo BOOLEAN NOT NULL DEFAULT TRUE,
    es_especialidad BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT pk_categoria_solicitud PRIMARY KEY (id_categoria),
    CONSTRAINT uq_categoria_solicitud_nombre UNIQUE (nombre)
);

-- 7. Consulta
CREATE TABLE IF NOT EXISTS public.consulta (
    id_consulta BIGINT GENERATED ALWAYS AS IDENTITY,
    id_estudiante BIGINT NOT NULL,
    id_asignatura BIGINT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_consulta PRIMARY KEY (id_consulta),
    CONSTRAINT fk_consulta_estudiante FOREIGN KEY (id_estudiante)
        REFERENCES public.estudiante (id_estudiante) ON DELETE CASCADE,
    CONSTRAINT fk_consulta_asignatura FOREIGN KEY (id_asignatura)
        REFERENCES public.asignatura (id_asignatura) ON DELETE RESTRICT
);

-- 8. Respuesta
CREATE TABLE IF NOT EXISTS public.respuesta (
    id_respuesta BIGINT GENERATED ALWAYS AS IDENTITY,
    id_consulta BIGINT NOT NULL,
    id_usuario BIGINT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_respuesta TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_respuesta PRIMARY KEY (id_respuesta),
    CONSTRAINT fk_respuesta_consulta FOREIGN KEY (id_consulta)
        REFERENCES public.consulta (id_consulta) ON DELETE CASCADE,
    CONSTRAINT fk_respuesta_usuario FOREIGN KEY (id_usuario)
        REFERENCES public.usuario (id_usuario) ON DELETE CASCADE
);

-- 9. Solicitud de Ayudantía
CREATE TABLE IF NOT EXISTS public.solicitud_ayudantia (
    id_solicitud BIGINT GENERATED ALWAYS AS IDENTITY,
    id_consulta BIGINT NOT NULL,
    id_ayudante BIGINT,
    id_categoria BIGINT NOT NULL DEFAULT 1,
    modalidad VARCHAR(50) NOT NULL DEFAULT 'PRESENCIAL',
    fecha_solicitud TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    motivo TEXT,
    CONSTRAINT pk_solicitud_ayudantia PRIMARY KEY (id_solicitud),
    CONSTRAINT uq_solicitud_consulta UNIQUE (id_consulta),
    CONSTRAINT fk_solicitud_consulta FOREIGN KEY (id_consulta)
        REFERENCES public.consulta (id_consulta) ON DELETE CASCADE,
    CONSTRAINT fk_solicitud_ayudante FOREIGN KEY (id_ayudante)
        REFERENCES public.ayudante (id_ayudante) ON DELETE SET NULL,
    CONSTRAINT fk_solicitud_categoria FOREIGN KEY (id_categoria)
        REFERENCES public.categoria_solicitud (id_categoria) ON DELETE RESTRICT
);

-- 10. Ayudantía
CREATE TABLE IF NOT EXISTS public.ayudantia (
    id_ayudantia BIGINT GENERATED ALWAYS AS IDENTITY,
    id_solicitud BIGINT NOT NULL,
    fecha_inicio TIMESTAMPTZ,
    fecha_fin TIMESTAMPTZ,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    observaciones TEXT,
    CONSTRAINT pk_ayudantia PRIMARY KEY (id_ayudantia),
    CONSTRAINT uq_ayudantia_solicitud UNIQUE (id_solicitud),
    CONSTRAINT fk_ayudantia_solicitud FOREIGN KEY (id_solicitud)
        REFERENCES public.solicitud_ayudantia (id_solicitud) ON DELETE CASCADE
);

-- 11. Evaluación
CREATE TABLE IF NOT EXISTS public.evaluacion (
    id_evaluacion BIGINT GENERATED ALWAYS AS IDENTITY,
    id_ayudantia BIGINT NOT NULL,
    valoracion INTEGER NOT NULL,
    comentario TEXT,
    fecha_evaluacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_evaluacion PRIMARY KEY (id_evaluacion),
    CONSTRAINT uq_evaluacion_ayudantia UNIQUE (id_ayudantia),
    CONSTRAINT fk_evaluacion_ayudantia FOREIGN KEY (id_ayudantia)
        REFERENCES public.ayudantia (id_ayudantia) ON DELETE CASCADE,
    CONSTRAINT chk_evaluacion_rango CHECK (valoracion BETWEEN 1 AND 5)
);

-- 12. Especialidad Ayudante
CREATE TABLE IF NOT EXISTS public.especialidad_ayudante (
    id_ayudante BIGINT NOT NULL,
    id_asignatura BIGINT NOT NULL,
    nivel_competencia VARCHAR(20) NOT NULL DEFAULT 'HABILITADO',
    fecha_habilitacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_especialidad_ayudante PRIMARY KEY (id_ayudante, id_asignatura),
    CONSTRAINT fk_especialidad_ayudante FOREIGN KEY (id_ayudante)
        REFERENCES public.ayudante (id_ayudante) ON DELETE CASCADE,
    CONSTRAINT fk_especialidad_asignatura FOREIGN KEY (id_asignatura)
        REFERENCES public.asignatura (id_asignatura) ON DELETE CASCADE
);

-- 13. Notificación
CREATE TABLE IF NOT EXISTS public.notificacion (
    id_notificacion BIGINT GENERATED ALWAYS AS IDENTITY,
    id_usuario_destino BIGINT NOT NULL,
    id_usuario_origen BIGINT,
    id_solicitud BIGINT,
    tipo VARCHAR(100) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMPTZ,
    CONSTRAINT pk_notificacion PRIMARY KEY (id_notificacion),
    CONSTRAINT fk_notificacion_usuario_destino FOREIGN KEY (id_usuario_destino)
        REFERENCES public.usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_notificacion_usuario_origen FOREIGN KEY (id_usuario_origen)
        REFERENCES public.usuario (id_usuario) ON DELETE SET NULL,
    CONSTRAINT fk_notificacion_solicitud FOREIGN KEY (id_solicitud)
        REFERENCES public.solicitud_ayudantia (id_solicitud) ON DELETE SET NULL
);

-- 14. Categoría Actividad
CREATE TABLE IF NOT EXISTS public.categoria_actividad (
    id_categoria BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_categoria_actividad PRIMARY KEY (id_categoria)
);

-- 15. Estado Actividad
CREATE TABLE IF NOT EXISTS public.estado_actividad (
    id_estado_actividad BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_estado_actividad PRIMARY KEY (id_estado_actividad)
);

-- 16. Actividad Ayudantía
CREATE TABLE IF NOT EXISTS public.actividad_ayudantia (
    id_actividad BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre_actividad TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    es_activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMPTZ,
    fecha_completado TIMESTAMPTZ,
    id_categoria BIGINT NOT NULL,
    id_ayudantia BIGINT NOT NULL,
    id_estado_actividad BIGINT NOT NULL,
    CONSTRAINT pk_actividad_ayudantia PRIMARY KEY (id_actividad),
    CONSTRAINT fk_actividad_ayudantia FOREIGN KEY (id_ayudantia)
        REFERENCES public.ayudantia (id_ayudantia) ON DELETE RESTRICT,
    CONSTRAINT fk_actividad_estado FOREIGN KEY (id_estado_actividad)
        REFERENCES public.estado_actividad (id_estado_actividad) ON DELETE RESTRICT,
    CONSTRAINT fk_actividad_categoria FOREIGN KEY (id_categoria)
        REFERENCES public.categoria_actividad (id_categoria) ON DELETE RESTRICT
);

-- Índices para rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_solicitud_ayudante ON public.solicitud_ayudantia (id_ayudante);
CREATE INDEX IF NOT EXISTS idx_solicitud_categoria ON public.solicitud_ayudantia (id_categoria);
CREATE INDEX IF NOT EXISTS idx_solicitud_estado_fecha ON public.solicitud_ayudantia (estado, fecha_solicitud DESC);
CREATE INDEX IF NOT EXISTS idx_consulta_asignatura_estado ON public.consulta (id_asignatura, estado);
CREATE INDEX IF NOT EXISTS idx_respuesta_consulta_estado ON public.respuesta (id_consulta, estado);
CREATE INDEX IF NOT EXISTS idx_notificacion_destino_leida ON public.notificacion (id_usuario_destino, leida, fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_actividad_fecha_modif ON public.actividad_ayudantia (fecha_modificacion);
CREATE INDEX IF NOT EXISTS idx_actividad_estado ON public.actividad_ayudantia (id_estado_actividad);

-- Activar Row Level Security (RLS) en todas las tablas del esquema public
ALTER TABLE public.version_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rol ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_rol ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estudiante ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ayudante ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.postulacion_ayudante ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asignatura ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categoria_solicitud ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respuesta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitud_ayudantia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ayudantia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.especialidad_ayudante ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categoria_actividad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estado_actividad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actividad_ayudantia ENABLE ROW LEVEL SECURITY;

COMMIT;