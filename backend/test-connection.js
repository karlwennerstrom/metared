const sequelize = require('./src/config/database');

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a Supabase...\n');

    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente!\n');

    // Probar si las tablas existen
    const [results] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('usuarios', 'perfiles')
      ORDER BY table_name;
    `);

    if (results.length === 0) {
      console.log('⚠️  Las tablas no existen aún.');
      console.log('📝 Ejecuta los scripts SQL en Supabase:');
      console.log('   1. database/init-supabase.sql');
      console.log('   2. database/import-supabase.sql\n');
    } else {
      console.log('✅ Tablas encontradas:', results.map(r => r.table_name).join(', '));

      // Contar registros
      const [usuarios] = await sequelize.query('SELECT COUNT(*) as count FROM usuarios');
      const [perfiles] = await sequelize.query('SELECT COUNT(*) as count FROM perfiles');

      console.log(`\n📊 Datos en la base de datos:`);
      console.log(`   - Usuarios: ${usuarios[0].count}`);
      console.log(`   - Perfiles: ${perfiles[0].count}\n`);

      if (perfiles[0].count === '0') {
        console.log('⚠️  No hay datos importados.');
        console.log('📝 Ejecuta database/import-supabase.sql en Supabase\n');
      } else {
        console.log('✅ ¡Todo listo! Puedes iniciar el servidor.\n');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('\n🔧 Verifica:');
    console.error('   1. Las credenciales en backend/.env son correctas');
    console.error('   2. Supabase está accesible desde tu red');
    console.error('   3. El proyecto de Supabase está activo\n');
    process.exit(1);
  }
}

testConnection();
