# 🚀 Guía de Deploy a Vercel - Configuración Actual

## ⚠️ Error 404: NOT_FOUND - Solución

Si recibes el error `404: NOT_FOUND`, sigue estos pasos:

## 📋 Paso 1: Configurar Variables de Entorno en Vercel

**MUY IMPORTANTE:** El error 404 generalmente ocurre porque las variables de entorno no están configuradas.

### 1.1 Ir a Vercel Dashboard

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Click en **"Settings"** (arriba)
4. Click en **"Environment Variables"** (menú izquierdo)

### 1.2 Agregar TODAS estas variables

**IMPORTANTE:** Cada variable debe agregarse para **Production, Preview, y Development**

```bash
# Backend Database (Supabase Connection Pooler)
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.tjwiwwqlxfqnmxzzwatp
DB_PASSWORD=OawiTMG3Y4&1phbV
DB_NAME=postgres

# Backend JWT
JWT_SECRET=cambia-esto-a-un-valor-aleatorio-super-seguro-en-produccion
JWT_EXPIRES_IN=24h

# Backend Node
NODE_ENV=production

# Frontend (Usar /api al inicio)
VITE_API_URL=/api
```

**Pasos para agregar cada variable:**
1. Name: `DB_HOST`
2. Value: `aws-1-us-east-1.pooler.supabase.com`
3. Environment: ✅ Production, ✅ Preview, ✅ Development
4. Click "Add"

**Repite para TODAS las 9 variables.**

## 📋 Paso 2: Verificar Configuración del Proyecto

### 2.1 Estructura Actual

Tu proyecto está configurado así:

```
/metared/
├── api/                    # ← Serverless function para Vercel
│   ├── index.js           # Handler que importa desde backend
│   └── package.json       # Dependencias del backend
├── backend/               # ← Código del backend
│   └── src/
├── frontend/              # ← React app
│   └── dist/              # Build output
└── vercel.json            # ← Configuración de Vercel
```

### 2.2 Verificar vercel.json

Tu `vercel.json` debe verse así:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install --prefix api",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api"
    }
  ]
}
```

## 📋 Paso 3: Redeploy

### 3.1 Después de agregar variables de entorno

1. Ve a **"Deployments"** en tu proyecto de Vercel
2. Click en los **3 puntos** (...) del último deployment
3. Click en **"Redeploy"**
4. ✅ Marca **"Use existing Build Cache"** = **NO** (desmarcado)
5. Click en **"Redeploy"**

### 3.2 Ver Logs del Build

Mientras se hace el deploy, click en el deployment activo para ver logs:

```
Building...
✓ Installing dependencies (api)
✓ Building frontend
✓ Creating serverless functions
```

## 📋 Paso 4: Verificar que Funcione

### 4.1 Test del Backend API

Una vez deployado, prueba:

```bash
curl https://tu-dominio.vercel.app/api/perfiles
```

Debería devolver JSON con perfiles.

### 4.2 Test del Frontend

Visita:
```
https://tu-dominio.vercel.app
```

Deberías ver la página de búsqueda.

### 4.3 Test de Health Check

```bash
curl https://tu-dominio.vercel.app/api/health
```

Debería devolver:
```json
{"status": "ok", "timestamp": "..."}
```

## 🔧 Troubleshooting

### Error: "FUNCTION_INVOCATION_FAILED"

**Causa:** Variables de entorno faltantes o incorrectas

**Solución:**
1. Verifica que las 9 variables estén en Vercel
2. Verifica que `DB_HOST` sea el pooler (.pooler.supabase.com)
3. Verifica que `DB_PORT` sea `6543` (NO 5432)
4. Redeploy después de agregar variables

### Error: "Cannot find module..."

**Causa:** Dependencias faltantes en `api/package.json`

**Solución:**
1. Verifica que `api/package.json` tenga todas las dependencias
2. Las dependencias deben incluir: express, cors, sequelize, pg, jsonwebtoken, bcryptjs, dotenv, etc.

### Frontend carga pero "Network Error"

**Causa:** `VITE_API_URL` mal configurado

**Solución:**
1. Primero usa `VITE_API_URL=/api`
2. Después del primer deploy exitoso, cámbialo a tu URL real:
   - `VITE_API_URL=https://tu-dominio-real.vercel.app/api`
