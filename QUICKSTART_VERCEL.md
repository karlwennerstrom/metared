# 🚀 Quick Start: Deploy a Vercel

## Pasos Rápidos (5 minutos)

### 1️⃣ Instalar Dependencias
```bash
cd backend
sudo npm install
# o sin sudo:
# rm -rf node_modules package-lock.json && npm install
```

### 2️⃣ Inicializar Base de Datos en Supabase

1. Abre [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a tu proyecto
3. Click en **SQL Editor** (menú izquierdo)
4. Click en **New Query**
5. Copia todo el contenido de `database/init-supabase.sql`
6. Pégalo y click en **Run**
7. Verifica que aparezca: "Tablas creadas correctamente"

### 3️⃣ Probar Localmente (Opcional)

```bash
# Desde /backend
npm run dev

# Deberías ver: "Conexión a PostgreSQL establecida correctamente"
```

### 4️⃣ Subir a GitHub

```bash
git add .
git commit -m "Migración a PostgreSQL (Supabase) y configuración para Vercel"
git push origin main
```

### 5️⃣ Deploy en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click en **Import Git Repository**
3. Selecciona tu repo `metared`
4. Click en **Import**

5. **Configurar Variables de Entorno:**
   - Click en **Environment Variables**
   - Agrega estas variables:

   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=db.tjwiwwqlxfqnmxzzwatp.supabase.co
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=OawiTMG3Y4&1phbV
   DB_NAME=postgres
   JWT_SECRET=cambia-esto-por-un-string-aleatorio-seguro
   JWT_EXPIRES_IN=24h
   VITE_API_URL=/api
   ```

6. Click en **Deploy**

### 6️⃣ Después del Deploy

1. Copia tu URL de Vercel (ej: `https://metared-xyz.vercel.app`)
2. Ve a Settings → Environment Variables en Vercel
3. Edita `VITE_API_URL` y ponle: `https://tu-url.vercel.app/api`
4. Haz click en **Redeploy** en el dashboard

### 7️⃣ Verificar

1. Visita tu URL: `https://tu-url.vercel.app`
2. Deberías ver la página de búsqueda
3. Prueba login: `https://tu-url.vercel.app/admin/login`
   - Email: `admin@uc.cl`
   - Password: `Admin123!`

## ✅ Checklist

- [ ] Dependencias instaladas (`npm install` en backend)
- [ ] Base de datos inicializada en Supabase
- [ ] Código subido a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] VITE_API_URL actualizado con URL real
- [ ] Redeploy después de actualizar VITE_API_URL
- [ ] Sitio funcionando correctamente

## 🆘 Problemas Comunes

### Error al conectar a la base de datos
- Verifica que las credenciales en Vercel sean correctas
- Asegúrate de que DB_HOST termine en `.supabase.co`
- Verifica que NODE_ENV=production

### Error 404 en /api
- Verifica que `vercel.json` esté en la raíz del proyecto
- Revisa los logs en Vercel Dashboard

### Frontend no se conecta al backend
- Verifica que VITE_API_URL esté configurado
- Debe ser: `https://tu-dominio.vercel.app/api`
- Haz redeploy después de cambiar variables

### No aparecen perfiles
- Verifica que la base de datos tenga datos
- Ejecuta `npm run seed` localmente (conectado a Supabase)
- O inserta perfiles manualmente desde el admin panel

## 📖 Más Información

- Guía completa: `DEPLOYMENT.md`
- Resumen de cambios: `MIGRATION_SUMMARY.md`
- Documentación técnica: `CLAUDE.md`

---

**¿Todo listo?** → Sigue el paso 1 y en 5 minutos estarás en producción 🎉
