const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.routes');
const perfilesRoutes = require('./routes/perfiles.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
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

const PORT = process.env.PORT || 5000;

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente.');

    // Sync models (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Modelos sincronizados.');
    }

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

startServer();
