-- Esquema principal
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  edad INTEGER NOT NULL CHECK (edad >= 0),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('PROFESOR', 'ALUMNO'))
);

CREATE TABLE IF NOT EXISTS aulas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  grado VARCHAR(30) NOT NULL,
  profesor_encargado INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS chats (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL CHECK (tipo = 'AULA'),
  aula_id INTEGER NOT NULL REFERENCES aulas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pictogramas (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  titulo VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario_aula (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  aula_id INTEGER NOT NULL REFERENCES aulas(id) ON DELETE CASCADE,
  UNIQUE (usuario_id, aula_id)
);

CREATE TABLE IF NOT EXISTS mensajes (
  id SERIAL PRIMARY KEY,
  fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  emisor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  pictograma_id INTEGER NOT NULL REFERENCES pictogramas(id)
);

-- Seed idempotente
INSERT INTO usuarios (id, nombre, edad, tipo) VALUES
  (1, 'Profe Ana', 34, 'PROFESOR'),
  (2, 'Luis', 8, 'ALUMNO'),
  (3, 'Mia', 9, 'ALUMNO')
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

-- Ajustar secuencias para que no choquen con ids fijos
SELECT setval(pg_get_serial_sequence('usuarios', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM usuarios), 0), 1));
SELECT setval(pg_get_serial_sequence('aulas', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM aulas), 0), 1));
SELECT setval(pg_get_serial_sequence('chats', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM chats), 0), 1));
SELECT setval(pg_get_serial_sequence('pictogramas', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM pictogramas), 0), 1));
SELECT setval(pg_get_serial_sequence('usuario_aula', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM usuario_aula), 0), 1));
SELECT setval(pg_get_serial_sequence('mensajes', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM mensajes), 0), 1));
