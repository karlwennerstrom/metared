# 🚀 Ejecutar Proyecto en Local

## ⚠️ Importante: Primero Importa los Datos a Supabase

Antes de ejecutar el proyecto localmente, asegúrate de haber importado los datos a Supabase:

```bash
# Sigue las instrucciones en IMPORTAR_DATOS_SUPABASE.md
# 1. Ejecutar database/init-supabase.sql en Supabase
# 2. Ejecutar database/import-supabase.sql en Supabase
```

## 📋 Paso 1: Instalar Dependencias

### Backend (ya está listo ✅)

Las dependencias del backend ya están instaladas con PostgreSQL.

### Frontend

```bash
cd frontend
sudo rm -rf node_modules package-lock.json
npm install
```

Si tienes problemas de permisos, usa:

```bash
cd frontend
sudo chown -R $USER:$USER node_modules
npm install
```

## 🏃 Paso 2: Ejecutar el Proyecto

### Opción A: Terminal Separadas (Recomendado)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Deberías ver:
```
Conexión a PostgreSQL establecida correctamente.
Servidor corriendo en puerto 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Deberías ver:
```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:3000/
```

### Opción B: Script Automático (Próximamente)

Puedes crear un script para ejecutar ambos:

```bash
# crear start-dev.sh
#!/bin/bash
cd backend && npm run dev &
cd frontend && npm run dev
```

## ✅ Verificar que Todo Funciona

### 1. Backend está corriendo
```bash
curl http://localhost:5000/health
```

Debe responder:
```json
{"status":"ok","timestamp":"2025-11-20T..."}
```

### 2. Probar API de perfiles
```bash
curl http://localhost:5000/api/perfiles
```

Debe responder con la lista de perfiles.

### 3. Frontend está corriendo

Abre en tu navegador:
- http://localhost:3000 - Página principal (búsqueda de perfiles)
- http://localhost:3000/admin/login - Login de administrador

### 4. Probar Login

- Email: `admin@uc.cl`
- Password: (la que tenías configurada, o crea un nuevo admin con `npm run create-admin`)

## 🔧 Troubleshooting

### Error: "Cannot connect to database"

**Causa:** No se puede conectar a Supabase

**Solución:**
1. Verifica que las credenciales en `backend/.env.local` sean correctas
2. Verifica que Supabase esté accesible:
   ```bash
   ping db.tjwiwwqlxfqnmxzzwatp.supabase.co
   ```
3. Revisa los logs del backend para más detalles

### Error: "Error: listen EADDRINUSE: address already in use :::5000"

**Causa:** El puerto 5000 ya está en uso

**Solución:**
```bash
# Encontrar qué proceso está usando el puerto 5000
lsof -i :5000
# O cambiar el puerto en backend/.env.local
PORT=5001
```

### Error: "Network Error" en el frontend

**Causa:** El frontend no puede conectarse al backend

**Solución:**
1. Verifica que el backend esté corriendo en puerto 5000
2. Verifica `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Reinicia el servidor de Vite (Ctrl+C y npm run dev)

### No hay datos / Tablas vacías

**Causa:** No se ejecutaron los scripts SQL en Supabase

**Solución:**
1. Abre Supabase Dashboard → SQL Editor
2. Ejecuta `database/init-supabase.sql`
3. Ejecuta `database/import-supabase.sql`
4. Verifica con: `SELECT COUNT(*) FROM perfiles;`

### Error: "password authentication failed"

**Causa:** Credenciales incorrectas de Supabase

**Solución:**
Verifica en `backend/.env.local`:
```
DB_HOST=db.tjwiwwqlxfqnmxzzwatp.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=OawiTMG3Y4&1phbV
DB_NAME=postgres
```

## 📝 Comandos Útiles

### Backend

```bash
cd backend

# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Crear usuario admin
npm run create-admin

# Importar CSV
npm run seed
```

### Frontend

```bash
cd frontend

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🎯 URLs del Proyecto Local

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health
- **Admin Panel:** http://localhost:3000/admin/login

## 🔐 Credenciales de Prueba

Después de importar los datos:

- **Email:** admin@uc.cl
- **Password:** (la que tenías en tu sistema anterior)

Si olvidaste la contraseña, ejecuta:
```bash
cd backend
npm run create-admin
```

## 📊 Verificar Datos

Para verificar que los datos se importaron correctamente:

```bash
cd backend
node -e "
const sequelize = require('./src/config/database');
const { Perfil, Usuario } = require('./src/models');

(async () => {
  await sequelize.authenticate();
  const perfilesCount = await Perfil.count();
  const usuariosCount = await Usuario.count();
  console.log('Usuarios:', usuariosCount);
  console.log('Perfiles:', perfilesCount);
  process.exit(0);
})();
"
```

Debe mostrar:
```
Usuarios: 1
Perfiles: 150
```

---

**¡Listo!** Tu proyecto ahora está corriendo localmente conectado a Supabase 🎉
