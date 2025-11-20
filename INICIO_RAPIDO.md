# 🚀 Inicio Rápido - Proyecto Local

## 📋 Pasos para Ejecutar el Proyecto (10 minutos)

### ✅ Paso 1: Importar Datos a Supabase (2 minutos)

**Si aún no lo hiciste:**

1. Abre [Supabase Dashboard](https://supabase.com/dashboard) → Tu proyecto
2. Click en **SQL Editor** (menú izquierdo)
3. **Nueva query** → Pega y ejecuta `database/init-supabase.sql`
4. **Nueva query** → Pega y ejecuta `database/import-supabase.sql`

Verifica:
```sql
SELECT COUNT(*) FROM usuarios;  -- Debe ser 1
SELECT COUNT(*) FROM perfiles;  -- Debe ser 150
```

---

### ⚠️ Paso 2: Configurar Connection Pooler (3 minutos)

**Tu WSL2 tiene problemas con IPv6.** Necesitas usar el **Connection Pooler** de Supabase:

1. En Supabase Dashboard → **Settings** → **Database**
2. Busca la sección **Connection pooling**
3. Copia estos datos:
   - Host (termina en `.pooler.supabase.com`)
   - Port: `6543`
   - User (tiene formato `postgres.xxxxx`)
   - Password (tu password)

4. **Edita** `backend/.env` y actualiza:

```env
NODE_ENV=development
PORT=5000

# Database - Supabase PostgreSQL (Connection Pooler - WSL2 Compatible)
DB_HOST=aws-0-us-east-1.pooler.supabase.com  # ← Cámbialo por tu host pooler
DB_PORT=6543  # ← IMPORTANTE: puerto 6543, no 5432
DB_USER=postgres.tu-proyecto-id  # ← Tu user del pooler
DB_PASSWORD=tu-password  # ← Tu password
DB_NAME=postgres

# JWT
JWT_SECRET=tu_super_secret_jwt_cambiar_en_produccion
JWT_EXPIRES_IN=24h
```

**📘 Más detalles:** Ver `SOLUCION_CONEXION.md`

---

### ✅ Paso 3: Probar Conexión (1 minuto)

```bash
cd backend
node test-connection.js
```

**Debe mostrar:**
```
✅ Conexión a PostgreSQL establecida correctamente!
✅ Tablas encontradas: perfiles, usuarios
📊 Datos en la base de datos:
   - Usuarios: 1
   - Perfiles: 150
✅ ¡Todo listo! Puedes iniciar el servidor.
```

**Si falla:** Ver `SOLUCION_CONEXION.md` para troubleshooting.

---

### 🎯 Paso 4: Instalar Dependencias Frontend (2 minutos)

```bash
cd frontend
sudo rm -rf node_modules package-lock.json
npm install
```

Si hay problemas de permisos:
```bash
sudo chown -R $USER:$USER .
npm install
```

---

### 🚀 Paso 5: Ejecutar el Proyecto (2 minutos)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Espera ver:
```
Conexión a PostgreSQL establecida correctamente.
Servidor corriendo en puerto 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Espera ver:
```
➜  Local:   http://localhost:3000/
```

---

## 🎉 ¡Listo!

Abre tu navegador en:

- **🏠 Página principal:** http://localhost:3000
- **🔐 Admin panel:** http://localhost:3000/admin/login
  - Email: `admin@uc.cl`
  - Password: (la que configuraste)

---

## 🆘 Troubleshooting Rápido

### ❌ Backend no conecta a Supabase

→ Ver `SOLUCION_CONEXION.md` - Probablemente necesitas usar el Connection Pooler

### ❌ Frontend muestra "Network Error"

1. Verifica que el backend esté corriendo en puerto 5000
2. Verifica `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

### ❌ No hay perfiles en la búsqueda

1. Verifica en Supabase SQL Editor:
   ```sql
   SELECT COUNT(*) FROM perfiles WHERE publicado = true;
   ```
2. Si es 0, ejecuta `database/import-supabase.sql`

### ❌ Olvidé mi password

```bash
cd backend
npm run create-admin
```

---

## 📚 Documentación Completa

- **`SOLUCION_CONEXION.md`** - Problemas de conexión a Supabase (IPv6/WSL2)
- **`EJECUTAR_LOCAL.md`** - Guía completa de ejecución local
- **`IMPORTAR_DATOS_SUPABASE.md`** - Importar datos a Supabase
- **`DEPLOYMENT.md`** - Deployment a Vercel
- **`QUICKSTART_VERCEL.md`** - Deploy rápido a Vercel

---

**¿Listo para producción?** → Sigue `QUICKSTART_VERCEL.md`
