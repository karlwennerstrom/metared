const { Sequelize } = require('sequelize');
const pg = require('pg'); // <--- NECESARIO
require('dotenv').config();

// Imprimir en los logs para confirmar que esto se está ejecutando
console.log("--> Cargando configuración de base de datos...");
console.log("--> Driver PG cargado:", !!pg);

// Forzar resolución DNS a IPv4 (corrección para Node 17+)
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    
    // ESTA ES LA LÍNEA CLAVE. Si esto falta, falla.
    dialectModule: pg, 
    
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      // En Vercel serverless, máx 2 conexiones para no saturar
      max: 2,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;