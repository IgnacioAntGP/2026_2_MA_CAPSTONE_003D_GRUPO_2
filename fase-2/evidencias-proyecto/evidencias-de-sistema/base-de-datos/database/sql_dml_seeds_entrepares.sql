BEGIN;

-- Versión
INSERT INTO version_sistema (version, nombre, descripcion, es_activo)
VALUES ('v0.1.0', 'MVP Inicial', 'Prototipo inicial con foro y escalamiento', TRUE);

-- Roles
INSERT INTO rol (nombre, descripcion) VALUES 
('Estudiante', 'Usuario que publica consultas y solicita tutorías'),
('Ayudante', 'Ayudante que resuelve consultas y atiende sesiones');

-- Usuarios (Matías, Camila, Diego, Fernanda, Ignacio)
INSERT INTO usuario (nombre, apellido, rut, correo, password_hash) VALUES 
('Matías', 'Silva', '20.111.222-3', 'm.silva@duocuc.cl', '$2b$10$dummyhash1'),
('Camila', 'Rojas', '21.333.444-5', 'c.rojas@duocuc.cl', '$2b$10$dummyhash2'),
('Diego', 'Pérez', '19.555.666-7', 'd.perez@duocuc.cl', '$2b$10$dummyhash3'),
('Fernanda', 'Morales', '20.777.888-9', 'f.morales@duocuc.cl', '$2b$10$dummyhash4'),
('Ignacio', 'González', '19.876.543-2', 'i.gonzalez@duocuc.cl', '$2b$10$dummyhash5');

-- Asignación de Roles
INSERT INTO usuario_rol (id_usuario, id_rol) VALUES
(1, 1), -- Matías: Estudiante
(2, 1), -- Camila: Estudiante
(3, 1), -- Diego: Estudiante
(4, 2), -- Fernanda: Ayudante
(5, 1); -- Ignacio: Estudiante

-- Perfiles de Estudiante
INSERT INTO estudiante (id_usuario, carrera, semestre, institucion) VALUES
(1, 'Ingeniería en Informática', 3, 'Duoc UC'),
(2, 'Ingeniería en Informática', 3, 'Duoc UC'),
(3, 'Ingeniería en Informática', 1, 'Duoc UC'),
(5, 'Ingeniería en Informática', 4, 'Duoc UC');

-- Perfil de Ayudante (Fernanda)
INSERT INTO ayudante (id_usuario, descripcion) VALUES
(4, 'Estudiante de 4to año especializada en Programación y Estructuras de Datos');

-- Asignaturas
INSERT INTO asignatura (nombre, codigo, descripcion) VALUES 
('Programación', 'PRG101', 'Fundamentos de programación en Java'),
('Bases de Datos', 'BDD201', 'Modelamiento relacional y SQL'),
('Matemáticas', 'MAT101', 'Álgebra y Cálculo diferencial');

-- Consultas (Las mismas de la pantalla Comunidad)
INSERT INTO consulta (id_usuario, id_asignatura, titulo, descripcion) VALUES 
(1, 1, '¿Cómo puedo recorrer una lista en Java?', 'Estoy trabajando con listas y no entiendo bien cuándo utilizar un for tradicional o un for-each. ¿Hay alguna diferencia importante entre ambos?'),
(2, 2, 'Problema con una consulta SQL', 'Mi consulta funciona, pero me devuelve registros repetidos. ¿Alguien podría orientarme sobre qué estoy haciendo mal?'),
(3, 3, 'Ayuda con una integral', 'No entiendo cómo comenzar este ejercicio. ¿Alguien podría explicarme el procedimiento?');

-- Respuestas a la consulta de Java (id_consulta = 1)
INSERT INTO respuesta (id_consulta, id_usuario, contenido) VALUES 
(1, 2, 'El for-each es bastante útil cuando solo necesitas recorrer los elementos de la lista y no necesitas conocer su posición.'),
(1, 3, 'Si necesitas trabajar con el índice del elemento, entonces puede ser más conveniente utilizar un for tradicional.'),
(1, 4, 'También puedes utilizar otras alternativas dependiendo de lo que quieras hacer con la lista. Lo importante es entender qué necesitas antes de elegir.');

-- Categoría de solicitud de muestra
INSERT INTO categoria_solicitud (nombre, descripcion) VALUES
('Ayudantía General', 'Consultas transversales que cualquier ayudante puede aceptar')
ON CONFLICT (nombre) DO NOTHING;

COMMIT;