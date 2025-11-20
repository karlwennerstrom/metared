import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const PerfilFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoria: '',
    area_conocimiento: '',
    tipo_cargo: '',
    descripcion: '',
    responsabilidades: '',
    requisitos: '',
    publicado: false
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (esEdicion) {
      cargarPerfil();
    }
  }, [id]);

  const cargarPerfil = async () => {
    try {
      const { data } = await adminAPI.listarTodosPerfiles();
      const perfil = data.data.find(p => p.id === parseInt(id));
      if (perfil) {
        setFormData(perfil);
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setError('Error al cargar el perfil');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (esEdicion) {
        await adminAPI.actualizarPerfil(id, formData);
      } else {
        await adminAPI.crearPerfil(formData);
      }
      navigate('/admin/perfiles');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el perfil');
    } finally {
      setCargando(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/perfiles')}
          className="flex items-center text-sm text-polar-600 dark:text-polar-400 hover:text-uc-blue transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </button>
        <h1 className="text-2xl font-bold">
          {esEdicion ? 'Editar Perfil' : 'Crear Nuevo Perfil'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Código *
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              disabled={esEdicion}
              className="input disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ej: INF001"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre del Perfil *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="input"
              placeholder="Ej: Arquitecto TI"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Categoría *
            </label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="input"
              placeholder="Ej: 1. Infraestructura Operaciones"
            />
          </div>

          {/* Área de Conocimiento */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Área de Conocimiento *
            </label>
            <input
              type="text"
              name="area_conocimiento"
              value={formData.area_conocimiento}
              onChange={handleChange}
              required
              className="input"
              placeholder="Ej: Infraestructura y Operaciones"
            />
          </div>

          {/* Tipo de Cargo */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tipo de Cargo *
            </label>
            <select
              name="tipo_cargo"
              value={formData.tipo_cargo}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Seleccionar...</option>
              <option value="Líder">Líder</option>
              <option value="Contribución Individual">Contribución Individual</option>
            </select>
          </div>

          {/* Publicado */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, publicado: !prev.publicado }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.publicado
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-polar-100 dark:bg-polar-800 text-polar-600 dark:text-polar-400'
              }`}
            >
              {formData.publicado ? (
                <>
                  <Eye className="w-4 h-4" />
                  Publicado
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Borrador
                </>
              )}
            </button>
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Descripción del Cargo
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleChange}
            rows={4}
            className="input resize-none"
            placeholder="Descripción general del cargo..."
          />
        </div>

        {/* Responsabilidades */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Responsabilidades
          </label>
          <textarea
            name="responsabilidades"
            value={formData.responsabilidades || ''}
            onChange={handleChange}
            rows={8}
            className="input resize-none font-mono text-sm"
            placeholder="Separa cada responsabilidad con un salto de línea..."
          />
          <p className="text-xs text-polar-500 dark:text-polar-400 mt-2">
            Cada línea se mostrará como un item de lista
          </p>
        </div>

        {/* Requisitos */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Requisitos del Puesto
          </label>
          <textarea
            name="requisitos"
            value={formData.requisitos || ''}
            onChange={handleChange}
            rows={8}
            className="input resize-none font-mono text-sm"
            placeholder="Separa cada requisito con un salto de línea..."
          />
          <p className="text-xs text-polar-500 dark:text-polar-400 mt-2">
            Cada línea se mostrará como un item de lista
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-polar-200 dark:border-polar-700">
          <button
            type="submit"
            disabled={cargando}
            className="btn-primary disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {cargando ? 'Guardando...' : 'Guardar Perfil'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/perfiles')}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default PerfilFormPage;