3. Redeploy

### Error 404 en /api/perfiles

**Causa:** Rewrites no funcionando correctamente

**Solución:**
1. Verifica que `vercel.json` tenga el rewrite:
   ```json
   "rewrites": [
     {
       "source": "/api/:path*",
       "destination": "/api"
     }
   ]
   ```
2. Verifica que `/api/index.js` exporte una función serverless:
   ```javascript
   module.exports = async (req, res) => {
     await connectDB();
     return app(req, res);
   };
   ```

### Base de datos vacía

**Causa:** No ejecutaste los scripts SQL en Supabase

**Solución:**
1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta `database/init-supabase.sql`
3. Ejecuta `database/import-supabase.sql`
4. Verifica que tengas 1 usuario y 150 perfiles

## 📋 Checklist Completo

Antes de hacer deploy, verifica:

- [ ] ✅ Repositorio en GitHub
- [ ] ✅ `database/init-supabase.sql` ejecutado en Supabase
- [ ] ✅ `database/import-supabase.sql` ejecutado en Supabase (150 perfiles)
- [ ] ✅ 9 variables de entorno configuradas en Vercel
- [ ] ✅ Variables configuradas para Production, Preview y Development
- [ ] ✅ `vercel.json` en la raíz del proyecto
- [ ] ✅ Carpeta `/api` con `index.js` y `package.json`
- [ ] ✅ Redeploy después de configurar variables

## 🎯 Comandos Útiles

### Ver logs en tiempo real (desde CLI)
```bash
npm install -g vercel
vercel login
vercel logs --follow
```

### Deploy manual
```bash
vercel --prod
```

### Ver información del proyecto
```bash
vercel inspect
```

## 📝 Notas Importantes

1. **Connection Pooler:** SIEMPRE usa el pooler de Supabase (puerto 6543), NO la conexión directa (5432)
2. **JWT_SECRET:** Genera uno seguro para producción (no uses el de desarrollo)
3. **SSL:** Ya está configurado en `backend/src/config/database.js`
4. **CORS:** Ya está habilitado en el backend
5. **Serverless Cold Start:** La primera request puede tardar 2-3 segundos

## 🔍 Verificar Deploy Exitoso

### 1. Check de Logs en Vercel

Ve a tu deployment y busca:
```
✓ Installing dependencies
✓ Building
✓ Generating serverless functions
✓ Deployment ready
```

### 2. Test Manual

```bash
# Health check
curl https://tu-dominio.vercel.app/api/health

# Lista de perfiles
curl https://tu-dominio.vercel.app/api/perfiles

# Frontend
curl https://tu-dominio.vercel.app
```

### 3. Test desde el Navegador

1. Abre `https://tu-dominio.vercel.app`
2. Deberías ver la página de búsqueda
3. Busca "Java" o cualquier término
4. Deberías ver resultados

## 🚨 Si Sigue el Error 404

1. **Verifica las variables de entorno:**
   ```bash
   # En Vercel CLI
   vercel env ls
   ```

2. **Revisa los logs del deployment:**
   - Ve a Vercel Dashboard
   - Click en el deployment fallido
   - Busca mensajes de error específicos

3. **Verifica la estructura de archivos:**
   ```bash
   # Debe existir /api/index.js
   ls -la api/
   ```

4. **Prueba en local primero:**
   ```bash
   # Backend
   cd backend && npm run dev

   # Frontend
   cd frontend && npm run dev
   ```

---

## 🎉 Deploy Exitoso

Si todo funciona:
- ✅ Frontend carga en tu URL de Vercel
- ✅ `/api/health` devuelve `{"status": "ok"}`
- ✅ `/api/perfiles` devuelve JSON con perfiles
- ✅ Búsqueda funciona en el frontend
- ✅ Login admin funciona

**¡Listo! Tu aplicación está en producción 🚀**
