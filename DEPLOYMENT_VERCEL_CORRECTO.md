# 🚀 Guía de Deployment a Vercel - CONFIGURACIÓN CORRECTA

## 📋 Resumen de la Configuración

Este proyecto despliega **SOLO el backend** en Vercel como serverless functions. El frontend se desplegará por separado en otro proyecto de Vercel.

## 🏗️ Estructura del Proyecto

```
/metared/
├── backend/
│   ├── api/
│   │   └── index.js        # ← Handler serverless para Vercel
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js # ← Configurado para serverless (pool.max=1)
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── index.js        # ← Para desarrollo local
│   ├── .vercelignore
│   └── package.json        # ← main: "api/index.js"
├── frontend/               # ← Se desplegará por separado
├── database/
└── vercel.json            # ← Configuración v2 con builds y routes
```

## 🔧 Cambios Realizados

### 1. `vercel.json` - Sintaxis v2

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/api/index.js"
    }
  ]
}
```

### 2. `backend/api/index.js` - Handler Serverless

✅ **Configurado correctamente con:**
- CORS configurado para producción
- `sequelize.sync()` deshabilitado en producción
- Soporte para desarrollo local y serverless

### 3. `backend/src/config/database.js` - Pool para Serverless

✅ **Configurado con:**
- Detección de entorno Vercel (`process.env.VERCEL`)
- `pool.max = 1` en serverless (CRÍTICO)
- Connection Pooler (puerto 6543) automático en producción

### 4. `backend/package.json`

✅ **Actualizado con:**
- `"main": "api/index.js"`
- `"vercel-build": "echo 'No build needed for API'"`

### 5. `backend/.vercelignore`

✅ **Creado para ignorar:**
- node_modules
- .env y variantes
- logs

## 📦 Paso 1: Deploy del Backend

### 1.1 Crear Proyecto en Vercel (Solo Backend)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio `metared`
3. **Root Directory:** `backend` ← IMPORTANTE
4. **Framework Preset:** Other
5. Click en **Deploy**

### 1.2 Configurar Variables de Entorno

En tu proyecto de Vercel → Settings → Environment Variables:

**TODAS estas variables para Production, Preview y Development:**

```bash
NODE_ENV=production
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.tjwiwwqlxfqnmxzzwatp
DB_PASSWORD=OawiTMG3Y4&1phbV
DB_NAME=postgres
JWT_SECRET=tu-super-secret-seguro-para-produccion
JWT_EXPIRES_IN=24h
VERCEL=1
```

**⚠️ CRÍTICO:**
- `DB_PORT` debe ser `6543` (Connection Pooler, NO 5432)
- `VERCEL=1` para detectar entorno serverless
- `NODE_ENV=production` para deshabilitar sync

### 1.3 Deploy

1. Después de configurar variables, ve a **Deployments**
2. Click en **...** → **Redeploy**
3. ✅ **Desmarca** "Use existing Build Cache"
4. Deploy

### 1.4 Verificar Backend

Una vez desplegado, prueba:

```bash
# Reemplaza con tu URL real
curl https://tu-backend.vercel.app/api/health

# Debería devolver:
# {"status":"ok","timestamp":"..."}

curl https://tu-backend.vercel.app/api/perfiles

# Debería devolver array con perfiles
```

## 📦 Paso 2: Deploy del Frontend (Proyecto Separado)

### 2.1 Crear Nuevo Proyecto en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. **Importa el MISMO repositorio** `metared`
3. **Root Directory:** `frontend` ← IMPORTANTE
4. **Framework Preset:** Vite
5. **Build Command:** `npm run build` (automático)
6. **Output Directory:** `dist` (automático)

### 2.2 Variables de Entorno del Frontend

Solo necesitas UNA variable:

```bash
VITE_API_URL=https://tu-backend.vercel.app/api
```

**Reemplaza `tu-backend.vercel.app` con la URL real de tu backend deployado en el Paso 1.**

### 2.3 Deploy Frontend

1. Configura la variable `VITE_API_URL`
2. Deploy
3. Vercel construirá el frontend automáticamente

### 2.4 Verificar Frontend

Visita tu URL del frontend:
```
https://tu-frontend.vercel.app
```

Deberías ver:
- ✅ Página de búsqueda carga
- ✅ Búsqueda funciona (conecta al backend)
- ✅ Admin login funciona

## ✅ Checklist de Deployment

### Backend:
- [ ] ✅ Root Directory = `backend` en Vercel
- [ ] ✅ 9 variables de entorno configuradas
- [ ] ✅ `DB_PORT=6543` (Connection Pooler)
- [ ] ✅ `VERCEL=1` configurado
- [ ] ✅ `/api/health` responde correctamente
- [ ] ✅ `/api/perfiles` devuelve datos

### Frontend:
- [ ] ✅ Root Directory = `frontend` en Vercel (proyecto separado)
- [ ] ✅ `VITE_API_URL` apunta al backend deployado
- [ ] ✅ Frontend carga correctamente
- [ ] ✅ Búsqueda funciona
- [ ] ✅ Admin panel funciona

### Database:
- [ ] ✅ `database/init-supabase.sql` ejecutado en Supabase
- [ ] ✅ `database/import-supabase.sql` ejecutado (150 perfiles)
- [ ] ✅ 1 usuario admin creado

## 🔍 Troubleshooting

### Error: "Cannot connect to database"

**Causa:** Puerto incorrecto o no es Connection Pooler

**Solución:**
```bash
DB_HOST=aws-1-us-east-1.pooler.supabase.com  # ← Debe ser .pooler
DB_PORT=6543  # ← NO 5432
```

### Error: "FUNCTION_INVOCATION_FAILED"

**Causa:** Variables de entorno faltantes

**Solución:**
1. Verifica que TODAS las 9 variables estén configuradas
2. Verifica que estén en Production, Preview Y Development
3. Redeploy sin cache

### Error: "Too many connections"

**Causa:** `pool.max` no está configurado a 1

**Solución:**
- Ya está corregido en `backend/src/config/database.js`
- Asegúrate de tener `VERCEL=1` en las variables de entorno
- Verifica que el código detecte `isServerless`

### Frontend muestra "Network Error"

**Causa:** `VITE_API_URL` mal configurado

**Solución:**
```bash
# NO uses /api (relativo)
VITE_API_URL=https://tu-backend-real.vercel.app/api

