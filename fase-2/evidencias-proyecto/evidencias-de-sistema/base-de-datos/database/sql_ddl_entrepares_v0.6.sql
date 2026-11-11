BEGIN;

-- 1. Control de versiones
CREATE TABLE IF NOT EXISTS version_sistema (
    id_version BIGINT GENERATED ALWAYS AS IDENTITY,
    version VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fecha_version TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    es_activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_version_sistema PRIMARY KEY (id_version),
    CONSTRAINT uq_version_sistema_version UNIQUE (version),
    CONSTRAINT uq_version_sistema_nombre UNIQUE (nombre)
);

-- 2. Usuario
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rut VARCHAR(12) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    es_activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuario_rut UNIQUE (rut),
    CONSTRAINT uq_usuario_correo UNIQUE (correo)
);

-- 3. Rol y Asignación
CREATE TABLE IF NOT EXISTS rol (
    id_rol BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    CONSTRAINT pk_rol PRIMARY KEY (id_rol)
);

CREATE TABLE IF NOT EXISTS usuario_rol (
    id_usuario BIGINT NOT NULL,
    id_rol BIGINT NOT NULL,
    fecha_asignacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuario_rol PRIMARY KEY (id_usuario, id_rol),
    CONSTRAINT fk_usuariorol_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_usuariorol_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE
);

-- 4. Estudiante y Ayudante
CREATE TABLE IF NOT EXISTS estudiante (
    id_estudiante BIGINT GENERATED ALWAYS AS IDENTITY,
    id_usuario BIGINT NOT NULL,
    carrera VARCHAR(150) NOT NULL,
    semestre INTEGER NOT NULL,
    institucion VARCHAR(150) NOT NULL,
    CONSTRAINT pk_estudiante PRIMARY KEY (id_estudiante),
    CONSTRAINT uq_estudiante_usuario UNIQUE (id_usuario),
    CONSTRAINT fk_estudiante_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT chk_estudiante_semestre_valido CHECK (semestre > 0)
);

