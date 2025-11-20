const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('../backend/src/config/database');

// Import routes
const authRoutes = require('../backend/src/routes/auth.routes');
const perfilesRoutes = require('../backend/src/routes/perfiles.routes');
const adminRoutes = require('../backend/src/routes/admin.routes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://tu-dominio.vercel.app']
    : '*',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/perfiles', perfilesRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Initialize database connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente.');

    // NO hacer sync en producción
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync();
      console.log('Modelos sincronizados.');
    }

    isConnected = true;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};

// For Vercel serverless
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