# Debe ser la URL COMPLETA del backend
```

### CORS Error en el frontend

**Causa:** Backend no permite el origen del frontend

**Solución:**
Edita `backend/api/index.js` y agrega tu dominio del frontend:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://tu-frontend.vercel.app']  // ← Agregar tu dominio
    : '*',
  credentials: true
}));
```

Luego redeploy el backend.

## 📝 Configuración de CORS (Importante)

Después del primer deploy del frontend, actualiza `backend/api/index.js`:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://tu-frontend-real.vercel.app',  // ← Tu dominio del frontend
        'https://tu-dominio-personalizado.com'  // ← Si tienes dominio custom
      ]
    : '*',
  credentials: true
}));
```

## 🎯 URLs Finales

Después de ambos deployments:

```
Backend API:  https://tu-backend.vercel.app/api
Frontend:     https://tu-frontend.vercel.app
```

### Endpoints del Backend:

```
GET  /api/health                        # Health check
GET  /api/perfiles                      # Listar perfiles (público)
GET  /api/perfiles/:codigo              # Ver perfil (público)
GET  /api/perfiles/:codigo/pdf          # Descargar PDF (público)
POST /api/auth/login                    # Login
GET  /api/auth/me                       # Usuario actual (autenticado)
GET  /api/admin/perfiles                # Admin: listar perfiles
POST /api/admin/perfiles                # Admin: crear perfil
PUT  /api/admin/perfiles/:id            # Admin: editar perfil
DELETE /api/admin/perfiles/:id          # Admin: eliminar perfil
```

## 🔐 Variables de Entorno - Resumen

### Backend (9 variables):
```
NODE_ENV=production
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.tjwiwwqlxfqnmxzzwatp
DB_PASSWORD=OawiTMG3Y4&1phbV
DB_NAME=postgres
JWT_SECRET=tu-super-secret-seguro
JWT_EXPIRES_IN=24h
VERCEL=1
```

### Frontend (1 variable):
```
VITE_API_URL=https://tu-backend.vercel.app/api
```

## 📚 Archivos de Configuración

### `/vercel.json` (raíz del proyecto)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/api/index.js"
    }
  ]
}
```

### `backend/.vercelignore`
```
node_modules
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log
.DS_Store
```

## ⚙️ Optimizaciones para Serverless

Ya implementadas en el código:

1. ✅ **Pool de conexiones = 1** (evita "too many connections")
2. ✅ **Connection Pooler** (puerto 6543, no 5432)
3. ✅ **Caché de conexión** (variable `isConnected`)
4. ✅ **Sin sync en producción** (las tablas ya existen)
5. ✅ **CORS configurado** (solo permite orígenes autorizados)
6. ✅ **Logging deshabilitado** en producción

## 🚀 Deploy desde CLI (Opcional)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy backend
cd backend
vercel --prod

# Deploy frontend (en otra terminal)
cd frontend
vercel --prod
```

## 📊 Monitoreo

### Ver logs en tiempo real:
```bash
vercel logs --follow
```

### Ver deployment específico:
```bash
vercel inspect [deployment-url]
```

## ✨ Resultado Final

Después de completar ambos deployments:

- ✅ Backend API funcionando en Vercel serverless
- ✅ Frontend SPA funcionando en Vercel edge
- ✅ Base de datos PostgreSQL en Supabase
- ✅ 150 perfiles disponibles
- ✅ Admin panel funcional
- ✅ SSL habilitado automáticamente
- ✅ CDN global de Vercel
- ✅ Escalado automático

---

**¿Todo listo?** Sigue los pasos en orden y tendrás tu aplicación en producción 🎉
