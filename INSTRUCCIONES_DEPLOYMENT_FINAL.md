# ✅ Deployment Completado - Últimos Pasos

## 🎉 ¡Deployments Exitosos!

Tus proyectos han sido deployados exitosamente:

- **Backend:** `https://metared-le3co4q9n-karl-heinzs-projects.vercel.app`
- **Frontend:** `https://frontend-had3ffgzm-karl-heinzs-projects.vercel.app`

## ⚠️ Problema Actual: Protección de Deployment

Ambos proyectos tienen **Vercel Deployment Protection** activada, lo que requiere autenticación para acceder. Necesitas desactivar esto para que funcionen públicamente.

## 🔧 Paso 1: Desactivar Protección en Backend

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click en el proyecto **"metared"**
3. Ve a **Settings** → **Deployment Protection**
4. Cambia a **"Off" o "Standard Protection"**
5. Click en **"Save"**

## 🔧 Paso 2: Desactivar Protección en Frontend

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click en el proyecto **"frontend"**
3. Ve a **Settings** → **Deployment Protection**
4. Cambia a **"Off" o "Standard Protection"**
5. Click en **"Save"**

## 🔄 Paso 3: Actualizar Frontend con URL Correcta del Backend

El frontend actualmente apunta a la URL vieja del backend. Necesitas actualizarlo:

1. Ve al proyecto **"frontend"** en Vercel Dashboard
2. Click en **Settings** → **Environment Variables**
3. Busca `VITE_API_URL`
4. Edítala y cambia el valor a: `https://metared-le3co4q9n-karl-heinzs-projects.vercel.app/api`
5. Asegúrate de seleccionar **Production, Preview y Development**
6. Click en **"Save"**
7. Ve a **Deployments**
8. Click en **...** (3 puntos) del último deployment
9. Click en **"Redeploy"**

## 🔄 Paso 4: Actualizar CORS en Backend

El backend necesita permitir las peticiones del frontend:

Esto se puede hacer de 2 formas:

### Opción A: Desde Vercel Dashboard (Recomendado)

1. Ve al proyecto **"metared"** (backend)
2. Settings → Environment Variables
3. Agrega una nueva variable:
   - Name: `FRONTEND_URL`
   - Value: `https://frontend-had3ffgzm-karl-heinzs-projects.vercel.app`
   - Environment: Production, Preview, Development
4. Redeploy el backend

### Opción B: Editar código (ya lo puedo hacer yo)

Déjame saber y yo actualizo el código para permitir el frontend.

## ✅ Verificación Final

Una vez completados los pasos:

### 1. Test del Backend

```bash
curl https://metared-le3co4q9n-karl-heinzs-projects.vercel.app/api/health
```

**Respuesta esperada:**
```json
{"status":"ok","timestamp":"2024-11-20T..."}
```

### 2. Test de Perfiles

```bash
curl https://metared-le3co4q9n-karl-heinzs-projects.vercel.app/api/perfiles
```

**Respuesta esperada:** Array con 150 perfiles

### 3. Test del Frontend

Abre en navegador:
```
https://frontend-had3ffgzm-karl-heinzs-projects.vercel.app
```

Deberías ver:
- ✅ Página de búsqueda carga
- ✅ Puedes buscar perfiles
- ✅ Admin login funciona

## 🔑 Variables de Entorno Actuales

### Backend (metared)
```
NODE_ENV=production
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.tjwiwwqlxfqnmxzzwatp
DB_PASSWORD=OawiTMG3Y4&1phbV
DB_NAME=postgres
JWT_SECRET=tu-super-secret-seguro-para-produccion-2024
JWT_EXPIRES_IN=24h
VERCEL=1
```

### Frontend
```
VITE_API_URL=https://metared-le3co4q9n-karl-heinzs-projects.vercel.app/api
```
(Necesita actualización - ver Paso 3)

## 📝 Resumen de URLs

| Servicio | URL |
|----------|-----|
| Backend API | `https://metared-le3co4q9n-karl-heinzs-projects.vercel.app` |
| Frontend | `https://frontend-had3ffgzm-karl-heinzs-projects.vercel.app` |
| Health Check | `https://metared-le3co4q9n-karl-heinzs-projects.vercel.app/api/health` |
| Perfiles API | `https://metared-le3co4q9n-karl-heinzs-projects.vercel.app/api/perfiles` |
| Admin Login | `https://frontend-had3ffgzm-karl-heinzs-projects.vercel.app/admin/login` |

## 🎯 Qué Hacer Ahora

1. **Desactivar protección** en ambos proyectos (Paso 1 y 2)
2. **Actualizar VITE_API_URL** del frontend (Paso 3)
3. **Configurar CORS** del backend (Paso 4)
4. **Verificar** que todo funcione

## 💡 Comando Rápido para Verificar (después de completar pasos)

```bash
# Test completo
curl https://metared-le3co4q9n-karl-heinzs-projects.vercel.app/api/health && \
curl https://metared-le3co4q9n-karl-heinzs-projects.vercel.app/api/perfiles | head -20
```

## 🚀 Dominios Personalizados (Opcional)

Si quieres usar dominios personalizados:

1. Ve a cada proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio personalizado
4. Configura DNS según las instrucciones
5. Actualiza `VITE_API_URL` con el nuevo dominio

---

## 📧 Credenciales Admin

- Email: `admin@uc.cl`
- Password: Tu contraseña de Supabase

---

**¿Necesitas ayuda con algún paso? Déjame saber y te guío.**
