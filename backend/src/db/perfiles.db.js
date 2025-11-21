const supabase = require('../config/supabase');

/**
 * Database helper functions for perfiles table
 */

// Find perfil by codigo
const findPerfilByCodigo = async (codigo, publicadoOnly = false) => {
  let query = supabase
    .from('perfiles')
    .select('*')
    .eq('codigo', codigo);

  if (publicadoOnly) {
    query = query.eq('publicado', true);
  }

  const { data, error } = await query.single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    throw error;
  }

  return data;
};

// Find perfil by ID
const findPerfilById = async (id) => {
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

// Get all perfiles (with optional filters)
const findAllPerfiles = async (filters = {}) => {
  let query = supabase
    .from('perfiles')
    .select('*')
    .order('codigo', { ascending: true });

  // Apply filters
  if (filters.publicado !== undefined) {
    query = query.eq('publicado', filters.publicado);
  }
  if (filters.categoria) {
    query = query.eq('categoria', filters.categoria);
  }
  if (filters.area_conocimiento) {
    query = query.eq('area_conocimiento', filters.area_conocimiento);
  }
  if (filters.tipo_cargo) {
    query = query.eq('tipo_cargo', filters.tipo_cargo);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
};

// Get all published perfiles
const findAllPublishedPerfiles = async () => {
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('publicado', true)
    .order('codigo', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

// Create new perfil
const createPerfil = async (perfilData) => {
  const { data, error } = await supabase
    .from('perfiles')
    .insert(perfilData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Update perfil by ID
const updatePerfil = async (id, updates) => {
  const { data, error } = await supabase
    .from('perfiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Delete perfil by ID
const deletePerfil = async (id) => {
  const { error } = await supabase
    .from('perfiles')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
};

// Toggle publicado status
const togglePerfilPublicado = async (id) => {
  // First get the current perfil
  const perfil = await findPerfilById(id);
  if (!perfil) {
    throw new Error('Perfil no encontrado');
  }

  // Toggle the publicado value
  const { data, error } = await supabase
    .from('perfiles')
    .update({ publicado: !perfil.publicado })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

module.exports = {
  findPerfilByCodigo,
  findPerfilById,
  findAllPerfiles,
  findAllPublishedPerfiles,
  createPerfil,
  updatePerfil,
  deletePerfil,
  togglePerfilPublicado
};
