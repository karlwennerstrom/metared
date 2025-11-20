# 🔧 Solución: Problema de Conexión a Supabase desde WSL2

## ❌ Problema Detectado

Tu sistema WSL2 está intentando conectarse a Supabase usando IPv6, pero WSL2 no tiene conectividad IPv6 habilitada por defecto.

**Error:** `connect ENETUNREACH 2600:1f18:... - Local (:::0)`

## ✅ Solución: Usar Pooler de Supabase (Connection Pooling)

Supabase ofrece un **pooler** que usa IPv4 y es más compatible con WSL2.

### Paso 1: Obtener la URL del Pooler

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Click en **Settings** (⚙️ en el menú izquierdo)
3. Click en **Database**
4. Busca la sección **Connection pooling**
5. Copia los datos:
   - **Host:** Algo como `aws-0-us-east-1.pooler.supabase.com`
   - **Port:** `6543` (no 5432)
   - **Database:** `postgres`
   - **User:** `postgres.xxx...`
   - **Password:** (tu password)

### Paso 2: Actualizar backend/.env

Reemplaza el contenido de `/backend/.env` con:

```env
NODE_ENV=development
PORT=5000

# Database - Supabase PostgreSQL (Connection Pooler)
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.tu-proyecto-id
DB_PASSWORD=tu-password-supabase
DB_NAME=postgres

# JWT
JWT_SECRET=tu_super_secret_jwt_cambiar_en_produccion
JWT_EXPIRES_IN=24h
```

**⚠️ IMPORTANTE:**
- El puerto debe ser **6543** (no 5432)
- El host termina en `.pooler.supabase.com`
- El user incluye el prefijo `postgres.`

### Paso 3: Probar la Conexión

```bash
cd backend
node test-connection.js
```

Deberías ver:
```
✅ Conexión a PostgreSQL establecida correctamente!
```

## 🎯 Alternativa: Usar Direct Connection

Si prefieres usar la conexión directa (puerto 5432), necesitas habilitar IPv6 en WSL2:

### Opción A: Habilitar IPv6 en WSL2

**En Windows PowerShell (como Administrador):**

```powershell
# Ver configuración actual de WSL
wsl --shutdown
notepad $env:USERPROFILE\.wslconfig
```

**Agregar/modificar en `.wslconfig`:**

```ini
[wsl2]
networkingMode=mirrored
ipv6=true
```

**Reiniciar WSL:**

```powershell
wsl --shutdown
# Luego abre WSL nuevamente
```

### Opción B: Usar proxy/túnel

Si no puedes modificar la configuración de WSL, usa el pooler (es la opción más simple).

## 📋 Checklist de Verificación

- [ ] He obtenido las credenciales del Connection Pooler de Supabase
- [ ] He actualizado `backend/.env` con el host y puerto correctos
- [ ] El puerto es 6543 (no 5432)
- [ ] He ejecutado `node test-connection.js` y funciona
- [ ] Puedo ver mis datos (1 usuario, 150 perfiles)

## 🆘 Si Sigue Sin Funcionar

### Error: "password authentication failed"

**Solución:** Verifica que estés usando el password correcto de Supabase. Puedes resetearlo en:
Settings → Database → Database password → Reset database password

### Error: "Connection timeout"

**Solución:**
1. Verifica que tu firewall permita conexiones al puerto 6543
2. Verifica que Supabase esté activo (no en pausa)
3. Intenta desde Windows directamente:
   ```bash
   # En PowerShell
   Test-NetConnection -ComputerName aws-0-us-east-1.pooler.supabase.com -Port 6543
   ```

### Error: "SSL required"

**Solución:** Ya está configurado en `database.js`. Si persiste, verifica que la línea `ssl: { require: true }` esté presente.

## ✅ Próximo Paso

Una vez que `test-connection.js` funcione correctamente, ejecuta:

```bash
cd backend
npm run dev
```

Y en otra terminal:

```bash
cd frontend
npm run dev
```

¡Tu proyecto debería estar funcionando en http://localhost:3000! 🎉

---

**Nota:** El Connection Pooler es la forma recomendada de conectarse a Supabase desde entornos con limitaciones de red (como WSL2, Docker, etc.).
