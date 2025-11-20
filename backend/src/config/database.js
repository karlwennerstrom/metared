const { Sequelize } = require('sequelize');
const pg = require('pg'); // <--- 1. OBLIGATORIO: Importar pg aquí
require('dotenv').config();

// Ajuste para DNS en entornos Node modernos
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    
    // <--- 2. OBLIGATORIO: Forzar el módulo aquí
    dialectModule: pg, 
    
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: isProduction ? 2 : 5, // Reducir conexiones en Vercel
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;