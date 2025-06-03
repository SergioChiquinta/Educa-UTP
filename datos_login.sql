
-- Insertar roles
INSERT INTO roles (nombre_rol) VALUES
('admin'),
('docente'),
('estudiante');

-- Insertar usuarios de prueba
INSERT INTO usuarios (nombre_completo, correo, contrasena, id_rol, area_interes, estado, foto_perfil)
VALUES
-- Usuario Admin
('Administrador General', 'admin@utp.edu.pe', '$2b$10$vVD870eILY7hkIH9F1G3De79ITEVg76SyOlRlZYGFYJ4lU82zfhKq', 1, 'Gestión institucional', TRUE, 'admin.png'),

-- Usuario Docente
('Carlos Docente', 'docente@utp.edu.pe', '$2b$10$fXiFvucXhJqBXDjk50/zoO23kE6S67oqI8WVFlP45o8Z5BO6LXxvC', 2, 'Matemáticas', TRUE, 'docente.png'),

-- Usuario Estudiante
('Lucía Estudiante', 'estudiante@utp.edu.pe', '$2b$10$L8fygleVPM/JZa4hcMkuNOlN80syr8LyDyjTZXntPPqPPoOHlOb3u', 3, 'Programación', TRUE, 'estudiante.png');
