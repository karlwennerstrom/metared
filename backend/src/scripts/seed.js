#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
require('dotenv').config();

const supabase = require('../config/supabase');

const seedPerfiles = async () => {
  try {
    // Test Supabase connection
    const { error: connError } = await supabase.from('perfiles').select('count', { count: 'exact', head: true });
    if (connError) {
      console.error('Error conectando a Supabase:', connError);
      process.exit(1);
    }
    console.log('Conexión a Supabase establecida.');

    // Find CSV file
    const csvPath = path.join(__dirname, '../../data/MetaRed_Perfiles_TI__250301_ORIGINAL_UNIFICADO_xlsx_-_TODOS.csv');

    if (!fs.existsSync(csvPath)) {
      console.error('❌ Error: No se encontró el archivo CSV en:', csvPath);
      console.error('   Asegúrate de copiar el CSV a la carpeta data/');
      process.exit(1);
    }

    console.log('📂 Leyendo archivo CSV...');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true
    });

    console.log(`📊 Se encontraron ${records.length} registros en el CSV`);

    // Clear existing profiles (optional - comment out if you want to keep existing)
    const { count: existingCount, error: countError } = await supabase
      .from('perfiles')
      .select('*', { count: 'exact', head: true });

    if (existingCount > 0) {
      console.log(`🗑️  Eliminando ${existingCount} perfiles existentes...`);
      await supabase.from('perfiles').delete().neq('id', 0); // Delete all
    }

    // Map CSV columns to model fields
    // Adjust these based on actual CSV column names
    const columnMap = {
      'Codigo': 'codigo',
      'Código': 'codigo',
      'Nombre': 'nombre',
      'Nombre del Perfil': 'nombre',
      'Categoria': 'categoria',
      'Categoría': 'categoria',
      'Area de Conocimiento': 'area_conocimiento',
      'Área de Conocimiento': 'area_conocimiento',
      'Tipo de Cargo': 'tipo_cargo',
      'Descripcion': 'descripcion',
      'Descripción': 'descripcion',
      'Descripción del Cargo': 'descripcion',
      'Responsabilidades': 'responsabilidades',
      'Requisitos': 'requisitos',
      'Requisitos del Puesto': 'requisitos'
    };

    // Process records
    let imported = 0;
    let errors = 0;
    const perfilesToCreate = [];

    for (const record of records) {
      try {
        // Map CSV columns to model fields
        const perfilData = {
          publicado: true // Set all as published by default
        };

        // Try to find the right column for each field
        for (const [csvCol, modelField] of Object.entries(columnMap)) {
          if (record[csvCol] !== undefined) {
            perfilData[modelField] = record[csvCol];
          }
        }

        // Also try direct field names
        if (!perfilData.codigo && record.codigo) perfilData.codigo = record.codigo;
        if (!perfilData.nombre && record.nombre) perfilData.nombre = record.nombre;
        if (!perfilData.categoria && record.categoria) perfilData.categoria = record.categoria;
        if (!perfilData.area_conocimiento && record.area_conocimiento) perfilData.area_conocimiento = record.area_conocimiento;
        if (!perfilData.tipo_cargo && record.tipo_cargo) perfilData.tipo_cargo = record.tipo_cargo;
        if (!perfilData.descripcion && record.descripcion) perfilData.descripcion = record.descripcion;
        if (!perfilData.responsabilidades && record.responsabilidades) perfilData.responsabilidades = record.responsabilidades;
        if (!perfilData.requisitos && record.requisitos) perfilData.requisitos = record.requisitos;

        // Generate codigo if not present
        if (!perfilData.codigo) {
          perfilData.codigo = `PRF${String(imported + 1).padStart(5, '0')}`;
        }

        // Validate required fields
        if (!perfilData.nombre || !perfilData.categoria || !perfilData.area_conocimiento || !perfilData.tipo_cargo) {
          // Use fallbacks
          perfilData.nombre = perfilData.nombre || 'Sin nombre';
          perfilData.categoria = perfilData.categoria || 'Sin categoría';
          perfilData.area_conocimiento = perfilData.area_conocimiento || 'General';
          perfilData.tipo_cargo = perfilData.tipo_cargo || 'Contribución Individual';
        }

        perfilesToCreate.push(perfilData);
        imported++;
      } catch (err) {
        errors++;
        if (errors <= 5) {
          console.error(`   Error en registro ${imported + errors}:`, err.message);
        }
      }
    }

    // Bulk insert
    console.log(`\n💾 Insertando ${perfilesToCreate.length} perfiles en la base de datos...`);

    // Insert in batches of 100 (Supabase limit)
    const batchSize = 100;
    for (let i = 0; i < perfilesToCreate.length; i += batchSize) {
      const batch = perfilesToCreate.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('perfiles')
        .insert(batch);

      if (insertError) {
        console.error(`\nError en batch ${i}-${i + batchSize}:`, insertError);
      }
      process.stdout.write(`\r   Progreso: ${Math.min(i + batchSize, perfilesToCreate.length)}/${perfilesToCreate.length}`);
    }

    console.log('\n\n✅ Importación completada:');
    console.log(`   - Perfiles importados: ${imported}`);
    console.log(`   - Errores: ${errors}`);

    // Show sample of imported data
    const { data: sample } = await supabase
      .from('perfiles')
      .select('codigo, nombre, categoria')
      .limit(3);

    console.log('\n📋 Muestra de datos importados:');
    sample.forEach(p => {
      console.log(`   - ${p.codigo}: ${p.nombre} (${p.categoria})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la importación:', error);
    process.exit(1);
  }
};

seedPerfiles();
