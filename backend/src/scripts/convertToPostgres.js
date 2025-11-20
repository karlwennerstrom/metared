const fs = require('fs').promises;
const path = require('path');

async function convertMySQLtoPostgreSQL() {
  try {
    console.log('Leyendo dump de MySQL...');
    const inputPath = path.join(__dirname, '../../../database/mysql-dump.sql');
    const content = await fs.readFile(inputPath, 'utf8');

    console.log('Convirtiendo a PostgreSQL...');

    // Extraer solo los INSERT statements
    const insertRegex = /INSERT INTO `(\w+)` VALUES (.+);/g;
    let match;
    const inserts = { usuarios: [], perfiles: [] };

    while ((match = insertRegex.exec(content)) !== null) {
      const tableName = match[1];
      const valuesString = match[2];

      if (inserts[tableName]) {
        // Parsear los valores - cada conjunto de valores está entre paréntesis
        const valueGroups = [];
        let currentGroup = '';
        let inString = false;
        let depth = 0;

        for (let i = 0; i < valuesString.length; i++) {
          const char = valuesString[i];

          if (char === "'" && valuesString[i-1] !== '\\') {
            inString = !inString;
          }

          if (!inString) {
            if (char === '(') depth++;
            if (char === ')') depth--;
          }

          currentGroup += char;

          if (!inString && depth === 0 && char === ')') {
            valueGroups.push(currentGroup.trim());
            currentGroup = '';
            i++; // Skip comma
          }
        }

        inserts[tableName] = inserts[tableName].concat(valueGroups);
      }
    }

    console.log(`Encontrados ${inserts.usuarios.length} usuarios`);
    console.log(`Encontrados ${inserts.perfiles.length} perfiles`);

    // Generar SQL para PostgreSQL
    let postgresSQL = `-- Migración de datos de MySQL a PostgreSQL (Supabase)
-- Generado el: ${new Date().toISOString()}
-- Total usuarios: ${inserts.usuarios.length}
-- Total perfiles: ${inserts.perfiles.length}

-- Deshabilitar triggers temporalmente para insertar con IDs específicos
SET session_replication_role = 'replica';

`;

    // Generar INSERTs para usuarios
    if (inserts.usuarios.length > 0) {
      postgresSQL += `-- Insertar usuarios\n`;
      for (const values of inserts.usuarios) {
        postgresSQL += `INSERT INTO usuarios (id, email, password, nombre, rol, activo, created_at, updated_at) VALUES ${values};\n`;
      }
      postgresSQL += '\n';

      // Actualizar secuencia
      postgresSQL += `-- Actualizar secuencia de usuarios\n`;
      postgresSQL += `SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios), true);\n\n`;
    }

    // Generar INSERTs para perfiles
    if (inserts.perfiles.length > 0) {
      postgresSQL += `-- Insertar perfiles\n`;
      for (const values of inserts.perfiles) {
        postgresSQL += `INSERT INTO perfiles (id, codigo, nombre, categoria, area_conocimiento, tipo_cargo, descripcion, responsabilidades, requisitos, publicado, created_at, updated_at) VALUES ${values};\n`;
      }
      postgresSQL += '\n';

      // Actualizar secuencia
      postgresSQL += `-- Actualizar secuencia de perfiles\n`;
      postgresSQL += `SELECT setval('perfiles_id_seq', (SELECT MAX(id) FROM perfiles), true);\n\n`;
    }

    // Rehabilitar triggers
    postgresSQL += `-- Rehabilitar triggers\n`;
    postgresSQL += `SET session_replication_role = 'origin';\n\n`;

    // Verificación
    postgresSQL += `-- Verificación\n`;
    postgresSQL += `SELECT 'Migración completada' AS status;\n`;
    postgresSQL += `SELECT COUNT(*) AS total_usuarios FROM usuarios;\n`;
    postgresSQL += `SELECT COUNT(*) AS total_perfiles FROM perfiles;\n`;
    postgresSQL += `SELECT codigo, nombre FROM perfiles ORDER BY id;\n`;

    // Guardar archivo
    const outputPath = path.join(__dirname, '../../../database/import-supabase.sql');
    await fs.writeFile(outputPath, postgresSQL, 'utf8');

    console.log(`\n✅ Conversión completada!`);
    console.log(`📄 Archivo generado: database/import-supabase.sql`);
    console.log(`\n📝 Próximos pasos:`);
    console.log(`   1. Abre Supabase Dashboard → SQL Editor`);
    console.log(`   2. Primero ejecuta: database/init-supabase.sql (crear tablas)`);
    console.log(`   3. Luego ejecuta: database/import-supabase.sql (importar datos)`);
    console.log(`   4. Verifica que los datos se importaron correctamente\n`);

  } catch (error) {
    console.error('❌ Error durante la conversión:', error.message);
    process.exit(1);
  }
}

convertMySQLtoPostgreSQL();
