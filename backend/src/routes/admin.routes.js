const express = require('express');
const router = express.Router();
const { autenticar, autorizar } = require('../middleware/auth.middleware');
const {
  listarTodosPerfiles,
  crearPerfil,
  actualizarPerfil,
  eliminarPerfil,
  togglePublicado
} = require('../controllers/perfiles.controller');
const {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarios.controller');

// All admin routes require authentication
router.use(autenticar);

// Perfiles admin routes - all authenticated users
router.get('/perfiles', listarTodosPerfiles);
router.post('/perfiles', crearPerfil);
router.put('/perfiles/:id', actualizarPerfil);
router.patch('/perfiles/:id/toggle-publicado', togglePublicado);

// Delete perfiles - only admin and superadmin
router.delete('/perfiles/:id', autorizar('admin', 'superadmin'), eliminarPerfil);

// User management routes - only admin and superadmin can view
router.get('/usuarios', autorizar('admin', 'superadmin'), listarUsuarios);

// User creation/modification - only superadmin
router.post('/usuarios', autorizar('superadmin'), crearUsuario);
router.put('/usuarios/:id', autorizar('superadmin'), actualizarUsuario);
router.delete('/usuarios/:id', autorizar('superadmin'), eliminarUsuario);

module.exports = router;
