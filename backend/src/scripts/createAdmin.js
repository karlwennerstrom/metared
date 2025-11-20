#!/usr/bin/env node

const bcrypt = require('bcryptjs');
require('dotenv').config();

const sequelize = require('../config/database');
const { Usuario } = require('../models');

const createAdmin = async () => {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    let email, password, nombre;

    args.forEach(arg => {
      if (arg.startsWith('--email=')) {
        email = arg.split('=')[1];
      } else if (arg.startsWith('--password=')) {
        password = arg.split('=')[1];
      } else if (arg.startsWith('--nombre=')) {
        nombre = arg.split('=')[1];
      }
    });

    if (!email || !password || !nombre) {
      console.error('Uso: npm run create-admin -- --email=admin@uc.cl --password=Password123 --nombre="Admin Name"');
      process.exit(1);
    }

    // Connect to database
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    // Sync models
    await sequelize.sync();

    // Check if user already exists
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      console.error(`Error: El usuario ${email} ya existe.`);
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create superadmin user
    const usuario = await Usuario.create({
      email,
      password: passwordHash,
      nombre,
      rol: 'superadmin',
      activo: true
    });

    console.log('✅ Usuario SuperAdmin creado exitosamente:');
    console.log(`   Email: ${usuario.email}`);
    console.log(`   Nombre: ${usuario.nombre}`);
    console.log(`   Rol: ${usuario.rol}`);

    process.exit(0);
  } catch (error) {
    console.error('Error creando admin:', error);
    process.exit(1);
  }
};

createAdmin();
