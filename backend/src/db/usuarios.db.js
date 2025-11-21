const supabase = require('../config/supabase');

/**
 * Database helper functions for usuarios table
 */

// Find usuario by email
const findUsuarioByEmail = async (email) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    throw error;
  }

  return data;
};

// Find usuario by ID
const findUsuarioById = async (id) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

// Get all usuarios (with optional filters)
const findAllUsuarios = async (filters = {}) => {
  let query = supabase
    .from('usuarios')
    .select('*')
    .order('nombre', { ascending: true });

  // Apply filters
  if (filters.activo !== undefined) {
    query = query.eq('activo', filters.activo);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
};

// Create new usuario
const createUsuario = async (usuarioData) => {
  const { data, error } = await supabase
    .from('usuarios')
    .insert(usuarioData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Update usuario by ID
const updateUsuario = async (id, updates) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Soft delete usuario (set activo = false)
const deactivateUsuario = async (id) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update({ activo: false })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

module.exports = {
  findUsuarioByEmail,
  findUsuarioById,
  findAllUsuarios,
  createUsuario,
  updateUsuario,
  deactivateUsuario
};
