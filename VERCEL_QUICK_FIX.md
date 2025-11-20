# ⚡ Solución Rápida al Error 404 en Vercel

## 🚨 Error: `404: NOT_FOUND`

### ✅ Solución en 3 Pasos

## Paso 1️⃣: Configurar Variables de Entorno

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. **Settings** → **Environment Variables**
4. Agrega estas **9 variables** (para Production, Preview y Development):

```bash
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.tjwiwwqlxfqnmxzzwatp
DB_PASSWORD=OawiTMG3Y4&1phbV
DB_NAME=postgres
JWT_SECRET=cambia-esto-a-un-valor-aleatorio-super-seguro-en-produccion
JWT_EXPIRES_IN=24h
NODE_ENV=production
VITE_API_URL=/api
```

**⚠️ IMPORTANTE:** Cada variable debe tener seleccionado:
- ✅ Production
- ✅ Preview
- ✅ Development

## Paso 2️⃣: Redeploy

1. Ve a **Deployments**
2. Click en **...** (3 puntos) del último deployment
3. Click en **"Redeploy"**
4. **Desmarca** "Use existing Build Cache"
5. Click en **"Redeploy"**

## Paso 3️⃣: Verificar

Una vez completado el deploy:

```bash
# Test backend
curl https://tu-dominio.vercel.app/api/health

# Test perfiles
curl https://tu-dominio.vercel.app/api/perfiles
```

Deberías recibir JSON como respuesta.

---

## 📝 Explicación del Problema

El error 404 ocurre porque:

1. **Faltaban variables de entorno:** Vercel necesita las credenciales de Supabase y JWT para que el backend funcione
2. **Variables solo configuradas en backend/.env:** En Vercel, las variables deben estar en el dashboard, no en archivos .env
3. **El código ahora está actualizado:** `/api/index.js` ahora usa las variables del dashboard de Vercel en producción

---

## 🔍 Si Sigue el Error

### Ver logs del deployment:

1. Ve a tu proyecto en Vercel
2. Click en el deployment activo
3. Busca errores en los logs

### Errores comunes:

**"Cannot connect to database"**
- Verifica que `DB_HOST` sea el pooler: `aws-1-us-east-1.pooler.supabase.com`
- Verifica que `DB_PORT` sea `6543` (NO 5432)

**"Module not found"**
- Verifica que todas las dependencias estén en `/api/package.json`
- Vercel ejecutará `npm install --prefix api`

**"VITE_API_URL is not defined"**
- Agrega `VITE_API_URL=/api` a las variables de entorno

---

## ✅ Checklist Final

Antes de redeploy:

- [ ] 9 variables de entorno agregadas en Vercel
- [ ] Cada variable configurada para Production, Preview y Development
- [ ] `database/init-supabase.sql` ejecutado en Supabase
- [ ] `database/import-supabase.sql` ejecutado en Supabase (150 perfiles)
- [ ] Código actualizado (`/api/index.js` y `/api/package.json`)
- [ ] Redeploy sin cache

---

## 🎯 Resultado Esperado

Después del redeploy exitoso:

- ✅ `https://tu-dominio.vercel.app` → Frontend carga
- ✅ `https://tu-dominio.vercel.app/api/health` → `{"status": "ok"}`
- ✅ `https://tu-dominio.vercel.app/api/perfiles` → Array con perfiles
- ✅ Búsqueda funciona en el frontend

---

**Documentación completa:** Ver `VERCEL_DEPLOYMENT_GUIDE.md`
