const fs = require('fs').promises;
const path = require('path');

async function convertMySQLtoPostgreSQL() {
  try {
    console.log('Leyendo dump de MySQL...');
    const inputPath = path.join(__dirname, '../../../database/mysql-dump.sql');
    let content = await fs.readFile(inputPath, 'utf8');

    console.log('Convirtiendo a PostgreSQL...\n');

    // Remover comentarios de MySQL
    content = content.replace(/--.*$/gm, '');
    content = content.replace(/\/\*.*?\*\//gs, '');

    // Remover comandos específicos de MySQL
    content = content.replace(/SET @.*?;/g, '');
    content = content.replace(/SET .*?=.*?;/g, '');
    content = content.replace(/\/\*!.*?\*\/;/gs, '');

    // Remover LOCK/UNLOCK TABLES
    content = content.replace(/LOCK TABLES.*?;/gi, '');
    content = content.replace(/UNLOCK TABLES;/gi, '');

    // Remover backticks
    content = content.replace(/`/g, '');

    // Extraer INSERT statements
    const usuariosMatch = content.match(/INSERT INTO usuarios VALUES \((.*?)\);/s);
    const perfilesMatch = content.match(/INSERT INTO perfiles VALUES (.*?);$/ms);

    if (!usuariosMatch || !perfilesMatch) {
      throw new Error('No se encontraron datos en el dump');
    }

    // Contar registros
    const usuariosCount = 1; // Solo hay un INSERT para usuarios
    const perfilesData = perfilesMatch[1];

    // Contar perfiles (cada registro termina en ),)
    const perfilesCount = (perfilesData.match(/\),\(/g) || []).length + 1;

    console.log(`✓ Encontrados ${usuariosCount} usuario(s)`);
    console.log(`✓ Encontrados ${perfilesCount} perfiles\n`);

    // Crear SQL para PostgreSQL
    let postgresSQL = `-- Migración de datos de MySQL a PostgreSQL (Supabase)
-- Generado el: ${new Date().toISOString()}
-- Total usuarios: ${usuariosCount}
-- Total perfiles: ${perfilesCount}

-- Deshabilitar triggers temporalmente para insertar con IDs específicos
SET session_replication_role = 'replica';

-- Insertar usuarios
INSERT INTO usuarios (id, email, password, nombre, rol, activo, created_at, updated_at) VALUES (${usuariosMatch[1]});

-- Actualizar secuencia de usuarios
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios), true);

-- Insertar perfiles
INSERT INTO perfiles (id, codigo, nombre, categoria, area_conocimiento, tipo_cargo, descripcion, responsabilidades, requisitos, publicado, created_at, updated_at) VALUES
${perfilesData};

-- Actualizar secuencia de perfiles
SELECT setval('perfiles_id_seq', (SELECT MAX(id) FROM perfiles), true);

-- Rehabilitar triggers
SET session_replication_role = 'origin';

-- Verificación
SELECT 'Migración completada' AS status;
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT COUNT(*) AS total_perfiles FROM perfiles;
SELECT codigo, nombre FROM perfiles ORDER BY id LIMIT 10;
`;

    // Convertir valores booleanos de MySQL (0,1) a PostgreSQL (false,true)
    // Esto es complicado porque necesitamos solo cambiar los valores en las columnas booleanas
    // Para usuarios: columna 6 (activo)
    // Para perfiles: columna 10 (publicado)

    // Usar una expresión regular más cuidadosa
    postgresSQL = postgresSQL.replace(/,0,'2025-/g, ",false,'2025-");
    postgresSQL = postgresSQL.replace(/,1,'2025-/g, ",true,'2025-");

    // Guardar archivo
    const outputPath = path.join(__dirname, '../../../database/import-supabase.sql');
    await fs.writeFile(outputPath, postgresSQL, 'utf8');

    console.log(`✅ Conversión completada!`);
    console.log(`📄 Archivo generado: database/import-supabase.sql`);
    console.log(`\n📝 Próximos pasos:`);
    console.log(`   1. Abre Supabase Dashboard → SQL Editor`);
    console.log(`   2. Primero ejecuta: database/init-supabase.sql (crear tablas)`);
    console.log(`   3. Luego ejecuta: database/import-supabase.sql (importar datos)`);
    console.log(`   4. Verifica que los datos se importaron correctamente\n`);

  } catch (error) {
    console.error('❌ Error durante la conversión:', error.message);
    console.error('\nDetalles del error:', error);
    process.exit(1);
  }
}

convertMySQLtoPostgreSQL();
