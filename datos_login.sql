
-- Insertar roles
INSERT INTO roles (nombre_rol) VALUES
('admin'),
('docente'),
('estudiante');

-- Insertar usuarios de prueba
INSERT INTO usuarios (nombre_completo, correo, contrasena, id_rol, area_interes, estado, foto_perfil)
VALUES
-- Usuario Admin
('Administrador General', 'admin@utp.edu.pe', '$2b$10$vVD870eILY7hkIH9F1G3De79ITEVg76SyOlRlZYGFYJ4lU82zfhKq', 1, 'Gestión institucional', TRUE, NULL),

-- Usuario Docente
('Carlos Docente', 'docente@utp.edu.pe', '$2b$10$fXiFvucXhJqBXDjk50/zoO23kE6S67oqI8WVFlP45o8Z5BO6LXxvC', 2, 'Matemáticas', TRUE, NULL),

-- Usuario Estudiante
('Lucía Estudiante', 'estudiante@utp.edu.pe', '$2b$10$L8fygleVPM/JZa4hcMkuNOlN80syr8LyDyjTZXntPPqPPoOHlOb3u', 3, 'Programación', TRUE, NULL);

-- Insertar cursos
INSERT INTO cursos (id_curso, nombre_curso, descripcion) VALUES
(1, 'Matemática', 'Curso de razonamiento matemático y operaciones básicas.'),
(2, 'Cálculo', 'Curso de límites, derivadas e integrales.'),
(3, 'Programación', 'Curso introductorio a la lógica y lenguajes de programación.'),
(4, 'Base de Datos', 'Curso sobre diseño y manejo de bases de datos relacionales.'),
(5, 'Redes', 'Curso de fundamentos de redes y comunicaciones.');

-- Insertar categorías
INSERT INTO categorias (id_categoria, nombre_categoria) VALUES
(1, 'Práctica 1'),
(2, 'Práctica 2'),
(3, 'Práctica 3'),
(4, 'Práctica 4'),
(5, 'Examen Parcial'),
(6, 'Examen Final'),
(7, 'Tarea'),
(8, 'Tema Semana 1'),
(9, 'Tema Semana 2'),
(10, 'Tema Semana 3'),
(11, 'Tema Semana 4');
