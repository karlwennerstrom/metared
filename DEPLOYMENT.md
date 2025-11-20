# Guía de Deployment a Vercel con Supabase

## Pre-requisitos

1. Cuenta en [Vercel](https://vercel.com)
2. Base de datos PostgreSQL en [Supabase](https://supabase.com) ya configurada
3. Proyecto sincronizado con GitHub

## Paso 1: Instalar dependencias actualizadas

```bash
# Backend (PostgreSQL)
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Paso 2: Crear las tablas en Supabase

Antes de deployar, necesitas crear las tablas en tu base de datos Supabase. Ejecuta el siguiente SQL en el SQL Editor de Supabase:

```sql
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
CREATE INDEX idx_perfiles_publicado ON perfiles(publicado);
CREATE INDEX idx_perfiles_codigo ON perfiles(codigo);
CREATE INDEX idx_usuarios_email ON usuarios(email);
```

## Paso 3: Crear usuario administrador

Después de crear las tablas, necesitas crear un usuario superadmin. Puedes hacerlo de dos formas:

### Opción A: Localmente (conectándote a Supabase)

```bash
cd backend
# Asegúrate de que el .env tiene las credenciales de Supabase
npm run create-admin
```

### Opción B: Directamente en Supabase SQL Editor

```sql
-- Reemplaza con tu email y contraseña
-- La contraseña debe estar hasheada con bcrypt
-- Puedes usar https://bcrypt-generator.com/ para generar el hash
INSERT INTO usuarios (email, password, nombre, rol, activo)
VALUES (
  'tu-email@uc.cl',
  '$2a$10$tu_hash_bcrypt_aqui',
  'Administrador',
  'superadmin',
  true
);
```

## Paso 4: Importar datos desde CSV (Opcional)

Si tienes un archivo CSV con perfiles:

```bash
cd backend
# Asegúrate de que el archivo CSV esté en la ruta correcta
npm run seed
```

## Paso 5: Deployment en Vercel

### Configurar el proyecto en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará el monorepo automáticamente

### Configurar Variables de Entorno

En la configuración del proyecto en Vercel, agrega las siguientes variables de entorno:

**Variables del Backend:**
```
NODE_ENV=production
PORT=5000
DB_HOST=db.tjwiwwqlxfqnmxzzwatp.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=OawiTMG3Y4&1phbV
DB_NAME=postgres
JWT_SECRET=genera-un-secret-seguro-aleatorio-aqui
JWT_EXPIRES_IN=24h
```

**Variables del Frontend:**
```
VITE_API_URL=https://tu-dominio.vercel.app/api
```

### Configuración del Build

Vercel usará el archivo `vercel.json` en la raíz del proyecto para configurar el build automáticamente.

- **Backend**: Se deployará como funciones serverless en `/api/*`
- **Frontend**: Se deployará como sitio estático en la raíz

## Paso 6: Deploy

1. Haz push de tus cambios a GitHub:
```bash
git add .
git commit -m "Configuración para deployment en Vercel con Supabase"
git push origin main
```

2. Vercel detectará el push automáticamente y comenzará el deployment
3. Espera a que termine el deployment (puedes ver el progreso en el dashboard)
4. Una vez completado, obtendrás una URL de producción

## Paso 7: Actualizar VITE_API_URL

Después del primer deployment:

1. Ve a tu proyecto en Vercel Dashboard
2. Ve a Settings → Environment Variables
3. Actualiza `VITE_API_URL` con tu URL real de producción:
   ```
   VITE_API_URL=https://tu-dominio-real.vercel.app/api
   ```
4. Haz un redeploy para aplicar los cambios

## Verificación

1. Visita tu sitio: `https://tu-dominio.vercel.app`
2. Prueba el buscador de perfiles públicos
3. Prueba el login de administrador en `/admin/login`
4. Verifica que las conexiones a la base de datos funcionen correctamente

## Troubleshooting

### Error de conexión a la base de datos
- Verifica que las credenciales en las variables de entorno sean correctas
- Asegúrate de que Supabase permite conexiones desde las IPs de Vercel
- Verifica que SSL está habilitado en la configuración de Sequelize

### Error 404 en rutas
- Verifica que el archivo `vercel.json` esté en la raíz del proyecto
- Revisa que las rutas en `vercel.json` estén correctamente configuradas

### Error en el build del frontend
- Asegúrate de que `VITE_API_URL` está configurado como variable de entorno
- Verifica que todas las dependencias estén instaladas correctamente

## Comandos útiles

```bash
# Ver logs de producción
vercel logs

# Deployar manualmente
vercel --prod

# Ver el estado del deployment
vercel inspect
```

## Notas importantes

1. **Seguridad**: Cambia el `JWT_SECRET` a un valor aleatorio y seguro
2. **CORS**: Si tienes problemas de CORS, verifica que el frontend esté usando la URL correcta del API
3. **SSL**: Supabase requiere SSL para conexiones de producción (ya configurado en `database.js`)
4. **Logs**: Revisa los logs en Vercel Dashboard si encuentras errores
5. **Database Migrations**: Si haces cambios en los modelos, necesitarás actualizar la base de datos manualmente

## Dominios personalizados

Para usar un dominio personalizado:

1. Ve a Settings → Domains en Vercel Dashboard
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones de Vercel
4. Actualiza `VITE_API_URL` con tu nuevo dominio