CREATE TABLE IF NOT EXISTS ayudante (
    id_ayudante BIGINT GENERATED ALWAYS AS IDENTITY,
    id_usuario BIGINT NOT NULL,
    descripcion TEXT,
    CONSTRAINT pk_ayudante PRIMARY KEY (id_ayudante),
    CONSTRAINT uq_ayudante_usuario UNIQUE (id_usuario),
    CONSTRAINT fk_ayudante_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- 5. Asignatura
CREATE TABLE IF NOT EXISTS asignatura (
    id_asignatura BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(150) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_asignatura PRIMARY KEY (id_asignatura),
    CONSTRAINT uq_asignatura_codigo UNIQUE (codigo)
);

-- 6. Categoria de Solicitud
CREATE TABLE IF NOT EXISTS categoria_solicitud (
    id_categoria BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    es_activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_categoria_solicitud PRIMARY KEY (id_categoria),
    CONSTRAINT uq_categoria_solicitud_nombre UNIQUE (nombre)
);

-- 7. Consulta
CREATE TABLE IF NOT EXISTS consulta (
    id_consulta BIGINT GENERATED ALWAYS AS IDENTITY,
    id_usuario BIGINT NOT NULL,
    id_asignatura BIGINT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_consulta PRIMARY KEY (id_consulta),
    CONSTRAINT fk_consulta_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_consulta_asignatura FOREIGN KEY (id_asignatura) REFERENCES asignatura(id_asignatura) ON DELETE RESTRICT
);

-- 8. Respuesta
CREATE TABLE IF NOT EXISTS respuesta (
    id_respuesta BIGINT GENERATED ALWAYS AS IDENTITY,
    id_consulta BIGINT NOT NULL,
    id_usuario BIGINT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_respuesta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_respuesta PRIMARY KEY (id_respuesta),
    CONSTRAINT fk_respuesta_consulta FOREIGN KEY (id_consulta) REFERENCES consulta(id_consulta) ON DELETE CASCADE,
    CONSTRAINT fk_respuesta_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- 9. Solicitud de Ayudantía
CREATE TABLE IF NOT EXISTS solicitud_ayudantia (
    id_solicitud BIGINT GENERATED ALWAYS AS IDENTITY,
    id_consulta BIGINT NOT NULL,
    id_ayudante BIGINT,
    id_categoria BIGINT NOT NULL DEFAULT 1,
    modalidad VARCHAR(50) NOT NULL DEFAULT 'PRESENCIAL',
    fecha_solicitud TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    motivo TEXT,
    CONSTRAINT pk_solicitud_ayudantia PRIMARY KEY (id_solicitud),
    CONSTRAINT fk_solicitud_consulta FOREIGN KEY (id_consulta) REFERENCES consulta(id_consulta) ON DELETE CASCADE,
    CONSTRAINT fk_solicitud_ayudante FOREIGN KEY (id_ayudante) REFERENCES ayudante(id_ayudante) ON DELETE SET NULL,
    CONSTRAINT fk_solicitud_categoria FOREIGN KEY (id_categoria) REFERENCES categoria_solicitud(id_categoria) ON DELETE RESTRICT
);

-- 10. Ayudantía
CREATE TABLE IF NOT EXISTS ayudantia (
    id_ayudantia BIGINT GENERATED ALWAYS AS IDENTITY,
    id_solicitud BIGINT NOT NULL,
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    observaciones TEXT,
    CONSTRAINT pk_ayudantia PRIMARY KEY (id_ayudantia),
    CONSTRAINT uq_ayudantia_solicitud UNIQUE (id_solicitud),
    CONSTRAINT fk_ayudantia_solicitud FOREIGN KEY (id_solicitud) REFERENCES solicitud_ayudantia(id_solicitud) ON DELETE CASCADE
);

-- 11. Evaluación
CREATE TABLE IF NOT EXISTS evaluacion (
    id_evaluacion BIGINT GENERATED ALWAYS AS IDENTITY,
    id_ayudantia BIGINT NOT NULL,
    valoracion INTEGER NOT NULL,
    comentario TEXT,
    fecha_evaluacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_evaluacion PRIMARY KEY (id_evaluacion),
    CONSTRAINT uq_evaluacion_ayudantia UNIQUE (id_ayudantia),
    CONSTRAINT fk_evaluacion_ayudantia FOREIGN KEY (id_ayudantia) REFERENCES ayudantia(id_ayudantia) ON DELETE CASCADE,
    CONSTRAINT chk_evaluacion_rango CHECK (valoracion BETWEEN 1 AND 5)
);

-- 12. especialidad_ayudante
CREATE TABLE IF NOT EXISTS especialidad_ayudante (
    id_ayudante BIGINT NOT NULL,
    id_asignatura BIGINT NOT NULL,
    nivel_competencia VARCHAR(20) NOT NULL DEFAULT 'HABILITADO',
    fecha_habilitacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_especialidad_ayudante PRIMARY KEY (id_ayudante, id_asignatura),
    CONSTRAINT fk_especialidad_ayudante FOREIGN KEY (id_ayudante) 
        REFERENCES ayudante (id_ayudante) ON DELETE CASCADE,
    CONSTRAINT fk_especialidad_asignatura FOREIGN KEY (id_asignatura) 
        REFERENCES asignatura (id_asignatura) ON DELETE CASCADE
);

-- Indexación para rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_solicitud_ayudante ON solicitud_ayudantia (id_ayudante);
CREATE INDEX IF NOT EXISTS idx_solicitud_categoria ON solicitud_ayudantia (id_categoria);
CREATE INDEX IF NOT EXISTS idx_solicitud_estado_fecha ON solicitud_ayudantia (estado, fecha_solicitud DESC);

CREATE INDEX IF NOT EXISTS idx_consulta_asignatura_estado ON consulta (id_asignatura, estado);
CREATE INDEX IF NOT EXISTS idx_respuesta_consulta_estado ON respuesta (id_consulta, estado);

CREATE INDEX IF NOT EXISTS idx_especialidad_asignatura ON especialidad_ayudante (id_asignatura);

-- Activar Row Level Security (RLS) en todas las tablas
ALTER TABLE version_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE rol ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario_rol ENABLE ROW LEVEL SECURITY;
ALTER TABLE estudiante ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudante ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignatura ENABLE ROW LEVEL SECURITY;
ALTER TABLE categoria_solicitud ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulta ENABLE ROW LEVEL SECURITY;
ALTER TABLE respuesta ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitud_ayudantia ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudantia ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE especialidad_ayudante ENABLE ROW LEVEL SECURITY;

COMMIT;