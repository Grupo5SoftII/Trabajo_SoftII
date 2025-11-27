-- 1. Crear la tabla de USUARIOS
CREATE TABLE Usuario (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    edad INT,
    tipo VARCHAR(50) NOT NULL,
    contraseña VARCHAR(255) NOT NULL
);

-- 2. Crear la tabla de PICTOGRAMAS
CREATE TABLE Pictograma (
    pictograma_id SERIAL PRIMARY KEY,
    nombrePictograma VARCHAR(100) NOT NULL
);

-- 3. Crear la tabla AULA
CREATE TABLE Aula (
    aula_id SERIAL PRIMARY KEY,
    codigoAula INTEGER UNIQUE NOT NULL,
    materia VARCHAR(100),
    grado VARCHAR(50),
    usuario_id INT NOT NULL,

    CONSTRAINT fk_aula_usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id)
);

-- 4. Crear la tabla intermedia USUARIO_AULA
CREATE TABLE Usuario_aula (
    usuario_aula_id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    aula_id INT NOT NULL,

    CONSTRAINT fk_ua_usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id),
    CONSTRAINT fk_ua_aula FOREIGN KEY (aula_id) REFERENCES Aula(aula_id)
);

-- 5. Crear la tabla CHAT
CREATE TABLE Chat (
    chat_id SERIAL PRIMARY KEY,
    aula_id INT NOT NULL,
    CONSTRAINT fk_chat_aula FOREIGN KEY (aula_id) REFERENCES Aula(aula_id)
);

-- 6. Crear la tabla MENSAJE
CREATE TABLE Mensaje (
    mensaje_id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL,
    chat_id INT NOT NULL,
    pictograma_id INT NOT NULL,
    
    CONSTRAINT fk_msj_usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id),
    CONSTRAINT fk_msj_chat FOREIGN KEY (chat_id) REFERENCES Chat(chat_id),
    CONSTRAINT fk_msj_picto FOREIGN KEY (pictograma_id) REFERENCES Pictograma(pictograma_id)
);
-- ==========================================================================================================

-- 1. Insertar USUARIOS
INSERT INTO Usuario (nombre, apellido, edad, tipo, contraseña) VALUES 
('Álvaro', 'Alayo', 28, 'profesor', 'alayoalvaro'),
('Micaela', 'Odria', 28, 'profesor', 'odriamerino'),
('Manuel', 'Revilla', 8, 'alumno', 'revillamanuel'),
('Kennett', 'Coca', 7, 'alumno', 'cocakennett');

-- 2. Insertar PICTOGRAMAS
INSERT INTO Pictograma (nombrePictograma) VALUES 
('Hola'),
('Adios'),
('Si'),
('No'),
('Baño'),
('Jugar'),
('Comer'),
('Feliz');

-- 3. Insertar AULAS
INSERT INTO Aula (codigoAula, materia, grado, usuario_id) VALUES 
(101, 'Matemáticas', '2do Grado', 1),
(102, 'Arte', '2do Grado', 2); 

-- 4. Inscribir ALUMNOS en Aulas (Tabla Usuario_aula)
INSERT INTO Usuario_aula (usuario_id, aula_id) VALUES 
(3, 1),
(4, 1);

INSERT INTO Usuario_aula (usuario_id, aula_id) VALUES 
(4, 2);

-- 5. Crear los CHATS para las aulas
INSERT INTO Chat (aula_id) VALUES 
(1),
(2);

-- 6. Insertar MENSAJES de prueba
INSERT INTO Mensaje (usuario_id, chat_id, pictograma_id) VALUES 
(3, 1, 1),
(1, 1, 1),
(4, 1, 8),
(3, 1, 5);
