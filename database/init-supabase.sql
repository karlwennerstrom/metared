-- Script de inicialización para Supabase (PostgreSQL)
-- Ejecutar este script en el SQL Editor de Supabase antes del deployment

-- Eliminar tablas si existen (cuidado en producción)
-- DROP TABLE IF EXISTS perfiles CASCADE;
-- DROP TABLE IF EXISTS usuarios CASCADE;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  rol VARCHAR(20) CHECK (rol IN ('editor', 'admin', 'superadmin')) DEFAULT 'editor',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de perfiles
CREATE TABLE IF NOT EXISTS perfiles (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  categoria VARCHAR(255) NOT NULL,
  area_conocimiento VARCHAR(255) NOT NULL,
  tipo_cargo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  responsabilidades TEXT,
  requisitos TEXT,
  publicado BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_perfiles_publicado ON perfiles(publicado);
CREATE INDEX IF NOT EXISTS idx_perfiles_codigo ON perfiles(codigo);
CREATE INDEX IF NOT EXISTS idx_perfiles_categoria ON perfiles(categoria);
CREATE INDEX IF NOT EXISTS idx_perfiles_area ON perfiles(area_conocimiento);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a usuarios
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger a perfiles
DROP TRIGGER IF EXISTS update_perfiles_updated_at ON perfiles;
CREATE TRIGGER update_perfiles_updated_at
    BEFORE UPDATE ON perfiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios de las tablas
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema con roles de acceso';
COMMENT ON TABLE perfiles IS 'Tabla de perfiles profesionales IT de la Universidad Católica';

COMMENT ON COLUMN usuarios.rol IS 'Rol del usuario: editor (crear/editar), admin (+ eliminar/ver usuarios), superadmin (+ CRUD usuarios)';
COMMENT ON COLUMN usuarios.activo IS 'Indica si el usuario está activo (soft delete)';
COMMENT ON COLUMN perfiles.publicado IS 'Indica si el perfil está visible públicamente';
COMMENT ON COLUMN perfiles.codigo IS 'Código único identificador del perfil';

-- Insertar usuario superadmin de prueba (CAMBIAR PASSWORD EN PRODUCCIÓN)
-- Password: Admin123! (hash generado con bcrypt, rounds: 10)
-- IMPORTANTE: Generar un nuevo hash en https://bcrypt-generator.com/
INSERT INTO usuarios (email, password, nombre, rol, activo)
VALUES (
  'admin@uc.cl',
  '$2a$10$vQxJV8K8j4Nq0hZ.LKk6B.YqC8qGpQXk7KpEX8Z9nQ0GkZ6qVJ8la',
  'Administrador',
  'superadmin',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Verificación
SELECT 'Tablas creadas correctamente' AS status;
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT COUNT(*) AS total_perfiles FROM perfiles;
