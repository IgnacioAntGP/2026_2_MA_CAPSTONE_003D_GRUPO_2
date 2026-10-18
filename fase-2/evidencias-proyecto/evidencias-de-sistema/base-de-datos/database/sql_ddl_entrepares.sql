BEGIN;

-- 1. CONTROL DE VERSIONES
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

-- 2. USUARIOS
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

-- 3. ROLES Y ASIGNACIÓN
CREATE TABLE IF NOT EXISTS rol (
    id_rol BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    CONSTRAINT pk_rol PRIMARY KEY (id_rol),
    CONSTRAINT uq_rol_nombre UNIQUE (nombre)
);

CREATE TABLE IF NOT EXISTS usuario_rol (
    id_usuario BIGINT NOT NULL,
    id_rol BIGINT NOT NULL,
    fecha_asignacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuario_rol PRIMARY KEY (id_usuario, id_rol),
    CONSTRAINT fk_usuariorol_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_usuariorol_rol FOREIGN KEY (id_rol) 
        REFERENCES rol (id_rol) ON DELETE CASCADE
);

-- 4. SUBTIPOS: ESTUDIANTE Y AYUDANTE
CREATE TABLE IF NOT EXISTS estudiante (
    id_estudiante BIGINT GENERATED ALWAYS AS IDENTITY,
    id_usuario BIGINT NOT NULL,
    carrera VARCHAR(150) NOT NULL,
    semestre INTEGER NOT NULL,
    institucion VARCHAR(150) NOT NULL,
    CONSTRAINT pk_estudiante PRIMARY KEY (id_estudiante),
    CONSTRAINT uq_estudiante_usuario UNIQUE (id_usuario),
    CONSTRAINT fk_estudiante_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT chk_estudiante_semestre_valido CHECK (semestre > 0)
);

CREATE TABLE IF NOT EXISTS ayudante (
    id_ayudante BIGINT GENERATED ALWAYS AS IDENTITY,
    id_usuario BIGINT NOT NULL,
    descripcion TEXT,
    CONSTRAINT pk_ayudante PRIMARY KEY (id_ayudante),
    CONSTRAINT uq_ayudante_usuario UNIQUE (id_usuario),
    CONSTRAINT fk_ayudante_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE CASCADE
);

-- 5. ASIGNATURA
CREATE TABLE IF NOT EXISTS asignatura (
    id_asignatura BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(150) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_asignatura PRIMARY KEY (id_asignatura),
    CONSTRAINT uq_asignatura_codigo UNIQUE (codigo)
);

-- 6. CONSULTAS (Nivel 1: Foro de la Comunidad)
CREATE TABLE IF NOT EXISTS consulta (
    id_consulta BIGINT GENERATED ALWAYS AS IDENTITY,
    id_usuario BIGINT NOT NULL,
    id_asignatura BIGINT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_consulta PRIMARY KEY (id_consulta),
    CONSTRAINT fk_consulta_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_consulta_asignatura FOREIGN KEY (id_asignatura) 
        REFERENCES asignatura (id_asignatura) ON DELETE RESTRICT
);

-- 7. RESPUESTAS AL FORO
CREATE TABLE IF NOT EXISTS respuesta (
    id_respuesta BIGINT GENERATED ALWAYS AS IDENTITY,
    id_consulta BIGINT NOT NULL,
    id_usuario BIGINT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_respuesta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_respuesta PRIMARY KEY (id_respuesta),
    CONSTRAINT fk_respuesta_consulta FOREIGN KEY (id_consulta) 
        REFERENCES consulta (id_consulta) ON DELETE CASCADE,
    CONSTRAINT fk_respuesta_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE CASCADE
);

-- 8. SOLICITUD DE AYUDANTÍA (Escalamiento a Tutoría)
CREATE TABLE IF NOT EXISTS solicitud_ayudantia (
    id_solicitud BIGINT GENERATED ALWAYS AS IDENTITY,
    id_consulta BIGINT NOT NULL,
    id_ayudante BIGINT, -- NULL al crearse; se llena cuando un ayudante la toma
    id_categoria BIGINT NOT NULL,
    modalidad VARCHAR(50) NOT NULL DEFAULT 'PRESENCIAL', -- Presencial, Online, etc.
    fecha_solicitud TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE', -- PENDIENTE, ACEPTADA, RECHAZADA, CANCELADA
    motivo TEXT,
    CONSTRAINT pk_solicitud_ayudantia PRIMARY KEY (id_solicitud),
    CONSTRAINT fk_solicitud_consulta FOREIGN KEY (id_consulta) 
        REFERENCES consulta (id_consulta) ON DELETE CASCADE,
    CONSTRAINT fk_solicitud_ayudante FOREIGN KEY (id_ayudante) 
        REFERENCES ayudante (id_ayudante) ON DELETE SET NULL
    CONSTRAINT fk_solicitud_categoria FOREIGN KEY (id_categoria)
        REFERENCES categoria_solicitud (id_categoria) ON DELETE RESTRICT
);

-- 9. AYUDANTÍA CONCRETADA
CREATE TABLE IF NOT EXISTS ayudantia (
    id_ayudantia BIGINT GENERATED ALWAYS AS IDENTITY,
    id_solicitud BIGINT NOT NULL,
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    estado VARCHAR(30) NOT NULL DEFAULT 'EN_PROCESO', -- EN_PROCESO, FINALIZADA, CANCELADA
    observaciones TEXT,
    CONSTRAINT pk_ayudantia PRIMARY KEY (id_ayudantia),
    CONSTRAINT uq_ayudantia_solicitud UNIQUE (id_solicitud),
    CONSTRAINT fk_ayudantia_solicitud FOREIGN KEY (id_solicitud) 
        REFERENCES solicitud_ayudantia (id_solicitud) ON DELETE CASCADE
);

-- 10. EVALUACIÓN DE LA AYUDANTÍA
CREATE TABLE IF NOT EXISTS evaluacion (
    id_evaluacion BIGINT GENERATED ALWAYS AS IDENTITY,
    id_ayudantia BIGINT NOT NULL,
    valoracion INTEGER NOT NULL,
    comentario TEXT,
    fecha_evaluacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_evaluacion PRIMARY KEY (id_evaluacion),
    CONSTRAINT uq_evaluacion_ayudantia UNIQUE (id_ayudantia),
    CONSTRAINT fk_evaluacion_ayudantia FOREIGN KEY (id_ayudantia) 
        REFERENCES ayudantia (id_ayudantia) ON DELETE CASCADE,
    CONSTRAINT chk_evaluacion_rango CHECK (valoracion BETWEEN 1 AND 5)
);

-- 11. CATEGORÍAS DE CONSULTA
CREATE TABLE IF NOT EXISTS categoria_solicitud (
    id_categoria BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    es_activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_categoria_solicitud PRIMARY KEY (id_categoria),
    CONSTRAINT uq_categoria_solicitud_nombre UNIQUE (nombre)
);

-- ÍNDICES DE RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_consulta_usuario ON consulta (id_usuario);
CREATE INDEX IF NOT EXISTS idx_consulta_asignatura ON consulta (id_asignatura);
CREATE INDEX IF NOT EXISTS idx_respuesta_consulta ON respuesta (id_consulta);
CREATE INDEX IF NOT EXISTS idx_solicitud_consulta ON solicitud_ayudantia (id_consulta);
CREATE INDEX IF NOT EXISTS idx_solicitud_ayudante ON solicitud_ayudantia (id_ayudante);
CREATE INDEX IF NOT EXISTS idx_solicitud_categoria ON solicitud_ayudantia (id_categoria);

COMMIT;