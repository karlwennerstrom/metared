const { Sequelize } = require('sequelize');
const pg = require('pg'); // <--- 1. IMPORTANTE: Importar pg explícitamente
const dns = require('dns');
require('dotenv').config();

// Forzar resolución DNS a IPv4
dns.setDefaultResultOrder('ipv4first');

// En Vercel serverless SIEMPRE usa Connection Pooler
const isProduction = process.env.NODE_ENV === 'production';
const isServerless = process.env.VERCEL === '1';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || (isProduction || isServerless ? 6543 : 5432),
    dialect: 'postgres',
    dialectModule: pg, // <--- 2. IMPORTANTE: Forzar el uso del módulo pg importado
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: isServerless ? 1 : 5, 
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;