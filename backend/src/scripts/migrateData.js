const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Configuración de MySQL local
const mysqlConfig = {
  host: 'localhost',
  port: 3309,
  user: 'metared_user',
  password: 'metared_pass',
  database: 'metared_perfiles'
};

// Función para escapar valores SQL
function escapeSQLValue(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    // Escapar comillas simples y caracteres especiales
    return "'" + value.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
  }
  if (value instanceof Date) {
    return "'" + value.toISOString() + "'";
  }
  return escapeSQLValue(String(value));
}

// Función para generar INSERT para PostgreSQL
function generateInsert(tableName, rows) {
  if (rows.length === 0) {
    return `-- No hay datos en la tabla ${tableName}\n`;
  }

  const columns = Object.keys(rows[0]);
  let sql = `-- Datos de la tabla ${tableName}\n`;

  for (const row of rows) {
    const values = columns.map(col => escapeSQLValue(row[col])).join(', ');
    sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});\n`;
  }

  sql += '\n';
  return sql;
}

async function migrateData() {
  let connection;

  try {
    console.log('Conectando a MySQL local...');
    connection = await mysql.createConnection(mysqlConfig);
    console.log('✓ Conectado a MySQL\n');

    // Exportar usuarios
    console.log('Exportando usuarios...');
    const [usuarios] = await connection.execute(
      'SELECT id, email, password, nombre, rol, activo, created_at, updated_at FROM usuarios ORDER BY id'
    );
    console.log(`✓ Encontrados ${usuarios.length} usuarios\n`);

    // Exportar perfiles
    console.log('Exportando perfiles...');
    const [perfiles] = await connection.execute(
      'SELECT id, codigo, nombre, categoria, area_conocimiento, tipo_cargo, descripcion, responsabilidades, requisitos, publicado, created_at, updated_at FROM perfiles ORDER BY id'
    );
    console.log(`✓ Encontrados ${perfiles.length} perfiles\n`);

    // Generar SQL para PostgreSQL
    console.log('Generando archivo SQL para PostgreSQL...');

    let sqlContent = `-- Migración de datos de MySQL a PostgreSQL (Supabase)
-- Generado el: ${new Date().toISOString()}
-- Total usuarios: ${usuarios.length}
-- Total perfiles: ${perfiles.length}

-- Deshabilitar triggers temporalmente para insertar con IDs específicos
SET session_replication_role = 'replica';

`;

    // Agregar datos de usuarios
    sqlContent += generateInsert('usuarios', usuarios);

    // Agregar datos de perfiles
    sqlContent += generateInsert('perfiles', perfiles);

    // Actualizar secuencias
    if (usuarios.length > 0) {
      const maxUsuarioId = Math.max(...usuarios.map(u => u.id));
      sqlContent += `-- Actualizar secuencia de usuarios\n`;
      sqlContent += `SELECT setval('usuarios_id_seq', ${maxUsuarioId}, true);\n\n`;
    }

    if (perfiles.length > 0) {
      const maxPerfilId = Math.max(...perfiles.map(p => p.id));
      sqlContent += `-- Actualizar secuencia de perfiles\n`;
      sqlContent += `SELECT setval('perfiles_id_seq', ${maxPerfilId}, true);\n\n`;
    }

    // Rehabilitar triggers
    sqlContent += `-- Rehabilitar triggers\n`;
    sqlContent += `SET session_replication_role = 'origin';\n\n`;

    // Verificación
    sqlContent += `-- Verificación\n`;
    sqlContent += `SELECT 'Migración completada' AS status;\n`;
    sqlContent += `SELECT COUNT(*) AS total_usuarios FROM usuarios;\n`;
    sqlContent += `SELECT COUNT(*) AS total_perfiles FROM perfiles;\n`;

    // Guardar archivo
    const outputPath = path.join(__dirname, '../../../database/migration-data.sql');
    await fs.writeFile(outputPath, sqlContent, 'utf8');

    console.log(`✓ Archivo SQL generado: database/migration-data.sql`);
    console.log(`\n📊 Resumen:`);
    console.log(`   - ${usuarios.length} usuarios exportados`);
    console.log(`   - ${perfiles.length} perfiles exportados`);
    console.log(`\n📝 Próximo paso:`);
    console.log(`   1. Abre Supabase Dashboard → SQL Editor`);
    console.log(`   2. Copia y pega el contenido de database/migration-data.sql`);
    console.log(`   3. Ejecuta el script`);
    console.log(`   4. Verifica que los datos se importaron correctamente\n`);

  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    console.error('\nDetalles del error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✓ Conexión a MySQL cerrada');
    }
  }
}

// Ejecutar migración
migrateData();
