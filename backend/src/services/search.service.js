const Fuse = require('fuse.js');
const { Perfil } = require('../models');

let fuseIndex = null;
let perfilesCache = [];

const fuseOptions = {
  keys: [
    { name: 'nombre', weight: 0.4 },
    { name: 'codigo', weight: 0.3 },
    { name: 'descripcion', weight: 0.2 },
    { name: 'responsabilidades', weight: 0.1 }
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2
};

const initializeSearchIndex = async () => {
  try {
    perfilesCache = await Perfil.findAll({
      where: { publicado: true },
      raw: true
    });
    fuseIndex = new Fuse(perfilesCache, fuseOptions);
    console.log(`Índice de búsqueda inicializado con ${perfilesCache.length} perfiles`);
  } catch (error) {
    console.error('Error inicializando índice de búsqueda:', error);
  }
};

const refreshSearchIndex = async () => {
  await initializeSearchIndex();
};

const searchPerfiles = async (query, filters = {}) => {
  if (!fuseIndex) {
    await initializeSearchIndex();
  }

  let results = perfilesCache;

  // Apply fuzzy search if query exists
  if (query && query.trim()) {
    const searchResults = fuseIndex.search(query);
    results = searchResults.map(r => r.item);
  }

  // Apply filters
  if (filters.categoria) {
    results = results.filter(p => p.categoria === filters.categoria);
  }
  if (filters.area_conocimiento) {
    results = results.filter(p => p.area_conocimiento === filters.area_conocimiento);
  }
  if (filters.tipo_cargo) {
    results = results.filter(p => p.tipo_cargo === filters.tipo_cargo);
  }

  return results;
};

const getFacets = async () => {
  if (!perfilesCache.length) {
    await initializeSearchIndex();
  }

  const categorias = [...new Set(perfilesCache.map(p => p.categoria))].sort();
  const areas = [...new Set(perfilesCache.map(p => p.area_conocimiento))].sort();
  const tipos = [...new Set(perfilesCache.map(p => p.tipo_cargo))].sort();

  return {
    categorias,
    areas_conocimiento: areas,
    tipos_cargo: tipos
  };
};

module.exports = {
  initializeSearchIndex,
  refreshSearchIndex,
  searchPerfiles,
  getFacets
};
