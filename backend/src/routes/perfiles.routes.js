const express = require('express');
const router = express.Router();
const {
  listarPerfilesPublicos,
  obtenerFacets,
  obtenerPerfilPorCodigo,
  generarPDF
} = require('../controllers/perfiles.controller');

// GET /api/perfiles - Search and list public profiles
router.get('/', listarPerfilesPublicos);

// GET /api/perfiles/facets - Get filter options
router.get('/facets', obtenerFacets);

// GET /api/perfiles/:codigo - Get single profile by code
router.get('/:codigo', obtenerPerfilPorCodigo);

// GET /api/perfiles/:codigo/pdf - Generate PDF
router.get('/:codigo/pdf', generarPDF);

module.exports = router;
