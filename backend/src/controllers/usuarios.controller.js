const bcrypt = require('bcryptjs');
const {
  findUsuarioByEmail,
  findUsuarioById,
  findAllUsuarios,
  createUsuario,
  updateUsuario,
  deactivateUsuario
} = require('../db/usuarios.db');

// GET /api/admin/usuarios - List all users
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await findAllUsuarios();

    // Sort by created_at DESC and format response
    const usuariosOrdenados = usuarios
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(u => ({
        id: u.id,
        email: u.email,
        nombre: u.nombre,
        rol: u.rol,
        activo: u.activo,
        created_at: u.created_at
      }));

    res.json({
      data: usuariosOrdenados,
      total: usuariosOrdenados.length
    });
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// POST /api/admin/usuarios - Create new user
const crearUsuarioController = async (req, res) => {
  try {
    const { email, password, nombre, rol } = req.body;

    if (!email || !password || !nombre) {
      return res.status(400).json({ error: 'Email, contraseña y nombre son requeridos' });
    }

    // Check if email already exists
    const existente = await findUsuarioByEmail(email);
    if (existente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const usuario = await createUsuario({
      email,
      password: passwordHash,
      nombre,
      rol: rol || 'editor'
    });

    res.status(201).json({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
      activo: usuario.activo
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// PUT /api/admin/usuarios/:id - Update user
const actualizarUsuarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await findUsuarioById(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { nombre, password, rol } = req.body;
    const updateData = {};

    if (nombre) updateData.nombre = nombre;
    if (rol) updateData.rol = rol;

    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const usuarioActualizado = await updateUsuario(id, updateData);

    res.json({
      id: usuarioActualizado.id,
      email: usuarioActualizado.email,
      nombre: usuarioActualizado.nombre,
      rol: usuarioActualizado.rol,
      activo: usuarioActualizado.activo
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// DELETE /api/admin/usuarios/:id - Deactivate user
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await findUsuarioById(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Prevent self-deletion
    if (req.usuario.id === parseInt(id)) {
      return res.status(400).json({ error: 'No puedes desactivarte a ti mismo' });
    }

    // Soft delete - just deactivate
    await deactivateUsuario(id);

    res.json({ message: 'Usuario desactivado correctamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = {
  listarUsuarios,
  crearUsuario: crearUsuarioController,
  actualizarUsuario: actualizarUsuarioController,
  eliminarUsuario
};
