const { Perfil } = require('../models');
const { searchPerfiles, getFacets, refreshSearchIndex } = require('../services/search.service');
const { generatePerfilPDF } = require('../services/pdf.service');
const { Op } = require('sequelize');

// Public controllers

// GET /api/perfiles - Search and list public profiles
const listarPerfilesPublicos = async (req, res) => {
  try {
    const { search, categoria, area_conocimiento, tipo_cargo, page = 1, limit = 20 } = req.query;

    const filters = {};
    if (categoria) filters.categoria = categoria;
    if (area_conocimiento) filters.area_conocimiento = area_conocimiento;
    if (tipo_cargo) filters.tipo_cargo = tipo_cargo;

    let perfiles = await searchPerfiles(search, filters);

    // Pagination
    const total = perfiles.length;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    perfiles = perfiles.slice(offset, offset + parseInt(limit));

    res.json({
      data: perfiles,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error listando perfiles:', error);
    res.status(500).json({ error: 'Error al obtener perfiles' });
  }
};

// GET /api/perfiles/facets - Get filter options
const obtenerFacets = async (req, res) => {
  try {
    const facets = await getFacets();
    res.json(facets);
  } catch (error) {
    console.error('Error obteniendo facets:', error);
    res.status(500).json({ error: 'Error al obtener filtros' });
  }
};

// GET /api/perfiles/:codigo - Get single profile by code
const obtenerPerfilPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const perfil = await Perfil.findOne({
      where: { codigo, publicado: true }
    });

    if (!perfil) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json(perfil);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// GET /api/perfiles/:codigo/pdf - Generate PDF for profile
const generarPDF = async (req, res) => {
  try {
    const { codigo } = req.params;
    const perfil = await Perfil.findOne({
      where: { codigo, publicado: true },
      raw: true
    });

    if (!perfil) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    const pdfBuffer = await generatePerfilPDF(perfil);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=perfil-${codigo}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error al generar PDF' });
  }
};

// Admin controllers

// GET /api/admin/perfiles - List all profiles (admin)
const listarTodosPerfiles = async (req, res) => {
  try {
    const { publicado } = req.query;
    const where = {};

    if (publicado === 'true') where.publicado = true;
    if (publicado === 'false') where.publicado = false;

    const perfiles = await Perfil.findAll({
      where,
      order: [['codigo', 'ASC']]
    });

    res.json({
      data: perfiles,
      total: perfiles.length
    });
  } catch (error) {
    console.error('Error listando perfiles admin:', error);
    res.status(500).json({ error: 'Error al obtener perfiles' });
  }
};

// POST /api/admin/perfiles - Create new profile
const crearPerfil = async (req, res) => {
  try {
    const {
      codigo,
      nombre,
      categoria,
      area_conocimiento,
      tipo_cargo,
      descripcion,
      responsabilidades,
      requisitos,
      publicado
    } = req.body;

    // Validate required fields
    if (!codigo || !nombre || !categoria || !area_conocimiento || !tipo_cargo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Check if code already exists
    const existente = await Perfil.findOne({ where: { codigo } });
    if (existente) {
      return res.status(400).json({ error: 'El código ya existe' });
    }

    const perfil = await Perfil.create({
      codigo,
      nombre,
      categoria,
      area_conocimiento,
      tipo_cargo,
      descripcion,
      responsabilidades,
      requisitos,
      publicado: publicado || false
    });

    // Refresh search index
    await refreshSearchIndex();

    res.status(201).json(perfil);
  } catch (error) {
    console.error('Error creando perfil:', error);
    res.status(500).json({ error: 'Error al crear perfil' });
  }
};

// PUT /api/admin/perfiles/:id - Update profile
const actualizarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const perfil = await Perfil.findByPk(id);

    if (!perfil) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    const {
      nombre,
      categoria,
      area_conocimiento,
      tipo_cargo,
      descripcion,
      responsabilidades,
      requisitos,
      publicado
    } = req.body;

    await perfil.update({
      nombre: nombre || perfil.nombre,
      categoria: categoria || perfil.categoria,
      area_conocimiento: area_conocimiento || perfil.area_conocimiento,
      tipo_cargo: tipo_cargo || perfil.tipo_cargo,
      descripcion: descripcion !== undefined ? descripcion : perfil.descripcion,
      responsabilidades: responsabilidades !== undefined ? responsabilidades : perfil.responsabilidades,
      requisitos: requisitos !== undefined ? requisitos : perfil.requisitos,
      publicado: publicado !== undefined ? publicado : perfil.publicado
    });

    // Refresh search index
    await refreshSearchIndex();

    res.json(perfil);
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// DELETE /api/admin/perfiles/:id - Delete profile
const eliminarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const perfil = await Perfil.findByPk(id);

    if (!perfil) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await perfil.destroy();

    // Refresh search index
    await refreshSearchIndex();

    res.json({ message: 'Perfil eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando perfil:', error);
    res.status(500).json({ error: 'Error al eliminar perfil' });
  }
};

// PATCH /api/admin/perfiles/:id/toggle-publicado - Toggle publish status
const togglePublicado = async (req, res) => {
  try {
    const { id } = req.params;
    const perfil = await Perfil.findByPk(id);

    if (!perfil) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await perfil.update({ publicado: !perfil.publicado });

    // Refresh search index
    await refreshSearchIndex();

    res.json(perfil);
  } catch (error) {
    console.error('Error cambiando estado:', error);
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
};

module.exports = {
  // Public
  listarPerfilesPublicos,
  obtenerFacets,
  obtenerPerfilPorCodigo,
  generarPDF,
  // Admin
  listarTodosPerfiles,
  crearPerfil,
  actualizarPerfil,
  eliminarPerfil,
  togglePublicado
};
