# 🚀 Configuración Completa de Vercel

## 📋 Paso 1: Configuración Inicial en Vercel Dashboard

### 1.1 Crear Proyecto en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click en **"Import Git Repository"**
3. Selecciona tu repositorio de GitHub: `metared`
4. Click en **"Import"**

### 1.2 Configuración del Proyecto

Vercel detectará automáticamente que es un monorepo. **NO CAMBIES NADA** en la configuración inicial. El archivo `vercel.json` en la raíz ya tiene toda la configuración necesaria.

**Framework Preset:** Déjalo en "Other" o "Vite" (Vercel lo detectará)
**Root Directory:** Déjalo vacío (usará la raíz)
**Build Command:** Se usa automáticamente desde vercel.json
**Output Directory:** Se configura automáticamente

## 📋 Paso 2: Variables de Entorno en Vercel

### 2.1 Ir a Settings → Environment Variables

En tu proyecto de Vercel:
1. Click en **"Settings"** (arriba)
2. Click en **"Environment Variables"** (menú izquierdo)
3. Agrega TODAS estas variables:

### 2.2 Variables de Entorno a Configurar

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

# Frontend (IMPORTANTE: Al inicio usa /api, luego actualízalo)
VITE_API_URL=/api
```

**⚠️ IMPORTANTE sobre VITE_API_URL:**
- **Primer Deploy:** Usa `/api` (path relativo)
- **Después del primer deploy:** Actualízalo a `https://tu-dominio-real.vercel.app/api`

### 2.3 Configurar el Entorno

Para cada variable:
1. **Name:** El nombre de la variable (ej: `DB_HOST`)
2. **Value:** El valor (ej: `aws-1-us-east-1.pooler.supabase.com`)
3. **Environment:** Selecciona **Production, Preview, y Development**
4. Click en **"Add"**

## 📋 Paso 3: Configuración Automática (Ya está lista)

### 3.1 Archivo vercel.json (Ya creado)

El archivo `vercel.json` en la raíz ya está configurado con:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/api/index.js",     // Backend serverless
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",    // Frontend estático
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",               // Rutas API → backend
      "dest": "backend/api/index.js"
    },
    {
      "src": "/(.*)",                   // Otras rutas → frontend
      "dest": "frontend/dist/$1"
    }
  ]
}
```

### 3.2 Build Commands (Automático)

Vercel ejecutará automáticamente:

**Frontend:**
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`

**Backend:**
- Se empaqueta como función serverless automáticamente
- No necesita build

## 📋 Paso 4: Deploy

### 4.1 Primer Deploy

1. Después de configurar las variables de entorno
2. Click en **"Deploy"** (o espera el autodeploy de GitHub)
3. Vercel construirá y deployará automáticamente

### 4.2 Ver el Progreso

Verás el log del build:
```
Running build in Washington, D.C., USA (iad1) - iad1
Cloning github.com/tu-usuario/metared
...
Building frontend
✓ Built in 45s
Building backend
✓ Serverless Function deployed
```

### 4.3 Obtener la URL

Una vez completado, obtendrás una URL como:
```
https://metared-xyz123.vercel.app
```

## 📋 Paso 5: Actualizar VITE_API_URL

**IMPORTANTE:** Después del primer deploy exitoso:

1. Ve a **Settings → Environment Variables**
2. Edita `VITE_API_URL`
3. Cámbialo de `/api` a `https://tu-dominio-real.vercel.app/api`
4. Guarda los cambios
5. Ve a **Deployments**
6. Click en los **3 puntos** del último deployment
7. Click en **"Redeploy"**

## 📋 Paso 6: Verificación

### 6.1 Probar el Frontend

Visita tu URL de Vercel:
```
https://tu-dominio.vercel.app
```

Deberías ver la página de búsqueda de perfiles.

### 6.2 Probar el Backend API

```bash
curl https://tu-dominio.vercel.app/api/perfiles
```

Debería devolver el JSON con los 150 perfiles.

### 6.3 Probar Admin

```
https://tu-dominio.vercel.app/admin/login
```

- Email: `admin@uc.cl`
- Password: (tu password de Supabase)

## 🔧 Troubleshooting

### Error: "FUNCTION_INVOCATION_FAILED"

**Causa:** Variables de entorno mal configuradas

**Solución:**
1. Verifica que TODAS las variables estén en Vercel
2. Verifica que DB_HOST sea el pooler (.pooler.supabase.com)
3. Verifica que DB_PORT sea 6543 (no 5432)

### Error: "Failed to build"

**Causa:** Error en el build del frontend

**Solución:**
1. Ve a los logs del build en Vercel
2. Busca el error específico
3. Usualmente es por dependencias faltantes

### Frontend carga pero "Network Error"

**Causa:** VITE_API_URL no está configurado correctamente

**Solución:**
1. Verifica que VITE_API_URL esté en las variables de entorno
2. Debe ser `https://tu-dominio.vercel.app/api` (tu URL real)
3. Redeploy después de cambiar

### No aparecen perfiles

**Causa:** Base de datos vacía o sin conexión

**Solución:**
1. Verifica que ejecutaste `database/import-supabase.sql` en Supabase
2. Verifica las credenciales de DB en Vercel
3. Revisa los logs de las funciones serverless

## 📋 Resumen - Checklist

Antes de hacer el deploy, asegúrate de:

- [ ] Repositorio subido a GitHub
- [ ] `database/init-supabase.sql` ejecutado en Supabase
- [ ] `database/import-supabase.sql` ejecutado en Supabase (150 perfiles)
- [ ] Variables de entorno configuradas en Vercel (9 variables)
- [ ] Primer deploy completado
- [ ] VITE_API_URL actualizado con URL real
- [ ] Redeploy después de actualizar VITE_API_URL
- [ ] Sitio funcionando en producción

## 🎯 Comandos Útiles

### Ver logs en tiempo real
```bash
vercel logs --follow
```

### Deploy manual desde CLI
```bash
npm install -g vercel  # Instalar Vercel CLI
vercel login           # Login
vercel --prod          # Deploy a producción
```

### Ver información del proyecto
```bash
vercel inspect
```

## 📝 Notas Importantes

1. **No uses la conexión directa de Supabase (puerto 5432)** en Vercel, usa el pooler (puerto 6543)
2. **JWT_SECRET:** Genera uno seguro para producción (no uses el de desarrollo)
3. **CORS:** Ya está configurado en el backend para aceptar todas las origins
4. **SSL:** Supabase pooler ya maneja SSL automáticamente
5. **Logs:** Revisa los logs en Vercel Dashboard si hay errores

## 🌐 Dominio Personalizado (Opcional)

Si quieres usar tu propio dominio:

1. Ve a **Settings → Domains**
2. Click en **"Add Domain"**
3. Ingresa tu dominio (ej: `metared.uc.cl`)
4. Sigue las instrucciones para configurar DNS
5. Una vez configurado, actualiza `VITE_API_URL` con tu nuevo dominio

---

**¿Todo listo?** → Sube tu código a GitHub y haz el primer deploy en Vercel 🚀
