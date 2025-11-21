const express = require('express');
const cors = require('cors');
require('dotenv').config();

const supabase = require('../backend/src/config/supabase');
const { initializeSearchIndex } = require('../backend/src/services/search.service');

// Import routes
const authRoutes = require('../backend/src/routes/auth.routes');
const perfilesRoutes = require('../backend/src/routes/perfiles.routes');
const adminRoutes = require('../backend/src/routes/admin.routes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? '*'
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

// Initialize Supabase connection and search index
let isInitialized = false;

const initializeApp = async () => {
  if (isInitialized) {
    return;
  }

  try {
    // Test Supabase connection
    const { error } = await supabase.from('perfiles').select('count', { count: 'exact', head: true });

    if (error) {
      console.error('Error conectando a Supabase:', error);
      throw error;
    }

    console.log('Conexión a Supabase establecida correctamente.');

    // Initialize search index
    await initializeSearchIndex();

    isInitialized = true;
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    throw error;
  }
};

// For Vercel serverless
module.exports = async (req, res) => {
  await initializeApp();
  return app(req, res);
};

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  initializeApp().then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  });
}
