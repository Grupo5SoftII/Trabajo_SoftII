-- Limpieza inicial
DROP TABLE IF EXISTS mensajes CASCADE;
DROP TABLE IF EXISTS usuario_aula CASCADE;
DROP TABLE IF EXISTS pictogramas CASCADE;
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS aulas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- 1. Tabla Usuarios con CONTRASEÑA
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  apellidos VARCHAR(120) NOT NULL,
  edad INTEGER NOT NULL CHECK (edad >= 0),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('PROFESOR', 'ALUMNO')),
  usuario VARCHAR(50) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL 
);

-- 2. Resto de tablas (Igual que antes)
CREATE TABLE aulas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  grado VARCHAR(30) NOT NULL,
  profesor_encargado INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT
);

CREATE TABLE chats (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL CHECK (tipo = 'AULA'),
  aula_id INTEGER NOT NULL REFERENCES aulas(id) ON DELETE CASCADE
);

CREATE TABLE pictogramas (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  titulo VARCHAR(120) NOT NULL
);

CREATE TABLE usuario_aula (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  aula_id INTEGER NOT NULL REFERENCES aulas(id) ON DELETE CASCADE,
  UNIQUE (usuario_id, aula_id)
);

CREATE TABLE mensajes (
  id SERIAL PRIMARY KEY,
  fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  emisor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  pictograma_id INTEGER NOT NULL REFERENCES pictogramas(id)
);

-- 3. Seed ACTUALIZADO (Ahora incluimos contraseñas)
INSERT INTO usuarios (id, nombre, apellidos, edad, tipo, usuario, contrasena) VALUES
  (1, 'Ana', 'García', 34, 'PROFESOR', 'profe.ana', '123456'),
  (2, 'Luis', 'Pérez', 8, 'ALUMNO', 'luisito2025', '123456'),
  (3, 'Mia', 'López', 9, 'ALUMNO', 'mia.lopez', '123456')
ON CONFLICT (id) DO NOTHING;

INSERT INTO aulas (id, nombre, grado, profesor_encargado) VALUES
  (10, '1ro Primaria A', '1ro', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO chats (id, tipo, aula_id) VALUES
  (100, 'AULA', 10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO pictogramas (id, url, titulo) VALUES
  (1000, 'https://picsum.photos/seed/saludo/64', 'HOLA'),
  (1001, 'https://picsum.photos/seed/bano/64', 'BANO'),
  (1002, 'https://picsum.photos/seed/agua/64', 'AGUA')
ON CONFLICT (id) DO NOTHING;

INSERT INTO usuario_aula (id, usuario_id, aula_id) VALUES
  (1, 2, 10),
  (2, 3, 10)
ON CONFLICT (id) DO NOTHING;

-- 4. Ajustar secuencias
SELECT setval(pg_get_serial_sequence('usuarios', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM usuarios), 0), 1));
SELECT setval(pg_get_serial_sequence('aulas', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM aulas), 0), 1));
SELECT setval(pg_get_serial_sequence('chats', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM chats), 0), 1));
SELECT setval(pg_get_serial_sequence('pictogramas', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM pictogramas), 0), 1));
SELECT setval(pg_get_serial_sequence('usuario_aula', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM usuario_aula), 0), 1));
SELECT setval(pg_get_serial_sequence('mensajes', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM mensajes), 0), 1));