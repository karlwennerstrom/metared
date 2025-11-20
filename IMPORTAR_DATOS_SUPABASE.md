# 🚀 Guía para Importar Datos a Supabase

## ✅ Datos Exportados y Convertidos Exitosamente

Se han exportado **todos tus datos** de MySQL local y convertido a formato PostgreSQL compatible:

- **1 usuario** (admin@uc.cl)
- **150 perfiles** (todos los perfiles IT)
- Archivo generado: `database/import-supabase.sql`

## 📋 Pasos para Importar a Supabase

### Paso 1: Crear las Tablas en Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. En el menú izquierdo, click en **SQL Editor**
4. Click en **New Query**
5. Abre el archivo `database/init-supabase.sql` en tu computadora
6. Copia **todo** el contenido y pégalo en el SQL Editor
7. Click en **Run** (o presiona Cmd/Ctrl + Enter)
8. Verifica que aparezca: "Tablas creadas correctamente"

### Paso 2: Importar los Datos

1. Aún en **SQL Editor** de Supabase
2. Click en **New Query** (nueva pestaña)
3. Abre el archivo `database/import-supabase.sql` en tu computadora
4. Copia **todo** el contenido y pégalo en el SQL Editor
5. Click en **Run** (o presiona Cmd/Ctrl + Enter)
6. Espera unos segundos mientras se importan los 150 perfiles

### Paso 3: Verificar la Importación

Ejecuta esta query en el SQL Editor de Supabase:

```sql
-- Verificar datos importados
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT COUNT(*) AS total_perfiles FROM perfiles;
SELECT COUNT(*) AS perfiles_publicados FROM perfiles WHERE publicado = true;

-- Ver algunos perfiles
SELECT codigo, nombre, categoria FROM perfiles LIMIT 10;
```

Deberías ver:
- ✅ 1 usuario
- ✅ 150 perfiles
- ✅ Lista de perfiles con sus códigos y nombres

## 🔐 Usuario de Administrador

Después de importar, puedes ingresar con:

- **Email:** admin@uc.cl
- **Password:** (la que tenías configurada en tu sistema local)

⚠️ **Nota:** Si olvidaste la contraseña, puedes restablecerla ejecutando el comando `npm run create-admin` localmente (conectado a Supabase).

## 🎉 ¡Listo!

Una vez completados estos pasos, tu base de datos Supabase tendrá **todos los datos** que tenías en MySQL local.

## 📍 Siguientes Pasos

1. ✅ Datos importados a Supabase
2. ⏭️ Sigue con `QUICKSTART_VERCEL.md` para deployar a Vercel
3. ⏭️ Conecta tu aplicación a Supabase

## 🆘 Troubleshooting

### Error: "relation already exists"
- Significa que las tablas ya existen
- Elimínalas primero con:
  ```sql
  DROP TABLE IF EXISTS perfiles CASCADE;
  DROP TABLE IF EXISTS usuarios CASCADE;
  ```
- Luego ejecuta nuevamente `init-supabase.sql`

### Error: "duplicate key value"
- Significa que ya hay datos con esos IDs
- Limpia las tablas primero:
  ```sql
  TRUNCATE TABLE perfiles CASCADE;
  TRUNCATE TABLE usuarios CASCADE;
  ```
- Luego ejecuta nuevamente `import-supabase.sql`

### No aparecen datos
- Verifica que ejecutaste ambos scripts en orden:
  1. Primero `init-supabase.sql` (crear tablas)
  2. Luego `import-supabase.sql` (importar datos)
- Verifica que no hubo errores en la ejecución

---

**Cualquier duda, revisa los archivos:**
- `DEPLOYMENT.md` - Guía completa de deployment
- `MIGRATION_SUMMARY.md` - Resumen de cambios realizados
